import * as SecureStore from 'expo-secure-store';

export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.16.30.28:4000';

const getHeaders = async (isUpload = false) => {
    const token = await SecureStore.getItemAsync('userToken');
    const headers: any = {
        'Accept': 'application/json',
        ...(isUpload ? {} : { 'Content-Type': 'application/json' }),
    };

    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
};

/**
 * Fonction pour rafraîchir le token
 */
const refreshToken = async () => {
    try {
        const refresh_token = await SecureStore.getItemAsync('userRefreshToken');
        if (!refresh_token) return null;

        const response = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: refresh_token }),
        });

        const json = await response.json();

        if (json.success && json.data.accessToken) {
            // Sauvegarder le nouveau token
            await SecureStore.setItemAsync('userToken', json.data.accessToken);
            return json.data.accessToken;
        }
        return null;
    } catch (error) {
        console.error("Erreur lors du refresh token:", error);
        return null;
    }
};

export const apiRequest = async (endpoint: string, options: any = {}) => {
    let headers = await getHeaders(options.body instanceof FormData);
    
    let response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: { ...headers, ...options.headers },
    });

    // INTERCEPTION 401 (Token expiré)
    if (response.status === 401) {
        console.log(`[API] Token expiré pour ${endpoint}, tentative de refresh...`);
        
        const newToken = await refreshToken();

        if (newToken) {
            // Si on a un nouveau token, on met à jour les headers et on rejoue la requête
            const retryHeaders = await getHeaders(options.body instanceof FormData);
            response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers: { ...retryHeaders, ...options.headers },
            });
        } else {
            // Si le refresh échoue, Mohamed doit se reconnecter
            console.warn("[API] Refresh échoué, déconnexion requise.");
            await SecureStore.deleteItemAsync('userToken');
            await SecureStore.deleteItemAsync('userRefreshToken');
            // Optionnel: Déclencher une redirection vers Login ici si nécessaire
        }
    }

    return await response.json();
};