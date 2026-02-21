// ===========================================
// Routes - Promos
// ===========================================
import express from "express";

import { validatePromoCode } from "../controllers/promo.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/promos/validate", authenticateToken, validatePromoCode);

export default router;