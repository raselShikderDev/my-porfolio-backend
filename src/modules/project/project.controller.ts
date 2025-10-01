/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { sendResonse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";
import { asyncFunc } from "../../utils/asyncFync";

const createProject = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    
    sendResonse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "New project successfully created",
      data: null,
    });
  }
);

export const projectController = {
  createProject,
};
