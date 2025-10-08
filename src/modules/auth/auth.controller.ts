/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { asyncFunc } from '../../utils/asyncFync';
import { sendResonse } from '../../utils/response';
import { StatusCodes } from 'http-status-codes';
import { authServices } from './auth.service';
import { setAuthCookies } from '../../utils/setCookies';
import AppError from '../../errorHelper/error';

// Owner login
const ownerLogin = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const ownerCredentials = await authServices.ownerLogin(email, password);
    if (!ownerCredentials.accessToken && !ownerCredentials.data) {
      throw new AppError(StatusCodes.BAD_GATEWAY, 'Login failed');
    }
    await setAuthCookies(res, {
      accessToken: ownerCredentials.accessToken,
      refreshToken: ownerCredentials.refreshToken,
    });

    sendResonse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Owner successfully logged in ',
      data: ownerCredentials,
    });
  },
);

// Log Out
const ownerLogOut = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('accessToken', {
      httpOnly: true,
      sameSite: 'none',
      secure: false,
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'none',
      secure: false,
    });

    sendResonse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Owner successfully logOut ',
      data: null,
    });
  },
);



// Generate accesstoken by refresh Token
const generateNewAccessToken = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken || req.headers.authorization;
    const accessToken = req.cookies.accessToken || req.headers.authorization;
    const ownerCredentials =
      await authServices.generateNewAccessToken(accessToken, refreshToken);
    if (!ownerCredentials.accessToken) {
      throw new AppError(
        StatusCodes.BAD_GATEWAY,
        'Generating access tokens failed',
      );
    }
    await setAuthCookies(res, {
      accessToken: ownerCredentials.accessToken,
      refreshToken: ownerCredentials.refreshToken,
    });

    sendResonse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'AccessToken successfully generated',
      data: {
        accessToken: ownerCredentials.accessToken,
      },
    });
  },
);

export const authController = {
  ownerLogin,
  ownerLogOut,
  generateNewAccessToken,
};
