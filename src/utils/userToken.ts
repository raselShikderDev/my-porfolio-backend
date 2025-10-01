import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../configs/envVars";
import { IUser } from "../modules/users/user.interface";
import { generateAccessToken } from "./jwt";

const createUserTokens = async (jwtPayload:JwtPayload) => {
  
  const accessToken = await generateAccessToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET as string,
    envVars.JWT_ACCESS_EXPIRES as string
  );

  const refreshToken = await generateAccessToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET as string,
    envVars.JWT_REFRESH_EXPIRES as string
  );
  return {
    accessToken,
    refreshToken,
  };
};

export default createUserTokens