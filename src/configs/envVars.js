"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVars = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envvarriables = () => {
    const varriables = [
        "PORT",
        "NODE_ENV",
        "DATABASE_URL",
        "FRONTEND_URL",
        "OWNER_EMAIL",
        "OWNER_PASSWORD",
        "BCRYPT_SALT",
        "JWT_REFRESH_EXPIRES",
        "JWT_REFRESH_SECRET",
        "JWT_ACCESS_EXPIRES",
        "JWT_ACCESS_SECRET",
        "CLOUDINARY_NAME",
        "CLOUDINARY_API_KEY",
        "CLOUDINARY_API_SECRET",
        "CLOUDINARY_URL",
    ];
    varriables.map((envItem) => {
        if (!process.env[envItem]) {
            throw new Error(`Missing envoirnment varriabls ${envItem}`);
        }
    });
    return {
        PORT: process.env.PORT,
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL,
        FRONTEND_URL: process.env.FRONTEND_URL,
        OWNER_EMAIL: process.env.OWNER_EMAIL,
        OWNER_PASSWORD: process.env.OWNER_PASSWORD,
        BCRYPT_SALT: process.env.BCRYPT_SALT,
        JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
        JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES,
        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
        CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
        CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
        CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
        CLOUDINARY_URL: process.env.CLOUDINARY_URL,
    };
};
exports.envVars = envvarriables();
