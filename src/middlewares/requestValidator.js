"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestValidator = void 0;
const envVars_1 = require("../configs/envVars");
const requestValidator = (zodSchema) => async (req, res, next) => {
    try {
        if (envVars_1.envVars.NODE_ENV === 'development') {
            console.log('Validating data of received request');
        }
        if (req.body.data) {
            // req.body = JSON.parse(req.body.data);
            req.body = req.body.data;
        }
        await zodSchema.parseAsync(req.body);
        if (envVars_1.envVars.NODE_ENV === 'development') {
            console.log('Data from received request is validated');
        }
        next();
    }
    catch (error) {
        if (envVars_1.envVars.NODE_ENV === 'development')
            console.log('errorin validator: ', error);
        next(error);
    }
};
exports.requestValidator = requestValidator;
