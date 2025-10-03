/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { sendResonse } from "../../utils/response";
import { asyncFunc } from "../../utils/asyncFync";
import { blogService } from "./blog.service";
import { StatusCodes } from "http-status-codes";

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

// Creating a blog
const updateBlog = asyncFunc(
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

// Creating a blog
const GetBlog = asyncFunc(
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

// Creating a blog
const getAllBlog = asyncFunc(
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

// Creating a blog
const deleteBlog = asyncFunc(
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

// Creating a blog
const statsBlog = asyncFunc(
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

// Creating a blog
const publishBlog = asyncFunc(
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
// Creating a blog
const unPublishBlog = asyncFunc(
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

export const blogController ={
    createBlog,
    updateBlog,
    GetBlog,
    getAllBlog,
    deleteBlog,
    statsBlog,
    publishBlog,
    unPublishBlog
}