import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Linking,
    Alert,
    RefreshControl,
    SafeAreaView
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import {
    ChevronLeft,
    MapPin,
    Phone,
    Star,
    Info,
    Car,
    ShoppingBag,
    Clock,
    CreditCard
} from 'lucide-react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { orderService } from '@/services/order.service';
import { Order } from '@/types/order';

export default function OrderDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const backgroundColor = useThemeColor({}, 'background');
    const cardBg = useThemeColor({}, 'card');
    const textColor = useThemeColor({}, 'text');
    const textMuted = useThemeColor({}, 'textMuted');
    const primaryColor = useThemeColor({}, 'primary');
    const borderColor = useThemeColor({}, 'border');

    const loadOrderData = useCallback(async (silent = false) => {
        if (!silent) setError(null);
        try {
            const res = await orderService.getOrderById(id as string);
            if (res.success) {
                console.log("Order data refreshed:", res.data);
                setOrder(res.data);
            } else {
                setError("Commande introuvable.");
            }
        } catch (err) {
            setError("Erreur de connexion au serveur.");
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [id]);

    useEffect(() => {
        loadOrderData();
        const interval = setInterval(() => {
            if (order?.status !== 'delivered' && order?.status !== 'cancelled') {
                loadOrderData(true);
            }
        }, 15000);
        return () => clearInterval(interval);
    }, [loadOrderData, order?.status]);

    const handleCallDriver = () => {
        if (order?.driverInfo?.phone) {
            Linking.openURL(`tel:${order.driverInfo.phone}`);
        } else {
            Alert.alert("Oups", "Le numéro du livreur n'est pas disponible.");
        }
    };

    if (isLoading) return (
        <View style={[styles.center, { backgroundColor }]}>
            <ActivityIndicator size="large" color={primaryColor} />
        </View>
    );

    if (error || !order) return (
        <View style={[styles.center, { backgroundColor }]}>
            <Text style={{ color: textColor, marginBottom: 20 }}>{error}</Text>
            <TouchableOpacity
                onPress={() => loadOrderData()}
                style={[styles.retryBtn, { backgroundColor: primaryColor }]}
            >
                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Réessayer</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Stack.Screen options={{ headerShown: false }} />

            <SafeAreaView style={{ backgroundColor }}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={[styles.backBtn, { backgroundColor: cardBg }]}
                        onPress={() => router.back()}
                    >
                        <ChevronLeft color={textColor} size={24} />
                    </TouchableOpacity>
                    <View style={{ flex: 1, marginLeft: 15 }}>
                        <Text style={[styles.headerTitle, { color: textColor }]}>
                            Commande #{order.orderNumber.split('-').pop()}
                        </Text>
                        <Text style={{ color: textMuted, fontSize: 13 }}>
                            {order.restaurantName}
                        </Text>
                    </View>
                </View>
            </SafeAreaView>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={() => { setIsRefreshing(true); loadOrderData(); }}
                        tintColor={primaryColor}
                    />
                }
            >
                <View style={[styles.section, { backgroundColor: cardBg }]}>
                    <Text style={[styles.sectionTitle, { color: textMuted }]}>
                        État de la livraison
                    </Text>
                    {order.timeline?.map((step, index) => {
                        const isLast = index === order.timeline.length - 1;
                        return (
                            <View key={index} style={styles.timelineRow}>
                                <View style={styles.timelineLeft}>
                                    <View style={[
                                        styles.dot,
                                        { backgroundColor: isLast ? primaryColor : borderColor }
                                    ]} />
                                    {!isLast && (
                                        <View style={[styles.line, { backgroundColor: borderColor }]} />
                                    )}
                                </View>
                                <View style={styles.timelineRight}>
                                    <Text style={[
                                        styles.timelineStatus,
                                        {
                                            color: isLast ? textColor : textMuted,
                                            fontWeight: isLast ? '700' : '400'
                                        }
                                    ]}>
                                        {step.message}
                                    </Text>
                                    <Text style={{ color: textMuted, fontSize: 11 }}>
                                        {new Date(step.timestamp).toLocaleTimeString('fr-FR', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
                </View>

                {order.driverInfo && (
                    <View style={[styles.section, { backgroundColor: cardBg }]}>
                        <Text style={[styles.sectionTitle, { color: textMuted }]}>
                            Votre Livreur
                        </Text>

                        {/* Ligne principale : avatar + nom + bouton appel */}
                        <View style={styles.driverRow}>
                            <Image
                                source={{ uri: order.driverInfo.avatar }}
                                style={styles.driverAvatar}
                            />
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={[styles.driverName, { color: textColor }]}>
                                    {order.driverInfo.name}
                                </Text>
                                <View style={styles.driverMeta}>
                                    <Star size={14} color="#FFB300" fill="#FFB300" />
                                    <Text style={{ color: textMuted, fontSize: 12 }}>
                                        {' '}{order.driverInfo.rating} · Livreur Partenaire
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={[styles.callBtn, { backgroundColor: primaryColor }]}
                                onPress={handleCallDriver}
                                activeOpacity={0.7}
                            >
                                <Phone size={18} color="#FFF" />
                            </TouchableOpacity>
                        </View>

                        {/* Détails véhicule */}
                        <View style={[styles.vehicleInfo, { borderTopColor: borderColor }]}>
                            <View style={styles.vehicleSubRow}>
                                <Car size={16} color={textMuted} />
                                <Text style={[styles.vehicleLabel, { color: textMuted }]}>
                                    Véhicule :
                                </Text>
                                <Text style={[styles.vehicleValue, { color: textColor }]}>
                                    {order.driverInfo.vehicle}
                                </Text>
                            </View>

                            {/* Plaque uniquement si elle existe */}
                            {order.driverInfo.licensePlate && (
                                <View style={styles.vehicleSubRow}>
                                    <CreditCard size={16} color={textMuted} />
                                    <Text style={[styles.vehicleLabel, { color: textMuted }]}>
                                        Plaque :
                                    </Text>
                                    <Text style={[
                                        styles.vehicleValue,
                                        { color: textColor, fontWeight: '800' }
                                    ]}>
                                        {order.driverInfo.licensePlate}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                )}

                {/* 3. ARTICLES */}
                <View style={[styles.section, { backgroundColor: cardBg }]}>
                    <View style={styles.sectionHeaderRow}>
                        <ShoppingBag size={16} color={textMuted} />
                        <Text style={[
                            styles.sectionTitle,
                            { color: textMuted, marginBottom: 0, marginLeft: 8 }
                        ]}>
                            Détail des articles
                        </Text>
                    </View>
                    {order.items.map((item, idx) => (
                        <View key={idx} style={styles.itemRow}>
                            <View style={[
                                styles.qtyCircle,
                                { backgroundColor: primaryColor + '15' }
                            ]}>
                                <Text style={{
                                    color: primaryColor,
                                    fontWeight: 'bold',
                                    fontSize: 12
                                }}>
                                    {item.quantity}
                                </Text>
                            </View>
                            <Text
                                style={[styles.itemName, { color: textColor }]}
                                numberOfLines={1}
                            >
                                {item.menuItem.name}
                            </Text>
                            <Text style={[styles.itemPrice, { color: textColor }]}>
                                {item.totalPrice.toFixed(2)} €
                            </Text>
                        </View>
                    ))}
                </View>

                {/* 4. ADRESSE & PAIEMENT */}
                <View style={[styles.section, { backgroundColor: cardBg }]}>
                    <Text style={[styles.sectionTitle, { color: textMuted }]}>
                        Adresse & Paiement
                    </Text>

                    <View style={styles.addressRow}>
                        <MapPin size={18} color={primaryColor} />
                        <Text style={[styles.addressText, { color: textColor }]}>
                            {order.deliveryAddress.street}, {order.deliveryAddress.city}
                        </Text>
                    </View>

                    {order.deliveryInstructions && (
                        <View style={[
                            styles.instructionCard,
                            { backgroundColor: backgroundColor + '60' }
                        ]}>
                            <Info size={14} color={textMuted} />
                            <Text style={[styles.instructionText, { color: textMuted }]}>
                                {order.deliveryInstructions}
                            </Text>
                        </View>
                    )}

                    <View style={[styles.divider, { backgroundColor: borderColor }]} />

                    <View style={styles.priceRow}>
                        <Text style={{ color: textMuted }}>Sous-total</Text>
                        <Text style={{ color: textColor }}>{order.subtotal.toFixed(2)} €</Text>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={{ color: textMuted }}>Livraison</Text>
                        <Text style={{ color: textColor }}>{order.deliveryFee.toFixed(2)} €</Text>
                    </View>
                    {order.tip > 0 && (
                        <View style={styles.priceRow}>
                            <Text style={{ color: textMuted }}>Pourboire</Text>
                            <Text style={{ color: textColor }}>{order.tip.toFixed(2)} €</Text>
                        </View>
                    )}

                    <View style={[styles.priceRow, { marginTop: 10 }]}>
                        <Text style={[styles.totalLabel, { color: textColor }]}>Total</Text>
                        <Text style={[styles.totalValue, { color: primaryColor }]}>
                            {order.total.toFixed(2)} €
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 10 },
    backBtn: { padding: 10, borderRadius: 15 },
    headerTitle: { fontSize: 18, fontWeight: '900' },
    scrollContent: { padding: 20, paddingBottom: 60 },
    section: {
        padding: 20, borderRadius: 28, marginBottom: 15,
        elevation: 2, shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05, shadowRadius: 10
    },
    sectionTitle: {
        fontSize: 11, fontWeight: '800', marginBottom: 15,
        textTransform: 'uppercase', letterSpacing: 1
    },
    sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    // Timeline
    timelineRow: { flexDirection: 'row', minHeight: 45 },
    timelineLeft: { alignItems: 'center', width: 20, marginRight: 15 },
    dot: { width: 8, height: 8, borderRadius: 4 },
    line: { width: 2, flex: 1, marginVertical: -2 },
    timelineRight: { flex: 1, paddingBottom: 15 },
    timelineStatus: { fontSize: 14 },
    // Livreur
    driverRow: { flexDirection: 'row', alignItems: 'center' },
    driverAvatar: { width: 48, height: 48, borderRadius: 24 },
    driverName: { fontSize: 16, fontWeight: '700' },
    driverMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
    callBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    vehicleInfo: { marginTop: 15, paddingTop: 15, borderTopWidth: 1 },
    vehicleSubRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    vehicleLabel: { fontSize: 12, marginLeft: 8, width: 60 },
    vehicleValue: { fontSize: 13, fontWeight: '600' },
    // Articles
    itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    qtyCircle: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    itemName: { flex: 1, fontSize: 14, fontWeight: '500' },
    itemPrice: { fontWeight: '600', fontSize: 14 },
    // Adresse & Prix
    addressRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
    addressText: { fontSize: 14, fontWeight: '600', marginLeft: 8, flex: 1, lineHeight: 20 },
    instructionCard: { flexDirection: 'row', padding: 12, borderRadius: 12, alignItems: 'center', marginTop: 5 },
    instructionText: { fontSize: 12, marginLeft: 8, fontStyle: 'italic', flex: 1 },
    divider: { height: 1, marginVertical: 15 },
    priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    totalLabel: { fontSize: 18, fontWeight: '900' },
    totalValue: { fontSize: 22, fontWeight: '900' },
    retryBtn: { paddingHorizontal: 30, paddingVertical: 12, borderRadius: 20 },
});