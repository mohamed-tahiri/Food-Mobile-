// ===========================================
// Routes - Search (pour compatibilité frontend)
// ===========================================
import express from "express";
import { 
    getNearbyRestaurants, 
    getRestaurantById, 
    getRestaurantDish, 
    getRestaurantMenu, 
    getRestaurantReviews, 
    getRestaurants, 
    searchRestaurants 
} from "../controllers/restaurant.controller.js";
import { optionalAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ===========================================
router.get("/restaurants/search", optionalAuth, searchRestaurants);

router.get("/restaurants", optionalAuth, getRestaurants);

router.get("/restaurants/nearby", optionalAuth, getNearbyRestaurants);

router.get("/restaurants/:id", optionalAuth, getRestaurantById);

router.get("/restaurants/:id/menu", getRestaurantMenu);

router.get("/restaurants/:idMenu/menu/:idDish/dish", getRestaurantDish);

router.get("/restaurants/:id/reviews", getRestaurantReviews);

export default router;