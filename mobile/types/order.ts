export interface OrderItem {
    menuItemId: string;
    menuItem: {
        id: string;
        name: string;
        price: number;
        image: string;
    };
    quantity: number;
    totalPrice: number;
}

export interface Order {
    id: string;
    orderNumber: string;
    restaurantId: string;
    restaurantName: string;
    restaurantImage: string;
    items: OrderItem[];
    status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'delivering' | 'delivered';
    subtotal: number;
    deliveryFee: number;
    serviceFee: number;
    total: number;
    createdAt: string;
    deliveryAddress: {
        label: string;
        street: string;
        city: string;
    };
    driverInfo?: {
        name: string;
        phone: string;
        avatar: string;
        licensePlate: string;
        vehicle: string;
        rating: number;
    };
}