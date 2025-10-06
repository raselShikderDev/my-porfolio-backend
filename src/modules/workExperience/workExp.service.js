"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.workExpServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const db_1 = require("../../configs/db");
const error_1 = __importDefault(require("../../errorHelper/error"));
// import { IWorkExp } from './WorkExp.interface';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createWorkExp = async (payload) => {
    const newWorkExp = await db_1.prisma.workExperince.create({
        data: payload,
    });
    if (!newWorkExp) {
        throw new error_1.default(http_status_codes_1.StatusCodes.BAD_GATEWAY, 'Failed to create Work experince');
    }
    return newWorkExp;
};
// Get singel WorkExp
const getWorkExp = async (id) => {
    const WorkExp = await db_1.prisma.workExperince.findUnique({ where: { id } });
    if (!WorkExp) {
        throw new error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Work experince not found');
    }
    return WorkExp;
};
// get all WorkExp
const getAllWorkExp = async () => {
    const allWorkExp = await db_1.prisma.workExperince.findMany();
    if (!allWorkExp || allWorkExp.length === 0) {
        throw new error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Work experince not found');
    }
    const totalWorkExpCount = await db_1.prisma.workExperince.count();
    return {
        data: allWorkExp,
        total: totalWorkExpCount
    };
};
// Update a singe WorkExp
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const editWorkExp = async (id, payload) => {
    const updatedWorkExp = await db_1.prisma.workExperince.update({
        where: { id },
        data: payload,
    });
    if (!updatedWorkExp) {
        throw new error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Work Experince not found');
    }
    return updatedWorkExp;
};
const removeWorkExp = async (id) => {
    const deletedWorkExp = await db_1.prisma.workExperince.delete({ where: { id } });
    if (!deletedWorkExp) {
        throw new error_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Delation of Work Experince is failed");
    }
    return deletedWorkExp;
};
exports.workExpServices = {
    createWorkExp,
    editWorkExp,
    getWorkExp,
    getAllWorkExp,
    removeWorkExp,
};
