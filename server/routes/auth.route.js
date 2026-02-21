// ===========================================
// Routes - Authentication
// ===========================================
import express from "express";
import { forgetPassword, login, logout, refresh, register } from "../controllers/auth.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/auth/register", register);

router.post("/auth/login", login);

router.post("/auth/refresh", refresh);

router.post("/auth/logout", authenticateToken, logout);

router.post("/auth/forgot-password", forgetPassword);

export default router;