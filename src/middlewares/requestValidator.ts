/* eslint-disable no-console */
import { NextFunction, Request, Response } from 'express';
import { type ZodObject, type ZodRawShape } from 'zod';
import { envVars } from '../configs/envVars';

export const requestValidator =
  (zodSchema: ZodObject<ZodRawShape>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    if (envVars.NODE_ENV === 'Development')
      console.log(`in validateReq - req.body: `, req.body);
console.log('req.body.data', req.body.data);
console.log("req.file", req.file);

    if (req.body.data) {
      if (envVars.NODE_ENV === 'Development')
        console.log(`in validateReq - req.body.data: `, req.body.data);
      req.body = JSON.parse(req.body.data);
    }
    req.body = await zodSchema.parseAsync(req.body);
    if (envVars.NODE_ENV === 'Development')
      console.log(`in validateReq after validation - payload: `, req.body);

    next();
  };
