/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "../../configs/db"

const getMe = async ()=>{
    return
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