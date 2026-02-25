import { loadJSON } from "../utils/database.util.js";
import { calculateDistance } from "../utils/helper.util.js";

let restaurants = loadJSON("restaurants.json");
let menus = loadJSON("menus.json");
let reviews = loadJSON("reviews.json");
let favorites = loadJSON("favorites.json");


export const searchRestaurants = (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.json({ success: true, data: [] });
  }

  const query = q.toString().toLowerCase();
  let result = restaurants.filter(r => 
    r.name.toLowerCase().includes(query) ||
    r.cuisine.some(c => c.toLowerCase().includes(query)) ||
    r.description.toLowerCase().includes(query) ||
    r.categories.some(c => c.toLowerCase().includes(query))
  );

  // Ajouter favoris si user connecté
  if (req.user) {
    const userFavs = favorites[req.user.userId] || [];
    result = result.map(r => ({ ...r, isFavorite: userFavs.includes(r.id) }));
  }

  res.json({ success: true, data: result });
};


export const getRestaurants = (req, res) => {
    const { category, cuisine, search, sortBy, lat, lng, radius, priceRange, rating, page = 1, limit = 20 } = req.query;
    
    let result = [...restaurants];

    // Filtrer par catégorie
    if (category) {
        result = result.filter(r => r.categories.includes(category));
    }

    // Filtrer par cuisine
    if (cuisine) {
        result = result.filter(r => r.cuisine.some(c => c.toLowerCase().includes(cuisine.toLowerCase())));
    }

    // Recherche textuelle
    if (search) {
        const q = search.toLowerCase();
        result = result.filter(r => 
          r.name.toLowerCase().includes(q) ||
          r.cuisine.some(c => c.toLowerCase().includes(q)) ||
          r.description.toLowerCase().includes(q)
        );
    }

    // Filtrer par prix
    if (priceRange) {
      const prices = priceRange.split(",").map(Number);
      result = result.filter(r => prices.includes(r.priceRange));
    }

    // Filtrer par note minimum
    if (rating) {
      result = result.filter(r => r.rating >= parseFloat(rating));
    }

    // Calculer la distance si lat/lng fournis
    if (lat && lng) {
      result = result.map(r => ({
        ...r,
        distance: calculateDistance(parseFloat(lat), parseFloat(lng), r.latitude, r.longitude)
      }));

      // Filtrer par rayon
      if (radius) {
        result = result.filter(r => r.distance <= parseFloat(radius));
      }
    }

    // Ajouter favoris si user connecté
    if (req.user) {
      const userFavs = favorites[req.user.userId] || [];
      result = result.map(r => ({ ...r, isFavorite: userFavs.includes(r.id) }));
    }

    // Trier
    switch (sortBy) {
      case "distance":
      result.sort((a, b) => (a.distance || 999) - (b.distance || 999));
      break;
      case "rating":
      result.sort((a, b) => b.rating - a.rating);
      break;
      case "deliveryTime":
      result.sort((a, b) => a.deliveryTime.min - b.deliveryTime.min);
      break;
      case "popularity":
      result.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
      default:
      result.sort((a, b) => b.rating - a.rating);
    }

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const paginatedResult = result.slice(startIndex, startIndex + parseInt(limit));

    res.json({
        success: true,
        data: paginatedResult,
        pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: result.length,
        totalPages: Math.ceil(result.length / parseInt(limit))
        }
    });
};

export const getNearbyRestaurants = (req, res) => {
  const { lat, lng, radius = 5 } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ success: false, message: "Latitude et longitude requises" });
  }

  let result = restaurants.map(r => ({
    ...r,
    distance: calculateDistance(parseFloat(lat), parseFloat(lng), r.latitude, r.longitude)
  }));

  result = result.filter(r => r.distance <= parseFloat(radius));
  result.sort((a, b) => a.distance - b.distance);

  if (req.user) {
    const userFavs = favorites[req.user.userId] || [];
    result = result.map(r => ({ ...r, isFavorite: userFavs.includes(r.id) }));
  }

  res.json({ success: true, data: result });
};

export const getRestaurantById = (req, res) => {
  const restaurant = restaurants.find(r => r.id === req.params.id);
  
  if (!restaurant) {
    return res.status(404).json({ success: false, message: "Restaurant non trouvé" });
  }

  let result = { ...restaurant };

  if (req.user) {
    const userFavs = favorites[req.user.userId] || [];
    result.isFavorite = userFavs.includes(restaurant.id);
  }

  res.json({ success: true, data: result });
};

export const getRestaurantMenu = (req, res) => {
  const menu = menus[req.params.id];
  
  if (!menu) {
    return res.status(404).json({ success: false, message: "Menu non trouvé" });
  }

  res.json({ success: true, data: menu });
};

export const getRestaurantDish = (req, res) => {
  const { idMenu, idDish } = req.params;
  const menu = menus[idMenu]; // On récupère le menu du restaurant
  
  if (!menu) {
    return res.status(404).json({ success: false, message: "Restaurant ou Menu non trouvé" });
  }

  // Comme ton menu contient des catégories (Entrées, Plats...), 
  // on utilise flatMap pour chercher l'item dans tous les tableaux 'items'
  const dish = menu.flatMap(category => category.items)
                   .find(item => item.id === idDish);

  if (!dish) {
    return res.status(404).json({ success: false, message: "Plat non trouvé dans ce menu" });
  }

  // On renvoie uniquement le plat trouvé
  res.json({ 
    success: true, 
    data: dish 
  });
};

export const getRestaurantReviews = (req, res) => {
  const restaurantReviews = reviews.filter(r => r.restaurantId === req.params.id);

  console.log(`Récupération des avis pour le restaurant ${req.params.id} - ${restaurantReviews.length} avis trouvés`);

  res.json({ success: true, data: restaurantReviews });
};
