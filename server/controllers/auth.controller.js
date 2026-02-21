import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { loadJSON } from "../utils/database.util.js";
import { generateTokens } from "../utils/token.util.js";

const JWT_SECRET = process.env.JWT_SECRET || "foodiespot-super-secret-jwt-key-change-in-production";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "foodiespot-super-secret-refresh-key-change-in-production";
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "1h";

let users = loadJSON("users.json");

export const register = (req, res) => {
    const { email, password, firstName, lastName, phone } = req.body || {};

    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ 
        success: false, 
        message: "Email, mot de passe, prénom et nom sont requis" 
        });
    }

    // Vérifier si l'email existe déjà
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(409).json({ success: false, message: "Cet email est déjà utilisé" });
    }

    const newUser = {
        id: uuidv4(),
        email,
        password, // En prod: hasher avec bcrypt!
        firstName,
        lastName,
        phone: phone || "",
        avatar: "",
        addresses: [],
        notificationsEnabled: true,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveJSON("users.json", users);

    const { password: _, ...userWithoutPassword } = newUser;
    const tokens = generateTokens(newUser);

    res.status(201).json({
        success: true,
        data: {
        user: userWithoutPassword,
        ...tokens,
        expiresIn: 36000
        }
    });
}

export const login = (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email et mot de passe requis" });
    }

    let user = users.find(u => u.email === email);
    
    if (!user) {
        user = {
        id: uuidv4(),
        email,
        firstName: email.split("@")[0],
        lastName: "Demo",
        phone: "",
        avatar: "",
        addresses: [
            {
            id: uuidv4(),
            label: "Maison",
            street: "123 Rue de Paris",
            city: "Paris",
            postalCode: "75001",
            country: "France",
            latitude: 48.8566,
            longitude: 2.3522,
            isDefault: true
            }
        ],
        notificationsEnabled: true,
        createdAt: new Date().toISOString()
        };
        users.push({ ...user, password });
        saveJSON("users.json", users);
    }

    const { password: _, ...userWithoutPassword } = user;
    const tokens = generateTokens(user);

    res.json({
        success: true,
        data: {
        user: userWithoutPassword,
        token: tokens.accessToken, 
        ...tokens,
            expiresIn: 36000
        }
    });
}

export const refresh =  (req, res) => {
    const { refreshToken } = req.body || {};

    if (!refreshToken) {
        return res.status(400).json({ success: false, message: "Refresh token requis" });
    }

    jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, decoded) => {
        if (err) {
        return res.status(403).json({ success: false, message: "Refresh token invalide" });
        }

        const accessToken = jwt.sign(
        { userId: decoded.userId, email: decoded.email },
        JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
        );

        res.json({
        success: true,
        data: { accessToken, expiresIn: 36000 }
        });
    });
}

export const logout = (req, res) => {
  // En prod: invalider le refresh token
  res.json({ success: true, message: "Déconnexion réussie" });
}

export const forgetPassword = (req, res) => {
    const { email } = req.body || {};
    // Mock: toujours succès
    res.json({ success: true, message: "Email de récupération envoyé" });
}