import multer from "multer";
// import path from "path";
import crypto from "crypto";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, callback) => {
    const fileHash = crypto.randomBytes(10).toString("hex");
    const fileName = `${fileHash}-${file.originalname.replace(/\s/g, "")}`;
    callback(null, fileName);
  },
});

export const uploadCarImages = multer({ storage }).fields([
  { name: "image", maxCount: 1 },
  { name: "gallery", maxCount: 20 },
]);

export const uploadUserImage = multer({ storage }).fields([
  { name: "imageUrl", maxCount: 1 },
]);
