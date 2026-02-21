import { loadJSON, saveJSON } from "../utils/database.util.js";

let pushTokens = loadJSON("push-tokens.json") || {};

export const registerPushTokenNotification = (req, res) => {
    const { token, platform, deviceName } = req.body;

    if (!token) {
        return res.status(400).json({ success: false, message: "Token requis" });
    }

    pushTokens[req.user.userId] = {
        token,
        platform: platform || "unknown",
        deviceName: deviceName || "Unknown Device",
        registeredAt: new Date().toISOString()
    };

    saveJSON("push-tokens.json", pushTokens);
    res.json({ success: true, message: "Token enregistré" });
};

export const getNotifications = (req, res) => {
    const notifications = [
        {
        id: uuidv4(),
        type: "promotion",
        title: "🎉 -20% chez Pizza Napoli !",
        body: "Profitez de 20% de réduction sur votre prochaine commande",
        data: { restaurantId: "rest-002" },
        isRead: false,
        createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
        id: uuidv4(),
        type: "new_restaurant",
        title: "🆕 Nouveau restaurant !",
        body: "Découvrez Green Bowl, votre nouvelle adresse healthy",
        data: { restaurantId: "rest-005" },
        isRead: true,
        createdAt: new Date(Date.now() - 86400000).toISOString()
        }
    ];
    
    res.json({ success: true, data: notifications });
};