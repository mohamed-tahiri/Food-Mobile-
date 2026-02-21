import express from "express";

import { authenticateToken } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { uploadFile } from "../controllers/upload.controller.js";

const router = express.Router();

router.post("/upload", authenticateToken, upload.single("image"), uploadFile);

router.post("/uploads", authenticateToken, upload.single("file"), uploadFile);

export default router;
