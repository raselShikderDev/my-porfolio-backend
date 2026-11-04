/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { sendResonse } from '../../utils/response';
import { StatusCodes } from 'http-status-codes';
import { asyncFunc } from '../../utils/asyncFync';
import { resumeService } from './resume.service';

// Creating a resume
const createResume = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
     const userid = Number(req.user?.id);
    const newResume = await resumeService.createResume(req.body, userid as number);

    sendResonse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Resume successfully created',
      data: newResume,
    });
  },
);

// Get a resume
const getResume = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const resumeId = parseInt(req.params.id);
    const resume = await resumeService.getResume(resumeId,);
   
    sendResonse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Resume successfully retrieved',
      data: resume,
    });
  },
);

// Get all resumes
const getAllResumes = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const resumes = await resumeService.getAllResumes();

    sendResonse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Resumes successfully retrieved',
      data: resumes.data,
      meta: {
        total: resumes.total,
      }
    });
  },
);

// Update a resume
const updateResume = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const resumeId = Number(req.params.id);
    const updatedResume = await resumeService.updateResume(resumeId, req.body);

    sendResonse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Resume successfully updated',
      data: updatedResume,
    });
  },
);

// Delete a resume
const deleteResume = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const resumeId = Number(req.params.id);
    const deletedResume = await resumeService.deleteResume(resumeId);

    sendResonse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Resume successfully deleted',
      data: deletedResume,
    });
  },
);

export const resumeController = {
  createResume,
  getResume,
  getAllResumes,
  updateResume,
  deleteResume,
};