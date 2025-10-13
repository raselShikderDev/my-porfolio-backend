/* eslint-disable no-console */
import { NextFunction, Request, Response } from 'express';
import { type ZodObject, type ZodRawShape } from 'zod';
import { envVars } from '../configs/envVars';

export const requestValidator =
  (zodSchema: ZodObject<ZodRawShape>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (envVars.NODE_ENV === 'development') {
        console.log('[requestValidator] Raw req.body: ', req.body);
        console.log('[requestValidator] Raw req.file: ', req.file);
        console.log('[requestValidator] Raw req.files: ', req.files);
        console.log('[requestValidator] Raw req.body.data: ', req.body.data);
        console.log('[requestValidator] Raw req.body: ', req.body);
      }

      if (req.body.data) {
        req.body = JSON.parse(req.body.data);
      }

      if (req.file && req.file.path) {
        req.body.image = req.file.path;
      }

      if (req.files && Array.isArray(req.files)) {
        const files = req.files as Express.Multer.File[];
        req.body.images = files.map((file) => file.path);
      }

      if (envVars.NODE_ENV === 'Development') {
        console.log(
          '[requestValidator] Modified req.body before validation:',
          req.body,
        );
      }

      req.body = await zodSchema.parseAsync(req.body);

      if (envVars.NODE_ENV === 'Development') {
        console.log(
          '[requestValidator] After Zod validation - payload:',
          req.body,
        );
      }

      next();
    } catch (err) {
      next(err);
    }
  };
