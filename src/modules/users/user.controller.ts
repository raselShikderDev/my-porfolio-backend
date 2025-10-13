/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { asyncFunc } from '../../utils/asyncFync';
import { userService } from './user.services';
import { sendResonse } from '../../utils/response';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';

const create = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;

    const newUser = await userService.create(body);
    sendResonse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Successfully created',
      data: newUser,
    });
  },
);

const getMe = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const email = req.user.email;
    const owner = await userService.getMe(email);
    console.log(owner);
    
    sendResonse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Successfully retrived owner',
      data: owner,
    });
  },
);

export const userController = {
  create,
  getMe,
};
