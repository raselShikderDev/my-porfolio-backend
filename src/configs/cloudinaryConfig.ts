import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { StatusCodes } from 'http-status-codes';
import stream from 'stream';
import { envVars } from './envVars';
import AppError from '../errorHelper/error';

cloudinary.config({
  cloud_name: envVars.CLOUDINARY_NAME,
  api_key: envVars.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY_API_SECRET,
});

export const uploadBufferCloudinary = async (
  buffer: Buffer,
  fileName: string
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    try {
      const public_id = `portfolio/${fileName}-${Date.now()}`;
      const bufferStream = new stream.PassThrough();
      bufferStream.end(buffer);
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: 'auto',
            public_id,
            folder: 'portfolio',
          },
          (err, result) => {
            if (err) {
              return reject(err);
            }
            resolve(result as UploadApiResponse);
          }
        )
        .end(buffer);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Failed to upload file:${message}`
      );
    }
  });
};

export const extractPublicId = (urlOrPath: string): string | null => {
  if (!urlOrPath || typeof urlOrPath !== 'string') {
    return null;
  }
  const urlRegex = /^.*\/(\d+)\/(.+?\.(?:jpg|jpeg|png|gif|webp))$/i;
  const versionRegex = /v(\d+)\/(.+?)\.$/i;
  const match = urlOrPath.match(urlRegex) || urlOrPath.match(versionRegex);
  if (match && match[2]) {
    return match[2];
  }
  return null;
};

export const deleteImageFromCloudinary = async (urlOrPath: string): Promise<boolean> => {
  try {
    const public_id = extractPublicId(urlOrPath);
    if (!public_id) {
      return false;
    }
    await cloudinary.uploader.destroy(public_id);
    return true;
  } catch (error) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to delete image in Cloudinary',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};

export const cloudinaryUpload = cloudinary;

