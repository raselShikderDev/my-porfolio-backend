import { StatusCodes } from "http-status-codes"
import { prisma } from "../../configs/db"
import AppError from "../../errorHelper/error"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createBlog = async (payload:any)=>{
    const newBlog = await prisma.blog.create({
        data:payload
    })
    if (!newBlog.id) {
        throw new AppError(StatusCodes.CREATED, "Blog creation failed")
    }
    return newBlog
}


export const blogService = {
    createBlog
}