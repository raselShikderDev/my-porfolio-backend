import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"

export const generateAccessToken = async (jwtPayload: JwtPayload, secret: string, expires: string): Promise<string> => {
    const accessToken = await jwt.sign(jwtPayload, secret, {
        expiresIn: expires,
        algorithm: 'HS256',
    } as SignOptions)
    return accessToken
}


export const verifyJwtToken = async (token: string, secret: string) => {
    const verifiedToken = await jwt.verify(token, secret, {
        algorithms: ['HS256'],
    })
    return verifiedToken
}

