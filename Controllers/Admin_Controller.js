import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Op, Sequelize } from 'sequelize';
import AdminModel from '../Models/AdminModel/Admin_Model.js';

import CabModel from '../Models/AdminModel/CabModel.js';
import DriverModel from '../Models/AdminModel/DriverModel.js';
import GuideModel from '../Models/AdminModel/GuideModel.js';
import CabAssignmentModel from '../Models/AdminModel/CabAssignmentModel.js'

import BannerModel from '../Models/AdminModel/BannerModel.js'
import users from '../Models/ApiModel/UserModel.js';
import FAQModel from '../Models/AdminModel/FAQModel.js';
import BlogModel from '../Models/AdminModel/BlogModel.js';
import path from 'path';

export const AdminRegister = async (req, res) => {
    try {
        const { fullname, email, password, phonenumber } = req.body;

        // validate input
        if (!fullname || !email || !password || !phonenumber) {
            return res.status(401).json({
                errormessage: "All fields are required"
            });
        }
        // validate email format
        const emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            return res.status(401).json({ message: "Invalid +" });
        }

        const isDuplicateEmail = await AdminModel.findOne({ where: { email } });

        if (isDuplicateEmail) {
            return res.status(401).json({ message: "Email already exists" });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(password, salt);

        const newAdmin = new AdminModel({
            fullname,
            email,
            planepassword: password,
            password: hashpassword,
            phonenumber,
        });

        await newAdmin.save();

        return res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            data: newAdmin,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const renderAdminLogin = async (req, res) => {
    try {
        return res.render("AdminView/adminlogin");
    } catch (err) {
        console.log(err);
    }
};

export const AdminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if the user exists
        const admin = await AdminModel.findOne({ where: { email } });
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        const isValid = await bcrypt.compare(password, admin.password);
        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }

        // Generate access and refresh tokens
        const token = jwt.sign({ id: admin.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ id: admin.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });
        // Save refresh token in the database

        admin.refreshToken = refreshToken;
        await admin.save();
        // Store user info in session (optional, if you're not fully stateless)
        req.session.admin = {
            id: admin.id,
            fullname: admin.fullname,
            email: admin.email,
            phonenumber: admin.phonenumber,
            token,
            refreshToken
        };

        const adminsession = req.session.admin;

        console.log("Admin session:", adminsession)

        return res.redirect('/dashboard');

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const AdminLogout = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: err.message });
            }
            res.clearCookie("connect.sid"); // Use your session cookie name if different
            return res.redirect('/login'); // Redirect to login page after logout
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const renderdashbord = async (req, res) => {
    const admin = req.session.admin;

    if (!admin) {
        return res.redirect('/login'); // Or your appropriate login page
    }

    res.render('AdminView/admindashboard', {
        admin: admin  // passing session data to the template
    });
};

export const AdminProfile = (req, res) => {
    const admin = req.session.admin;
    if (!admin) {
        return res.redirect('/login');
    }
    res.render('AdminView/adminprofile', { admin });
};

export const updateAdminProfile = async (req, res) => {
    try {
        const adminSession = req.session.admin;
        if (!adminSession) {
            return res.redirect('/dashboard'); // Redirect to dashboard if not logged in
        }

        const { fullname, email, phonenumber } = req.body;
        // Update in DB
        await AdminModel.update(
            { fullname, email, phonenumber },
            { where: { id: adminSession.id } }
        );

        // Update session data
        req.session.admin.fullname = fullname;
        req.session.admin.email = email;
        req.session.admin.phonenumber = phonenumber;

        // Redirect to dashboard
        return res.redirect('/dashboard');
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server error');
    }
};

export const renderChangePassword = (req, res) => {
    const admin = req.session.admin;
    if (!admin) {
        return res.redirect('/login');
    }
    res.render('AdminView/chngPassword', { admin });
};

export const AdminChangePassword = async (req, res) => {
    try {
        const adminSession = req.session.admin;
        if (!adminSession) {
            return res.redirect('/login');
        }

        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            // Render the form with an error message
            return res.render('AdminView/chngPassword', { admin: adminSession, error: "Old and new password are required" });
        }

        const admin = await AdminModel.findByPk(adminSession.id);
        if (!admin) {
            return res.render('AdminView/chngPassword', { admin: adminSession, error: "Admin not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, admin.password);
        if (!isMatch) {
            return res.render('AdminView/chngPassword', { admin: adminSession, error: "Old password is incorrect" });
        }

        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(newPassword, salt);
        await admin.save();

        // Redirect to dashboard after successful change
        return res.redirect('/dashboard');
    } catch (err) {
        console.log(err);
        return res.render('AdminView/chngPassword', { admin: req.session.admin, error: "Server error" });
    }
};

// _~~~Admin User Management~~~_

export const renderUserList = async (req, res) => {
    try {
        if (!req.session.admin) {
            return res.redirect('/login');
        }

        const allUsers = await users.findAll({
            attributes: { exclude: ['password', 'refreshToken'] }
        });

        res.render('AdminView/users_list', {
            admin: req.session.admin,
            users: allUsers
        });

    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).render('AdminView/users_list', {
            admin: req.session.admin,
            users: [],
            error: "Failed to load users"
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        if (!req.session.admin) {
            return res.redirect('/login');
        }

        const userId = req.params.id;
        await users.destroy({ where: { id: userId } });

        // Fetch updated user list
        const allUsers = await users.findAll({
            attributes: { exclude: ['password', 'refreshToken'] }
        });

        // Render the user list page with updated data
        res.render('AdminView/users_list', {
            admin: req.session.admin,
            users: allUsers,
            success: "User deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        // Optionally, fetch users to show the page even on error
        const allUsers = await users.findAll({
            attributes: { exclude: ['password', 'refreshToken'] }
        });
        res.status(500).render('AdminView/users_list', {
            admin: req.session.admin,
            users: allUsers,
            error: "Failed to delete user"
        });
    }
};

// _~~~Cab Management~~~_

export const addcabform = async (req, res) => {
    try {
        const admin = req.session.admin;
        return res.render("AdminView/addcab", { admin });
    } catch (err) {
        console.log(err);
    }
};

export const addCab = async (req, res) => {
    try {
        const {
            cabtype,
            cabseats,
            cabnumber,
            price_per_km,
            price_per_day
        } = req.body;

        // Validate required fields
        const requiredFields = {
            cabtype: "Cab type",
            cabseats: "Cab seats",
            cabnumber: "Cab number",
            price_per_km: "Price per km",
            price_per_day: "Price per day"
        };

        const missingFields = Object.entries(requiredFields)
            .filter(([key]) => !req.body[key])
            .map(([_, value]) => value);

        if (missingFields.length > 0) {
            req.flash("error", `Missing required fields: ${missingFields.join(", ")}`);
            return res.redirect("/addcabform");
        }

        // Validate cab number format (basic Indian format)
        if (!/^[A-Z]{2}\s?\d{2}\s?[A-Z]{1,2}\s?\d{4}$/i.test(cabnumber)) {
            req.flash("error", "Invalid cab number format. Example: MH02AB1234");
            return res.redirect("/addcabform");
        }

        // Check if cab number already exists
        const existingCab = await CabModel.findOne({ where: { cabnumber } });
        if (existingCab) {
            req.flash("error", "Cab with this number already exists");
            return res.redirect("/addcabform");
        }

        // Create new cab
        const newCab = await CabModel.create({
            cabtype,
            cabseats: parseInt(cabseats),
            cabnumber: cabnumber.toUpperCase().replace(/\s/g, ''),
            price_per_km: parseFloat(price_per_km),
            price_per_day: parseFloat(price_per_day),
            imagePath: req.file ? `${req.file.filename}` : null
        });

        req.flash("success", "Cab added successfully");
        return res.redirect("/addcabform"); // Redirect to cab listing page

    } catch (error) {
        console.error("Error adding cab:", error);
        req.flash("error", error.message || "Failed to add cab");
        return res.redirect("/addcabform");
    }
};

export const getAllCabs = async (req, res) => {
    try {
        const admin = req.session.admin;

        const allCabs = await CabModel.findAll({
            order: [['createdAt', 'DESC']]
        });

        return res.render("AdminView/cablist", {
            admin,
            cabs: allCabs,
            success: req.flash("success"),
            error: req.flash("error")
        });
    } catch (error) {
        console.error("Error fetching cabs:", error);
        req.flash("error", "Unable to fetch cab list");
        return res.redirect("/dashboard");
    }
};


// _~~~Guide management~~~__

export const addguideform = async (req, res) => {
    try {
        const admin = req.session.admin;
        return res.render("AdminView/addguide", { admin });
    } catch (err) {
        console.log(err);
    }
};

export const addGuide = async (req, res) => {
    try {
        const {
            guidename,
            gender,
            email,
            phonenumber,
            languagespoken,
            experience_years,
            city,
            state,
            country,
            availability,
        } = req.body;

        const missingFields = [];
        if (!guidename) missingFields.push("guidename");
        if (!gender) missingFields.push("gender");
        if (!email) missingFields.push("email");
        if (!phonenumber) missingFields.push("phonenumber");
        if (!languagespoken) missingFields.push("languagespoken");
        if (experience_years === undefined) missingFields.push("experience_years");
        if (!city) missingFields.push("city");
        if (!state) missingFields.push("state");
        if (!country) missingFields.push("country");

        if (missingFields.length > 0) {
            req.flash("error", `Missing fields: ${missingFields.join(", ")}`);
            return res.redirect("/addguideform");
        }

        const profileImage = req.file ? req.file.filename : null;

        const newGuide = await GuideModel.create({
            guidename,
            gender,
            email,
            phonenumber,
            languagespoken,
            experience_years,
            city,
            state,
            country,
            availability: availability === "true" ? true : false,
            profile_image: profileImage,
        });

        req.flash("success", "Guide added successfully");
        return res.redirect("/addguideform");

    } catch (error) {
        console.error("Error adding guide:", error);
        req.flash("error", "Server error occurred while adding the guide.");
        return res.redirect("/addguideform");
    }
};

export const getAllGuides = async (req, res) => {
    try {
        const admin = req.session.admin;
        const guides = await GuideModel.findAll({
            order: [['createdAt', 'DESC']]
        });

        return res.render('AdminView/guidelist', {
            admin,
            guides,
            success: req.flash('success'),
            error: req.flash('error')
        });
    } catch (error) {
        console.error("Error fetching guides:", error);
        req.flash("error", "Failed to fetch guide list.");
        return res.redirect('/dashboard');
    }
};


// Driver Management

export const addDriverForm = async (req, res) => {
    try {
        const admin = req.session.admin;
        return res.render("AdminView/adddriver", { admin });
    } catch (err) {
        console.log(err);
    }
};

export const addDriver = async (req, res) => {
    try {
        // Required fields
        const requiredFields = [
            'name', 'licenseNumber', 'licenseExpiry',
            'phone', 'city', 'state', 'country'
        ];

        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            req.flash('error', `Missing required fields: ${missingFields.join(', ')}`);
            return res.redirect('/driver/addform');
        }

        // Expiry date check
        const licenseExpiry = new Date(req.body.licenseExpiry);
        if (licenseExpiry < new Date()) {
            req.flash('error', 'License has already expired');
            return res.redirect('/driver/addform');
        }

        // Check duplicate license or phone
        const existingDriver = await DriverModel.findOne({
            where: {
                [Op.or]: [
                    { licenseNumber: req.body.licenseNumber },
                    { phone: req.body.phone }
                ]
            }
        });

        if (existingDriver) {
            const conflicts = [];
            if (existingDriver.licenseNumber === req.body.licenseNumber) {
                conflicts.push('license number');
            }
            if (existingDriver.phone === req.body.phone) {
                conflicts.push('phone number');
            }
            req.flash('error', `Driver with this ${conflicts.join(' and ')} already exists`);
            return res.redirect('/driver/addform');
        }

        // Save new driver
        await DriverModel.create({
            name: req.body.name,
            licenseNumber: req.body.licenseNumber,
            licenseExpiry: req.body.licenseExpiry,
            phone: req.body.phone,
            email: req.body.email || null,
            address: req.body.address || null,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
            pincode: req.body.pincode || null,
            experienceYears: req.body.experienceYears || 0,
            isAvailable: req.body.isAvailable !== undefined ? req.body.isAvailable : true,
            rating: 0.0,
            profilePhoto: req.file ? req.file.filename : null,
            aadharNumber: req.body.aadharNumber || null,
            panNumber: req.body.panNumber || null,
            bloodGroup: req.body.bloodGroup || null,
            emergencyContact: req.body.emergencyContact || null,
            isActive: true
        });

        req.flash('success', 'Driver added successfully');
        return res.redirect('/driver/addform');

    } catch (error) {
        console.error('Error adding driver:', error);
        req.flash('error', 'Something went wrong while adding the driver');
        return res.redirect('/driver/addform');
    }
};

export const getAllDrivers = async (req, res) => {
    try {
        const admin = req.session.admin;
        const drivers = await DriverModel.findAll({
            order: [['createdAt', 'DESC']]
        });

        return res.render('AdminView/driverlist', {
            admin,
            drivers,
            success: req.flash('success'),
            error: req.flash('error')
        });
    } catch (error) {
        console.error('Error fetching drivers:', error);
        req.flash('error', 'Unable to fetch driver list');
        return res.redirect('/dashboard');
    }
};



async function assignToCab(cabId, driverId, guideId, assignmentType) {
    const cab = await CabModel.findByPk(cabId);
    if (!cab) throw new Error('Cab not found');

    if (assignmentType === 'driver' && !driverId) {
        throw new Error('Driver ID required');
    }

    if (assignmentType === 'guide-as-driver') {
        const guide = await GuideModel.findByPk(guideId);
        if (!guide || !guide.canDrive) {
            throw new Error('This guide cannot drive');
        }
    }

    if (assignmentType === 'both') {
        if (!driverId || !guideId) throw new Error('Both Driver and Guide are required');
    }

    return await CabAssignmentModel.create({
        cabId,
        driverId: driverId || null,
        guideId: guideId || null,
        assignmentType
    });
}

// Form GET
export const cabAssignment = async (req, res) => {
    const admin = req.session.admin;
    const cabs = await CabModel.findAll();
    const drivers = await DriverModel.findAll();
    const guides = await GuideModel.findAll();

    res.render('AdminView/assigncab', {
        admin,
        cabs,
        drivers,
        guides,
        success: req.flash('success'),
        error: req.flash('error')
    });
};

// Form POST
export const updateCabAssignTo = async (req, res) => {
    try {
        const { cabId, driverId, guideId, assignmentType } = req.body;

        console.log("Form Data:", req.body);

        if (!cabId || !assignmentType) {
            req.flash("error", "Cab ID and assignment type are required");
            return res.redirect("/cab/assign/form");
        }

        await assignToCab(cabId, driverId, guideId, assignmentType);

        await CabModel.update(
            { hasDedicatedDriver: assignmentType !== 'guide-as-driver' },
            { where: {cabId} }
        );

        req.flash("success", "Cab assignment successful");
        return res.redirect("/cab/assign/form");

    } catch (err) {
        console.error("Assignment error:", err);
        req.flash("error", err.message);
        res.redirect("/cab/assign/form");
    }
};
























export const addbannerform = async (req, res) => {
    try {
        return res.render("AdminView/Frontend/banner_add");
    } catch (err) {
        req.flash("error", "Server error occurred while rendering the addbannerform.");
        return res.redirect("/banner/addform");
    }
};

export const addBanner = async (req, res) => {
    try {
        const titles = req.body.title; // This will be an array
        const images = req.files;      // This will be an array of file objects

        if (!titles || !images || titles.length !== images.length) {
            req.flash('error', 'Mismatch in number of titles and images.');
            return res.redirect('/banner/addform');
        }

        const bannerData = titles.map((title, i) => ({
            title,
            image: images[i].filename
        }));

        await BannerModel.bulkCreate(bannerData);

        req.flash('success', 'Banners uploaded successfully!');
        return res.redirect('/banner/addform');

    } catch (error) {
        console.error('Add Multiple Banners Error:', error);
        req.flash('error', 'Server error while uploading banners.');
        return res.redirect('/banner/addform');
    }
};

export const getAllBanners = async (req, res) => {
    try {
        const banners = await BannerModel.findAll({
            order: [['createdAt', 'DESC']]
        });

        res.render('AdminView/Frontend/banner_list', {
            banners,
            success: req.flash('success'),
            error: req.flash('error'),
        });
    } catch (error) {
        console.error('Render Banner List Error:', error);
        req.flash('error', 'Server error while loading banners.');
        res.redirect('/dashboard');
    }
};

export const addFaqForm = async (req, res) => {
    try {
        return res.render("AdminView/Frontend/FAQ_add");
    } catch (err) {
        req.flash("error", "Server error occurred while rendering the addfaqform.");
        return res.redirect("/dashbord");
    }
};

export const addFAQs = async (req, res) => {
    try {
        const { question, answer } = req.body;

        if (!question || !answer || question.length !== answer.length) {
            req.flash("error", "Please ensure all FAQ fields are properly filled.");
            return res.redirect("/faq/addform");
        }

        const faqData = question.map((q, i) => ({
            question: q,
            answer: answer[i],
        }));

        await FAQModel.bulkCreate(faqData);

        req.flash("success", "FAQs added successfully.");
        return res.redirect("/faq/addform");
    } catch (error) {
        console.error("FAQ Error:", error);
        req.flash("error", "Server error while saving FAQs.");
        return res.redirect("/faq/addform");
    }
};

export const listFAQs = async (req, res) => {
    try {
        const faqs = await FAQModel.findAll({
            order: [["createdAt", "DESC"]],
        });

        return res.render("AdminView/Frontend/FAQ_list", {
            admin: req.session.admin, // or however you pass the session
            faqs,
        });
    } catch (error) {
        console.error("FAQ List Error:", error);
        req.flash("error", "Unable to fetch FAQs.");
        return res.redirect("/dashboard");
    }
};

export const addBlogForm = async (req, res) => {
    try {
        return res.render("AdminView/Frontend/blog_add");
    } catch (error) {
        req.flash("error", "Server error occurred while rendering the addfaqform.");
        return res.redirect("/dashbord");
    }
}

export const addBlogs = async (req, res) => {
    try {
        const { title, heading, description } = req.body;
        const files = req.files;

        if (!title || !heading || !description || !files) {
            req.flash("error", "All fields including images are required.");
            return res.redirect("/blog/addform");
        }

        if (title.length !== files.length) {
            req.flash("error", "Mismatch between number of titles and uploaded images.");
            return res.redirect("/blog/addform");
        }

        const blogData = title.map((_, i) => ({
            title: title[i],
            heading: heading[i],
            description: description[i],
            image: files[i].filename
        }));

        await BlogModel.bulkCreate(blogData);

        req.flash("success", "Blogs added successfully.");
        return res.redirect("/blog/addform");

    } catch (error) {
        console.error("Add Blog Error:", error);
        req.flash("error", "Server error occurred while adding blogs.");
        return res.redirect("/blog/addform");
    }
};

export const listBlogs = async (req, res) => {
    try {
        const blogs = await BlogModel.findAll({
            order: [["createdAt", "DESC"]],
        });

        return res.render("AdminView/Frontend/blog_list", {
            admin: req.session.admin,
            blogs,
        });

    } catch (error) {
        console.error("Blog List Error:", error);
        req.flash("error", "Failed to fetch blog list.");
        return res.redirect("/dashboard");
    }
};














