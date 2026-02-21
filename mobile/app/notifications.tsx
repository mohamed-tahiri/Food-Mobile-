import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, Bell, Tag, Info, Star, Trash2 } from 'lucide-react-native';
import { useNotifications } from '@/hooks/use-notifications';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function NotificationsScreen() {
    const router = useRouter();
    const { notifications, isLoading, refresh } = useNotifications();

    // Thème
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const textMuted = useThemeColor({}, 'textMuted');
    const cardColor = useThemeColor({}, 'card');
    const primaryColor = useThemeColor({}, 'primary');
    const borderColor = useThemeColor({}, 'border');

    // Helper pour l'icône selon le type de notification
    const getIcon = (type: string) => {
        switch (type) {
            case 'promotion': return <Tag size={20} color="#FF9500" />;
            case 'new_restaurant': return <Star size={20} color="#FFCC00" />;
            default: return <Info size={20} color={primaryColor} />;
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity 
            style={[styles.notifCard, { backgroundColor: cardColor, borderBottomColor: borderColor }]}
            activeOpacity={0.7}
            onPress={() => {
                if (item.data?.restaurantId) {
                    router.push(`/restaurant/${item.data.restaurantId}`);
                }
            }}
        >
            <View style={[styles.iconContainer, { backgroundColor: backgroundColor }]}>
                {getIcon(item.type)}
            </View>
            
            <View style={styles.notifContent}>
                <View style={styles.notifHeader}>
                    <Text style={[styles.notifTitle, { color: textColor }]} numberOfLines={1}>
                        {item.title}
                    </Text>
                    {!item.isRead && <View style={[styles.unreadDot, { backgroundColor: primaryColor }]} />}
                </View>
                
                <Text style={[styles.notifBody, { color: textMuted }]} numberOfLines={2}>
                    {item.body}
                </Text>
                
                <Text style={[styles.notifDate, { color: textMuted }]}>
                    {new Date(item.createdAt).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Stack.Screen 
                options={{
                    headerShown: true,
                    title: 'Notifications',
                    headerTitleAlign: 'center',
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor },
                    headerTitleStyle: { 
                        color: textColor,
                        fontSize: 18,
                        fontWeight: 'bold' 
                    },
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                            <ChevronLeft color={textColor} size={24} />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity onPress={() => {

                        }} style={styles.backBtn}>
                            <Trash2 color={textMuted} size={20} />
                        </TouchableOpacity>
                    )
                }} 
            />

            {isLoading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={primaryColor} />
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <View style={[styles.emptyIconCircle, { backgroundColor: cardColor }]}>
                                <Bell size={40} color={textMuted} />
                            </View>
                            <Text style={[styles.emptyTitle, { color: textColor }]}>Aucune notification</Text>
                            <Text style={[styles.emptySubtitle, { color: textMuted }]}>
                                Vous serez informé ici de vos promos et du suivi de vos commandes.
                            </Text>
                        </View>
                    }
                    onRefresh={refresh}
                    refreshing={isLoading}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContent: { paddingBottom: 30 },
    backBtn: { padding: 8 },
    notifCard: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        alignItems: 'center',
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    notifContent: { flex: 1 },
    notifHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    notifTitle: { fontSize: 16, fontWeight: '700', flex: 1, marginRight: 10 },
    unreadDot: { width: 8, height: 8, borderRadius: 4 },
    notifBody: { fontSize: 14, lineHeight: 20, marginBottom: 6 },
    notifDate: { fontSize: 11, fontWeight: '500' },
    emptyState: { flex: 1, marginTop: 100, alignItems: 'center', paddingHorizontal: 40 },
    emptyIconCircle: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    emptyTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    emptySubtitle: { textAlign: 'center', lineHeight: 22, fontSize: 15 }
});