/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from "http-status-codes"
import { prisma } from "../../configs/db"
import AppError from "../../errorHelper/error"

const getMe = async (email:string)=>{
    const me = await prisma.user.findUnique({
        where:{
            email
        }
    })
    if (!me) {
        throw new AppError(StatusCodes.NOT_FOUND, "Owner not found")
    }
    return me
}

const create = async(payload:any)=>{
    
    const newUser = await prisma.user.create({
        data:payload
    })
    return newUser
}




export const userService ={
create,
getMe
}