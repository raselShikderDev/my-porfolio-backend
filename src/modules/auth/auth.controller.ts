import { NextFunction, Request, Response } from "express";
import { asyncFunc } from "../../utils/asyncFync";
import { sendResonse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";
import { authServices } from "./auth.service";


const ownerLogin = asyncFunc(async(req:Request, res:Response, next:NextFunction)=>{
    const {email, password} = req.body
    const ownerCredentials = await authServices.ownerLogin(email, password)
    sendResonse(res,{
        success:true,
        statusCode:StatusCodes.OK,
        message:"Oenser login successfull",
        data:ownerCredentials
    })
})



export const authController = {
    ownerLogin,
}