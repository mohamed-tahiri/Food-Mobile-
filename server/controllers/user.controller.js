import { loadJSON, saveJSON } from "../utils/database.util.js";

let users = loadJSON("users.json");
let favorites = loadJSON("favorites.json");
let restaurants = loadJSON("restaurants.json");

export const getUserProfile = (req, res) => {
    const user = users.find(u => u.id === req.user.userId);
    if (!user) {
        return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }
    const { password: _, ...userWithoutPassword } = user;
    res.json({ success: true, data: userWithoutPassword });
} 

export const updateUserProfileAdv = (req, res) => {
    const userIndex = users.findIndex(u => u.id === req.user.userId);
    
    if (userIndex === -1) {
        return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }

    const allowedFields = ['firstName', 'lastName', 'phone', 'photo', 'notificationsEnabled'];
    allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
        users[userIndex][field] = req.body[field];
        }
    });

    // Support pour le champ "name" du frontend
    if (req.body.name) {
        const nameParts = req.body.name.split(' ');
        users[userIndex].firstName = nameParts[0];
        users[userIndex].lastName = nameParts.slice(1).join(' ') || '';
    }

    saveJSON("users.json", users);

    const { password: _, ...userWithoutPassword } = users[userIndex];
    res.json({ success: true, data: userWithoutPassword });
}

export const updateUserProfile = (req, res) => {
    const { firstName, lastName, phone } = req.body || {};
    const userIndex = users.findIndex(u => u.id === req.user.userId);
    
    if (userIndex === -1) {
        return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }

    if (firstName) users[userIndex].firstName = firstName;
    if (lastName) users[userIndex].lastName = lastName;
    if (phone !== undefined) users[userIndex].phone = phone;

    saveJSON("users.json", users);

    const { password: _, ...userWithoutPassword } = users[userIndex];
    res.json({ success: true, data: userWithoutPassword });
}

export const uploadUserAvatar = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "Aucun fichier uploadé" });
    }

    const userIndex = users.findIndex(u => u.id === req.user.userId);
    if (userIndex === -1) {
        return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }

    const avatarUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    users[userIndex].avatar = avatarUrl;
    saveJSON("users.json", users);

    res.json({ success: true, data: { url: avatarUrl } });
}