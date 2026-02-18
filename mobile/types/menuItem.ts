export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    isAvailable: boolean;
    calories?: number;
}

export interface MenuCategory {
    id: string;
    name: string;
    sortOrder: number;
    items: MenuItem[]; // C'est ici que se trouvent tes plats (le [Array] du log)
}