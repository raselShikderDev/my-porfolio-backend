/* eslint-disable no-console */
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { StatusCodes } from 'http-status-codes';
import stream from 'stream';
import { envVars } from './envVars';
import AppError from '../errorHelper/error';

// cloudinary.config({
//   api_secreet: envVars.CLOUDINARY_API_SECRET,
//   api_key: envVars.CLOUDINARY_API_KEY,
//   cloude_name: envVars.CLOUDINARY_NAME,
// });

console.log('Cloudinary Config Check:', {
  name: cloudinary.config().cloud_name,
  key: cloudinary.config().api_key ? '✔️ loaded' : '❌ missing',
  secret: cloudinary.config().api_secret ? '✔️ loaded' : '❌ missing',
});

cloudinary.config({
  cloud_name: envVars.CLOUDINARY_NAME,
  api_key: envVars.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY_API_SECRET,
});
console.log('Cloudinary Config Check:', {
  name: cloudinary.config().cloud_name,
  key: cloudinary.config().api_key ? '✔️ loaded' : '❌ missing',
  secret: cloudinary.config().api_secret ? '✔️ loaded' : '❌ missing',
});
// Uploading Buffer in cloudinary
export const uploadBufferCloudinary = async (
  buffer: Buffer,
  fileName: string,
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    console.log('in cloudinary buffer: ', buffer);

    try {
      const public_id = `porfolio/${fileName}-${Date.now()}`;
      const bufferStream = new stream.PassThrough();
      bufferStream.end(buffer);
      console.log('Cloudinary Config Check:', {
        name: cloudinary.config().cloud_name,
        key: cloudinary.config().api_key ? '✔️ loaded' : '❌ missing',
        secret: cloudinary.config().api_secret ? '✔️ loaded' : '❌ missing',
        image:cloudinary.image,
        picture:cloudinary.picture,
      });
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: 'auto',
            public_id,
            folder: 'pdf',
          },
          (err, result) => {
            if (err) {
              return reject(err);
            }
            resolve(result as UploadApiResponse);
          },
        )
        .end(buffer);
      const uploader = cloudinary.uploader
        .upload_stream(
          {
            resource_type: 'auto',
            public_id,
            folder: 'porfolio',
          },
          (err, result) => {
            if (err) {
              return reject(err);
            }
            resolve(result as UploadApiResponse);
          },
        )
        .end(buffer);
      console.log('uploader', uploader);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Faild to upload file:${error.message}`,
      );
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
      console.log('File ', +public_id + ' Removed from the cloudinary');
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      'Faild to delete image in cloudinary',
      error.message,
    );
  }
};

export const cloudinaryUpload = cloudinary;
