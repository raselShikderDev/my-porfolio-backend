import { StatusCodes } from "http-status-codes";
import { prisma } from "../../configs/db";
import AppError from "../../errorHelper/error";
import bcrypt from "bcrypt";
import createUserTokens from "../../utils/userToken";
const ownerLogin = async (email: string, plainPassword: string) => {
  const existedOwner = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!existedOwner) {
    throw new AppError(StatusCodes.NOT_FOUND, "You are not authorized owner");
  }

  const isValidPassword = await bcrypt.compare(
    plainPassword,
    existedOwner.password
  );

  if (!isValidPassword) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid Password");
  }

  const tokens = await createUserTokens(existedOwner)

};

export const authServices = {
  ownerLogin,
};
