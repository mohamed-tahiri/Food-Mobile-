import React, { createContext, useContext, useState } from 'react';
import { Resto } from '@/types/resto';
import { restaurants } from '@/data/dataMocket';

interface FavoriteContextType {
    favorites: Resto[];
    toggleFavorite: (restoId: string) => void;
    isFavorite: (restoId: string) => boolean;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export function FavoriteProvider({ children }: { children: React.ReactNode }) {
    const [favorites, setFavorites] = useState<Resto[]>([]);

    const toggleFavorite = (restoId: string) => {
        setFavorites((prev) => {
            const exists = prev.find((item) => item.id === restoId);
            
            if (exists) {
                // S'il existe, on le retire simplement
                return prev.filter((item) => item.id !== restoId);
            }
            
            // S'il n'existe pas, on cherche l'objet complet dans nos données
            const restoData = restaurants.find((r) => r.id === restoId);
            
            if (restoData) {
                // On l'ajoute avec ses infos complètes
                return [...prev, { ...restoData, isFavorite: true }];
            }
            
            return prev; // Au cas où l'ID ne correspond à rien
        });
    };

    const isFavorite = (restoId: string) => {
        return favorites.some((item) => item.id === restoId);
    };

    return (
        <FavoriteContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
            {children}
        </FavoriteContext.Provider>
    );
}

export const useFavorites = () => {
    const context = useContext(FavoriteContext);
    if (!context) throw new Error('useFavorites must be used within a FavoriteProvider');
    return context;
};