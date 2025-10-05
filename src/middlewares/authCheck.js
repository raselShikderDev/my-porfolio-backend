"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const envVars_1 = require("../configs/envVars");
const jwt_1 = require("../utils/jwt");
const error_1 = __importDefault(require("../errorHelper/error"));
const http_status_codes_1 = require("http-status-codes");
const db_1 = require("../configs/db");
const authCheck = (...authRole) => async (req, res, next) => {
    try {
        const accessToken = req.headers.authorization || req.cookies.accessToken;
        const verifiedToken = await (0, jwt_1.verifyJwtToken)(accessToken, envVars_1.envVars.JWT_ACCESS_SECRET);
        if (!verifiedToken) {
            throw new error_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, `Invalid access token`);
        }
        const existedOwner = await db_1.prisma.user.findUnique({
            where: {
                email: verifiedToken.email,
            },
        });
        if (!existedOwner) {
            throw new error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "You are not authorized owner");
        }
        if (existedOwner.isActive === "BLOCKED" ||
            existedOwner.isActive === "INACTIVE") {
            throw new error_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, `You are ${existedOwner.isActive}! Please activate first`);
        }
        if (!existedOwner.isVerified) {
            throw new error_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "You are not verified");
        }
        if (!authRole.includes(existedOwner.role)) {
            throw new error_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, `Authorization required to access`);
        }
        req.user = verifiedToken;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.default = authCheck;
