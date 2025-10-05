"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_codes_1 = require("http-status-codes");
const db_1 = require("../../configs/db");
const error_1 = __importDefault(require("../../errorHelper/error"));
const createBlog = async (payload) => {
    const existedBlog = await db_1.prisma.blog.findUnique({
        where: {
            slug: payload.slug,
        },
    });
    if (existedBlog?.slug) {
        throw new error_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Duplicate slug! Required a unique slug');
    }
    const newBlog = await db_1.prisma.blog.create({
        data: payload,
    });
    if (!newBlog.id) {
        throw new error_1.default(http_status_codes_1.StatusCodes.CREATED, 'Blog creation failed');
    }
    return newBlog;
};
const updateBlog = async (slug, payload) => {
    if (payload.slug) {
        const existedBlog = await db_1.prisma.blog.findUnique({
            where: {
                slug: payload.slug,
            },
        });
        if (existedBlog?.slug) {
            throw new error_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Duplicate slug! Required a unique slug');
        }
    }
    const modifiedBlog = await db_1.prisma.blog.update({
        where: { slug },
        data: payload,
    });
    if (!modifiedBlog.id) {
        throw new error_1.default(http_status_codes_1.StatusCodes.CREATED, 'Blog creation failed');
    }
    return modifiedBlog;
};
// Get a Blog
const getBlog = async (slug) => {
    const blog = await db_1.prisma.blog.findUnique({
        where: {
            slug: slug,
        },
    });
    if (!blog) {
        throw new error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Blog not found');
    }
    return blog;
};
// delete a Blog
const deleteBlog = async (slug) => {
    const blog = await db_1.prisma.blog.delete({
        where: {
            slug: slug,
        },
    });
    if (!blog) {
        throw new error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Blog delation failed');
    }
    return blog;
};
// Publish a Blog
const publishBlog = async (slug) => {
    const blogPublished = await db_1.prisma.blog.update({
        where: {
            slug: slug,
            published: false,
        },
        data: {
            published: true,
        },
    });
    if (!blogPublished) {
        throw new error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Blog publishing failed');
    }
    return blogPublished;
};
// Publish a Blog
const unPublishBlog = async (slug) => {
    const blogUnPublished = await db_1.prisma.blog.update({
        where: {
            slug: slug,
            published: true,
        },
        data: {
            published: false,
        },
    });
    if (!blogUnPublished) {
        throw new error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Blog publishing failed');
    }
    return blogUnPublished;
};
// Get all Blog
const getAllBlog = async ({ page = 1, limit = 1, search, published, orderBy, tags, orderFeild = 'publishedDate', }) => {
    const skip = (page - 1) * limit;
    const where = {
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
    const blogs = await db_1.prisma.blog.findMany({
        skip,
        take: limit,
        where,
        orderBy: {
            [orderFeild]: orderBy ? orderBy : 'desc',
        },
    });
    if (!blogs || blogs.length === 0) {
        throw new error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Blogs not found');
    }
    const totalBlogCount = await db_1.prisma.blog.count({ where });
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
const getBlogStats = async () => {
    return await db_1.prisma.$transaction(async (txrb) => {
        const aggregates = await txrb.blog.aggregate({
            _count: true,
            _sum: { views: true },
            _avg: { views: true },
            _max: { views: true },
            _min: { views: true },
        });
        const featuredCount = await txrb.blog.count({
            where: {
                published: true
            }
        });
        const topFeatured = await txrb.blog.findFirst({
            where: { published: true },
            orderBy: { views: "desc" }
        });
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        const lastMonth = new Date();
        lastWeek.setDate(lastWeek.getDate() - 30);
        const lastWeekPostCount = await txrb.blog.count({
            where: {
                createdAt: {
                    gte: lastWeek
                }
            }
        });
        const lastMonthPostCount = await txrb.blog.count({
            where: {
                createdAt: {
                    gte: lastMonth
                }
            }
        });
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
    });
};
exports.blogService = {
    createBlog,
    updateBlog,
    getBlog,
    getAllBlog,
    deleteBlog,
    publishBlog,
    unPublishBlog,
    getBlogStats,
};
