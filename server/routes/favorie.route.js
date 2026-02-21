// ===========================================
// Routes - Favorites
// ===========================================
import express from "express";
import { addFavorite, getFavorites, removeFavorite } from "../controllers/favorite.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/favorites", authenticateToken, getFavorites);

router.post("/favorites", authenticateToken, addFavorite);

router.delete("/favorites/:restaurantId", authenticateToken, removeFavorite);

export default router;