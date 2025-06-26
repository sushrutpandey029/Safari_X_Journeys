import express from 'express'
const ApiRoute = express.Router();

import { registerOrLogin, UserLogout, userchangepassword, userUpdateProfile, getuserprofile,
    getAllBanners,listFAQs,listBlogs,contactUs,getAllGuides,getAllCabs,chatbot,getTestimonialsList
 } from '../Controllers/Api_Controller.js'

import { isAuthenticated } from '../Middlewares/isAuthenticated.js'
import { authenticateJWT } from '../Middlewares/JwtAuthLogin.js'

ApiRoute.post('/user/register-or-login', registerOrLogin);
ApiRoute.post('/user/logout', UserLogout);
ApiRoute.post('/user/change-password/:id', authenticateJWT, userchangepassword);
ApiRoute.get('/user/get-profile/:id', authenticateJWT, getuserprofile);
ApiRoute.post('/user/update-profile/:id', authenticateJWT, userUpdateProfile);



ApiRoute.get('/banner/image', getAllBanners);
ApiRoute.get('/FAQ/list', listFAQs);

ApiRoute.get('/Blog/list', listBlogs);

ApiRoute.post('/send/Contactus', contactUs);

ApiRoute.get('/guide/list', getAllGuides);

ApiRoute.get('/cab/list', getAllCabs);

ApiRoute.post('/chatbot', chatbot);

ApiRoute.get('/testimonial/list', getTestimonialsList);

















export default ApiRoute;


