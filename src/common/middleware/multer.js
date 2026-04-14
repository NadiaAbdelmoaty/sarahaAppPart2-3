import multer from "multer";
import fs from "node:fs";

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
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from "../../../config/config.service.js";

// configure cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

// ✅ replaces multer_local — uploads directly to Cloudinary
export const multer_local = ({
  myPath = "general",
  custom_types = [],
} = {}) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `uploads/${myPath}`, // creates folder in Cloudinary
      allowed_formats: custom_types.map((type) => type.split("/")[1]), // e.g. "image/jpeg" → "jpeg"
    },
  });

  function fileFilter(req, file, cb) {
    if (!custom_types.includes(file.mimetype)) {
      cb(new Error("invalid file type"));
    } else {
      cb(null, true);
    }
  }

  return multer({ storage, fileFilter });
};

// ✅ replaces multer_host — uses Cloudinary memory buffer
export const multer_host = (custom_types = []) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "uploads/host",
    },
  });

  function fileFilter(req, file, cb) {
    if (!custom_types.includes(file.mimetype)) {
      cb(new Error("invalid file type"));
    } else {
      cb(null, true);
    }
  }

  return multer({ storage, fileFilter });
};
