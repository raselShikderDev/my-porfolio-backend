import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"
import { envVars } from "../configs/envVars"

export const generateAccessToken = async (jwtPayload:JwtPayload, secret:string, expires:string):Promise<string>=>{
    const accessToken = await jwt.sign(jwtPayload, secret, {expiresIn:expires} as SignOptions )
    return accessToken
}


export const verifyJwtToken = async(accessToken:string, secret:string)=>{
    const verifiedToken = jwt.verify(accessToken, secret)
    return verifiedToken
}

