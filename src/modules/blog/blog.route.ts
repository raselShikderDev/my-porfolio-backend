import express from 'express';
import { blogController } from './blog.controller';

const router = express.Router();
//Get stats of blog
router.get('/stats', blogController.statsBlog);
//Create blog
router.post('/create', blogController.createBlog);
// get all Blog
router.get('/', blogController.getAllBlog);
// Get a blog
router.get('/:id', blogController.GetBlog);
// Publish a post
router.patch('/publish/:id', blogController.publishBlog);
// Unpublish a post
router.patch('/unpublish/:id', blogController.unPublishBlog);
// Update a blog
router.patch('/:id', blogController.updateBlog);
//Delete a blog
router.delete('/:id', blogController.deleteBlog);

export const blogRouter = router;
