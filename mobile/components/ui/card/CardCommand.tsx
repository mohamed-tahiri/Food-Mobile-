import React from 'react';
import { ShoppingBag } from 'lucide-react-native';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Order } from '@/types/order';
import { useThemeColor } from '@/hooks/use-theme-color';

interface CardCommandProps {
    item: Order;
}

export default function CardCommand({ item }: CardCommandProps) {
    const router = useRouter();

    // 1. Récupération des couleurs du thème
    const cardBg = useThemeColor({}, 'card');
    const textColor = useThemeColor({}, 'text');
    const textMuted = useThemeColor({}, 'textMuted');
    const primaryColor = useThemeColor({}, 'primary');
    const primaryLight = useThemeColor({}, 'primaryLight');

    // Couleur dynamique selon le statut (Le vert reste vert, l'orange suit le thème)
    const statusColor = item.status === 'Livré' ? '#4CAF50' : primaryColor;

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.orderCard, { backgroundColor: cardBg }]}
            onPress={() =>
                router.push({
                    pathname: '/order/[id]',
                    params: {
                        id: item.id,
                        store: item.store,
                        price: item.price,
                        status: item.status,
                        date: item.date,
                    },
                })
            }
        >
            <View
                style={[
                    styles.iconContainer,
                    { backgroundColor: primaryLight },
                ]}
            >
                <ShoppingBag color={primaryColor} size={22} />
            </View>

            <View style={styles.orderInfo}>
                <Text
                    style={[styles.storeName, { color: textColor }]}
                    numberOfLines={1}
                >
                    {item.store}
                </Text>
                <Text style={[styles.orderDate, { color: textMuted }]}>
                    {item.date}
                </Text>
            </View>

            <View style={styles.orderPriceSection}>
                <Text style={[styles.price, { color: textColor }]}>
                    {item.price}
                </Text>
                <View
                    style={[
                        styles.statusBadge,
                        { backgroundColor: statusColor + '15' },
                    ]}
                >
                    <Text style={[styles.statusText, { color: statusColor }]}>
                        {item.status}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    orderCard: {
        flexDirection: 'row',
        padding: 15,
        borderRadius: 18,
        marginBottom: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    iconContainer: {
        padding: 12,
        borderRadius: 14,
    },
    orderInfo: {
        marginLeft: 15,
        flex: 1,
    },
    storeName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    orderDate: {
        fontSize: 13,
        marginTop: 2,
    },
    orderPriceSection: {
        alignItems: 'flex-end',
    },
    price: {
        fontWeight: 'bold',
        fontSize: 15,
        marginBottom: 5,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 11,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
});
