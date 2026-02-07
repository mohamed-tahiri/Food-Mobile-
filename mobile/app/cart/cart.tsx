import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ChevronLeft, CreditCard, Trash2 } from 'lucide-react-native';
import { useCart } from '@/context/CartContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import CardCartItem from '@/components/ui/card/CardCartItem';

export default function CartScreen() {
    const router = useRouter();
    const { cart, addToCart, removeFromCart, totalPrice, deleteFromCart, clearCart } = useCart();

    const backgroundColor = useThemeColor({}, 'background');
    const cardBg = useThemeColor({}, 'card');
    const textColor = useThemeColor({}, 'text');
    const textMuted = useThemeColor({}, 'textMuted');
    const primaryColor = useThemeColor({}, 'primary');
    const borderColor = useThemeColor({}, 'border');

    const handleClearCart = () => {
        Alert.alert(
            "Vider le panier",
            "Êtes-vous sûr de vouloir retirer tous les articles ?",
            [
                { text: "Annuler", style: "cancel" },
                { 
                    text: "Vider", 
                    style: "destructive", 
                    onPress: () => clearCart() 
                }
            ]
        );
    };

    const handlePayment = () => {
        Alert.alert(
            "Paiement réussi",
            "Merci pour votre commande ! Elle arrivera d'ici 20 minutes.",
            [{ text: "Super !", onPress: () => {
                clearCart();
                router.replace('/(tabs)');
            }}]
        );
    };

    if (cart.length === 0) {
        return (
            <View style={[styles.container, { backgroundColor, justifyContent: 'center', alignItems: 'center' }]}>
                <Stack.Screen options={{ title: 'Panier', headerShown: true }} />
                <Text style={{ color: textMuted, fontSize: 18, marginBottom: 20 }}>
                    Votre panier est vide ☹️
                </Text>
                <TouchableOpacity 
                    onPress={() => router.back()}
                    style={[styles.checkoutBtn, { backgroundColor: primaryColor, width: '60%' }]}
                >
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
                    headerTintColor: textColor
                }} 
            />

            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {cart.map((item) => (
                    <CardCartItem
                        key={item.id}
                        item={item}
                        cardBg={cardBg}
                        textColor={textColor}
                        primaryColor={primaryColor}
                        borderColor={borderColor}
                        addToCart={addToCart}
                        removeFromCart={removeFromCart}
                        deleteFromCart={deleteFromCart}
                    />
                ))}

                <View style={[styles.summaryCard, { backgroundColor: cardBg }]}>
                    <View style={styles.summaryRow}>
                        <Text style={[styles.summaryLabel, { color: textMuted }]}>Sous-total</Text>
                        <Text style={[styles.summaryValue, { color: textColor }]}>{totalPrice.toFixed(2)} €</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={[styles.summaryLabel, { color: textMuted }]}>Frais de livraison</Text>
                        <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>Gratuit</Text>
                    </View>
                    <View style={[styles.divider, { backgroundColor: borderColor }]} />
                    <View style={styles.summaryRow}>
                        <Text style={[styles.totalLabel, { color: textColor }]}>Total</Text>
                        <Text style={[styles.totalValue, { color: primaryColor }]}>{totalPrice.toFixed(2)} €</Text>
                    </View>
                </View>
            </ScrollView>

            <View style={[styles.footer, { backgroundColor: cardBg, borderTopColor: borderColor }]}>
                <TouchableOpacity 
                    style={[styles.checkoutBtn, { backgroundColor: primaryColor }]}
                    onPress={handlePayment}
                >
                    <CreditCard color="#FFF" size={20} style={{ marginRight: 10 }} />
                    <Text style={styles.checkoutText}>Payer {totalPrice.toFixed(2)} €</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { padding: 20, paddingBottom: 140 },
    headerBtn: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    summaryCard: { 
        padding: 20, 
        borderRadius: 24, 
        marginTop: 10,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2
    },
    summaryRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginVertical: 6 
    },
    summaryLabel: { fontSize: 15 },
    summaryValue: { fontSize: 15, fontWeight: '600' },
    divider: { height: 1, marginVertical: 15, opacity: 0.5 },
    totalLabel: { fontSize: 18, fontWeight: '800' },
    totalValue: { fontSize: 22, fontWeight: '800' },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 25,
        borderTopWidth: 1,
    },
    checkoutBtn: {
        flexDirection: 'row',
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5
    },
    checkoutText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});