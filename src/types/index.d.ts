import { JwtPayload } from "jsonwebtoken";

declare module '*.svg' {
  const content: string;
  export default content;
}


declare global{
  namespace Express{
    interface Request{
      user:JwtPayload
    }
  }
}