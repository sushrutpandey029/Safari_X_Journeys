import express from 'express'
const GuideRoute = express.Router();

import {guidelogin} from '../Controllers/Guide_Controller.js'

GuideRoute.get('/',guidelogin);

export default GuideRoute;
