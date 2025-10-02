import { StatusCodes } from "http-status-codes";
import { prisma } from "../../configs/db";
import AppError from "../../errorHelper/error";
import bcrypt from "bcrypt";
import createUserTokens from "../../utils/userToken";
import { JwtPayload } from "jsonwebtoken";



const ownerLogin = async (email: string, plainPassword: string) => {
  const existedOwner = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!existedOwner) {
    throw new AppError(StatusCodes.NOT_FOUND, "You are not authorized owner");
  }

  if (existedOwner.isActive === "BLOCKED" || existedOwner.isActive === "INACTIVE") {
    throw new AppError(StatusCodes.UNAUTHORIZED, `You are ${existedOwner.isActive}! Please activate first`);
  }

  if (!existedOwner.isVerified) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Verify before login");
  }


  const isValidPassword = await bcrypt.compare(
    plainPassword,
    existedOwner.password
  );

  if (!isValidPassword) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid Password");
  }

  const jwtPayload:JwtPayload = {
      id: existedOwner.id,
      email: existedOwner.email,
      role: existedOwner.role,
    };

  const tokens = await createUserTokens(jwtPayload)
  
  return {
    accessToken:tokens.accessToken,
    refreshToken:tokens.refreshToken,
    data:existedOwner,
  }

};

export const authServices = {
  ownerLogin,
};
