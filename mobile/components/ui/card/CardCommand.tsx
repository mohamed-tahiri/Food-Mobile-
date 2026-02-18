import React from 'react';
import { Image, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Order } from '@/types/order';
import { useThemeColor } from '@/hooks/use-theme-color';

interface CardCommandProps {
    item: Order;
}

export default function CardCommand({ item }: CardCommandProps) {
    const router = useRouter();
    const cardBg = useThemeColor({}, 'card');
    const textColor = useThemeColor({}, 'text');
    const textMuted = useThemeColor({}, 'textMuted');
    const primaryColor = useThemeColor({}, 'primary');

    // On adapte aux statuts réels de la timeline JSON
    const getStatusDetails = (status: string) => {
        const config: Record<string, { label: string; color: string }> = {
            pending:    { label: 'Reçue', color: textMuted },
            confirmed:  { label: 'Confirmée', color: '#4A90E2' },
            preparing:  { label: 'En cuisine', color: '#FFB300' },
            ready:      { label: 'Prête', color: '#9C27B0' },
            picked_up:  { label: 'Récupérée', color: '#00BCD4' },
            delivering: { label: 'En livraison', color: primaryColor },
            delivered:  { label: 'Livrée', color: '#4CAF50' },
        };
        return config[status] || { label: status, color: primaryColor };
    };

    const status = getStatusDetails(item.status);

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.orderCard, { backgroundColor: cardBg }]}
            onPress={() => router.push(`/order/${item.id}`)}
        >
            <Image 
                source={{ uri: item.restaurantImage }} 
                style={styles.restaurantImg} 
            />

            <View style={styles.orderInfo}>
                <Text style={[styles.storeName, { color: textColor }]} numberOfLines={1}>
                    {item.restaurantName}
                </Text>
                <Text style={[styles.orderDate, { color: textMuted }]}>
                    {new Date(item.createdAt).toLocaleDateString('fr-FR')} • {item.items.length} {item.items.length > 1 ? 'articles' : 'article'}
                </Text>
            </View>

            <View style={styles.orderPriceSection}>
                <Text style={[styles.price, { color: textColor }]}>
                    {item.total.toFixed(2)} €
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: status.color + '15' }]}>
                    <Text style={[styles.statusText, { color: status.color }]}>
                        {status.label}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    orderCard: {
        flexDirection: 'row',
        padding: 12,
        borderRadius: 20,
        marginBottom: 16,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    restaurantImg: { 
        width: 55, 
        height: 55, 
        borderRadius: 14,
        backgroundColor: '#f0f0f0' 
    },
    orderInfo: { 
        marginLeft: 15, 
        flex: 1 
    },
    storeName: { 
        fontWeight: 'bold', 
        fontSize: 16 
    },
    orderDate: { 
        fontSize: 13, 
        marginTop: 4 
    },
    orderPriceSection: { 
        alignItems: 'flex-end' 
    },
    price: { 
        fontWeight: '800', 
        fontSize: 15, 
        marginBottom: 6 
    },
    statusBadge: { 
        paddingHorizontal: 10, 
        paddingVertical: 5, 
        borderRadius: 10 
    },
    statusText: { 
        fontSize: 10, 
        fontWeight: 'bold', 
        textTransform: 'uppercase' 
    },
});