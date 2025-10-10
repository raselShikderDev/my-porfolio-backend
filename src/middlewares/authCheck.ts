import { NextFunction, Request, Response } from 'express';
import { envVars } from '../configs/envVars';
import { verifyJwtToken } from '../utils/jwt';
import { JwtPayload } from 'jsonwebtoken';
import AppError from '../errorHelper/error';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '../configs/db';

const authCheck =
  (...authRole: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body) console.log('in auth', req.body);
      // if (req.body.data) console.log('in auth', req.body.data);
      console.log('Validating owner');

      const accessToken = req.headers.authorization || req.cookies.accessToken;

      const verifiedToken = (await verifyJwtToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET as string,
      )) as JwtPayload;

      if (!verifiedToken) {
        throw new AppError(StatusCodes.UNAUTHORIZED, `Invalid access token`);
      }

      const existedOwner = await prisma.user.findUnique({
        where: {
          email: verifiedToken.email,
        },
      });

      if (!existedOwner) {
        throw new AppError(
          StatusCodes.NOT_FOUND,
          'You are not authorized owner',
        );
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

      if (!authRole.includes(existedOwner.role)) {
        throw new AppError(
          StatusCodes.UNAUTHORIZED,
          `Authorization required to access`,
        );
      }

      req.user = verifiedToken;
      console.log('Owner is authenticated');
      
      next();
    } catch (error) {
      console.log('Owner is not authenticated');
      next(error);
    }
  };

export default authCheck;
