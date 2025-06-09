import express from 'express'
const AdminRoute = express.Router();

import{renderdashbord} from '../Controllers/Admin_Controller.js'

AdminRoute.get('/',renderdashbord);


export default AdminRoute;
