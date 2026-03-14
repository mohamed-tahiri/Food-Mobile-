export interface TimelineStep {
    status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'delivering' | 'delivered' | 'cancelled';
    timestamp: string;
    message: string;
}

export interface OrderItem {
    menuItemId: string;
    quantity: number;
    totalPrice: number;
    menuItem: {
        id: string;
        name: string;
        price: number;
        image: string;
        description?: string; // Présent dans certaines commandes
        category?: string;
        allergens?: string[];
    };
}

export interface Order {
    id: string;
    orderNumber: string;
    userId: string;
    restaurantId: string;
    restaurantName: string;
    restaurantImage: string;
    items: OrderItem[];
    status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'delivering' | 'delivered' | 'cancelled';
    subtotal: number;
    deliveryFee: number;
    serviceFee: number;
    tip: number;
    discount: number;
    total: number;
    paymentMethod: 'card' | 'cash' | string;
    createdAt: string;
    updatedAt: string;
    estimatedDelivery: string;
    actualDelivery?: string; // Uniquement si status === 'delivered'
    deliveryInstructions?: string;
    deliveryAddress: {
        id?: string;
        label: string;
        street: string;
        city: string;
        postalCode?: string;
        country?: string;
        latitude?: number;
        longitude?: number;
        zipCode?: string; // Adapté aux deux formats de ton JSON
    };
    driverInfo?: {
        id: string;
        name: string;
        phone: string;
        avatar: string;
        vehicle: string;
        licensePlate: string | null;
        rating: number;
        location?: {
            latitude: number;
            longitude: number;
        };
    };
    timeline: TimelineStep[];
}