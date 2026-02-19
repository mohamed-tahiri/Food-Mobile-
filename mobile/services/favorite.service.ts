/** Developper Par M.TAHIRI (CK) */

import { apiRequest } from './api';
import { Resto } from '@/types/resto';

export const favoriteService = {
    /**
     * Récupère la liste des restaurants favoris de l'utilisateur
     */
    getFavorites: async (): Promise<{ success: boolean; data: Resto[] }> => {
        return apiRequest('/user/favorites');
    },

    /**
     * Ajoute un restaurant aux favoris
     */
    addFavorite: async (restaurantId: string): Promise<{ success: boolean }> => {
        return apiRequest('/favorites', {
            method: 'POST',
            body: JSON.stringify({ restaurantId }),
        });
    },

    /**
     * Retire un restaurant des favoris
     */
    removeFavorite: async (restaurantId: string): Promise<{ success: boolean }> => {
        return apiRequest(`/favorites/${restaurantId}`, {
            method: 'DELETE',
        });
    }
};