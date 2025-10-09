import { Response } from 'express';

interface ITokens {
  accessToken?: string;
  refreshToken?: string;
}

export const setAuthCookies = async (res: Response, tokens: ITokens) => {
  if (tokens.accessToken) {
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
    });
  }
  if (tokens.refreshToken) {
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
    });
  }
};
