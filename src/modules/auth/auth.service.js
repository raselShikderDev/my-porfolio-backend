"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const db_1 = require("../../configs/db");
const error_1 = __importDefault(require("../../errorHelper/error"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userToken_1 = __importDefault(require("../../utils/userToken"));
const envVars_1 = require("../../configs/envVars");
const jwt_1 = require("../../utils/jwt");
// Owner login
const ownerLogin = async (email, plainPassword) => {
    const existedOwner = await db_1.prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (!existedOwner) {
        throw new error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'You are not authorized owner');
    }
    if (existedOwner.isActive === 'BLOCKED' ||
        existedOwner.isActive === 'INACTIVE') {
        throw new error_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, `You are ${existedOwner.isActive}! Please activate first`);
    }
    if (!existedOwner.isVerified) {
        throw new error_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Verify before login');
    }
    const isValidPassword = await bcrypt_1.default.compare(plainPassword, existedOwner.password);
    if (!isValidPassword) {
        throw new error_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid Password');
    }
    const jwtPayload = {
        id: existedOwner.id,
        email: existedOwner.email,
        role: existedOwner.role,
    };
    const tokens = await (0, userToken_1.default)(jwtPayload);
    return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        data: existedOwner,
    };
};
// Generate accessToken by refreshToken
const generateNewAccessToken = async (refreshToken) => {
    const verifiedToken = (await (0, jwt_1.verifyJwtToken)(refreshToken, envVars_1.envVars.JWT_REFRESH_SECRET));
    if (!verifiedToken) {
        throw new error_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, `Invalid refresh token`);
    }
    const existedOwner = await db_1.prisma.user.findUnique({
        where: {
            email: verifiedToken.email,
        },
    });
    if (!existedOwner) {
        throw new error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'You are not authorized owner');
    }
    if (existedOwner.isActive === 'BLOCKED' ||
        existedOwner.isActive === 'INACTIVE') {
        throw new error_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, `You are ${existedOwner.isActive}! Please activate first`);
    }
    if (!existedOwner.isVerified) {
        throw new error_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'You are not verified');
    }
    const jwtPayload = {
        id: existedOwner.id,
        email: existedOwner.email,
        role: existedOwner.role,
    };
    const tokens = await (0, userToken_1.default)(jwtPayload);
    return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
    };
};
exports.authServices = {
    ownerLogin,
    generateNewAccessToken,
};
