import { apiRequest } from './api';

export const notificationService = {
    getNotifications: async () => {
        return await apiRequest('/notifications', {
            method: 'GET'
        });
    },

    registerPushToken: async (token: string, platform: string) => {
        return await apiRequest('/notifications/register-token', {
            method: 'POST',
            body: JSON.stringify({
                token,
                platform,
                deviceName: 'Mobile App'
            })
        });
    }
};