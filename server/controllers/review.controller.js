import { loadJSON, saveJSON } from "../utils/database.util.js";
import { v4 as uuidv4 } from "uuid";

let users = loadJSON("users.json");
let reviews = loadJSON("reviews.json");
let restaurants = loadJSON("restaurants.json");


export const createReview =  (req, res) => {
  const { restaurantId, orderId, rating, comment } = req.body;

  if (!restaurantId || !rating) {
    return res.status(400).json({ success: false, message: "restaurantId et rating requis" });
  }

  const user = users.find(u => u.id === req.user.userId);
  const images = req.files ? req.files.map(f => `${req.protocol}://${req.get("host")}/uploads/${f.filename}`) : [];

  const newReview = {
    id: uuidv4(),
    userId: req.user.userId,
    userName: user ? `${user.firstName} ${user.lastName}` : "Utilisateur",
    userAvatar: user?.avatar,
    restaurantId,
    orderId,
    rating: parseInt(rating),
    comment: comment || "",
    images,
    likes: 0,
    createdAt: new Date().toISOString()
  };

  reviews.push(newReview);
  saveJSON("reviews.json", reviews);

  const restaurantReviews = reviews.filter(r => r.restaurantId === restaurantId);
  const avgRating = restaurantReviews.reduce((sum, r) => sum + r.rating, 0) / restaurantReviews.length;
  const restaurantIndex = restaurants.findIndex(r => r.id === restaurantId);
  if (restaurantIndex !== -1) {
    restaurants[restaurantIndex].rating = Math.round(avgRating * 10) / 10;
    restaurants[restaurantIndex].reviewCount = restaurantReviews.length;
    saveJSON("restaurants.json", restaurants);
  }

  res.status(201).json({ success: true, data: newReview });
};
