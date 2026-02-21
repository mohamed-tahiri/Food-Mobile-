import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    cb(null, `${Date.now()}-${uuidv4()}${ext}`);
  }
});

export const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });