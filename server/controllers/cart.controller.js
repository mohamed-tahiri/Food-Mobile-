import { loadJSON } from "../utils/database.util.js";

let restaurants = loadJSON("restaurants.json");
let menus = loadJSON("menus.json");

export const validateCart = (req, res) => {
    const { restaurantId, items } = req.body;

    const restaurant = restaurants.find(r => r.id === restaurantId);
    if (!restaurant) {
        return res.status(404).json({ success: false, message: "Restaurant non trouvé" });
    }

    const menu = menus[restaurantId];
    if (!menu) {
        return res.status(404).json({ success: false, message: "Menu non trouvé" });
    }

    // Valider que tous les items existent et sont disponibles
    const allMenuItems = menu.flatMap(cat => cat.items);
    let subtotal = 0;

    for (const item of items) {
        const menuItem = allMenuItems.find(m => m.id === item.menuItemId);
        if (!menuItem) {
        return res.status(400).json({ success: false, message: `Article ${item.menuItemId} non trouvé` });
        }
        if (!menuItem.isAvailable) {
        return res.status(400).json({ success: false, message: `${menuItem.name} n'est plus disponible` });
        }
        subtotal += menuItem.price * item.quantity;
    }

    if (subtotal < restaurant.minimumOrder) {
        return res.status(400).json({ 
        success: false, 
        message: `Commande minimum: ${restaurant.minimumOrder}€ (actuel: ${subtotal}€)` 
        });
    }

    res.json({
        success: true,
        data: {
        subtotal,
        deliveryFee: restaurant.deliveryFee,
        serviceFee: 0.99,
        total: subtotal + restaurant.deliveryFee + 0.99
        }
    });
}