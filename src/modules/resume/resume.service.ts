import { StatusCodes } from 'http-status-codes';
import { prisma } from '../../configs/db';
import AppError from '../../errorHelper/error';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createResume = async (payload: { resumeUrl: string; fileName?: string; }, userid:number) => {
  return prisma.resume.upsert({
    where: {
      userId: userid as number,
    },
    update: {
      resumeUrl: payload.resumeUrl,
      fileName: payload.fileName,
      uploadedAt: new Date(),
    },
    create: {
      userId: userid as number,
      resumeUrl: payload.resumeUrl,
      fileName: payload.fileName,
    },
  });
};

// Get single resume
const getResume = async (adminUserId: number) => {
  const resume = await prisma.resume.findUnique({
    where: {
      userId: adminUserId,
    },
    select: {
      resumeUrl: true,
      fileName: true,
      uploadedAt: true,
    },
  });

  if (!resume) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Resume not found',
    );
  }

  return resume;
};

// Get all resumes
const getAllResumes = async () => {
  const allResumes = await prisma.resume.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        }
      }
    },
    orderBy: {
      uploadedAt: 'desc',
    }
  });

  if (!allResumes || allResumes.length === 0) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Resumes not found');
  }

  const totalResumesCount = await prisma.resume.count();

  return {
    data: allResumes,
    total: totalResumesCount,
  };
};

// Update resume
const updateResume = async (id: number, payload: any) => {
  const resume = await prisma.resume.findUnique({ where: { id } });
  if (!resume) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Resume not found');
  }

  const updatedResume = await prisma.resume.update({
    where: { id },
    data: payload,
  });

  if (!updatedResume) {
    throw new AppError(StatusCodes.BAD_GATEWAY, 'Failed to update resume');
  }

  return updatedResume;
};

// Delete resume
const deleteResume = async (id: number) => {
  const deletedResume = await prisma.resume.delete({ where: { id } });
  if (!deletedResume) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Deletion of resume failed',
    );
  }
  return deletedResume;
};

export const resumeService = {
  createResume,
  getResume,
  getAllResumes,
  updateResume,
  deleteResume,
};