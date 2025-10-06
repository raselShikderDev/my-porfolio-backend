"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuthCookies = void 0;
;
const setAuthCookies = async (res, tokens) => {
    if (tokens.accessToken) {
        res.cookie("accessToken", tokens.accessToken, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
        });
    }
    if (tokens.refreshToken) {
        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
        });
    }
};
exports.setAuthCookies = setAuthCookies;
