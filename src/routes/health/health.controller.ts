import { Request, Response } from 'express';
import { prisma } from '../../configs/db';
import { StatusCodes } from 'http-status-codes';

export const healthCheck = async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Server is healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch {
    res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
      success: false,
      message: 'Database connection failed',
    });
  }
};
