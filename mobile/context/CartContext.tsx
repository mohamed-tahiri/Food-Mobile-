import React, { createContext, useContext, useState, useMemo } from 'react';
import { MenuItem } from '@/types/menuItem';

// On définit la structure d'un élément du panier
export interface CartItem extends MenuItem {
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: MenuItem) => void;
    removeFromCart: (itemId: string) => void;
    deleteFromCart: (itemId: string) => void;
    clearCart: () => void;
    totalPrice: number;
    totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    // Ajouter au panier
    const addToCart = (item: MenuItem) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((i) => i.id === item.id);
            if (existingItem) {
                return prevCart.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prevCart, { ...item, quantity: 1 }];
        });
    };

    // Supprimer/Diminuer
    const removeFromCart = (itemId: string) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((i) => i.id === itemId);
            if (existingItem?.quantity === 1) {
                return prevCart.filter((i) => i.id !== itemId);
            }
            return prevCart.map((i) =>
                i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
            );
        });
    };
    
    const deleteFromCart = (itemId: string) => {
        setCart((prevCart) => prevCart.filter((i) => i.id !== itemId));
    };

    const clearCart = () => setCart([]);

    const totalPrice = useMemo(() => 
        cart.reduce((sum, item) => {
            const priceValue = typeof item.price === 'string' 
                ? parseFloat(item.price) 
                : item.price; 
                
            return sum + (priceValue * item.quantity);
        }, 0), 
    [cart]);

    const totalItems = useMemo(() => 
        cart.reduce((sum, item) => sum + item.quantity, 0), 
    [cart]);

    return (
        <CartContext.Provider 
            value={{ 
                cart, 
                addToCart, 
                removeFromCart, 
                clearCart, 
                deleteFromCart,
                totalPrice, 
                totalItems 
            }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};