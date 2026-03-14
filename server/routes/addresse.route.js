// ===========================================
// Routes - Addresses
// ===========================================
import express from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { createUserAddress, deleteUserAddress, getUserAddresses, setDefaultAddress } from "../controllers/addresse.controller.js";

const router = express.Router();

router.get("/users/addresses", authenticateToken, getUserAddresses);

router.post("/users/addresses", authenticateToken, createUserAddress);

router.delete("/users/addresses/:addressId", authenticateToken, deleteUserAddress);

router.patch("/users/addresses/:addressId/default", authenticateToken, setDefaultAddress);

export default router;


