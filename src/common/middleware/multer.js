// import multer from "multer";
// import fs from "node:fs";

// export const multer_local = ({
//   myPath = "general",
//   custom_types = [],
// } = {}) => {
//   const fullPath = `uploads/${myPath}`;
//   if (!fs.existsSync(fullPath)) {
//     fs.mkdirSync(fullPath, { recursive: true });
//   }
//   const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, fullPath);
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//       cb(null, uniqueSuffix + "_" + file.originalname);
//     },
//   });
//   function fileFilter(req, file, cb) {
//     if (!custom_types.includes(file.mimetype)) {
//       cb(new Error("invalid file type"));
//     }
//     cb(null, true);
//   }

//   const upload = multer({ storage, fileFilter });
//   return upload;
// };

// export const multer_host = (custom_types = []) => {
//   const storage = multer.diskStorage({});
//   function fileFilter(req, file, cb) {
//     if (!custom_types.includes(file.mimetype)) {
//       cb(new Error("invalid file type"));
//     } else {
//       cb(null, true);
//     }
//   }

//   const upload = multer({ storage, fileFilter });
//   return upload;
// };


import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from "../../../config/config.service.js";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

// custom cloudinary storage engine for multer
const createCloudinaryStorage = (folder) => ({
  _handleFile(req, file, cb) {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: `uploads/${folder}` },
      (error, result) => {
        if (error) return cb(error);
        cb(null, {
          path: result.secure_url,   // the Cloudinary URL
          filename: result.public_id // the Cloudinary public_id
        });
      }
    );
//file.stream.pipe(uploadStream);
  },
  _removeFile(req, file, cb) {
    cloudinary.uploader.destroy(file.filename, cb);
  },
});

// ✅ replaces multer_local
export const multer_local = ({
  myPath = "general",
  custom_types = [],
} = {}) => {
  function fileFilter(req, file, cb) {
    if (!custom_types.includes(file.mimetype)) {
      cb(new Error("invalid file type"));
    } else {
      cb(null, true);
    }
  }

  return multer({
    storage: createCloudinaryStorage(myPath),
    fileFilter,
  });
};

// ✅ replaces multer_host
export const multer_host = (custom_types = []) => {
  function fileFilter(req, file, cb) {
    if (!custom_types.includes(file.mimetype)) {
      cb(new Error("invalid file type"));
    } else {
      cb(null, true);
    }
  }

  return multer({
    storage: createCloudinaryStorage("host"),
    fileFilter,
  });
};