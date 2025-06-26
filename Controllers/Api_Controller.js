import users from '../Models/ApiModel/UserModel.js';
import ContactUsModel from '../Models/ApiModel/ContactUsModel.js';
import BannerModel from '../Models/AdminModel/BannerModel.js';
import FAQModel from '../Models/AdminModel/FAQModel.js';
import BlogModel from '../Models/AdminModel/BlogModel.js';
import GuideModel from '../Models/AdminModel/GuideModel.js';
import CabModel from '../Models/AdminModel/CabModel.js';
import TestimonialsModel from '../Models/AdminModel/TestimonialModel.js';
import nodemailer from "nodemailer";

import { GoogleGenAI } from '@google/genai';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// export const registerOrLogin = async (req, res) => {
//     try {
//         const { fullname, phonenumber, emailid, password } = req.body;

//         // Email is required in both flows
//         if (!emailid) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Emailid is required"
//             });
//         }

//         console.log('emailid', req.body)

//         // Validate email format
//         const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//         if (!emailRegex.test(emailid)) {
//             return res.status(401).json({ message: "Invalid email format" });
//         }

//         // Check if email already exists
//         const user = await users.findOne({ where: { emailid } });

//         // CASE 1: Email exists → LOGIN FLOW
//         if (user) {
//             if (!password) {
//                 return res.status(401).json({
//                     success: false,
//                     userExists: true,
//                     message: "Password is required to login"
//                 });
//             }

//             const isValid = await bcrypt.compare(password, user.password);
//             if (!isValid) {
//                 return res.status(401).json({ message: "Invalid password" });
//             }

//             // Generate tokens
//             const token = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
//             const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

//             user.refreshToken = refreshToken;
//             await user.save();

//             // Save session
//             req.session.user = {
//                 id: user.id,
//                 fullname: user.fullname,
//                 emailid: user.emailid,
//                 phonenumber: user.phonenumber,
//                 refreshToken,
//                 token
//             };

//             return res.status(201).json({
//                 status: true,
//                 message: "Login successful",
//                 token,
//                 refreshToken,
//                 user: req.session.user
//             });
//         }

//         // CASE 2: Email not found → REGISTRATION FLOW
//         // All fields are required now
//         const missingFields = [];
//         if (!fullname) missingFields.push("fullname");
//         if (!phonenumber) missingFields.push("phonenumber");
//         if (!password) missingFields.push("password");

//         if (missingFields.length > 0) {
//             return res.status(401).json({
//                 success: false,
//                 userExists: false,
//                 message: `Missing fields for registration: ${missingFields.join(", ")}`
//             });
//         }

//         // Hash password & register
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = await users.create({
//             fullname,
//             phonenumber,
//             emailid,
//             password: hashedPassword
//         });

//         return res.status(201).json({
//             status: true,
//             message: "Registration successful",
//             user: {
//                 id: newUser.id,
//                 fullname: newUser.fullname,
//                 phonenumber: newUser.phonenumber,
//                 emailid: newUser.emailid
//             }
//         });

//     } catch (error) {
//         console.error("Auth error:", error);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };


// export const registerOrLogin = async (req, res) => {
//     try {
//         const { fullname, phonenumber, emailid, password } = req.body;

//         if (!emailid && !phonenumber) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Email ID or Phone Number is required",
//             });
//         }

//         // Validate email format if email is provided
//         if (emailid) {
//             const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//             if (!emailRegex.test(emailid)) {
//                 return res.status(401).json({ message: "Invalid email format" });
//             }
//         }

//         // Check if user exists with email or phone number
//         const whereClause = emailid
//             ? { emailid }
//             : { phonenumber };

//         const user = await users.findOne({ where: whereClause });

//         // CASE 1: LOGIN FLOW
//         if (user) {
//             if (!password) {
//                 return res.status(401).json({
//                     success: false,
//                     message: "Password is required to login"
//                 });
//             }

//             const isValid = await bcrypt.compare(password, user.password);
//             if (!isValid) {
//                 return res.status(401).json({ message: "Invalid password" });
//             }

//             // Generate tokens
//             const token = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
//             const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

//             user.refreshToken = refreshToken;
//             await user.save();

//             req.session.user = {
//                 id: user.id,
//                 fullname: user.fullname,
//                 emailid: user.emailid,
//                 phonenumber: user.phonenumber,
//                 refreshToken,
//                 token
//             };

//             return res.status(201).json({
//                 status: true,
//                 message: "Login successful",
//                 token,
//                 refreshToken,
//                 user: req.session.user
//             });
//         }

//         // CASE 2: REGISTRATION FLOW
//         const missingFields = [];
//         if (!fullname) missingFields.push("fullname");
//         if (!phonenumber) missingFields.push("phonenumber");
//         if (!emailid) missingFields.push("emailid");
//         if (!password) missingFields.push("password");

//         if (missingFields.length > 0) {
//             return res.status(401).json({
//                 success: false,
//                 message: `Missing fields for registration: ${missingFields.join(", ")}`
//             });
//         }

//         // Hash password & register
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = await users.create({
//             fullname,
//             phonenumber,
//             emailid,
//             password: hashedPassword
//         });

//         return res.status(201).json({
//             status: true,
//             message: "Registration successful",
//             user: {
//                 id: newUser.id,
//                 fullname: newUser.fullname,
//                 phonenumber: newUser.phonenumber,
//                 emailid: newUser.emailid
//             }
//         });

//     } catch (error) {
//         console.error("Auth error:", error);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

export const registerOrLogin = async (req, res) => {
    try {
        const { fullname, phonenumber, emailid, password } = req.body;

        // ✅ Check if email is provided
        if (!emailid) {
            return res.status(401).json({
                success: false,
                message: "Email ID is required"
            });
        }

        console.log('emailid', req.body);

        // ✅ Email format validation
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(emailid)) {
            return res.status(401).json({ message: "Invalid email format" });
        }

        // ✅ Check if user already exists
        const user = await users.findOne({ where: { emailid } });

        // ✅ LOGIN FLOW
        if (user) {
            if (!password) {
                return res.status(401).json({
                    success: false,
                    userExists: true,
                    message: "Password is required to login"
                });
            }

            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                return res.status(401).json({ message: "Invalid password" });
            }

            // Generate tokens
            const token = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

            user.refreshToken = refreshToken;
            await user.save();

            // Save session
            req.session.user = {
                id: user.id,
                fullname: user.fullname,
                emailid: user.emailid,
                phonenumber: user.phonenumber,
                refreshToken,
                token
            };

            return res.status(201).json({
                status: true,
                message: "Login successful",
                token,
                refreshToken,
                user: req.session.user
            });
        }

        // ✅ REGISTRATION FLOW
        const missingFields = [];
        if (!fullname) missingFields.push("fullname");
        if (!phonenumber) missingFields.push("phonenumber");
        if (!password) missingFields.push("password");

        if (missingFields.length > 0) {
            return res.status(401).json({
                success: false,
                userExists: false,
                message: `Missing fields for registration: ${missingFields.join(", ")}`
            });
        }

        // ✅ Phone number validation (must be 10 to 12 digits)
        const phoneString = String(phonenumber);
        const phoneRegex = /^\d{10,12}$/;

        if (!phoneRegex.test(phoneString)) {
            return res.status(401).json({
                success: false,
                message: "Phone number must be between 10 to 12 digits"
            });
        }
        // ✅ Hash password and create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await users.create({
            fullname,
            phonenumber,
            emailid,
            password: hashedPassword
        });

        return res.status(201).json({
            status: true,
            message: "Registration successful",
            user: {
                id: newUser.id,
                fullname: newUser.fullname,
                phonenumber: newUser.phonenumber,
                emailid: newUser.emailid
            }
        });

    } catch (error) {
        console.error("Auth error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const UserLogout = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ success: false, message: 'Error logging out' });
            }
            res.clearCookie('session_cookie_name');
            return res.status(201).json({ success: true, message: 'User logged out successfully' });
        });
    } catch (error) {
        console.error('Unexpected error during logout:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

export const userchangepassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { oldpassword, newpassword, confirmpassword } = req.body;

        const missingFields = [];
        if (!oldpassword) missingFields.push("oldpassword");
        if (!newpassword) missingFields.push("newpassword");
        if (!confirmpassword) missingFields.push("confirmpassword");

        if (missingFields.length > 0) {
            return res.status(401).json({
                success: false,
                message: `Missing fields: ${missingFields.join(", ")}`
            });
        }

        if (newpassword !== confirmpassword) {
            return res.status(401).json({
                success: false,
                message: "New password and confirm password do not match"
            });
        }

        const user = await users.findOne({ where: { id } });

        if (!user) {
            return res.status(403).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(oldpassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Old password is incorrect" });
        }
        const hashedPassword = await bcrypt.hash(newpassword, 10);
        user.password = hashedPassword;
        await user.save();

        return res.status(201).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        console.error("Error changing password:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const getuserprofile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await users.findOne({
            where: { id },
            attributes: { exclude: ['password', 'refreshToken'] }
        });

        if (!user) {
            return res.status(403).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(201).json({
            success: true,
            message: "User data fetched successfully",
            user: user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const userUpdateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullname, phonenumber, emailid } = req.body;

        const user = await users.findOne({ where: { id } });

        if (!user) {
            return res.status(403).json({
                success: false,
                message: "User not found"
            });
        }

        const updatedFields = {};
        if (fullname) updatedFields.fullname = fullname;
        if (phonenumber) updatedFields.phonenumber = phonenumber;

        if (emailid) {
            const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (!emailRegex.test(emailid)) {
                return res.status(401).json({ success: false, message: "Invalid email format" });
            }

            const emailExists = await users.findOne({ where: { emailid } });
            if (emailExists && emailExists.id !== parseInt(id)) {
                return res.status(401).json({ success: false, message: "Email already in use by another user" });
            }

            updatedFields.emailid = emailid;
        }

        await users.update(updatedFields, { where: { id } });

        const updatedUser = await users.findOne({
            where: { id },
            attributes: { exclude: ['password', 'refreshToken'] }
        });

        return res.status(201).json({
            success: true,
            message: "User profile updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("Update error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const getAllBanners = async (req, res) => {
    try {
        const banners = await BannerModel.findAll({
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json({
            success: true,
            message: 'Banners fetched successfully',
            data: banners
        });

    } catch (error) {
        console.error('Get All Banners Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching banners'
        });
    }
};

export const listFAQs = async (req, res) => {
    try {
        const faqs = await FAQModel.findAll({
            order: [["createdAt", "DESC"]],
        });

        return res.status(200).json({
            success: true,
            message: "FAQs fetched successfully",
            data: faqs,
        });

    } catch (error) {
        console.error("FAQ List API Error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch FAQs",
            error: error.message,
        });
    }
};

export const listBlogs = async (req, res) => {
    try {
        const blogs = await BlogModel.findAll({
            order: [["createdAt", "DESC"]],
        });

        return res.status(200).json({
            success: true,
            message: "Blogs fetched successfully",
            data: blogs,
        });

    } catch (error) {
        console.error("Blogs List API Error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch blogs",
            error: error.message,
        });
    }
};

export const contactUs = async (req, res) => {
    try {
        const { firstname, lastname, phonenumber, email, place, message } = req.body;

        // Validate input
        if (!firstname || !message || !email) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and message are required"
            });
        }

        // Email format validation
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
        if (!emailRegex.test(email)) {
            return res.status(401).json({
                success: false,
                message: "Invalid email format"
            });
        }

        const phoneString = String(phonenumber);
        const phoneRegex = /^\d{10,12}$/;

        if (phonenumber && !phoneRegex.test(phoneString)) {
            return res.status(401).json({
                success: false,
                message: "Phone number must be between 10 to 12 digits"
            });
        }

        const contactus = new ContactUsModel({
            firstname,
            lastname,
            email,
            phonenumber,
            message,
            place
        })

        const resp = await contactus.save();

        // Configure transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Use environment variables
                pass: process.env.EMAIL_PASS
            }
        });

        // Email options
        const mailOptions = {
            from: `"${firstname} " <${email}>`,
            to: 'tomharry192999@gmail.com',
            subject: `Hello Admin - Message from ${firstname}`,
            text: message
        };



        // Send email
        await transporter.sendMail(mailOptions);

        return res.status(201).json({
            success: true,
            message: "Email sent to admin successfully",
            data: resp
        });

    } catch (error) {
        console.error("Send mail error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const getAllGuides = async (req, res) => {
    try {
        const guides = await GuideModel.findAll({
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json({
            success: true,
            message: "Guides fetched successfully",
            data: guides
        });
    } catch (error) {
        console.error("Error fetching guides:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch guide list",
            error: error.message
        });
    }
};

export const getAllCabs = async (req, res) => {
    try {
        const allCabs = await CabModel.findAll({
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json({
            success: true,
            message: "Cabs fetched successfully",
            data: allCabs
        });
    } catch (error) {
        console.error("Error fetching cabs:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch cab list",
            error: error.message
        });
    }
};

export const getTestimonialsList = async (req, res) => {
    try {
        const testimonials = await TestimonialsModel.findAll({
            order: [['id', 'DESC']]
        });

        return res.status(200).json({
            success: true,
            message: "Testimonials fetched successfully",
            data: testimonials
        });

    } catch (error) {
        console.error("Error fetching testimonials:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to load testimonials",
            error: error.message
        });
    }
};

export const chatbot = async (req, res) => {
    try {
        const {
            toDestination,
            fromDestination,
            noOfAdults,
            noOfChildren,
            cabNeed,
            purposeType
        } = req.body;

        if (!toDestination || !fromDestination || !noOfAdults) {
            return res.status(400).json({ error: 'Required fields missing' });
        }

        const prompt = `I want to travel from ${fromDestination} to ${toDestination}. We are ${noOfAdults} adults and ${noOfChildren || 0} children. Cab needed: ${cabNeed}. Purpose of travel: ${purposeType}. Please tell me:
    
1. What is the *minimum budget* I should have to complete this journey?
2. What are the *cheapest and best ways* to travel between these two cities?
3. Suggest *transport options* (bus, train, etc.) and approximate cost for each.
4. Suggest if I can travel in low budget and how.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt
        });

        console.log(response.text);
        res.json({ result: response.text });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
};
































