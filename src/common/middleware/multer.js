import multer from "multer";
import fs from "node:fs";

export const multer_local = ({
  myPath = "general",
  custom_types = [],
} = {}) => {
  const fullPath = `uploads/${myPath}`;
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, fullPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "_" + file.originalname);
    },
  });
  function fileFilter(req, file, cb) {
    if (!custom_types.includes(file.mimetype)) {
      cb(new Error("invalid file type"));
    }
    cb(null, true);
  }

  const upload = multer({ storage, fileFilter });
  return upload;
};

export const multer_host = (custom_types = []) => {
  const storage = multer.diskStorage({});
  function fileFilter(req, file, cb) {
    if (!custom_types.includes(file.mimetype)) {
      cb(new Error("invalid file type"));
    } else {
      cb(null, true);
    }
  }

  const upload = multer({ storage, fileFilter });
  return upload;
};
