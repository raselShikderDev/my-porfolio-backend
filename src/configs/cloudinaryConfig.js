"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryUpload = exports.deleteImageFromCloudinary = exports.uploadBufferCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const http_status_codes_1 = require("http-status-codes");
const stream_1 = __importDefault(require("stream"));
const envVars_1 = require("./envVars");
const error_1 = __importDefault(require("../errorHelper/error"));
cloudinary_1.v2.config({
    api_secreet: envVars_1.envVars.CLOUDINARY_API_SECRET,
    api_key: envVars_1.envVars.CLOUDINARY_API_KEY,
    cloude_name: envVars_1.envVars.CLOUDINARY_NAME,
});
// Uploading Buffer in cloudinary
const uploadBufferCloudinary = async (buffer, fileName) => {
    return new Promise((resolve, reject) => {
        try {
            const public_id = `pdf/${fileName}-${Date.now()}`;
            const bufferStream = new stream_1.default.PassThrough();
            bufferStream.end(buffer);
            cloudinary_1.v2.uploader
                .upload_stream({
                resource_type: "auto",
                public_id,
                folder: "pdf",
            }, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            })
                .end(buffer);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        catch (error) {
            throw new error_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, `Faild to upload file:${error.message}`);
        }
    });
};
exports.uploadBufferCloudinary = uploadBufferCloudinary;
// Deleting image from cloudinary
const deleteImageFromCloudinary = async (url) => {
    try {
        const regex = /v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;
        const match = url.match(regex);
        if (match && match[1]) {
            const public_id = match[1];
            await cloudinary_1.v2.uploader.destroy(public_id);
            // eslint-disable-next-line no-console
            console.log("File ", +public_id + " Removed from the cloudinary");
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (error) {
        throw new error_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Faild to delete image in cloudinary", error.message);
    }
};
exports.deleteImageFromCloudinary = deleteImageFromCloudinary;
exports.cloudinaryUpload = cloudinary_1.v2;
