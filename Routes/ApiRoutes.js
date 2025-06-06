import express from 'express'
const ApiRoute = express.Router();

import {registerOrLogin,UserLogout,
    userchangepassword,userUpdateProfile,
    getuserprofile} from '../Controllers/Api_Controller.js'

import{isAuthenticated} from '../Middlewares/isAuthenticated.js'
import {authenticateJWT} from '../Middlewares/JwtAuthLogin.js'

ApiRoute.post('/registerOrLogin', registerOrLogin);
ApiRoute.post('/UserLogout', UserLogout);
ApiRoute.post('/UserChangePassword/:id',authenticateJWT,isAuthenticated, userchangepassword);
ApiRoute.get('/GetUserProfile/:id',authenticateJWT,isAuthenticated, getuserprofile);
ApiRoute.post('/userUpdateProfile/:id',authenticateJWT,isAuthenticated, userUpdateProfile);


export default ApiRoute;


