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

export const apiRequest = async (endpoint: string, options: any = {}) => {
    const headers = await getHeaders(options.body instanceof FormData);
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: { ...headers, ...options.headers },
    });
    
    if (response.status === 401) {
        
    }
    
    return await response.json();
};