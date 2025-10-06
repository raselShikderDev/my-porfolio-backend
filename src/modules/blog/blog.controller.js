"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogController = void 0;
const response_1 = require("../../utils/response");
const asyncFync_1 = require("../../utils/asyncFync");
const blog_service_1 = require("./blog.service");
const http_status_codes_1 = require("http-status-codes");
// Creating a blog
const createBlog = (0, asyncFync_1.asyncFunc)(async (req, res, next) => {
    const newBlog = await blog_service_1.blogService.createBlog(req.body);
    (0, response_1.sendResonse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: 'Blog successfully created',
        data: newBlog,
    });
});
// Upadting a blog
const updateBlog = (0, asyncFync_1.asyncFunc)(async (req, res, next) => {
    const newBlog = await blog_service_1.blogService.updateBlog(req.params.slug, req.body);
    (0, response_1.sendResonse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Blog successfully updated',
        data: newBlog,
    });
});
// get a blog
const GetBlog = (0, asyncFync_1.asyncFunc)(async (req, res, next) => {
    const newBlog = await blog_service_1.blogService.getBlog(req.params.slug);
    (0, response_1.sendResonse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Blog successfully retrived',
        data: newBlog,
    });
});
// get all blog
const getAllBlog = (0, asyncFync_1.asyncFunc)(async (req, res, next) => {
    const query = req.query;
    const allBlog = await blog_service_1.blogService.getAllBlog(query);
    (0, response_1.sendResonse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Blogs successfully retrived',
        data: allBlog.data,
        meta: {
            page: allBlog.meta.page,
            total: allBlog.meta.totalBlog,
            limit: allBlog.meta.limit,
            totalpage: allBlog.meta.totalPage
        }
    });
});
// delete a blog
const deleteBlog = (0, asyncFync_1.asyncFunc)(async (req, res, next) => {
    const deletedBlog = await blog_service_1.blogService.deleteBlog(req.params.slug);
    (0, response_1.sendResonse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Blog successfully deleted',
        data: deletedBlog,
    });
});
// stats of  blogs
const statsBlog = (0, asyncFync_1.asyncFunc)(async (req, res, next) => {
    const stats = await blog_service_1.blogService.getBlogStats();
    (0, response_1.sendResonse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Successfully retrived blogs stats',
        data: stats,
    });
});
// publish a blog
const publishBlog = (0, asyncFync_1.asyncFunc)(async (req, res, next) => {
    const publisedBlog = await blog_service_1.blogService.publishBlog(req.params.slug);
    (0, response_1.sendResonse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Blog successfully published',
        data: publisedBlog,
    });
});
// unpublish a blog
const unPublishBlog = (0, asyncFync_1.asyncFunc)(async (req, res, next) => {
    const blogUnPublished = await blog_service_1.blogService.unPublishBlog(req.params.slug);
    (0, response_1.sendResonse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Blog successfully unPublished',
        data: blogUnPublished,
    });
});
exports.blogController = {
    createBlog,
    updateBlog,
    GetBlog,
    getAllBlog,
    deleteBlog,
    statsBlog,
    publishBlog,
    unPublishBlog,
};
