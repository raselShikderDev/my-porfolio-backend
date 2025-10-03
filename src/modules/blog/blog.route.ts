import express from 'express';
import { blogController } from './blog.controller';
import { requestValidator } from '../../middlewares/requestValidator';
import { blogCreateSchema, blogUpdateSchema } from './blog.schmea';
import authCheck from '../../middlewares/authCheck';
import { Role } from '../users/user.interface';


const router = express.Router();


//Get stats of blog
router.get('/stats', authCheck(...Object.values(Role)), blogController.statsBlog);

//Create blog
router.post('/create', authCheck(...Object.values(Role)), requestValidator(blogCreateSchema), blogController.createBlog);

// get all Blog
router.get('/all', authCheck(...Object.values(Role)), blogController.getAllBlog);

// Get a blog
router.get('/:slug', authCheck(...Object.values(Role)), blogController.GetBlog);

// Publish a post
router.patch('/publish/:slug', authCheck(...Object.values(Role)), blogController.publishBlog);

// Unpublish a post
router.patch('/unpublish/:slug', authCheck(...Object.values(Role)), blogController.unPublishBlog);

// Update a blog
router.patch('/update/:slug', authCheck(...Object.values(Role)), requestValidator(blogUpdateSchema), blogController.updateBlog);

//Delete a blog
router.delete('/:slug', authCheck(...Object.values(Role)), blogController.deleteBlog);


export const blogRouter = router;