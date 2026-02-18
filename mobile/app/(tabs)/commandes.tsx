import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import CardCommand from '@/components/ui/card/CardCommand';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ENDPOINTS } from '@/constants/api';
import { Order } from '@/types/order';
import { useAuth } from '@/context/AuthContext'; // Import du hook d'auth

export default function OrdersScreen() {
    const { token } = useAuth(); // Récupération du token dynamique
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const primaryColor = useThemeColor({}, 'primary');

    const fetchOrders = async () => {
        // Si pas de token, on ne tente même pas l'appel
        if (!token) return;

        try {
            const response = await fetch(ENDPOINTS.ORDERS, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const json = await response.json();
            
            if (json.success) {
                // On trie par date décroissante (plus récent en haut)
                const sortedOrders = (json.data || []).sort((a: Order, b: Order) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setOrders(sortedOrders);
            } else {
                console.log("Erreur API :", json.message);
            }
        } catch (error) {
            console.error("Erreur Fetch Orders :", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Refresh manuel (Pull to refresh)
    const onRefresh = () => {
        setRefreshing(true);
        fetchOrders();
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
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