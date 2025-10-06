"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envVars_1 = require("../configs/envVars");
const jwt_1 = require("./jwt");
const createUserTokens = async (jwtPayload) => {
    const accessToken = await (0, jwt_1.generateAccessToken)(jwtPayload, envVars_1.envVars.JWT_ACCESS_SECRET, envVars_1.envVars.JWT_ACCESS_EXPIRES);
    const refreshToken = await (0, jwt_1.generateAccessToken)(jwtPayload, envVars_1.envVars.JWT_REFRESH_SECRET, envVars_1.envVars.JWT_REFRESH_EXPIRES);
    return {
        accessToken,
        refreshToken,
    };
};
exports.default = createUserTokens;
