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
import GuideRoute from './Routes/GuideRoutes.js'

const require = createRequire(import.meta.url);
const MySQLStore = require('express-mysql-session')(session);

dotenv.config();

const app = express();

hbs.registerHelper('eq', function (a, b) {
  return a == b;
});

app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "html");
app.engine("html", hbs.__express);


app.set("views", path.join(__dirname, "View")); // ✅ point to base View folder

// Register partials
hbs.registerPartials(path.join(__dirname, "View", "Partials"));


// Static files
app.use(express.static(path.join(__dirname, 'Public')));
app.use('/profile-images', express.static(path.join(__dirname, 'ProfileImages')));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 2625;

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
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
        },
    })
);

app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use('/',AdminRoutes);
app.use('/api',ApiRoutes);
app.use('/guide',GuideRoute);

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("DB connected.");
        await sequelize.sync({ alter: true });
        app.listen(PORT, () =>
            console.log(`Server running: http://localhost:${PORT}`)
        );
    } catch (err) {
        console.error("Server failed:", err);
    }
};

startServer();
