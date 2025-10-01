import { Response } from "express";

type TTokens = { accessToken?: string; refreshToken?: string };

export const setAuthCookies = async (res: Response, tokens: TTokens) => {
  if (tokens.accessToken) {
    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
  }
  if (tokens.refreshToken) {
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
  }
};
