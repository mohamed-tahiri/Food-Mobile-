// ===========================================
// Routes - Reviews (Module 05 - avec upload)
// ==========================================
import express from "express";
import { createReview } from "../controllers/review.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/reviews", authenticateToken, upload.array("images", 5), createReview);

export default router;
