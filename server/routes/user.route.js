
// ===========================================
// Routes - User Profile
// ===========================================
import express from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import {  
  getUserProfile, 
  updateUserProfile, 
  updateUserProfileAdv, 
  uploadUserAvatar 
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.route("/users/profile")
  .get(authenticateToken, getUserProfile)
  .put(authenticateToken, updateUserProfile);


router.patch("/users/profile", authenticateToken, updateUserProfileAdv);

router.post("/users/avatar", 
  authenticateToken, 
  upload.single("file"), uploadUserAvatar
);

export default router;
