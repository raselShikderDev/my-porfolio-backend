/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { sendResonse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";
import { asyncFunc } from "../../utils/asyncFync";
import { projectServices } from "./project.service";

const createProject = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const newProject = await projectServices.createProject(req.body)
    sendResonse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "New project successfully created",
      data: newProject,
    });
  }
);

export const projectController = {
  createProject,
};
