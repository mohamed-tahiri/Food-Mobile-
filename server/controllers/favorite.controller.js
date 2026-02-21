import { loadJSON, saveJSON } from "../utils/database.util.js";

export const getFavorites = (req, res) => {
    const favorites = loadJSON("favorites.json");
    const restaurants = loadJSON("restaurants.json");
    
    const userId = req.user.userId;
    const userFavs = favorites[userId] || [];

    const favoriteRestaurants = restaurants.filter(r => userFavs.includes(r.id));
    res.json({ success: true, data: favoriteRestaurants });
};

export const addFavorite = (req, res) => {
    const { restaurantId } = req.body;
    const userId = req.user.userId;

    if (!restaurantId) {
        return res.status(400).json({ success: false, message: "restaurantId requis" });
    }

    // 1. CHARGER : On s'assure que c'est un OBJET {} et pas un tableau []
    let favorites = loadJSON("favorites.json");
    if (Array.isArray(favorites)) {
        favorites = {}; // Correction si le fichier était un [] vide
    }

    // 2. INITIALISER l'entrée utilisateur
    if (!favorites[userId]) {
        favorites[userId] = [];
    }

    if (!favorites[userId].includes(restaurantId)) {
        favorites[userId].push(restaurantId);
        
        saveJSON("favorites.json", favorites);
    }
    res.json({ success: true, message: "Ajouté aux favoris" });
};

export const removeFavorite = (req, res) => {
    const userId = req.user.userId;
    const { restaurantId } = req.params;
    
    let favorites = loadJSON("favorites.json");

    if (favorites[userId]) {
        favorites[userId] = favorites[userId].filter(id => id !== restaurantId);
        saveJSON("favorites.json", favorites);
    }
    res.json({ success: true, message: "Retiré des favoris" });
};