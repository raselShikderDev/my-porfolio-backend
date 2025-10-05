"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwtToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccessToken = async (jwtPayload, secret, expires) => {
    const accessToken = await jsonwebtoken_1.default.sign(jwtPayload, secret, { expiresIn: expires });
    return accessToken;
};
exports.generateAccessToken = generateAccessToken;
const verifyJwtToken = async (token, secret) => {
    const verifiedToken = await jsonwebtoken_1.default.verify(token, secret);
    return verifiedToken;
};
exports.verifyJwtToken = verifyJwtToken;
