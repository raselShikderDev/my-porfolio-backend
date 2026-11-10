declare module 'morgan' {
  import { RequestHandler } from 'express';
  function morgan(format: string, options?: any): RequestHandler;
  export = morgan;
}
