/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import { prisma } from '../../configs/db';
import AppError from '../../errorHelper/error';


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

  const modifiedBlog = await prisma.blog.update({
    where: { slug },
    data: payload,
  });

  if (!modifiedBlog.id) {
    throw new AppError(StatusCodes.CREATED, 'Blog creation failed');
  }
  return modifiedBlog;
};

// Get a Blog
const getBlog = async (slug: string) => {
  const blog = await prisma.blog.findUnique({
    where: {
      slug: slug,
    },
  });
  if (!blog) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Blog not found');
  }
  return blog;
};

// delete a Blog
const deleteBlog = async (slug: string) => {
  const blog = await prisma.blog.delete({
    where: {
      slug: slug,
    },
  });
  if (!blog) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Blog delation failed');
  }
  return blog;
};

// Publish a Blog
const publishBlog = async (slug: string) => {
  const blogPublished = await prisma.blog.update({
    where: {
      slug: slug,
      published: false,
    },
    data: {
      published: true,
    },
  });
  if (!blogPublished) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Blog publishing failed');
  }
  return blogPublished;
};

// Publish a Blog
const unPublishBlog = async (slug: string) => {
  const blogUnPublished = await prisma.blog.update({
    where: {
      slug: slug,
      published: true,
    },
    data: {
      published: false,
    },
  });
  if (!blogUnPublished) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Blog publishing failed');
  }
  return blogUnPublished;
};

// Get all Blog
const getAllBlog = async ({
  page = 1,
  limit = 10,
  search,
  published,
  orderBy,
  tags,
  orderFeild = 'publishedDate',
}: {
  page?: number;
  limit?: number;
  search?: string;
  published?: boolean;
  orderFeild?: string;
  tags?: string[];
  orderBy?: 'asc' | 'desc';
}) => {
  const skip = (page - 1) * limit;
  const where: any = {
    AND: [
      search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
        ],
      },
      typeof published === 'boolean' && { published },
      tags && tags.length > 0 && { tags: { hasEvery: tags } },
    ].filter(Boolean),
  };
  const blogs = await prisma.blog.findMany({
    skip,
    take: limit,
    where,
    orderBy: {
      [orderFeild]: orderBy ? orderBy : 'desc',
    },
  });
  console.log(blogs);
  
  if (!blogs || blogs.length === 0) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Blogs not found');
  }

  const totalBlogCount = await prisma.blog.count({ where});

  return {
    data: blogs,
    meta: {
      page,
      limit,
      totalBlog: totalBlogCount,
      totalPage: Math.ceil(totalBlogCount / limit)
    },
  };
};

const getBlogStats = async()=>{
     return await prisma.$transaction(async (txrb) => {
        const aggregates = await txrb.blog.aggregate({
            _count: true,
            _sum: { views: true },
            _avg: { views: true },
            _max: { views: true },
            _min: { views: true },
        })

        const featuredCount = await txrb.blog.count({
            where: {
                published: true
            }
        });

        const topFeatured = await txrb.blog.findFirst({
            where: { published: true },
            orderBy: { views: "desc" }
        })

        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7)
        const lastMonth = new Date();
        lastWeek.setDate(lastWeek.getDate() - 30)

        const lastWeekPostCount = await txrb.blog.count({
            where: {
                createdAt: {
                    gte: lastWeek
                }
            }
        })
        const lastMonthPostCount = await txrb.blog.count({
            where: {
                createdAt: {
                    gte: lastMonth
                }
            }
        })

        return {
            stats: {
                totalBlog: aggregates._count ?? 0,
                totalViews: aggregates._sum.views ?? 0,
                avgViews: aggregates._avg.views ?? 0,
                minViews: aggregates._min.views ?? 0,
                maxViews: aggregates._max.views ?? 0
            },
            featured: {
                count: featuredCount,
                topPost: topFeatured,
            },
            lastWeekPostCount,
            lastMonthPostCount
        };
    })
}

export const blogService = {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlog,
  deleteBlog,
  publishBlog,
  unPublishBlog,
  getBlogStats,
};
