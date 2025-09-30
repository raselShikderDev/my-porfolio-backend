import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";


const globalError = async(err:any, res:Response, req:Request, next:NextFunction)=>{
   console.log(err);
   
    let message:string = "Something went wrong!";
    let statusCode:number = 500;

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code) {
            
        }
    }
}


export default globalError







// import { Prisma } from "@prisma/client";
// import { Request, Response, NextFunction } from "express";

// export function globalErrorHandler(
//   err: unknown,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   console.error(err);

//   // 1. Known DB errors
//   if (err instanceof Prisma.PrismaClientKnownRequestError) {
//     if (err.code === "P2002") {
//       return res.status(409).json({
//         status: "fail",
//         message: `Unique constraint failed on the field: ${err.meta?.target}`,
//       });
//     }

//     if (err.code === "P2025") {
//       return res.status(404).json({
//         status: "fail",
//         message: "Record not found",
//       });
//     }

//     // fallback for other Pxxxx codes
//     return res.status(400).json({
//       status: "fail",
//       message: `Database error: ${err.code}`,
//     });
//   }

//   // 2. Validation errors
//   if (err instanceof Prisma.PrismaClientValidationError) {
//     return res.status(400).json({
//       status: "fail",
//       message: "Validation error: " + err.message,
//     });
//   }

//   // 3. Unknown request errors
//   if (err instanceof Prisma.PrismaClientUnknownRequestError) {
//     return res.status(500).json({
//       status: "error",
//       message: "Unknown database error",
//     });
//   }

//   // 4. Initialization errors
//   if (err instanceof Prisma.PrismaClientInitializationError) {
//     return res.status(500).json({
//       status: "error",
//       message: "Failed to initialize database connection",
//     });
//   }

//   // 5. Rust panic
//   if (err instanceof Prisma.PrismaClientRustPanicError) {
//     return res.status(500).json({
//       status: "error",
//       message: "Database engine crashed unexpectedly",
//     });
//   }

//   // 6. Any other runtime/JS error
//   res.status(500).json({
//     status: "error",
//     message: "Internal server error",
//   });
// }
