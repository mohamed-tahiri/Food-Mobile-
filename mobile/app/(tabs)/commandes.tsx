import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import CardCommand from '@/components/ui/card/CardCommand';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuth } from '@/context/AuthContext';
import { orderService } from '@/services/order.service'; // Import du service
import { Order } from '@/types/order';

export default function OrdersScreen() {
    const { token } = useAuth(); 
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    
    // Theme colors
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const primaryColor = useThemeColor({}, 'primary');

    // Utilisation du SERVICE pour charger les commandes
    const loadOrders = async () => {
        if (!token) return;

        try {
            const res = await orderService.getOrders(); // Plus besoin de passer le token ici car géré par l'intercepteur ou le service centralisé

            if (res.success) {
                // Tri par date (plus récent en haut)
                const sortedOrders = (res.data || []).sort((a: Order, b: Order) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setOrders(sortedOrders);
            } else {
                console.error("Erreur API :", res);
            }
        } catch (error) {
            console.error("Erreur service orders :", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadOrders();
    }, [token]);

    useEffect(() => {
        loadOrders();
    }, [token]);

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Text style={[styles.title, { color: textColor }]}>Mes Commandes</Text>
            
            {loading ? (
                <ActivityIndicator size="large" color={primaryColor} style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => <CardCommand item={item} />}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={primaryColor} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={[styles.emptyText, { color: '#999' }]}>
                                Aucune commande pour le moment 🍕
                            </Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    title: { 
        fontSize: 28, 
        fontWeight: '900', 
        paddingTop: 60, 
        paddingHorizontal: 20, 
        marginBottom: 20,
        letterSpacing: -0.5
    },
    listContent: { 
        paddingHorizontal: 20, 
        paddingBottom: 100 
    },
    emptyContainer: {
        marginTop: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '500'
    }
});