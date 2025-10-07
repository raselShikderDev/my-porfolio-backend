/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { sendResonse } from '../../utils/response';
import { asyncFunc } from '../../utils/asyncFync';
import { blogService } from './blog.service';
import { StatusCodes } from 'http-status-codes';
import { Record } from '@prisma/client/runtime/library';

// Creating a blog
const createBlog = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const newBlog = await blogService.createBlog(req.body);
    sendResonse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Blog successfully created',
      data: newBlog,
    });
  },
);


// Upadting a blog
const updateBlog = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const newBlog = await blogService.updateBlog(req.params.slug, req.body);
    sendResonse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Blog successfully updated',
      data: newBlog,
    });
  },
);


// get a blog
const GetBlog = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("Got request for one blog")
    const newBlog = await blogService.getBlog(req.params.slug);
    sendResonse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Blog successfully retrived',
      data: newBlog,
    });
  },
);


// get all blog
const getAllBlog = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query
    const allBlog = await blogService.getAllBlog(query as Record<string, string>);
    console.log("Got request in all blog");
    
    sendResonse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Blogs successfully retrived',
      data: allBlog.data,
      meta:{
        page:allBlog.meta.page,
        total:allBlog.meta.totalBlog,
        limit:allBlog.meta.limit,
        totalpage:allBlog.meta.totalPage
      }
    });
  },
);


// delete a blog
const deleteBlog = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const deletedBlog = await blogService.deleteBlog(req.params.slug);
    sendResonse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Blog successfully deleted',
      data: deletedBlog,
    });
  },
);


// stats of  blogs
const statsBlog = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const stats = await blogService.getBlogStats();
    sendResonse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Successfully retrived blogs stats',
      data: stats,
    });
  },
);


// publish a blog
const publishBlog = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const publisedBlog = await blogService.publishBlog(req.params.slug);
    sendResonse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Blog successfully published',
      data: publisedBlog,
    });
  },
);


// unpublish a blog
const unPublishBlog = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const blogUnPublished = await blogService.unPublishBlog(req.params.slug);
    sendResonse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Blog successfully unPublished',
      data: blogUnPublished,
    });
  },
);


export const blogController = {
  createBlog,
  updateBlog,
  GetBlog,
  getAllBlog,
  deleteBlog,
  statsBlog,
  publishBlog,
  unPublishBlog,
};
