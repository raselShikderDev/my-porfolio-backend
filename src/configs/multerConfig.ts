import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { Request } from 'express';
import { cloudinaryUpload } from './cloudinaryConfig';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
] as const;
type AllowedMimeType = typeof ALLOWED_MIME_TYPES[number];


export const multerUpload = multer({
  storage: new CloudinaryStorage({
    cloudinary: cloudinaryUpload,
    params: async (req, file) => {
      const validatedMime = file.mimetype as AllowedMimeType;
      if (!ALLOWED_MIME_TYPES.includes(validatedMime)) {
        throw new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'file');
      }
      const baseName = file.originalname.toLowerCase().replace(/[^a-z0-9-]/g, '').substring(0, 100);
      const randomPrefix = Math.random().toString(36).substring(2, 10);
      const timestamp = Date.now();
      const uniqueFileName = `${randomPrefix}-${timestamp}-${baseName}`;
      return {
        public_id: uniqueFileName,
        folder: 'portfolio',
        resource_type: 'auto',
        format: validatedMime === 'image/jpeg' || validatedMime === 'image/jpg' ? undefined : validatedMime.split('/')[1],
      };
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10, // Maximum 10 files per request
  },
  fileFilter: (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    cb(null, ALLOWED_MIME_TYPES.includes(file.mimetype as AllowedMimeType));
  },
});
