import { apiRequest } from './api';

export const addressService = {
    getAll: async () => {
        return await apiRequest('/users/addresses', {
            method: 'GET'
        });
    },

    create: async (addressData: { label: string, street: string, city: string, zipCode?: string }) => {
        return await apiRequest('/users/addresses', {
            method: 'POST',
            body: JSON.stringify(addressData)
        });
    },

    delete: async (addressId: string) => {
        return await apiRequest(`/users/addresses/${addressId}`, {
            method: 'DELETE'
        });
    },

    setDefault: async (addressId: string) => {
        return await apiRequest(`/users/addresses/${addressId}/default`, {
            method: 'PATCH',
            body: JSON.stringify({ isDefault: true })
        });
    },
};