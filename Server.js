import express from "express";
import cluster from 'cluster';
import dotenv from "dotenv";
import os from 'os';
import hbs from "hbs";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import session from "express-session";
import flash from "express-flash";
import handlebars from 'express-handlebars';
import sequelize from "./DB_Connection/MySql_Connnet.js";
import AdminRoutes from "./Routes/AdminRoutes.js";
import ApiRoutes from "./Routes/ApiRoutes.js";
import GuideRoute from './Routes/GuideRoutes.js';

const require = createRequire(import.meta.url);
const MySQLStore = require('express-mysql-session')(session);

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Register handlebars helper
hbs.registerHelper('eq', function (a, b) {
    return a == b;
});

hbs.registerHelper('inc', function (value) {
    return parseInt(value) + 1;
});

// ✅ Register Handlebars Partials
app.set("views", path.join(__dirname, "View"));
hbs.registerPartials(path.join(__dirname, "View", "Partials"));
app.set("view engine", "html");
app.engine("html", hbs.__express);

// ✅ Static Files
app.use(express.static(path.join(__dirname, 'Public')));
app.use('/profile-images', express.static(path.join(__dirname, 'ProfileImages')));
app.use('/banner/images', express.static('Public/banner/images'));
app.use('/blog/images', express.static('Public/blog/images'));

app.use('/cab/images', express.static('Public/uploads/cabs'));
app.use('/driver/images', express.static('Public/uploads/drivers'));
app.use('/guide/images', express.static('ProfileImages/guide'));

// ✅ Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ✅ Trust proxy for ngrok / production reverse proxy
app.set("trust proxy", 1);

// ✅ CORS Fix for React & Ngrok frontend
app.use(cors({
    origin: [
        "http://localhost:3000", // React dev
        "https://38f3-2401-4900-47fa-e5a5-edf2-b4f5-8d2d-9b59.ngrok-free.app",
        "http://localhost:3001", // ngrok (replace this if using it)
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));


// Session Store
const sessionStore = new MySQLStore({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "root@123",
    database: "safariXjourneys",
});

app.use(
    session({
        key: "session_cookie_name",
        secret: process.env.SESSION_SECRET || "defaultsecret",
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // true if using https
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        },
    })
);

app.use(flash());

//Flash messages globally
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

//Routes
app.use('/', AdminRoutes);
app.use('/api', ApiRoutes);
app.use('/guide', GuideRoute);

//Server Boot
const PORT = process.env.PORT || 2625;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ DB connected.");
        await sequelize.sync({ alter: true });
        app.listen(PORT, '0.0.0.0',() =>
            console.log(`🚀 Server running: http://localhost:${PORT}`)
        );
    } catch (err) {
        console.error("Server failed:", err);
    }
};

startServer();