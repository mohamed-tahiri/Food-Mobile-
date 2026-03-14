import { useState, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { notificationService } from '@/services/notification.service'; // Import du service

export interface NotificationItem {
    id: string;
    title: string;
    body: string;
    type: 'promotion' | 'new_restaurant' | 'order_update';
    isRead: boolean;
    createdAt: string;
    data?: any;
}

export const useNotifications = () => {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isSimulated, setIsSimulated] = useState(false);

    const refresh = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await notificationService.getNotifications();
            
            let fetchedNotifs: NotificationItem[] = [];
            if (response.success) {
                fetchedNotifs = response.data;
                setNotifications(fetchedNotifs);
            }

            const [badge, scheduled] = await Promise.all([
                Notifications.getBadgeCountAsync(),
                Notifications.getAllScheduledNotificationsAsync(),
            ]);

            const countFromApi = fetchedNotifs.filter(n => !n.isRead).length;
            setUnreadCount(countFromApi || badge);

            console.log(`[Notif] Data fetched: ${fetchedNotifs.length}, Scheduled: ${scheduled.length}`);
            
            setIsSimulated(Platform.OS === 'ios' || Platform.OS === 'android' ? false : true);
            
            if (Platform.OS !== 'web') {
                await Notifications.setBadgeCountAsync(countFromApi);
            }

        } catch (error) {
            console.error("useNotifications Error:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const requestPermissions = async () => {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status === 'granted') {
            refresh();
        }
        return status;
    };

    return { 
        notifications, 
        unreadCount, 
        isLoading, 
        isSimulated, 
        refresh, 
        requestPermissions 
    };
};