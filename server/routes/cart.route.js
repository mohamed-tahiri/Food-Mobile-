// ===========================================
// Routes - Cart (côté client principalement)
// ===========================================
import express from "express";
import { validateCart } from "../controllers/cart.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/cart/validate", authenticateToken, validateCart);

export default router;