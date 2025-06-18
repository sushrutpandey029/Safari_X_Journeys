import express from 'express'
const ApiRoute = express.Router();

import { registerOrLogin, UserLogout, userchangepassword, userUpdateProfile, getuserprofile,
    getAllBanners,listFAQs,listBlogs
 } from '../Controllers/Api_Controller.js'

import { isAuthenticated } from '../Middlewares/isAuthenticated.js'
import { authenticateJWT } from '../Middlewares/JwtAuthLogin.js'

ApiRoute.post('/user/register-or-login', registerOrLogin);
ApiRoute.post('/user/logout', UserLogout);
ApiRoute.post('/user/change-password/:id', authenticateJWT, isAuthenticated, userchangepassword);
ApiRoute.get('/user/get-profile/:id', authenticateJWT, isAuthenticated, getuserprofile);
ApiRoute.post('/user/update-profile/:id', authenticateJWT, isAuthenticated, userUpdateProfile);

ApiRoute.get('/banner/image', getAllBanners);
ApiRoute.get('/FAQ/list', listFAQs);

ApiRoute.get('/Blog/list', listBlogs);




export default ApiRoute;


