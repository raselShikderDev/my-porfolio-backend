/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { sendResonse } from '../../utils/response';
import { StatusCodes } from 'http-status-codes';
import { asyncFunc } from '../../utils/asyncFync';
import { workExpServices } from './workExp.service';

// Creating a WorkExp
const createWorkExp = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log('In controller', req.body);

    const newWorkExp = await workExpServices.createWorkExp(req.body);
    sendResonse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'New Work experince successfully created',
      data: newWorkExp,
    });
  },
);

// Edit a WorkExp
const editWorkExp = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    // console.log("req.body in controller: ", req.body);
    const WorkExpId = Number(req.params.id);
    const newWorkExp = await workExpServices.editWorkExp(WorkExpId, req.body);
    sendResonse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Work experince successfully edited',
      data: newWorkExp,
    });
  },
);

// get a WorkExp
const removeWorkExp = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    // console.log("req.body in controller: ", req.body);
    const userId = Number(req.params.id);
    const newWorkExp = await workExpServices.removeWorkExp(userId);
    sendResonse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Work experince successfully deleted',
      data: newWorkExp,
    });
  },
);

// get a WorkExp
const getWorkExp = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    // console.log("req.body in controller: ", req.body);
    const WorkExpId = Number(req.params.id);
    const newWorkExp = await workExpServices.getWorkExp(WorkExpId);
    sendResonse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Work experince successfully retrived',
      data: newWorkExp,
    });
  },
);

// get all WorkExp
const getAllWorkExp = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    // console.log("req.body in controller: ", req.body);
    const workExp = await workExpServices.getAllWorkExp();
    sendResonse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Works experinces successfully retrived',
      data: workExp.data,
      meta: {
        total: workExp.total,
      },
    });
  },
);

export const workExpController = {
  createWorkExp,
  editWorkExp,
  getWorkExp,
  getAllWorkExp,
  removeWorkExp,
};
