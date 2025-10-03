import { StatusCodes } from 'http-status-codes';
import { prisma } from '../../configs/db';
import AppError from '../../errorHelper/error';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createBlog = async (payload: any) => {
  const existedBlog = await prisma.blog.findUnique({
    where: {
      slug: payload.slug,
    },
  });

  if (existedBlog?.slug) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Duplicate slug! Required a unique slug',
    );
  }

  const newBlog = await prisma.blog.create({
    data: payload,
  });
  if (!newBlog.id) {
    throw new AppError(StatusCodes.CREATED, 'Blog creation failed');
  }
  return newBlog;
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateBlog = async (slug: string, payload: any) => {

  if (payload.slug) {
    const existedBlog = await prisma.blog.findUnique({
      where: {
        slug: payload.slug,
      },
    });
    if (existedBlog?.slug) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Duplicate slug! Required a unique slug',
      );
    }
  }

  const modifiedBlog = await prisma.blog.update(
    { where: { slug }, data:payload },
  );

  if (!modifiedBlog.id) {
    throw new AppError(StatusCodes.CREATED, 'Blog creation failed');
  }
  return modifiedBlog;
};


// Get a Blog
const getBlog = async(slug:string)=>{
     const blog = await prisma.blog.findUnique({
      where: {
        slug: slug,
      },
    });
    if (!blog) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        'Blog not found',
      );
    }
    return blog
}
// delete a Blog
const deleteBlog = async(slug:string)=>{
     const blog = await prisma.blog.delete({
      where: {
        slug: slug,
      },
    });
    if (!blog) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        'Blog delation failed',
      );
    }
    return blog
}


// Publish a Blog
const publishBlog = async(slug:string)=>{
     const blogPublished = await prisma.blog.update({
      where: {
        slug: slug,
        published:false
      },
      data:{
        published:true
      }
    });
    if (!blogPublished) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        'Blog publishing failed',
      );
    }
    return blogPublished
}


// Publish a Blog
const unPublishBlog = async(slug:string)=>{
     const blogUnPublished = await prisma.blog.update({
      where: {
        slug: slug,
        published:true
      },
      data:{
        published:false
      }
    });
    if (!blogUnPublished) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        'Blog publishing failed',
      );
    }
    return blogUnPublished
}


// Get all Blog
const getAllBlog = async()=>{
     const blogs = await prisma.blog.findMany();
    if (!blogs) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        'Blogs not found',
      );
    }
    return blogs
}


export const blogService = {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlog,
  deleteBlog,
  publishBlog,
  unPublishBlog
};
