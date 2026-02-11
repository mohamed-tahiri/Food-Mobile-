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
        address: '12 Avenue du Maine, 75015 Paris',
        phone: '0145385678',
        menus: [
            { id: '101', name: 'Entrecôte frites', price: 24.00, desc: 'Bœuf charolais, frites maison, sauce béarnaise.', img: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400' },
            { id: '102', name: 'Soupe à l\'oignon', price: 12.00, desc: 'Recette traditionnelle, croûtons et fromage fondu.', img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400' }
        ]
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
        address: '25 Rue de la Gaîté, 75014 Paris', // Ajout
        phone: '0143208504',
        menus: [
            { id: '201', name: 'Plateau Saumon', price: 18.50, desc: '12 pièces de sushi et maki pur saumon.', img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400' },
            { id: '202', name: 'Ramen Tonkotsu', price: 15.00, desc: 'Bouillon de porc, nouilles fraîches, œuf mollet.', img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400' }
        ]
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
        address: '110 Rue de la Convention, 75015 Paris',
        phone: '0145571234',
        menus: [
            { id: '301', name: 'Pizza Margherita', price: 12.00, desc: 'Tomate, mozzarella di bufala, basilic frais.', img: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?w=400' },
            { id: '302', name: 'Tiramisu Maison', price: 7.50, desc: 'Mascarpone, café, biscuits cuillères.', img: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400' }
        ]
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
        address: '110 Rue de la Convention, 75015 Paris',
        phone: '0145571234',
        menus: [
            { id: '401', name: 'Double Cheese', price: 12.90, desc: 'Bœuf grillé, double cheddar, cornichons.', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
            { id: '402', name: 'Frites Maison', price: 4.50, desc: 'Pommes de terre fraîches, sel de mer.', img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400' }
        ]
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
        address: '110 Rue de la Convention, 75015 Paris',
        phone: '0145571234',
        menus: [
            { id: '501', name: 'Tacos XL Custom', price: 10.50, desc: '3 viandes au choix, sauce fromagère.', img: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400' },
            { id: '502', name: 'Nachos Supreme', price: 8.00, desc: 'Nachos, guacamole, cheddar fondu.', img: 'https://images.unsplash.com/photo-1513456852971-30c0b81c9d23?w=400' }
        ]
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
        address: '110 Rue de la Convention, 75015 Paris',
        phone: '0145571234',
        menus: [
            { id: '601', name: 'Buddha Bowl', price: 14.00, desc: 'Quinoa, avocat, pois chiches, chou kale.', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400' },
            { id: '602', name: 'Smoothie Vert', price: 6.50, desc: 'Épinards, pomme verte, gingembre.', img: 'https://images.unsplash.com/photo-1515942400420-2b98fed1f515?w=400' }
        ]
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
