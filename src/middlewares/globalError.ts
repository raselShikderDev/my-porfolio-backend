/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-inferrable-types */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { Prisma } from "@prisma/client";
// import { NextFunction, Request, Response } from "express";
// import { envVars } from "../configs/envVars";
// import AppError from "../errorHelper/error";
// import { deleteImageFromCloudinary } from "../configs/cloudinaryConfig";

// const globalError = async (
//   err: any,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   let message: string = "Something went wrong!";
//   let statusCode: number = 500;
//   let errorDetails: any = null;

//   // Clean up uploaded single image if request failed
//   if (req.file) {
//     await deleteImageFromCloudinary(req.file.path);
//   }

//   // Clean up multiple uploaded images if request failed
//   if (req.files && Array.isArray(req.files) && req.files.length > 0) {
//     const imagesUrl = (req.files as Express.Multer.File[]).map(
//       (file) => file.path
//     );
//     await Promise.all(imagesUrl.map((url) => deleteImageFromCloudinary(url)));
//   }

//   // Prisma known request errors
//   if (err instanceof Prisma.PrismaClientKnownRequestError) {
//     if (err.code === "P2002") {
//       statusCode = 409;
//       message = `Unique constraint failed on the field: ${err.meta?.target}`;
//     } else if (err.code === "P2025") {
//       statusCode = 404;
//       message = "Record not found";
//     } else {
//       statusCode = 400;
//       message = `Database error: ${err.code}`;
//     }
//   }

//   // Prisma validation errors
//   else if (err instanceof Prisma.PrismaClientValidationError) {
//     statusCode = 400;
//     message = "Validation error: " + err.message;
//   }

//   // Prisma unknown request errors
//   else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
//     statusCode = 500;
//     message = "Unknown database error";
//   }

//   // Prisma initialization errors
//   else if (err instanceof Prisma.PrismaClientInitializationError) {
//     statusCode = 500;
//     message = "Failed to initialize database connection";
//   }

//   // Prisma Rust panic
//   else if (err instanceof Prisma.PrismaClientRustPanicError) {
//     statusCode = 500;
//     message = "Database engine crashed unexpectedly";
//   }

//   // Zod validation errors
//   else if (err.name === "ZodError") {
//     statusCode = 400;
//     message = "Zod validation failed";
//     errorDetails = err.errors?.map((issue: any) => ({
//       path: issue.path.join("."),
//       message: issue.message,
//       expected: issue.expected,
//       received: issue.received,
//     }));
//   }

//   // Custom AppError
//   else if (err instanceof AppError) {
//     statusCode = err.statusCode;
//     message = err.message;
//   }

//   // Generic error
//   else if (err instanceof Error) {
//     statusCode = 500;
//     message = err.message;
//   }

//   res.status(statusCode).json({
//     success: false,
//     message,
//     errors: errorDetails || null,
//     err: envVars.NODE_ENV === "development" ? err : null,
//     stack: envVars.NODE_ENV === "development" ? err.stack : null,
//   });
// };

// export default globalError;


/** biome-ignore-all lint/suspicious/noExplicitAny: ok */
/** biome-ignore-all assist/source/organizeImports: > */
/** biome-ignore-all lint/style/useImportType: > */
/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: ok */
import { type Request, type Response, type NextFunction } from 'express';
import AppError from '../errorHelper/error';

// Checks if an error is a Prisma Client error
const isPrismaError = (error: any): boolean => {
    return typeof error.code === 'string' && error.code.startsWith('P');
};

// Checks if an error is a Zod validation error
const isZodError = (error: any): boolean => {
    return error.name === 'ZodError' && Array.isArray(error.errors);
};

// Checks if an error is a JWT authentication error
const isJWTError = (error: any): boolean => {
    return error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError';
};


const processRawError = (err: any): typeof AppError.prototype => {
    
    // 1. ZOD VALIDATION ERRORS (400 Bad Request)
    if (isZodError(err)) {
        // Map Zod errors to the structured errors array
        const validationErrors = err.errors.map((error: any) => ({
            path: error.path.join('.'),
            message: error.message,
        }));
        
        return new AppError(
            400, 
            'Validation failed. Check the errors array for details.',
            validationErrors 
        );
    }
    
    // 2. JWT AUTHENTICATION ERRORS (401 Unauthorized)
    if (isJWTError(err)) {
        let message = 'Authentication failed.';
        if (err.name === 'TokenExpiredError') {
            message = 'Access token has expired. Please log in again.';
        } else if (err.name === 'JsonWebTokenError') {
            message = 'Invalid token signature or format.';
        }
        return new AppError(401, message);
    }

    // 3. PRISMA DATABASE ERRORS (404, 409, 500)
    if (isPrismaError(err)) {
        switch (err.code) {
            case 'P2002': { // Unique constraint failed
                const field = err.meta?.target?.[0] || 'Unknown field';
                return new AppError(
                    409, // Conflict
                    `A record with this value already exists for the field: ${field}.`,
                );
            }
            case 'P2025': // Record not found
                return new AppError(
                    404, // Not Found
                    'The requested resource was not found.',
                );
            default:
                console.error('Unhandled Prisma Error:', err.code, err.message);
                return new AppError(500, 'A database error occurred.');
        }
    }
    
    // 4. ALREADY CUSTOM ERRORS
    if (err instanceof AppError) {
        return err;
    }

    // 5. GENERIC ERRORS (RUNTIME, UNHANDLED EXCEPTIONS)
    const statusCode = err.statusCode || 500;
    
    return new AppError(
        statusCode,
        err.message || 'An unexpected internal server error occurred.',
        err.stack
    );
};


 const globalError = (
    err: any, 
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    // Process the raw error into a standardized customError object
    const error = processRawError(err);
console.log(error);

    // Log the detailed stack trace for all 500 errors
    if (error.statusCode >= 500) {
        console.error(`[FATAL] Server Error ${error.statusCode}:`, error.stack || error.message);
    }

    // Send the standardized JSON response to the client
    res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error, 
    });
};


export default globalError