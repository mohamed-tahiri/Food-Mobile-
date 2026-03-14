import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    TouchableOpacity, 
    Platform, 
    Alert, 
    ActivityIndicator, 
    TextInput 
} from 'react-native';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { Ticket, CheckCircle2, XCircle, ChevronLeft, Trash2, MapPin } from 'lucide-react-native';
import { useCart } from '@/context/CartContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { orderService } from '@/services/order.service';
import CardCartItem from '@/components/ui/card/CardCartItem';
import { addressService } from '@/services/address.service';

export default function CartScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { 
        cart, 
        restaurantId, 
        addToCart, 
        removeFromCart, 
        totalPrice, 
        deleteFromCart, 
        clearCart 
    } = useCart();

    // États pour les adresses
    const [addresses, setAddresses] = useState<any[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<any>(null);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
    
    // États pour le Code Promo
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0); 
    const [isValidating, setIsValidating] = useState(false);
    const [promoError, setPromoError] = useState<string | null>(null);
    const [isApplied, setIsApplied] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Thème
    const backgroundColor = useThemeColor({}, 'background');
    const cardBg = useThemeColor({}, 'card');
    const textColor = useThemeColor({}, 'text');
    const textMuted = useThemeColor({}, 'textMuted');
    const primaryColor = useThemeColor({}, 'primary');
    const borderColor = useThemeColor({}, 'border');
        
    // Récupération des adresses de Mohamed
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const res = await addressService.getAll();
                if (res.success && res.data.length > 0) {
                    setAddresses(res.data);
                    setSelectedAddress(res.data[0]); // Par défaut, la première
                }
            } catch (error) {
                console.error("Erreur fetch addresses:", error);
            } finally {
                setIsLoadingAddresses(false);
            }
        };
        fetchAddresses();
    }, []);

    const handleClearCart = () => {
        Alert.alert(
            "Vider le panier",
            "Êtes-vous sûr de vouloir retirer tous les articles ?",
            [
                { text: "Annuler", style: "cancel" },
                { text: "Vider", style: "destructive", onPress: () => clearCart() }
            ]
        );
    };

    const finalPrice = Math.max(0, (totalPrice || 0) - (discount || 0));

    const handleApplyPromo = async () => {
        if (!promoCode.trim()) return;
        setIsValidating(true);
        setPromoError(null);
        try {
            const res = await orderService.validatePromo(promoCode.toUpperCase(), totalPrice);
            if (res.success && res.data) {
                const amount = typeof res.data.discount === 'number' ? res.data.discount : 0;
                setDiscount(amount);
                setIsApplied(true);
                Alert.alert("Succès", res.data.message || "Code promo appliqué !");
            } else {
                setPromoError(res.message || "Code invalide");
                setDiscount(0);
                setIsApplied(false);
            }
        } catch (error) {
            setPromoError("Erreur lors de la validation");
            setDiscount(0);
        } finally {
            setIsValidating(false);
        }
    };

    const handlePayment = async () => {
        if (cart.length === 0) return;
        if (!selectedAddress) {
            Alert.alert("Adresse manquante", "Mohamed, choisie une adresse pour la livraison !");
            return;
        }

        setIsProcessing(true);
        try {
            const orderData = {
                restaurantId: String(id),
                items: cart.map(item => ({ 
                    menuItemId: item.id, 
                    quantity: item.quantity 
                })),
                deliveryAddress: {
                    label: selectedAddress.label,
                    street: selectedAddress.street,
                    city: selectedAddress.city,
                    zipCode: selectedAddress.zipCode || "93160"
                },
                paymentMethod: "card",
                promoCode: isApplied ? promoCode.toUpperCase() : null,
                totalAmount: finalPrice,
                tip: 0,
                deliveryInstructions: "Sonner à l'interphone"
            };

            const res = await orderService.createOrder(orderData);
            if (res.success) {
                Alert.alert("Succès", "Commande validée ! Bon appétit.");
                clearCart();
                router.replace('/(tabs)/commandes');
            }
        } catch (error) {
            Alert.alert("Erreur", "Connexion au serveur impossible.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (cart.length === 0) {
        return (
            <View style={[styles.container, { backgroundColor, justifyContent: 'center', alignItems: 'center' }]}>
                <Stack.Screen options={{ title: 'Panier' }} />
                <Text style={{ color: textMuted, fontSize: 18, marginBottom: 20 }}>Votre panier est vide ☹️</Text>
                <TouchableOpacity onPress={() => router.back()} style={[styles.checkoutBtn, { backgroundColor: primaryColor, paddingHorizontal: 30 }]}>
                    <Text style={styles.checkoutText}>Retour au menu</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Stack.Screen 
                options={{ 
                    headerShown: true, 
                    title: 'Mon Panier',
                    headerTitleAlign: 'center',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
                            <ChevronLeft color={textColor} size={24} />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity onPress={handleClearCart} style={styles.headerBtn}>
                            <Trash2 color="#FF3B30" size={22} />
                        </TouchableOpacity>
                    ),
                    headerStyle: { backgroundColor },
                    headerShadowVisible: false,
                }} 
            />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Liste des items */}
                {cart.map((item) => (
                    <CardCartItem 
                        key={item.id} 
                        item={item} 
                        cardBg={cardBg} 
                        textColor={textColor} 
                        primaryColor={primaryColor} 
                        borderColor={borderColor} 
                        addToCart={(i) => addToCart(i, restaurantId!)} 
                        removeFromCart={removeFromCart} 
                        deleteFromCart={deleteFromCart} 
                    />
                ))}

                {/* SECTION CHOIX ADRESSE - Mohamed respect du design */}
                <Text style={[styles.sectionTitle, { color: textMuted }]}>Adresse de livraison</Text>
                {isLoadingAddresses ? (
                    <ActivityIndicator color={primaryColor} style={{ marginVertical: 10 }} />
                ) : (
                    <View style={styles.addressContainer}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
                            {addresses.map((addr) => (
                                <TouchableOpacity 
                                    key={addr.id}
                                    onPress={() => setSelectedAddress(addr)}
                                    style={[
                                        styles.addressChip, 
                                        { 
                                            backgroundColor: selectedAddress?.id === addr.id ? primaryColor + '15' : cardBg, 
                                            borderColor: selectedAddress?.id === addr.id ? primaryColor : borderColor 
                                        }
                                    ]}
                                >
                                    <MapPin size={16} color={selectedAddress?.id === addr.id ? primaryColor : textMuted} />
                                    <Text style={[styles.addressChipText, { color: selectedAddress?.id === addr.id ? textColor : textMuted }]}>
                                        {addr.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity 
                                style={[styles.addressChip, { borderStyle: 'dashed', borderColor: primaryColor }]}
                                onPress={() => router.push('/address/manage')}
                            >
                                <Text style={{ color: primaryColor, fontWeight: '700' }}>+ Ajouter</Text>
                            </TouchableOpacity>
                        </ScrollView>
                        
                        {selectedAddress && (
                            <View style={styles.addressDetailRow}>
                                <Text style={[styles.selectedAddressDetail, { color: textMuted }]}>
                                    {selectedAddress.street}, {selectedAddress.city}
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                {/* SECTION CODE PROMO */}
                <View style={[styles.promoContainer, { backgroundColor: cardBg, borderColor, marginTop: 10 }]}>
                    <View style={styles.promoInputRow}>
                        <Ticket size={20} color={isApplied ? '#4CAF50' : textMuted} style={{ marginRight: 10 }} />
                        <TextInput
                            placeholder="Code promo"
                            placeholderTextColor={textMuted}
                            style={[styles.input, { color: textColor }]}
                            value={promoCode}
                            onChangeText={(text) => {
                                setPromoCode(text);
                                if (isApplied) { setIsApplied(false); setDiscount(0); }
                            }}
                            autoCapitalize="characters"
                        />
                        <TouchableOpacity 
                            onPress={handleApplyPromo} 
                            disabled={isValidating || !promoCode}
                            style={[styles.applyBtn, { backgroundColor: isApplied ? '#4CAF50' : primaryColor }]}
                        >
                            {isValidating ? <ActivityIndicator size="small" color="#FFF" /> : 
                             isApplied ? <CheckCircle2 size={18} color="#FFF" /> : 
                             <Text style={styles.applyBtnText}>Appliquer</Text>}
                        </TouchableOpacity>
                    </View>
                    {promoError && (
                        <View style={styles.errorRow}>
                            <XCircle size={14} color="#FF3B30" />
                            <Text style={styles.errorText}>{promoError}</Text>
                        </View>
                    )}
                </View>

                {/* RÉSUMÉ */}
                <View style={[styles.summaryCard, { backgroundColor: cardBg, marginTop: 10 }]}>
                    <View style={styles.summaryRow}>
                        <Text style={[styles.summaryLabel, { color: textMuted }]}>Sous-total</Text>
                        <Text style={[styles.summaryValue, { color: textColor }]}>{(totalPrice || 0).toFixed(2)} €</Text>
                    </View>
                    
                    {isApplied && (
                        <View style={styles.summaryRow}>
                            <Text style={[styles.summaryLabel, { color: '#4CAF50' }]}>Réduction ({promoCode})</Text>
                            <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>-{(discount || 0).toFixed(2)} €</Text>
                        </View>
                    )}

                    <View style={styles.summaryRow}>
                        <Text style={[styles.summaryLabel, { color: textMuted }]}>Frais de livraison</Text>
                        <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>Gratuit</Text>
                    </View>

                    <View style={[styles.divider, { backgroundColor: borderColor }]} />
                    
                    <View style={styles.summaryRow}>
                        <Text style={[styles.totalLabel, { color: textColor }]}>Total</Text>
                        <Text style={[styles.totalValue, { color: primaryColor }]}>{finalPrice.toFixed(2)} €</Text>
                    </View>
                </View>
            </ScrollView>

            <View style={[styles.footer, { backgroundColor: cardBg, borderTopColor: borderColor }]}>
                <TouchableOpacity 
                    style={[styles.checkoutBtn, { backgroundColor: selectedAddress ? primaryColor : textMuted }]} 
                    onPress={handlePayment} 
                    disabled={isProcessing || !selectedAddress}
                >
                    {isProcessing ? <ActivityIndicator color="#FFF" /> : (
                        <Text style={styles.checkoutText}>Payer {finalPrice.toFixed(2)} €</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
    scrollContent: { padding: 20, paddingBottom: 140 },
    sectionTitle: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', marginBottom: 12, letterSpacing: 1, marginTop: 10 },
    addressContainer: { marginBottom: 5 },
    addressChip: { 
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, 
        borderRadius: 18, borderWidth: 1.5, marginRight: 10, gap: 8 
    },
    addressChipText: { fontWeight: '700', fontSize: 14 },
    addressDetailRow: { marginTop: 8, paddingLeft: 5 },
    selectedAddressDetail: { fontSize: 13, fontStyle: 'italic', opacity: 0.8 },
    promoContainer: { padding: 15, borderRadius: 20, borderWidth: 1, marginBottom: 15 },
    promoInputRow: { flexDirection: 'row', alignItems: 'center' },
    input: { flex: 1, height: 45, fontSize: 15, fontWeight: '500' },
    applyBtn: { paddingHorizontal: 18, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    applyBtnText: { color: '#FFF', fontWeight: '700', fontSize: 13 },
    errorRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 5 },
    errorText: { color: '#FF3B30', fontSize: 12, fontWeight: '600' },
    summaryCard: { padding: 20, borderRadius: 24 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6 },
    summaryLabel: { fontSize: 15 },
    summaryValue: { fontSize: 15, fontWeight: '600' },
    divider: { height: 1, marginVertical: 15, opacity: 0.3 },
    totalLabel: { fontSize: 18, fontWeight: '800' },
    totalValue: { fontSize: 22, fontWeight: '800' },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 40, borderTopWidth: 1 },
    checkoutBtn: { height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    checkoutText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});