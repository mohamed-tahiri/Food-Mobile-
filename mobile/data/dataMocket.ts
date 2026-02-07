export const orders = [
    {
        id: '1',
        store: 'Burger King',
        date: 'Hier, 19:30',
        price: '22,40 €',
        status: 'Livré',
    },
    {
        id: '2',
        store: 'Sushi Shop',
        date: '12 Janv.',
        price: '35,00 €',
        status: 'Livré',
    },
];

export const cuisines = [
    { id: '1', name: 'Italien', icon: '🍕' },
    { id: '2', name: 'Japonais', icon: '🍣' },
    { id: '3', name: 'Mexicain', icon: '🌮' },
    { id: '4', name: 'Burger', icon: '🍔' },
    { id: '5', name: 'Santé', icon: '🥗' },
    { id: '6', name: 'Indien', icon: '🍛' },
];

export const menuItems = [
    {
        id: '1',
        name: 'Double Cheese Burger',
        price: 12.90,
        desc: 'Bœuf grillé, double cheddar, cornichons, sauce secrète.',
        img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200',
    },
    {
        id: '2',
        name: 'Classic Burger',
        price: 10.50,
        desc: 'Bœuf, salade, tomate, oignons rouges, ketchup.',
        img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=200',
    },
    {
        id: '3',
        name: 'Frites Maison (Large)',
        price: 4.50,
        desc: 'Pommes de terre fraîches, sel de mer.',
        img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200',
    },
];

export const restaurants = [
    {
        id: '1',
        name: 'Le Bistro Gourmand',
        rating: '4.8',
        time: '15-25 min',
        imageUrl:
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
        type: 'Français • Cuisine Fine',
        promo: '-20% sur tout',
        distance: '0.8 km',
        isFavorite: false,
    },
    {
        id: '2',
        name: 'Sushi Master',
        rating: '4.9',
        time: '20-30 min',
        imageUrl:
            'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800',
        type: 'Japonais • Sushi & Ramen',
        distance: '1.5 km',
        isFavorite: false,
    },
    {
        id: '3',
        name: 'Pizza Roma',
        rating: '4.5',
        time: '10-20 min',
        imageUrl:
            'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800',
        type: 'Italien • Pizza au feu de bois',
        promo: '1 achetée = 1 offerte',
        distance: '2.1 km',
        isFavorite: false,
    },
    {
        id: '4',
        name: 'Burger House',
        rating: '4.7',
        time: '25-35 min',
        imageUrl:
            'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800',
        type: 'Américain • Burger Gourmet',
        distance: '0.5 km',
        isFavorite: false,
    },
    {
        id: '5',
        name: 'Tacos de Lyon',
        rating: '4.2',
        time: '15-20 min',
        imageUrl:
            'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=800',
        type: 'Mexicain • Tacos & Burritos',
        promo: 'Menu à 9.99€',
        distance: '3.0 km',
        isFavorite: false,
    },
    {
        id: '6',
        name: 'Healthy Green',
        rating: '4.4',
        time: '10-15 min',
        imageUrl:
            'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800',
        type: 'Salade • Healthy & Vegan',
        distance: '0.3 km',
        isFavorite: false,
    },
];

export const favorites = [
    {
        id: '1',
        name: 'La Trattoria Milano',
        type: 'Italien • Pizza',
        rating: '4.9',
        time: '20-30 min',
        imageUrl:
            'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800',
        distance: '1.2 km',
        isFavorite: true,
    },
    {
        id: '2',
        name: 'Sakura Zen',
        type: 'Japonais • Sushi',
        rating: '4.7',
        time: '15-25 min',
        imageUrl:
            'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=800', // Image de sushi pro
        distance: '2.5 km',
        isFavorite: true,
    },
];

export const categories = [
    { id: '1', name: 'Pizza', icon: '🍕' },
    { id: '2', name: 'Burger', icon: '🍔' },
    { id: '3', name: 'Sushi', icon: '🍣' },
    { id: '4', name: 'Tacos', icon: '🌮' },
    { id: '5', name: 'Poulet', icon: '🍗' },
];

export const offers = [
    {
        id: '1',
        title: '50% sur les Pizzas',
        sub: 'Code: PIZZA50',
        color: '#FF6B35',
    },
    {
        id: '2',
        title: 'Livraison Gratuite',
        sub: "Dès 15€ d'achat",
        color: '#4A90E2',
    },
];
