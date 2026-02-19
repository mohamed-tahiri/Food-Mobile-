import React, { createContext, useContext, useState, useEffect } from 'react';
import { Resto } from '@/types/resto';
import { favoriteService } from '@/services/favorite.service';
import { useAuth } from '@/context/AuthContext';

interface FavoriteContextType {
    favorites: Resto[];
    toggleFavorite: (restoId: string) => Promise<void>;
    isFavorite: (restoId: string) => boolean;
    isLoading: boolean;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export function FavoriteProvider({ children }: { children: React.ReactNode }) {
    const [favorites, setFavorites] = useState<Resto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { token } = useAuth();



    useEffect(() => {
        const loadFavorites = async () => {
            if (token) {
                const res = await favoriteService.getFavorites();
                
                if (res.success) setFavorites(res.data);
            } else {
                setFavorites([]);
            }
            setIsLoading(false);
        };
        loadFavorites();
    }, [token]);

    const toggleFavorite = async (restoId: string) => {
        const alreadyFavorite = isFavorite(restoId);

        try {
            if (alreadyFavorite) {
                setFavorites(prev => prev.filter(item => item.id !== restoId));
                await favoriteService.removeFavorite(restoId);
            } else {
                const res = await favoriteService.addFavorite(restoId);
                if (res.success) {
                    const updatedList = await favoriteService.getFavorites();
                    if (updatedList.success) setFavorites(updatedList.data);
                }
            }
        } catch (error) {
            console.error("Erreur toggle favorite:", error);
        }
    };

    const isFavorite = (restoId: string) => {
        return favorites.some((item) => item.id === restoId);
    };

    return (
        <FavoriteContext.Provider value={{ favorites, toggleFavorite, isFavorite, isLoading }}>
            {children}
        </FavoriteContext.Provider>
    );
}

export const useFavorites = () => {
    const context = useContext(FavoriteContext);
    if (!context) throw new Error('useFavorites must be used within a FavoriteProvider');
    return context;
};