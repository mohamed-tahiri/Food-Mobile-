import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORRECTION : On ajoute ".." pour sortir de "utils" et trouver "data" à la racine
const DATA_DIR = process.env.DATA_DIR 
  ? path.resolve(__dirname, process.env.DATA_DIR) 
  : path.join(__dirname, "..", "data"); 

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const loadJSON = (filename) => {
    try {
        const filepath = path.join(DATA_DIR, filename);
        
        // On vérifie si le fichier existe vraiment avant de lire
        if (!fs.existsSync(filepath)) {
            // console.warn(`⚠️ Fichier manquant: ${filepath}`);
            return filename === "menus.json" ? {} : (filename === "favorites.json" ? {} : []);
        }

        const raw = fs.readFileSync(filepath, "utf8");
        return JSON.parse(raw);
    } catch (e) {
        console.error(`❌ Erreur lors de la lecture de ${filename}:`, e.message);
        return filename === "menus.json" ? {} : [];
    }
}

export const saveJSON = (filename, data) => {
    try {
        const filepath = path.join(DATA_DIR, filename);

        fs.writeFileSync(filepath, JSON.stringify(data, null, 2), "utf8");
    } catch (e) {
        console.error(`❌ Erreur lors de l'écriture de ${filename}:`, e.message);
    }
}