/* eslint-disable no-console */
import { NextFunction, Request, Response } from 'express';
import { type ZodObject, type ZodRawShape } from 'zod';
import { envVars } from '../configs/envVars';

export const requestValidator =
  (zodSchema: ZodObject<ZodRawShape>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (envVars.NODE_ENV === 'development') {
        console.log('Validating data of recived request');
      }
      if (req.body) {
        req.body = JSON.parse(req.body);
      }
      if (req.body.data) {
        req.body = JSON.parse(req.body.data);
      }
      await zodSchema.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
