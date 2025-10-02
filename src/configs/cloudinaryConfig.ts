import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { StatusCodes } from "http-status-codes";
import stream from "stream";
import { envVars } from "./envVars";
import AppError from "../errorHelper/error";

cloudinary.config({
  api_secreet: envVars.CLOUDINARY_API_SECRET,
  api_key: envVars.CLOUDINARY_API_KEY,
  cloude_name: envVars.CLOUDINARY_NAME,
});

// Uploading Buffer in cloudinary
export const uploadBufferCloudinary = async (
  buffer: Buffer,
  fileName: string
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    try {
      const public_id = `pdf/${fileName}-${Date.now()}`;
      const bufferStream = new stream.PassThrough();
      bufferStream.end(buffer);

      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
            public_id,
            folder: "pdf",
          },
          (err, result) => {
            if (err) {
              return reject(err);
            }
            resolve(result as UploadApiResponse);
          }
        )
        .end(buffer);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, `Faild to upload file:${error.message}`);
    }
  });
};

// Deleting image from cloudinary
export const deleteImageFromCloudinary = async (url: string) => {
  try {
    const regex = /v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;

    const match = url.match(regex);

    if (match && match[1]) {
      const public_id = match[1];
      await cloudinary.uploader.destroy(public_id);
      // eslint-disable-next-line no-console
      console.log("File ", +public_id + " Removed from the cloudinary");
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "Faild to delete image in cloudinary",
      error.message
    );
  }
};

export const cloudinaryUpload = cloudinary;
