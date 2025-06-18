import express from 'express';
import upload from '../Middlewares/fileupload/multerConfig.js';
import uploadCabImage from '../Middlewares/fileupload/cabMulterConfig.js'
import bannerimage from '../Middlewares/fileupload/bannerMulterConfig.js'  
import uploadBlog from '../Middlewares/fileupload/blogMulterConfig.js'

import { AdminRegister, renderdashbord,AdminLogin,
    AdminLogout,AdminProfile,
    updateAdminProfile,AdminChangePassword,
    renderAdminLogin,renderChangePassword,
    renderUserList,deleteUser,addcabform,addguideform,addGuide,
    addbannerform,addBanner,getAllBanners,
    addFaqForm,addFAQs,listFAQs,addBlogForm,addBlogs,listBlogs

} from "../Controllers/Admin_Controller.js";

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

// __User Routes__

router.get('/users',isAdminLoggedIn, renderUserList);
router.delete('/users/:id', deleteUser); 

// __Cab Routes__

router.get('/addcabform',isAdminLoggedIn, addcabform);
// router.post('/ceratecab', uploadCabImage, addCab);

// __Guide Routes__

router.get('/addguideform',isAdminLoggedIn, addguideform);
router.post('/submitguide', upload.single('profileimages'),addGuide);


// Frontend UserViews Routes
router.get('/banner/addform',addbannerform);
router.post("/banner/add", bannerimage.array("bannerimage[]",10), addBanner);
router.get('/banner/list',getAllBanners);


router.get('/faq/addform',addFaqForm);
router.post('/faq/add',addFAQs);
router.get('/faq/list',listFAQs);


router.get('/blog/addform',addBlogForm);
router.post('/blog/add',uploadBlog.array("image[]"),addBlogs);
router.get('/blog/list',listBlogs);


export default router;