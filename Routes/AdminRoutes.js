import express from 'express';
import upload from '../Middlewares/fileupload/multerConfig.js';
import uploadCabImage from '../Middlewares/fileupload/cabMulterConfig.js';
import bannerimage from '../Middlewares/fileupload/bannerMulterConfig.js'; 
import uploadBlog from '../Middlewares/fileupload/blogMulterConfig.js';
import uploadDriverPhoto from '../Middlewares/fileupload/driverUpload.js';
import uploadTestimonial from '../Middlewares/fileupload/testimonialMulterConfig.js';

import { AdminRegister, renderdashbord,AdminLogin,
    AdminLogout,AdminProfile,
    updateAdminProfile,AdminChangePassword,
    renderAdminLogin,renderChangePassword,
    renderUserList,deleteUser,addcabform,addCab,addguideform,addGuide,
    addbannerform,addBanner,getAllBanners,
    addFaqForm,addFAQs,listFAQs,addBlogForm,addBlogs,listBlogs,
    addDriver,addDriverForm,getAllCabs,
    getAllDrivers,getAllGuides,cabAssignment,
    updateCabAssignTo,getAllAssignCab,addTestimonial,addTestimonialForm,getTestimonialsList,deleteTestimonial,showGuidePassword

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
router.post('/cab/add', uploadCabImage, addCab);
router.get('/cab/list', getAllCabs);

// Driver routes
router.get('/driver/addform', addDriverForm);
router.post('/driver/add',uploadDriverPhoto, addDriver);
router.get('/driver/list', getAllDrivers);

router.get('/cab/assign/form', cabAssignment);
router.post('/cab/assign/to', updateCabAssignTo);
router.get('/cab/assign/list', getAllAssignCab);





// __Guide Routes__

router.get('/addguideform',isAdminLoggedIn, addguideform);
router.post('/submitguide', upload.single('profileimages'),addGuide);
router.get('/guide/list', getAllGuides);
router.get('/guide/:id/password', showGuidePassword);








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

router.get('/testimonial/addform',addTestimonialForm);
router.post('/testimonial/add',uploadTestimonial.array("image[]"),addTestimonial);
router.get('/testimonial/list',getTestimonialsList);
router.post('/testimonial/delete/:id',deleteTestimonial);



export default router;