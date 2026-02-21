import { useState, useEffect } from 'react';
import { notificationService } from '@/services/notification.service';

export function useNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const res = await notificationService.getNotifications();
            if (res.success) {
                setNotifications(res.data);
                const unread = res.data.filter((n: any) => !n.isRead).length;
                setUnreadCount(unread);
            }
        } catch (error) {
            console.error("Erreur chargement notifications:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return { notifications, unreadCount, isLoading, refresh: fetchNotifications };
}