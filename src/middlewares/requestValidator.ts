/* eslint-disable no-console */
import { NextFunction, Request, Response } from 'express';
import { type ZodObject, type ZodRawShape } from 'zod';
import { envVars } from '../configs/envVars';

export const requestValidator =
  (zodSchema: ZodObject<ZodRawShape>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (envVars.NODE_ENV === 'development') {
        console.log('Validating data of received request');
      }

      if (req.body.data) {
        // req.body = JSON.parse(req.body.data);
        req.body = req.body.data;
      }
      await zodSchema.parseAsync(req.body);
      if (envVars.NODE_ENV === 'development') {
        console.log('Data from received request is validated');
      }
      next();
    } catch (error) {
      if (envVars.NODE_ENV === 'development')
        console.log('errorin validator: ', error);
      next(error);
    }
  };
