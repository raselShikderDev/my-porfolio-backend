"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const db_1 = require("../../configs/db");
const getMe = async () => {
    return;
};
const create = async (payload) => {
    const newUser = await db_1.prisma.user.create({
        data: payload
    });
    return newUser;
};
exports.userService = {
    create,
    getMe
};
