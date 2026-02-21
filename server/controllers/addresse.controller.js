
import { v4 as uuidv4 } from "uuid";
import { loadJSON, saveJSON } from "../utils/database.util.js";

let users = loadJSON("users.json");

export const getUserAddresses = (req, res) => {
    const user = users.find(u => u.id === req.user.userId);
    if (!user) {
        return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }
    res.json({ success: true, data: user.addresses || [] });
} 

export const createUserAddress = (req, res) => {
    const { label, street, apartment, city, postalCode, country, latitude, longitude, isDefault, instructions } = req.body;
    
    const userIndex = users.findIndex(u => u.id === req.user.userId);
    if (userIndex === -1) {
        return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }

    const newAddress = {
        id: uuidv4(),
        label: label || "Adresse",
        street,
        apartment,
        city,
        postalCode,
        country: country || "France",
        latitude: latitude || 48.8566,
        longitude: longitude || 2.3522,
        isDefault: isDefault || false,
        instructions
    };

    if (newAddress.isDefault) {
        users[userIndex].addresses = users[userIndex].addresses.map(a => ({ ...a, isDefault: false }));
    }

    users[userIndex].addresses.push(newAddress);
    saveJSON("users.json", users);

    res.status(201).json({ success: true, data: newAddress });
}

export const deleteUserAddress = (req, res) => {
    const userIndex = users.findIndex(u => u.id === req.user.userId);
    if (userIndex === -1) {
        return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }

    users[userIndex].addresses = users[userIndex].addresses.filter(a => a.id !== req.params.addressId);
    saveJSON("users.json", users);

    res.json({ success: true, message: "Adresse supprimée" });
}