import React, { createContext, useContext, useState, useMemo } from 'react';
import { MenuItem } from '@/types/menuItem';
import { orderService } from '@/services/order.service';

export interface CartItem extends MenuItem {
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    restaurantId: string | null;
    addToCart: (item: MenuItem, restoId: string) => void;
    removeFromCart: (itemId: string) => void;
    deleteFromCart: (itemId: string) => void;
    clearCart: () => void;
    validateCart: () => Promise<any>;
    totalPrice: number;
    totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [restaurantId, setRestaurantId] = useState<string | null>(null);

    // Calculs dérivés (Memoized pour la performance)
    const totalPrice = useMemo(() => 
        cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    , [cart]);

    const totalItems = useMemo(() => 
        cart.reduce((sum, item) => sum + item.quantity, 0)
    , [cart]);

    const addToCart = (item: MenuItem, restoId: string) => {
        setCart((prevCart) => {
            if (restaurantId && restaurantId !== restoId) {
                // Optionnel : Alert.alert("Panier vidé", "Vous ne pouvez commander que dans un resto à la fois")
                setRestaurantId(restoId);
                return [{ ...item, quantity: 1 }];
            }
            setRestaurantId(restoId);
            const existingItem = prevCart.find((i) => i.id === item.id);
            if (existingItem) {
                return prevCart.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prevCart, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (itemId: string) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((i) => i.id === itemId);
            if (existingItem?.quantity === 1) {
                const newCart = prevCart.filter((i) => i.id !== itemId);
                if (newCart.length === 0) setRestaurantId(null);
                return newCart;
            }
            return prevCart.map((i) =>
                i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
            );
        });
    };

    const deleteFromCart = (itemId: string) => {
        const newCart = cart.filter((i) => i.id !== itemId);
        setCart(newCart);
        if (newCart.length === 0) setRestaurantId(null);
    };

    const clearCart = () => {
        setCart([]);
        setRestaurantId(null);
    };

    const validateCart = async () => {
        if (!restaurantId || cart.length === 0) return null;
        const items = cart.map(item => ({ menuItemId: item.id, quantity: item.quantity }));
        return await orderService.validateCart(restaurantId, items);
    };

    return (
        <CartContext.Provider 
            value={{ 
                cart, 
                restaurantId, 
                addToCart, 
                removeFromCart, 
                deleteFromCart, 
                clearCart, 
                validateCart, 
                totalPrice, 
                totalItems 
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};