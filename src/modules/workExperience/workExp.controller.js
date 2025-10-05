"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workExpController = void 0;
const response_1 = require("../../utils/response");
const http_status_codes_1 = require("http-status-codes");
const asyncFync_1 = require("../../utils/asyncFync");
const workExp_service_1 = require("./workExp.service");
// Creating a WorkExp
const createWorkExp = (0, asyncFync_1.asyncFunc)(async (req, res, next) => {
    const newWorkExp = await workExp_service_1.workExpServices.createWorkExp(req.body);
    (0, response_1.sendResonse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: 'New Work experince successfully created',
        data: newWorkExp,
    });
});
// Edit a WorkExp
const editWorkExp = (0, asyncFync_1.asyncFunc)(async (req, res, next) => {
    // console.log("req.body in controller: ", req.body);
    const WorkExpId = Number(req.params.id);
    const newWorkExp = await workExp_service_1.workExpServices.editWorkExp(WorkExpId, req.body);
    (0, response_1.sendResonse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Work experince successfully edited',
        data: newWorkExp,
    });
});
// get a WorkExp
const removeWorkExp = (0, asyncFync_1.asyncFunc)(async (req, res, next) => {
    // console.log("req.body in controller: ", req.body);
    const userId = Number(req.params.id);
    const newWorkExp = await workExp_service_1.workExpServices.removeWorkExp(userId);
    (0, response_1.sendResonse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Work experince successfully deleted',
        data: newWorkExp,
    });
});
// get a WorkExp
const getWorkExp = (0, asyncFync_1.asyncFunc)(async (req, res, next) => {
    // console.log("req.body in controller: ", req.body);
    const WorkExpId = Number(req.params.id);
    const newWorkExp = await workExp_service_1.workExpServices.getWorkExp(WorkExpId);
    (0, response_1.sendResonse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Work experince successfully retrived',
        data: newWorkExp,
    });
});
// get all WorkExp
const getAllWorkExp = (0, asyncFync_1.asyncFunc)(async (req, res, next) => {
    // console.log("req.body in controller: ", req.body);
    const workExp = await workExp_service_1.workExpServices.getAllWorkExp();
    (0, response_1.sendResonse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Works experinces successfully retrived',
        data: workExp.data,
        meta: {
            total: workExp.total
        }
    });
});
exports.workExpController = {
    createWorkExp,
    editWorkExp,
    getWorkExp,
    getAllWorkExp,
    removeWorkExp,
};
