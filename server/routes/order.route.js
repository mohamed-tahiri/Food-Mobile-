// ===========================================
// Routes - Orders
// ===========================================
import express from "express";
import { cancelOrder, createOrder, getOrderById, getOrders, trackOrder } from "../controllers/order.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/orders")
    .get(authenticateToken, getOrders)
    .post(authenticateToken, createOrder);

router.get("/orders/:id", authenticateToken, getOrderById);

router.post("/orders/:id/cancel", authenticateToken, cancelOrder);

router.get("/orders/:id/track", authenticateToken, trackOrder);

export default router;