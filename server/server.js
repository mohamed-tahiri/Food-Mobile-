import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Import des routes
import orderRoutes from "./routes/order.route.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import addressRoutes from "./routes/addresse.route.js";
import categoryRoutes from "./routes/category.route.js";
import cartRoutes from "./routes/cart.route.js";
import favorieRoutes from "./routes/favorie.route.js";
import notiificationRoutes from "./routes/notification.route.js";
import promoRoutes from "./routes/promo.route.js";
import restaurantRoutes from "./routes/restaurant.route.js";
import reviewRoutes from "./routes/review.route.js";
import uploadRoutes from "./routes/upload.route.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 4000;
const UPLOADS_DIR = path.join(__dirname, "uploads");

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const app = express();

// ===========================================
// Middlewares de base
// ===========================================
app.use(cors({ origin: true }));
app.use(express.json());
app.use("/uploads", express.static(UPLOADS_DIR));

// ===========================================
// LOGGER MIDDLEWARE (Pour voir les appels en console)
// ===========================================
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// ===========================================
// Routes - API Endpoints
// ===========================================
app.get("/health", (req, res) => {
  res.json({ ok: true, service: "FoodieSpot API", ts: Date.now() });
});

app.use(orderRoutes);
app.use(authRoutes);
app.use(userRoutes);
app.use(addressRoutes);
app.use(categoryRoutes);
app.use(cartRoutes);
app.use(favorieRoutes);
app.use(notiificationRoutes);
app.use(promoRoutes);
app.use(restaurantRoutes);
app.use(reviewRoutes);
app.use(uploadRoutes);

// ===========================================
// 404 Handler
// ===========================================
app.use((req, res) => {
  console.warn(`[404] Route non trouvée : ${req.method} ${req.originalUrl}`);
  res.status(404).json({ success: false, message: "Route non trouvée" });
});

// ===========================================
// Start Server
// ===========================================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   🍔 FoodieSpot THR API Server                    ║
║                                                   ║
║   Statut: EN LIGNE                                ║
║   Port: ${PORT}                                   ║
║   URL: http://localhost:${PORT}                   ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
  `);
  console.log("🚀 En attente de requêtes...\n");
});