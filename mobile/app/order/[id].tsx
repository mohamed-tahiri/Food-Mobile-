import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ChevronLeft, Package, CreditCard } from 'lucide-react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function OrderDetailScreen() {
    const { id, store, price, status, date } = useLocalSearchParams();
    const router = useRouter();

    // Couleurs thématiques
    const backgroundColor = useThemeColor({}, 'background');
    const cardBg = useThemeColor({}, 'card');
    const headerBg = useThemeColor({}, 'tabBar');
    const textColor = useThemeColor({}, 'text');
    const textMuted = useThemeColor({}, 'textMuted');
    const primaryColor = useThemeColor({}, 'primary');
    const borderColor = useThemeColor({}, 'border');

    const items = [
        { id: 1, name: 'Menu Burger XL', qty: 1, p: '15.50 €' },
        { id: 2, name: 'Coca Cola 33cl', qty: 1, p: '2.50 €' },
        { id: 3, name: 'Supplément Sauce', qty: 2, p: '1.00 €' },
    ];

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={[styles.header, { backgroundColor: headerBg }]}>
                <TouchableOpacity
                    style={[styles.backBtn, { backgroundColor: borderColor }]}
                    onPress={() => router.back()}
                >
                    <ChevronLeft color={textColor} size={24} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: textColor }]}>
                    Détails de la commande
                </Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Statut Card */}
                <View style={[styles.statusCard, { backgroundColor: cardBg }]}>
                    <Package color={primaryColor} size={40} />
                    {/* Le statut reste vert pour le succès, mais on peut ajuster si besoin */}
                    <Text style={styles.statusText}>{status}</Text>
                    <Text style={[styles.orderRef, { color: textMuted }]}>
                        Commande #{id}
                    </Text>
                </View>

                {/* Info Restaurant */}
                <View style={[styles.section, { backgroundColor: cardBg }]}>
                    <Text style={[styles.sectionTitle, { color: textMuted }]}>
                        Restaurant
                    </Text>
                    <Text style={[styles.storeName, { color: textColor }]}>
                        {store}
                    </Text>
                    <Text style={[styles.dateText, { color: textMuted }]}>
                        {date}
                    </Text>
                </View>

                {/* Articles */}
                <View style={[styles.section, { backgroundColor: cardBg }]}>
                    <Text style={[styles.sectionTitle, { color: textMuted }]}>
                        Articles
                    </Text>
                    {items.map((item) => (
                        <View key={item.id} style={styles.itemRow}>
                            <Text style={[styles.qty, { color: primaryColor }]}>
                                {item.qty}x
                            </Text>
                            <Text
                                style={[styles.itemName, { color: textColor }]}
                            >
                                {item.name}
                            </Text>
                            <Text
                                style={[styles.itemPrice, { color: textColor }]}
                            >
                                {item.p}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Résumé Paiement */}
                <View style={[styles.section, { backgroundColor: cardBg }]}>
                    <View
                        style={[
                            styles.totalRow,
                            { borderTopColor: borderColor },
                        ]}
                    >
                        <Text style={[styles.totalLabel, { color: textColor }]}>
                            Total payé
                        </Text>
                        <Text
                            style={[styles.totalValue, { color: primaryColor }]}
                        >
                            {price}
                        </Text>
                    </View>
                    <View style={styles.paymentMethod}>
                        <CreditCard size={16} color={textMuted} />
                        <Text
                            style={[styles.paymentText, { color: textMuted }]}
                        >
                            Payé via Apple Pay (**** 1234)
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    backBtn: { padding: 8, borderRadius: 12 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 15 },
    scrollContent: { padding: 20 },
    statusCard: {
        alignItems: 'center',
        padding: 25,
        borderRadius: 20,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    statusText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#4CAF50', // Vert de succès
    },
    orderRef: { marginTop: 5 },
    section: {
        padding: 20,
        borderRadius: 20,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    storeName: { fontSize: 18, fontWeight: 'bold' },
    dateText: { marginTop: 4 },
    itemRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
    qty: { fontWeight: 'bold', width: 30 },
    itemName: { flex: 1 },
    itemPrice: { fontWeight: '500' },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        paddingTop: 15,
        marginTop: 10,
    },
    totalLabel: { fontSize: 18, fontWeight: 'bold' },
    totalValue: { fontSize: 18, fontWeight: 'bold' },
    paymentMethod: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
    },
    paymentText: { fontSize: 12, marginLeft: 8 },
});
