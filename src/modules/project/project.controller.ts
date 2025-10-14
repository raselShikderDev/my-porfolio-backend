/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { sendResonse } from '../../utils/response';
import { StatusCodes } from 'http-status-codes';
import { asyncFunc } from '../../utils/asyncFync';
import { projectServices } from './project.service';



// Creating a project
const createProject = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    
    const newProject = await projectServices.createProject(req.body);
    
    sendResonse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'New project successfully created',
      data: newProject,
    });
  },
);


// Edit a project
const editProject = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const projectId = Number(req.params.id);
    const newProject = await projectServices.editProject(projectId, req.body);
    sendResonse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Project successfully edited',
      data: newProject,
    });
  },
);


// get a project
const removeProject = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = Number(req.params.id);
    const newProject = await projectServices.removeProject(userId);
    sendResonse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Project successfully deleted',
      data: newProject,
    });
  },
);


// get a project
const getProject = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const projectId = Number(req.params.id);
    const newProject = await projectServices.getProject(projectId);
    sendResonse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Project successfully retrived',
      data: newProject,
    });
  },
);


// get all project
const getAllProject = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const projects = await projectServices.getAllProject();

    sendResonse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Project successfully retrived',
      data: projects.data,
      meta:{
        total:projects.total
      }
    });
  },
);


export const projectController = {
  createProject,
  editProject,
  getProject,
  getAllProject,
  removeProject,
};
