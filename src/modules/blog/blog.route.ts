import express from 'express';
import { blogController } from './blog.controller';
import { requestValidator } from '../../middlewares/requestValidator';
import { blogCreateSchema, blogUpdateSchema } from './blog.schmea';
import authCheck from '../../middlewares/authCheck';
import { Role } from '../users/user.interface';
import { multerUpload } from '../../configs/multerConfig';

const router = express.Router();

// eslint-disable-next-line no-console
console.log("✅ Blog routes registered");

// get all Blog
router.get(
  '/all',
  blogController.getAllBlog,
);

//Get stats of blog
router.get(
  '/stats',
  authCheck(...Object.values(Role)),
  blogController.statsBlog,
);

//Create blog
router.post(
  '/create',
  multerUpload.array('files'),
  authCheck(...Object.values(Role)),
  requestValidator(blogCreateSchema),
  blogController.createBlog,
);



// Get a blog
router.get('/:slug', blogController.GetBlog);

// Publish a post
router.patch(
  '/publish/:slug',
  authCheck(...Object.values(Role)),
  blogController.publishBlog,
);

// Unpublish a post
router.patch(
  '/unpublish/:slug',
  authCheck(...Object.values(Role)),
  blogController.unPublishBlog,
);

// Update a blog
router.patch(
  '/update/:slug',
  multerUpload.array('files'),
  authCheck(...Object.values(Role)),
  requestValidator(blogUpdateSchema),
  blogController.updateBlog,
);

//Delete a blog
router.delete(
  '/:slug',
  authCheck(...Object.values(Role)),
  blogController.deleteBlog,
);

export const blogRouter = router;
