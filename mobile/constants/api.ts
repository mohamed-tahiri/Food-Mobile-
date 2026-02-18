export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';

export const ENDPOINTS = {
    LOGIN: `${API_URL}/auth/login`,
    REGISTER: `${API_URL}/auth/register`,
    REFRESH: `${API_URL}/auth/refresh`,

    // Core Data
    CATEGORIES: `${API_URL}/categories`,
    RESTAURANTS: `${API_URL}/restaurants`,
    RESTAURANT_DETAILS: (id: string) => `${API_URL}/restaurants/${id}`,
    RESTAURANT_MENU: (id: string) => `${API_URL}/restaurants/${id}/menu`,
    RESTAURANT_MENU_DISH: (idMenu: string, idDish: string) => `${API_URL}/restaurants/${idMenu}/menu/${idDish}/dish`,

    // User Specific
    FAVORITES: `${API_URL}/favorites`,
    ORDERS: `${API_URL}/orders`,
    REVIEWS: `${API_URL}/reviews`,
    
    // Tools
    UPLOADS: `${API_URL}/uploads`,
    PUSH_TOKEN: `${API_URL}/notifications/register-token`,
    HEALTH: `${API_URL}/health`,
};