import express from 'express';
import upload from '../Middlewares/fileupload/multerConfig.js';

import { AdminRegister, renderdashbord,AdminLogin,
    AdminLogout,AdminProfile,
    updateAdminProfile,AdminChangePassword,
    renderAdminLogin,renderChangePassword,
    renderUserList,deleteUser,addcabform,
    addCab,addguideform,addGuide} from "../Controllers/Admin_Controller.js";

import verifyToken from '../Middlewares/verifyToken.js';
import {isAdminLoggedIn} from '../Middlewares/sessionauth.js';

const router = express.Router();


router.post('/adminregister', AdminRegister);
router.post("/adminlogin", AdminLogin);
router.get('/dashboard',isAdminLoggedIn, renderdashbord);
router.get("/",renderAdminLogin);
router.get("/admin/profile", isAdminLoggedIn, AdminProfile);
router.post('/admin/updateprofile', updateAdminProfile);
router.get('/admin/changepassword',isAdminLoggedIn, renderChangePassword); 
router.post('/admin/changepassword', AdminChangePassword);
router.get("/adminlogout", AdminLogout);
router.get('/login', renderAdminLogin);

// ________________User Routes_____________

router.get('/users',isAdminLoggedIn, renderUserList);
router.delete('/users/:id', deleteUser); 

// ______________Cab Routes_____________

router.get('/addcabform',isAdminLoggedIn, addcabform);
router.post('/cabs/add', addCab);

// ____________Guide Routes_____________

router.get('/addguideform',isAdminLoggedIn, addguideform);
router.post('/submitguide', upload.single('profileimages'),addGuide);

export default router;