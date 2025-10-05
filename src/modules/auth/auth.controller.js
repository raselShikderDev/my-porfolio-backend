"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const asyncFync_1 = require("../../utils/asyncFync");
const response_1 = require("../../utils/response");
const http_status_codes_1 = require("http-status-codes");
const auth_service_1 = require("./auth.service");
const setCookies_1 = require("../../utils/setCookies");
const error_1 = __importDefault(require("../../errorHelper/error"));
// Owner login
const ownerLogin = (0, asyncFync_1.asyncFunc)(async (req, res, next) => {
    const { email, password } = req.body;
    const ownerCredentials = await auth_service_1.authServices.ownerLogin(email, password);
    if (!ownerCredentials.accessToken && !ownerCredentials.data) {
        throw new error_1.default(http_status_codes_1.StatusCodes.BAD_GATEWAY, 'Login failed');
    }
    await (0, setCookies_1.setAuthCookies)(res, {
        accessToken: ownerCredentials.accessToken,
        refreshToken: ownerCredentials.refreshToken,
    });
    (0, response_1.sendResonse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Owner successfully logged in ',
        data: ownerCredentials,
    });
});
// Log Out
const ownerLogOut = (0, asyncFync_1.asyncFunc)(async (req, res, next) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
    });
    (0, response_1.sendResonse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Owner successfully logOut ',
        data: null,
    });
});
// Generate accesstoken by refresh Token
const generateNewAccessToken = (0, asyncFync_1.asyncFunc)(async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken || req.headers.authorization;
    const ownerCredentials = await auth_service_1.authServices.generateNewAccessToken(refreshToken);
    if (!ownerCredentials.accessToken) {
        throw new error_1.default(http_status_codes_1.StatusCodes.BAD_GATEWAY, 'Generating access tokens failed');
    }
    await (0, setCookies_1.setAuthCookies)(res, {
        accessToken: ownerCredentials.accessToken,
        refreshToken: ownerCredentials.refreshToken,
    });
    (0, response_1.sendResonse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'AccessToken successfully generated',
        data: {
            accessToken: ownerCredentials.accessToken,
        },
    });
});
exports.authController = {
    ownerLogin,
    ownerLogOut,
    generateNewAccessToken,
};
