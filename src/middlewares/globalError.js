"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const client_1 = require("@prisma/client");
const envVars_1 = require("../configs/envVars");
const error_1 = __importDefault(require("../errorHelper/error"));
const cloudinaryConfig_1 = require("../configs/cloudinaryConfig");
const globalError = async (err, req, res, next) => {
    let message = "Something went wrong!";
    let statusCode = 500;
    // delete singel image from cludianry - (req.file)
    if (req.file) {
        await (0, cloudinaryConfig_1.deleteImageFromCloudinary)(req.file.path);
    }
    // deleting multiple image from cloudinary - (req.files)
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const imagesUrl = req.files.map((file) => file.path);
        await Promise.all(imagesUrl.map((url) => (0, cloudinaryConfig_1.deleteImageFromCloudinary)(url)));
    }
    // 1. Known DB errors
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            statusCode = 409;
            message = `Unique constraint failed on the field: ${err.meta?.target}`;
        }
        else if (err.code === "P2025") {
            statusCode = 409;
            message = "Record not found";
        }
        else {
            statusCode = 400;
            message = `Database error: ${err.code}`;
        }
    }
    // 2. Validation errors
    else if (err instanceof client_1.Prisma.PrismaClientValidationError) {
        (statusCode = 400), (message = "Validation error: " + err.message);
    }
    // 3. Unknown request errors
    else if (err instanceof client_1.Prisma.PrismaClientUnknownRequestError) {
        (statusCode = 500), (message = "Unknown database error");
    }
    // 4. Initialization errors
    else if (err instanceof client_1.Prisma.PrismaClientInitializationError) {
        (statusCode = 500), (message = "Failed to initialize database connection");
    }
    // 5. Rust panic
    else if (err instanceof client_1.Prisma.PrismaClientRustPanicError) {
        (statusCode = 500), (message = "Database engine crashed unexpectedly");
    }
    // Zod Error
    else if (err.name === "ZodError") {
        statusCode = 400;
        message = `Zod Error`;
    }
    else if (err instanceof error_1.default) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err instanceof Error) {
        statusCode = 501;
        message = err.message;
    }
    res.status(statusCode).json({
        success: false,
        message,
        err: envVars_1.envVars.NODE_ENV === "development" ? err.stack : null,
        stack: envVars_1.envVars.NODE_ENV === "development" ? err.stack : null,
    });
};
exports.default = globalError;
