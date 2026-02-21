// ===========================================
// Routes - Push Notifications (Module 09)
// ===========================================

import express from "express";
import { getNotifications, registerPushTokenNotification } from "../controllers/notification.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ===========================================
router.post("/notifications/register-token", authenticateToken, registerPushTokenNotification);

router.get("/notifications", authenticateToken, getNotifications);

export default router;