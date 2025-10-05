"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncFunc = void 0;
const asyncFunc = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
        next(error);
    });
};
exports.asyncFunc = asyncFunc;
