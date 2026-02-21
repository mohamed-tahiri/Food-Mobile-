import { loadJSON } from "../utils/database.util.js";

let categories = loadJSON("categories.json");

export const getCategories = (req, res) => {
    res.json({ success: true, data: categories });
}