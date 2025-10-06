"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRouter = void 0;
const express_1 = __importDefault(require("express"));
const blog_controller_1 = require("./blog.controller");
const requestValidator_1 = require("../../middlewares/requestValidator");
const blog_schmea_1 = require("./blog.schmea");
const authCheck_1 = __importDefault(require("../../middlewares/authCheck"));
const user_interface_1 = require("../users/user.interface");
const multerConfig_1 = require("../../configs/multerConfig");
const router = express_1.default.Router();
//Get stats of blog
router.get('/stats', (0, authCheck_1.default)(...Object.values(user_interface_1.Role)), blog_controller_1.blogController.statsBlog);
//Create blog
router.post('/create', multerConfig_1.multerUpload.array('files'), (0, authCheck_1.default)(...Object.values(user_interface_1.Role)), (0, requestValidator_1.requestValidator)(blog_schmea_1.blogCreateSchema), blog_controller_1.blogController.createBlog);
// get all Blog
router.get('/all', (0, authCheck_1.default)(...Object.values(user_interface_1.Role)), blog_controller_1.blogController.getAllBlog);
// Get a blog
router.get('/:slug', (0, authCheck_1.default)(...Object.values(user_interface_1.Role)), blog_controller_1.blogController.GetBlog);
// Publish a post
router.patch('/publish/:slug', (0, authCheck_1.default)(...Object.values(user_interface_1.Role)), blog_controller_1.blogController.publishBlog);
// Unpublish a post
router.patch('/unpublish/:slug', (0, authCheck_1.default)(...Object.values(user_interface_1.Role)), blog_controller_1.blogController.unPublishBlog);
// Update a blog
router.patch('/update/:slug', multerConfig_1.multerUpload.array('files'), (0, authCheck_1.default)(...Object.values(user_interface_1.Role)), (0, requestValidator_1.requestValidator)(blog_schmea_1.blogUpdateSchema), blog_controller_1.blogController.updateBlog);
//Delete a blog
router.delete('/:slug', (0, authCheck_1.default)(...Object.values(user_interface_1.Role)), blog_controller_1.blogController.deleteBlog);
exports.blogRouter = router;
