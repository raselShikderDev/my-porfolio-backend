"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectController = void 0;
const response_1 = require("../../utils/response");
const http_status_codes_1 = require("http-status-codes");
const asyncFync_1 = require("../../utils/asyncFync");
const project_service_1 = require("./project.service");
// Creating a project
const createProject = (0, asyncFync_1.asyncFunc)(async (req, res, next) => {
    const newProject = await project_service_1.projectServices.createProject(req.body);
    (0, response_1.sendResonse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: 'New project successfully created',
        data: newProject,
    });
});
// Edit a project
const editProject = (0, asyncFync_1.asyncFunc)(async (req, res, next) => {
    // console.log("req.body in controller: ", req.body);
    const projectId = Number(req.params.id);
    const newProject = await project_service_1.projectServices.editProject(projectId, req.body);
    (0, response_1.sendResonse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Project successfully edited',
        data: newProject,
    });
});
// get a project
const removeProject = (0, asyncFync_1.asyncFunc)(async (req, res, next) => {
    // console.log("req.body in controller: ", req.body);
    const userId = Number(req.params.id);
    const newProject = await project_service_1.projectServices.removeProject(userId);
    (0, response_1.sendResonse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Project successfully deleted',
        data: newProject,
    });
});
// get a project
const getProject = (0, asyncFync_1.asyncFunc)(async (req, res, next) => {
    // console.log("req.body in controller: ", req.body);
    const projectId = Number(req.params.id);
    const newProject = await project_service_1.projectServices.getProject(projectId);
    (0, response_1.sendResonse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Project successfully retrived',
        data: newProject,
    });
});
// get all project
const getAllProject = (0, asyncFync_1.asyncFunc)(async (req, res, next) => {
    // console.log("req.body in controller: ", req.body);
    const projects = await project_service_1.projectServices.getAllProject();
    (0, response_1.sendResonse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Project successfully retrived',
        data: projects.data,
        meta: {
            total: projects.total
        }
    });
});
exports.projectController = {
    createProject,
    editProject,
    getProject,
    getAllProject,
    removeProject,
};
