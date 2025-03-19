import express from 'express';
import { addCourse, educatorDashboard, getEducatorCourse, getEnrolledStudentsData, updateRoleEducator } from '../controllers/educatorController.js';
import upload from '../configs/multer.js';
import { protectEducator } from '../middlewares/authMiddleware.js';

const educatorRouter = express.Router();

//Add educator Role
educatorRouter.get('/update-role',updateRoleEducator);
educatorRouter.post('/add-course',upload.single('image'),protectEducator,addCourse);
educatorRouter.get('/courses',protectEducator,getEducatorCourse);
educatorRouter.get('/dashboard',protectEducator,educatorDashboard);
educatorRouter.get('/enrolled-students',protectEducator,getEnrolledStudentsData);

export default educatorRouter;