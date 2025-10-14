import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinaryUpload } from './cloudinaryConfig';

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: async (req, file) => {

    const fileName = file.originalname
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/\./g, '-')
      // eslint-disable-next-line no-useless-escape
      .replace(/[^a-z0-9\-\.]/g, '');

    const fileExtension = file.originalname.split('.').pop();
    const uniqueFileName = `${Math.random().toString(36).substring(2)}-${Date.now()}-${fileName}.${fileExtension}`;

    // Return the configuration
    return {
      public_id: uniqueFileName,
      folder: 'portfolio', // Add specific folder
      resource_type: 'auto',
      // upload_preset: 'your_preset_name' // Add if you have one
    };
  },
});

// Add limits to handle larger files properly
export const multerUpload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

