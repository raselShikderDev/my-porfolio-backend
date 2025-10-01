import { prisma } from "../../configs/db"

const getMe = async ()=>{
    
}

const create = async(payload:any)=>{
    
    const newUser = await prisma.user.create({
        data:payload
    })
    return newUser
}

export const userService ={
create
}