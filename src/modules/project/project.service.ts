import { StatusCodes } from 'http-status-codes';
import { prisma } from '../../configs/db';
import AppError from '../../errorHelper/error';
// import { IProject } from './project.interface';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createProject = async (payload: any) => {
  const newProject = await prisma.project.create({
    data: payload,
  });
  if (!newProject) {
    throw new AppError(StatusCodes.BAD_GATEWAY, 'Failed to create a project');
  }
  return newProject;
};

// Get singel project
const getProject = async (id: number) => {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Project not found');
  }

  return project;
};

// get all project
const getAllProject = async () => {
  const allProject = await prisma.project.findMany();
  if (!allProject) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Projects not found');
  }

  return allProject;
};

// Update a singe project
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const editProject = async (id: number, payload: Partial<any>) => {
  const updatedProject = await prisma.project.update({
    where: { id },
    data: payload,
  });
  if (!updatedProject) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Project not found');
  }

  return updatedProject;
};


const removeProject = async (id:number)=>{
  const deletedProject = await prisma.project.delete({where:{id}})
  if (!deletedProject) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Delation of project is failed")
  }
  return deletedProject
}

export const projectServices = {
  createProject,
  editProject,
  getProject,
  getAllProject,
  removeProject,
};
