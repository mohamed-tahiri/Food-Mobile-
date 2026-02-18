import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    token: string | null;
    user: User | null;
    signIn: (token: string, user: User) => Promise<void>;
    signOut: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        async function loadStorageData() {
            try {
                const [storedToken, storedUser] = await Promise.all([
                    SecureStore.getItemAsync('userToken'),
                    SecureStore.getItemAsync('userData')
                ]);

                if (storedToken) setToken(storedToken);
                if (storedUser) setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Erreur chargement stockage", e);
            } finally {
                setIsLoading(false);
            }
        }
        loadStorageData();
    }, []);

    useEffect(() => {
        if (isLoading) return;
        const inAuthGroup = segments[0] === '(tabs)' || segments[0] === 'order' || segments[0] === 'cart';

        if (!token && inAuthGroup) {
            router.replace('/login');
        } else if (token && segments[0] === 'login') {
            router.replace('/(tabs)');
        }
    }, [token, segments, isLoading]);

    const signIn = async (newToken: string, userData: User) => {
        await SecureStore.setItemAsync('userToken', newToken);
        await SecureStore.setItemAsync('userData', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
    };

    const signOut = async () => {
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('userData');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, signIn, signOut, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);