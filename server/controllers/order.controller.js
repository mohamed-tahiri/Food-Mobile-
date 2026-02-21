import { v4 as uuidv4 } from "uuid";
import { loadJSON, saveJSON } from "../utils/database.util.js";

let orders = loadJSON("orders.json");
let menus = loadJSON("menus.json");
let restaurants = loadJSON("restaurants.json");

export const createOrder = (req, res) => {
    const { restaurantId, items, deliveryAddress, paymentMethod, tip = 0, deliveryInstructions } = req.body;

    const restaurant = restaurants.find(r => r.id === restaurantId);
    if (!restaurant) {
        return res.status(404).json({ success: false, message: "Restaurant non trouvé" });
    }

    // Calculer les totaux
    const menu = menus[restaurantId];
    const allMenuItems = menu ? menu.flatMap(cat => cat.items) : [];
    
    let subtotal = 0;
    const orderItems = items.map(item => {
        const menuItem = allMenuItems.find(m => m.id === item.menuItemId);
        const itemTotal = menuItem ? menuItem.price * item.quantity : 0;
        subtotal += itemTotal;
        return {
            ...item,
            menuItem,
            totalPrice: itemTotal
        };
    });

    const deliveryFee = restaurant.deliveryFee;
    const serviceFee = 0.99;
    const total = subtotal + deliveryFee + serviceFee + tip;

    const newOrder = {
        id: uuidv4(),
        orderNumber: `FS-${Date.now().toString().slice(-8)}`,
        userId: req.user.userId,
        restaurantId,
        restaurantName: restaurant.name,
        restaurantImage: restaurant.image,
        items: orderItems,
        status: "pending",
        subtotal,
        deliveryFee,
        serviceFee,
        tip,
        discount: 0,
        total,
        paymentMethod: paymentMethod || "card",
        deliveryAddress,
        deliveryInstructions,
        estimatedDelivery: new Date(Date.now() + (restaurant.deliveryTime.max * 60 * 1000)).toISOString(),
        timeline: [
        { status: "pending", timestamp: new Date().toISOString(), message: "Commande reçue" }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    orders.push(newOrder);
    saveJSON("orders.json", orders);

    // Simuler progression de la commande
    simulateOrderProgress(newOrder.id);

    res.status(201).json({ success: true, data: newOrder });
};

export const getOrders = (req, res) => {
    const userOrders = orders.filter(o => o.userId === req.user.userId);
    userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, data: userOrders });
};

export const getOrderById = (req, res) => {
    const order = orders.find(o => o.id === req.params.id && o.userId === req.user.userId);
    if (!order) {
        return res.status(404).json({ success: false, message: "Commande non trouvée" });
    }
    res.json({ success: true, data: order });
};

export const cancelOrder = (req, res) => {
    const orderIndex = orders.findIndex(o => o.id === req.params.id && o.userId === req.user.userId);
    
    if (orderIndex === -1) {
        return res.status(404).json({ success: false, message: "Commande non trouvée" });
    }

    if (!["pending", "confirmed"].includes(orders[orderIndex].status)) {
        return res.status(400).json({ success: false, message: "Cette commande ne peut plus être annulée" });
    }

    orders[orderIndex].status = "cancelled";
    orders[orderIndex].updatedAt = new Date().toISOString();
    orders[orderIndex].timeline.push({
        status: "cancelled",
        timestamp: new Date().toISOString(),
        message: "Commande annulée par le client"
    });

    saveJSON("orders.json", orders);
    res.json({ success: true, data: orders[orderIndex] });
};

export const trackOrder = (req, res) => {
    const order = orders.find(o => o.id === req.params.id && o.userId === req.user.userId);
    
    if (!order) {
        return res.status(404).json({ success: false, message: "Commande non trouvée" });
    }

    // Simuler la position du livreur si en livraison
    let trackingData = { ...order };
    
    if (order.status === "delivering" || order.status === "picked_up") {
        trackingData.driverLocation = {
        latitude: 48.8566 + (Math.random() - 0.5) * 0.01,
        longitude: 2.3522 + (Math.random() - 0.5) * 0.01,
        heading: Math.random() * 360,
        updatedAt: new Date().toISOString()
        };
        trackingData.estimatedArrival = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    }

    res.json({ success: true, data: trackingData });
};

function simulateOrderProgress(orderId) {
    const statuses = [
        { status: "confirmed", delay: 10000, message: "Commande confirmée par le restaurant" },
        { status: "preparing", delay: 20000, message: "Préparation en cours" },
        { status: "ready", delay: 40000, message: "Commande prête" },
        { status: "picked_up", delay: 50000, message: "Récupérée par le livreur" },
        { status: "delivering", delay: 60000, message: "En cours de livraison" },
        { status: "delivered", delay: 90000, message: "Livrée" }
    ];

    statuses.forEach(({ status, delay, message }) => {
        setTimeout(() => {
        const orderIndex = orders.findIndex(o => o.id === orderId);
        if (orderIndex !== -1 && orders[orderIndex].status !== "cancelled") {
            orders[orderIndex].status = status;
            orders[orderIndex].updatedAt = new Date().toISOString();
            orders[orderIndex].timeline.push({
            status,
            timestamp: new Date().toISOString(),
            message
            });
            if (status === "delivered") {
            orders[orderIndex].actualDelivery = new Date().toISOString();
            }
            saveJSON("orders.json", orders);
        }
        }, delay);
    });
}