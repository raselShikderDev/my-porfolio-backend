"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const db_1 = require("../../configs/db");
const error_1 = __importDefault(require("../../errorHelper/error"));
// import { IProject } from './project.interface';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createProject = async (payload) => {
    const newProject = await db_1.prisma.project.create({
        data: payload,
    });
    if (!newProject) {
        throw new error_1.default(http_status_codes_1.StatusCodes.BAD_GATEWAY, 'Failed to create a project');
    }
    return newProject;
};
// Get singel project
const getProject = async (id) => {
    const project = await db_1.prisma.project.findUnique({ where: { id } });
    if (!project) {
        throw new error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Project not found');
    }
    return project;
};
// get all project
const getAllProject = async () => {
    const allProject = await db_1.prisma.project.findMany();
    if (!allProject || allProject.length === 0) {
        throw new error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Projects not found');
    }
    const allProjectCount = await db_1.prisma.project.count();
    return {
        data: allProject,
        total: allProjectCount
    };
};
// Update a singe project
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const editProject = async (id, payload) => {
    const updatedProject = await db_1.prisma.project.update({
        where: { id },
        data: payload,
    });
    if (!updatedProject) {
        throw new error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Project not found');
    }
    return updatedProject;
};
const removeProject = async (id) => {
    const deletedProject = await db_1.prisma.project.delete({ where: { id } });
    if (!deletedProject) {
        throw new error_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Delation of project is failed");
    }
    return deletedProject;
};
exports.projectServices = {
    createProject,
    editProject,
    getProject,
    getAllProject,
    removeProject,
};
