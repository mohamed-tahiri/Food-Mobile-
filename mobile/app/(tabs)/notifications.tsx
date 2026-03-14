import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, ShieldCheck, Cpu } from 'lucide-react-native';
import { useNotifications } from '@/hooks/use-notifications';
import { useThemeColor } from '@/hooks/use-theme-color';
import NotificationCard from '@/components/ui/card/NotificationCard';
import EmptyNotifications from '@/components/ui/notifs/EmptyNotifications';

export default function NotificationsScreen() {
    const router = useRouter();
    const { notifications, isLoading, refresh, requestPermissions, isSimulated } = useNotifications();

    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const primaryColor = useThemeColor({}, 'primary');
    const cardColor = useThemeColor({}, 'card');

    useEffect(() => {
        refresh();
    }, [refresh]); 

    const handleInitPermissions = async () => {
        const status = await requestPermissions();
        if (status === 'granted') {
            Alert.alert("Succès", "Notifications activées !");
        }
    };

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Stack.Screen 
                options={{
                    headerTitle: 'Notifications',
                    headerShadowVisible: false, 
                    headerStyle: { backgroundColor },
                    headerTitleStyle: { fontWeight: 'bold', color: textColor },
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                            <ChevronLeft color={textColor} size={24} />
                        </TouchableOpacity>
                    ),
                }} 
            />

            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                onRefresh={refresh}
                refreshing={isLoading}
                ListHeaderComponent={
                    <View style={[styles.statusBanner, { backgroundColor: cardColor }]}>
                        <View style={styles.statusRow}>
                            <Cpu size={14} color={isSimulated ? "#FF9500" : "#4CAF50"} />
                            <Text style={[styles.statusText, { color: textColor }]}>
                                Mode: {isSimulated ? "Simulateur" : "Device Réel"}
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.permissionBtn} onPress={handleInitPermissions}>
                            <ShieldCheck size={16} color={primaryColor} />
                            <Text style={[styles.permissionBtnText, { color: primaryColor }]}>Configurer</Text>
                        </TouchableOpacity>
                    </View>
                }
                renderItem={({ item }) => <NotificationCard item={item} />}
                ListEmptyComponent={!isLoading ? <EmptyNotifications /> : null}
                ListFooterComponent={isLoading ? <ActivityIndicator color={primaryColor} style={{ marginTop: 20 }} /> : null}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1,
    },
    backBtn: {
        padding: 8,
        marginLeft: -8,
    },
    center: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    listContent: {
        paddingBottom: 120, 
        flexGrow: 1, 
    },
    statusBanner: { 
        marginTop: 56,
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        padding: 12, 
        margin: 16, 
        borderRadius: 12,
        alignItems: 'center',
        // Petite ombre pour le relief
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    statusText: { fontSize: 12, fontWeight: '600' },
    permissionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, padding: 6 },
    permissionBtnText: { fontSize: 12, fontWeight: 'bold' }
});