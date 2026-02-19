import { apiRequest } from './api';
import { Order } from '@/types/order';

export const orderService = {
    /**
     * Récupère toutes les commandes de l'utilisateur connecté
     */
    getOrders: async (): Promise<{ success: boolean; data: Order[] }> => {
        return apiRequest('/orders');
    },

    /**
     * Récupère les détails d'une commande spécifique
     */
    getOrderById: async (id: string): Promise<{ success: boolean; data: Order }> => {
        return apiRequest(`/orders/${id}`);
    },

    /**
     * Crée une nouvelle commande
     */
    createOrder: async (orderData: {
        restaurantId: string;
        items: { menuItemId: string; quantity: number }[];
        deliveryAddress: any;
        paymentMethod: string;
        tip?: number;
        deliveryInstructions?: string;
    }): Promise<{ success: boolean; data: Order }> => {
        return apiRequest('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
    },

    /**
     * Valide le panier avant de passer à l'écran de paiement
     */
    validateCart: async (restaurantId: string, items: any[]) => {
        return apiRequest('/cart/validate', {
            method: 'POST',
            body: JSON.stringify({ restaurantId, items }),
        });
    },

    /**
     * Annule une commande (si le statut le permet)
     */
    cancelOrder: async (id: string) => {
        return apiRequest(`/orders/${id}/cancel`, {
            method: 'POST',
        });
    },

    /**
     * Suivi en temps réel de la commande (position livreur, etc.)
     */
    trackOrder: async (id: string) => {
        return apiRequest(`/orders/${id}/track`);
    }
};