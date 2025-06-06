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
import sequelize from "./DB_Connection/MySql_Connnet.js";
import AdminRoutes from "./Routes/AdminRoutes.js";
import ApiRoutes from "./Routes/ApiRoutes.js";
import GuideRoute from './Routes/GuideRoutes.js'

const require = createRequire(import.meta.url);
const MySQLStore = require('express-mysql-session')(session);

dotenv.config();

const app = express();

app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.engine("html", hbs.__express);
app.set("view engine", "html");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
