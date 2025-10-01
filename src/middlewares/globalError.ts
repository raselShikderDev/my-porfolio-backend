/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { envVars } from "../configs/envVars";
import AppError from "../errorHelper/error";

const globalError = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  let message: string = "Something went wrong!";
  let statusCode: number = 500;

  // 1. Known DB errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = 409;
      message = `Unique constraint failed on the field: ${err.meta?.target}`;
    } else if (err.code === "P2025") {
      statusCode = 409;
      message = "Record not found";
    } else {
      statusCode = 400;
      message = `Database error: ${err.code}`;
    }
  }

  // 2. Validation errors
  else if (err instanceof Prisma.PrismaClientValidationError) {
    (statusCode = 400), (message = "Validation error: " + err.message);
  }

  // 3. Unknown request errors
  else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    (statusCode = 500), (message = "Unknown database error");
  }

  // 4. Initialization errors
  else if (err instanceof Prisma.PrismaClientInitializationError) {
    (statusCode = 500), (message = "Failed to initialize database connection");
  }

  // 5. Rust panic
  else if (err instanceof Prisma.PrismaClientRustPanicError) {
    (statusCode = 500), (message = "Database engine crashed unexpectedly");
  }

  // Zod Error
  else if (err.name === "ZodError") {
    statusCode = 400;
    message = `Zod Error`;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 501;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    err: envVars.NODE_ENV === "development" ? err.stack : null,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};

export default globalError;
