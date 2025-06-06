import express from 'express'
const AdminRoute = express.Router();

import{userregistartionandlogin} from '../Controllers/Admin_Controller.js'

AdminRoute.get('/',userregistartionandlogin);

export default AdminRoute;


