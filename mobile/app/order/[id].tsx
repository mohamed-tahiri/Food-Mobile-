import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Linking,
    Alert
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ChevronLeft, Package, MapPin, Phone, Star } from 'lucide-react-native';

// Services & Hooks
import { useThemeColor } from '@/hooks/use-theme-color';
import { orderService } from '@/services/order.service';

// Types
import { Order } from '@/types/order';

export default function OrderDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Thème
    const backgroundColor = useThemeColor({}, 'background');
    const cardBg = useThemeColor({}, 'card');
    const textColor = useThemeColor({}, 'text');
    const textMuted = useThemeColor({}, 'textMuted');
    const primaryColor = useThemeColor({}, 'primary');
    const borderColor = useThemeColor({}, 'border');

    /**
     * Gère l'appel téléphonique au livreur
     */
    const handleCallDriver = () => {
        if (order?.driverInfo?.phone) {
            const url = `tel:${order.driverInfo.phone}`;
            Linking.canOpenURL(url)
                .then((supported) => {
                    if (!supported) {
                        Alert.alert("Erreur", "Votre appareil ne permet pas de passer des appels.");
                    } else {
                        return Linking.openURL(url);
                    }
                })
                .catch((err) => console.error("Erreur d'appel:", err));
        } else {
            Alert.alert("Indisponible", "Le numéro du livreur n'est pas renseigné.");
        }
    };

    /**
     * Chargement des détails via le SERVICE
     */
    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                // Utilisation du service centralisé
                const res = await orderService.getOrderById(id as string);
                if (res.success) {
                    setOrder(res.data);
                }
            } catch (error) {
                console.error("Erreur service OrderDetail:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchOrderDetail();
    }, [id]);

    if (isLoading) return <ActivityIndicator style={{ flex: 1 }} color={primaryColor} />;
    if (!order) return null;

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header Custom */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={[styles.backBtn, { backgroundColor: cardBg }]} 
                    onPress={() => router.back()}
                >
                    <ChevronLeft color={textColor} size={24} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: textColor }]}>
                    Commande #{order.orderNumber.split('-').pop()}
                </Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                {/* Statut Card */}
                <View style={[styles.statusCard, { backgroundColor: cardBg }]}>
                    <View style={[styles.iconCircle, { backgroundColor: primaryColor + '15' }]}>
                        <Package color={primaryColor} size={32} />
                    </View>
                    <Text style={[styles.statusText, { color: primaryColor }]}>
                        {order.status.toUpperCase()}
                    </Text>
                    <Text style={[styles.dateText, { color: textMuted }]}>
                        Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR')} à {new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>

                {/* Section Livreur */}
                {order.driverInfo && (
                    <View style={[styles.section, { backgroundColor: cardBg }]}>
                        <Text style={[styles.sectionTitle, { color: textMuted }]}>Votre Livreur</Text>
                        <View style={styles.driverRow}>
                            <Image source={{ uri: order.driverInfo.avatar }} style={styles.driverAvatar} />
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={[styles.driverName, { color: textColor }]}>{order.driverInfo.name}</Text>
                                <View style={styles.driverMeta}>
                                    <Star size={14} color="#FFB300" fill="#FFB300" />
                                    <Text style={{ color: textMuted, fontSize: 12 }}> 
                                        {order.driverInfo.rating} • {order.driverInfo.vehicle}
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
                    </View>
                )}

                {/* Adresse */}
                <View style={[styles.section, { backgroundColor: cardBg }]}>
                    <Text style={[styles.sectionTitle, { color: textMuted }]}>Adresse de livraison</Text>
                    <View style={styles.addressRow}>
                        <MapPin size={20} color={primaryColor} />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={[styles.addressLabel, { color: textColor }]}>{order.deliveryAddress.label}</Text>
                            <Text style={[styles.addressText, { color: textMuted }]}>
                                {order.deliveryAddress.street}, {order.deliveryAddress.city}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Panier */}
                <View style={[styles.section, { backgroundColor: cardBg }]}>
                    <Text style={[styles.sectionTitle, { color: textMuted }]}>Votre Panier</Text>
                    {order.items.map((item, index) => (
                        <View key={index} style={styles.itemRow}>
                            <Image source={{ uri: item.menuItem.image }} style={styles.itemImage} />
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={[styles.itemName, { color: textColor }]}>{item.menuItem.name}</Text>
                                <Text style={{ color: textMuted }}>{item.quantity} x {item.menuItem.price.toFixed(2)}€</Text>
                            </View>
                            <Text style={[styles.itemTotal, { color: textColor }]}>{item.totalPrice.toFixed(2)} €</Text>
                        </View>
                    ))}
                    
                    <View style={[styles.divider, { backgroundColor: borderColor }]} />
                    
                    <View style={styles.priceRow}>
                        <Text style={{ color: textMuted }}>Sous-total</Text>
                        <Text style={{ color: textColor }}>{order.subtotal.toFixed(2)} €</Text>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={{ color: textMuted }}>Frais de livraison</Text>
                        <Text style={{ color: textColor }}>{order.deliveryFee.toFixed(2)} €</Text>
                    </View>
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
    header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 15 },
    backBtn: { padding: 10, borderRadius: 15, elevation: 2 },
    headerTitle: { fontSize: 18, fontWeight: '800', marginLeft: 15 },
    scrollContent: { padding: 20, paddingBottom: 50 },
    statusCard: { alignItems: 'center', padding: 25, borderRadius: 24, marginBottom: 20 },
    iconCircle: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    statusText: { fontSize: 22, fontWeight: '900', letterSpacing: 1 },
    dateText: { fontSize: 13, marginTop: 5 },
    section: { padding: 20, borderRadius: 24, marginBottom: 15 },
    sectionTitle: { fontSize: 12, fontWeight: '800', marginBottom: 15, textTransform: 'uppercase', letterSpacing: 1 },
    driverRow: { flexDirection: 'row', alignItems: 'center' },
    driverAvatar: { width: 50, height: 50, borderRadius: 25 },
    driverName: { fontSize: 16, fontWeight: 'bold' },
    driverMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
    callBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    addressRow: { flexDirection: 'row', alignItems: 'center' },
    addressLabel: { fontWeight: 'bold', fontSize: 15 },
    addressText: { fontSize: 13, marginTop: 2 },
    itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    itemImage: { width: 45, height: 45, borderRadius: 10 },
    itemName: { fontWeight: '600', fontSize: 15 },
    itemTotal: { fontWeight: '700' },
    divider: { height: 1, marginVertical: 15 },
    priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    totalLabel: { fontSize: 18, fontWeight: '900' },
    totalValue: { fontSize: 20, fontWeight: '900' },
});