export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.16.30.28:4000';

export const ENDPOINTS = {
    // User Specific
    FAVORITES: `${API_URL}/favorites`,
    ORDERS: `${API_URL}/orders`,
    REVIEWS: `${API_URL}/reviews`,
    
    // Tools
    UPLOADS: `${API_URL}/uploads`,
    PUSH_TOKEN: `${API_URL}/notifications/register-token`,
    HEALTH: `${API_URL}/health`,
};