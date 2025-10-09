import { StatusCodes } from 'http-status-codes';
import { prisma } from '../../configs/db';
import AppError from '../../errorHelper/error';
import bcrypt from 'bcrypt';
import createUserTokens from '../../utils/userToken';
import { JwtPayload } from 'jsonwebtoken';
import { envVars } from '../../configs/envVars';
import { verifyJwtToken } from '../../utils/jwt';
import jwt from 'jsonwebtoken';

// Owner login
const ownerLogin = async (email: string, plainPassword: string) => {
  const existedOwner = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!existedOwner) {
    throw new AppError(StatusCodes.NOT_FOUND, 'You are not authorized owner');
  }

  if (
    existedOwner.isActive === 'BLOCKED' ||
    existedOwner.isActive === 'INACTIVE'
  ) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      `You are ${existedOwner.isActive}! Please activate first`,
    );
  }

  if (!existedOwner.isVerified) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Verify before login');
  }

  const isValidPassword = await bcrypt.compare(
    plainPassword,
    existedOwner.password,
  );

  if (!isValidPassword) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid Password');
  }

  const jwtPayload: JwtPayload = {
    id: existedOwner.id,
    email: existedOwner.email,
    role: existedOwner.role,
  };

  const tokens = await createUserTokens(jwtPayload);

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    data: existedOwner,
  };
};

// Generate accessToken by refreshToken
const generateNewAccessToken = async (
  accessToken: string,
  refreshToken: string,
) => {
  let email: string | undefined;

  try {
    await verifyJwtToken(accessToken, envVars.JWT_ACCESS_SECRET as string);
    return {
      accessToken,
      refreshToken,
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error instanceof jwt.TokenExpiredError) {
      const verifiedRefreshToken = await verifyJwtToken(
        refreshToken,
        envVars.JWT_REFRESH_SECRET as string,
      ) as JwtPayload;

      email = verifiedRefreshToken.email;

      if (!email) {
        throw new AppError(StatusCodes.UNAUTHORIZED, `Invalid refresh token`);
      }
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError(StatusCodes.UNAUTHORIZED, `Invalid token`);
    } else {
      throw new AppError(StatusCodes.UNAUTHORIZED, error.message);
    }
  }

  if (!email) {
    throw new AppError(StatusCodes.UNAUTHORIZED, `Invalid or no tokens found`);
  }

  const existedOwner = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!existedOwner) {
    throw new AppError(StatusCodes.NOT_FOUND, 'You are not authorized owner');
  }

  if (
    existedOwner.isActive === 'BLOCKED' ||
    existedOwner.isActive === 'INACTIVE'
  ) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      `You are ${existedOwner.isActive}! Please activate first`,
    );
  }

  if (!existedOwner.isVerified) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'You are not verified');
  }

  const jwtPayload: JwtPayload = {
    id: existedOwner.id,
    email: existedOwner.email,
    role: existedOwner.role,
  };

  const tokens = await createUserTokens(jwtPayload);

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};


export const authServices = {
  ownerLogin,
  generateNewAccessToken,
};
