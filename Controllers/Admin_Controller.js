import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Op, Sequelize } from 'sequelize';
import AdminModel from '../Models/AdminModel/Admin_Model.js';
import GuideMoel from '../Models/AdminModel/Guide_Model.js';
import users from '../Models/ApiModel/UserModel.js';
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
        return res.render("AdminView/addcab",{admin});
    } catch (err) {
        console.log(err);
    }
};


export const addCab = async (req, res) => {
    try {
        const { cabseats, cabnumber, price_per_km, price_per_day, images } = req.body;

        // Validate input
        if (!cabtype || !cabseats || !cabnumber || !price_per_km || !price_per_day) {
            return res.status(400).render('AdminView/AddCab', {
                admin: req.session.admin,
                error: "All fields are required"
            });
        }

        // Find guide by email
        const guide = await Guide.findOne({ where: { email } });
        if (!guide) {
            return res.status(400).render('AdminView/AddCab', {
                admin: req.session.admin,
                error: "Guide email not found"
            });
        }

        // Create cab
        await CabDetails.create({
            guideid: guide.guideid,
            cabtype,
            cabseats,
            cabnumber,
            price_per_km,
            price_per_day,
            images
        });

        return res.redirect('/cabs/add');
    } catch (error) {
        console.error("Error adding cab:", error);
        return res.status(500).render('AdminView/AddCab', {
            admin: req.session.admin,
            error: "Internal server error"
        });
    }
};

// _~~~Guide management~~~__

export const addguideform = async (req, res) => {
    try {
        const admin = req.session.admin;
        return res.render("AdminView/addguide",{admin});
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

        const newGuide = await GuideMoel.create({
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
