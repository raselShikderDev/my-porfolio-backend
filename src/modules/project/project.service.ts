import { StatusCodes } from "http-status-codes";
import { prisma } from "../../configs/db";
import AppError from "../../errorHelper/error";




// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createProject = async (payload:any) => {
  const newProject= await prisma.project.create({
    data:payload
  })


  if (!newProject) {
    throw new AppError(StatusCodes.BAD_GATEWAY, "Failed to create a project")
  }

  return newProject

};

export const projectServices = {
  createProject,
};
