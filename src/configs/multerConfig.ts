import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinaryConfig";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: {
    public_id: (req, file) => {
      // console.log("req in multer config: ", req);
      
      const fileName = file.originalname
        .toLowerCase()
        .replace(/\s+/g, "-") 
        .replace(/\./g, "-")
        // eslint-disable-next-line no-useless-escape
        .replace(/[^a-z0-9\-\.]/g, ""); 

        const fileExtension = file.originalname.split(".").pop()
        const uniqeFileName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileName + "-" + "." + fileExtension
              console.log("In multer config of uniqeFileName: ", uniqeFileName);
              console.log("In multer config of fileName: ", fileName);

        return uniqeFileName
    },
  },
});

export const multerUpload = multer({storage:storage})
