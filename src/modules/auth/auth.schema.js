"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginSchema = void 0;
const zod_1 = require("zod");
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.email({ message: 'Email should be valid' }),
    password: zod_1.z
        .string()
        .min(8, { message: 'Password should be at least 8 character' })
        .max(16, { message: 'Password must not exceed 16 character' }),
});
