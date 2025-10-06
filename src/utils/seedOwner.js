"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedOwner = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
const db_1 = require("../configs/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
// import avater from "../assets/avatar.svg";
const constraints_1 = require("../constraints/constraints");
const envVars_1 = require("../configs/envVars");
const seedOwner = async () => {
    if (envVars_1.envVars.NODE_ENV === 'development')
        console.log('Checking existed Owner');
    const existedOwner = await db_1.prisma.user.findUnique({
        where: {
            email: process.env.OWNER_EMAIL,
        },
    });
    if (existedOwner) {
        if (envVars_1.envVars.NODE_ENV === 'development')
            console.log(`Owner already exists with ${existedOwner.email}`);
        return;
    }
    const hashedPassword = await bcrypt_1.default.hash(process.env.OWNER_PASSWORD, Number(process.env.BCRYPT_SALT));
    const ownerPayload = {
        name: 'Rasel Shikder',
        email: process.env.OWNER_EMAIL,
        password: hashedPassword,
        // avater: avater,
        skills: constraints_1.constraints.skills,
        address: constraints_1.constraints.address,
        phone: constraints_1.constraints.phone,
        github: constraints_1.constraints.socialUrl.github,
        linkedin: constraints_1.constraints.socialUrl.linkedin,
        twitter: constraints_1.constraints.socialUrl.twitter,
    };
    try {
        if (envVars_1.envVars.NODE_ENV === 'development')
            console.log('Creating Owner...');
        const owner = await db_1.prisma.user.create({
            data: ownerPayload,
        });
        if (!owner) {
            throw new Error('Creating Owner is failed');
        }
        if (envVars_1.envVars.NODE_ENV === 'development')
            console.log('Owner Sucessfully created');
    }
    catch (error) {
        console.error('Creating Owner is failed', error.message);
        throw new Error('Somthing wrong! OwnerShip creation failed');
    }
};
exports.seedOwner = seedOwner;
