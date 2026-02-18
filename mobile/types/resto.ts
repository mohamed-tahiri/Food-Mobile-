import { MenuCategory, MenuItem } from "./menuItem";

export interface Resto {
    id: string;
    name: string;
    description: string;
    address: string;
    phone: string;
    rating: number; // Ton API renvoie un nombre, pas un string
    reviewCount: number;
    image: string; // L'API utilise 'image'
    coverImage: string;
    cuisine: string[]; // C'est un tableau de strings dans ton log
    deliveryFee: number;
    deliveryTime: {
        min: number;
        max: number;
    };
    priceRange: number;
    isOpen: boolean;
    latitude: number;
    longitude: number;
    minimumOrder: number;
    slug: string;
    categories: string[];
    features: string[];
    // Garde ces champs en optionnel si tu les utilises encore dans l'UI
    isFavorite?: boolean; 
    menuCategories?: MenuCategory[];
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
}