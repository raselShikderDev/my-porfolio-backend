/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { envVars } from "../configs/envVars";
import AppError from "../errorHelper/error";
import { deleteImageFromCloudinary } from "../configs/cloudinaryConfig";

const globalError = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let message: string = "Something went wrong!";
  let statusCode: number = 500;
  let errorDetails: any = null;

  // Clean up uploaded single image if request failed
  if (req.file) {
    await deleteImageFromCloudinary(req.file.path);
  }

  // Clean up multiple uploaded images if request failed
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    const imagesUrl = (req.files as Express.Multer.File[]).map(
      (file) => file.path
    );
    await Promise.all(imagesUrl.map((url) => deleteImageFromCloudinary(url)));
  }

  // Prisma known request errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = 409;
      message = `Unique constraint failed on the field: ${err.meta?.target}`;
    } else if (err.code === "P2025") {
      statusCode = 404;
      message = "Record not found";
    } else {
      statusCode = 400;
      message = `Database error: ${err.code}`;
    }
  }

  // Prisma validation errors
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Validation error: " + err.message;
  }

  // Prisma unknown request errors
  else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = 500;
    message = "Unknown database error";
  }

  // Prisma initialization errors
  else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = 500;
    message = "Failed to initialize database connection";
  }

  // Prisma Rust panic
  else if (err instanceof Prisma.PrismaClientRustPanicError) {
    statusCode = 500;
    message = "Database engine crashed unexpectedly";
  }

  // Zod validation errors
  else if (err.name === "ZodError") {
    statusCode = 400;
    message = "Zod validation failed";
    errorDetails = err.errors?.map((issue: any) => ({
      path: issue.path.join("."),
      message: issue.message,
      expected: issue.expected,
      received: issue.received,
    }));
  }

  // Custom AppError
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Generic error
  else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: errorDetails || null,
    err: envVars.NODE_ENV === "development" ? err : null,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};

export default globalError;
