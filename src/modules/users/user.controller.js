"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const asyncFync_1 = require("../../utils/asyncFync");
const user_services_1 = require("./user.services");
const response_1 = require("../../utils/response");
const http_status_codes_1 = require("http-status-codes");
const create = (0, asyncFync_1.asyncFunc)(async (req, res, next) => {
    const body = req.body;
    const newUser = await user_services_1.userService.create(body);
    (0, response_1.sendResonse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Successfully created",
        data: newUser,
    });
});
const getMe = (0, asyncFync_1.asyncFunc)(async (req, res, next) => {
    const decodedToken = req.user;
    const newUser = await user_services_1.userService.create(decodedToken);
    (0, response_1.sendResonse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Successfully created",
        data: newUser,
    });
});
exports.userController = {
    create,
    getMe
};
