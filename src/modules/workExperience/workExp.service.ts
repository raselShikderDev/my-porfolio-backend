import { StatusCodes } from 'http-status-codes';
import { prisma } from '../../configs/db';
import AppError from '../../errorHelper/error';
// import { IWorkExp } from './WorkExp.interface';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createWorkExp = async (payload: any) => {
  
  const newWorkExp = await prisma.workExperince.create({
    data: payload,
  });
  console.log("newWorkExp", newWorkExp);
  
  if (!newWorkExp) {
    throw new AppError(StatusCodes.BAD_GATEWAY, 'Failed to create Work experince');
  }
  return newWorkExp;
};

// Get singel WorkExp
const getWorkExp = async (id: number) => {
  const WorkExp = await prisma.workExperince.findUnique({ where: { id } });
  if (!WorkExp) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Work experince not found');
  }

  return WorkExp;
};

// get all WorkExp
const getAllWorkExp = async () => {
  const allWorkExp = await prisma.workExperince.findMany();
  if (!allWorkExp || allWorkExp.length === 0) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Work experince not found');
  }

    const totalWorkExpCount = await prisma.workExperince.count();

  return {
    data:allWorkExp,
    total:totalWorkExpCount
  };
};

// Update a singe WorkExp
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const editWorkExp = async (id: number, payload: Partial<any>) => {
  const updatedWorkExp = await prisma.workExperince.update({
    where: { id },
    data: payload,
  });
  if (!updatedWorkExp) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Work Experince not found');
  }

  return updatedWorkExp;
};


const removeWorkExp = async (id:number)=>{
  const deletedWorkExp = await prisma.workExperince.delete({where:{id}})
  if (!deletedWorkExp) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Delation of Work Experince is failed")
  }
  return deletedWorkExp
}

export const workExpServices = {
  createWorkExp,
  editWorkExp,
  getWorkExp,
  getAllWorkExp,
  removeWorkExp,
};
