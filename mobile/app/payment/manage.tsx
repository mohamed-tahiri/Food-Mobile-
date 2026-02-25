import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, Plus, Trash2, CreditCard, ShieldCheck } from 'lucide-react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function ManagePaymentScreen() {
    const router = useRouter();
    
    // Thème unifié
    const backgroundColor = useThemeColor({}, 'background');
    const headerColor = useThemeColor({}, 'tabBar');
    const textColor = useThemeColor({}, 'text');
    const textMuted = useThemeColor({}, 'textMuted');
    const cardColor = useThemeColor({}, 'card');
    const primaryColor = useThemeColor({}, 'primary');

    // Simulation des cartes de Mohamed
    const [cards, setCards] = useState([
        { id: '1', type: 'Visa', last4: '4242', expiry: '12/26', brandColor: '#1A1F71', isDefault: true },
        { id: '2', type: 'Mastercard', last4: '8890', expiry: '05/27', brandColor: '#EB001B', isDefault: false }
    ]);

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header style Profile */}
            <View style={[styles.header, { backgroundColor: headerColor }]}>
                <TouchableOpacity 
                    style={[styles.backBtn, { backgroundColor: cardColor }]} 
                    onPress={() => router.back()}
                >
                    <ChevronLeft color={textColor} size={24} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: textColor }]}>Paiement</Text>
                <View style={{ width: 44 }} /> 
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={[styles.sectionTitle, { color: textMuted }]}>Tes cartes enregistrées</Text>

                {cards.map((card) => (
                    <View key={card.id} style={[styles.paymentCard, { backgroundColor: card.brandColor }]}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardType}>{card.type}</Text>
                            <CreditCard color="#FFF" size={24} />
                        </View>
                        
                        <Text style={styles.cardNumber}>••••  ••••  ••••  {card.last4}</Text>
                        
                        <View style={styles.cardFooter}>
                            <View>
                                <Text style={styles.cardLabel}>Expire fin</Text>
                                <Text style={styles.cardValue}>{card.expiry}</Text>
                            </View>
                            {card.isDefault && (
                                <View style={styles.defaultBadge}>
                                    <Text style={styles.defaultText}>Principale</Text>
                                </View>
                            )}
                            <TouchableOpacity onPress={() => {/* Delete logic */}}>
                                <Trash2 color="rgba(255,255,255,0.7)" size={20} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

                <TouchableOpacity style={[styles.addBtn, { borderColor: primaryColor }]}>
                    <Plus size={20} color={primaryColor} />
                    <Text style={[styles.addBtnText, { color: primaryColor }]}>Ajouter une carte</Text>
                </TouchableOpacity>

                <View style={styles.secureInfo}>
                    <ShieldCheck size={16} color={textMuted} />
                    <Text style={[styles.secureText, { color: textMuted }]}>
                        Tes données de paiement sont sécurisées et cryptées.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { 
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingHorizontal: 20, paddingBottom: 25, 
        borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 4
    },
    backBtn: { width: 44, height: 44, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    content: { padding: 20, paddingTop: 30 },
    sectionTitle: { fontSize: 12, fontWeight: '800', marginBottom: 20, textTransform: 'uppercase', letterSpacing: 1 },
    
    // Style Carte Bancaire (Apple Wallet Style)
    paymentCard: { 
        height: 180, borderRadius: 24, padding: 25, marginBottom: 20,
        elevation: 10, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 10,
        justifyContent: 'space-between'
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cardType: { color: '#FFF', fontSize: 18, fontWeight: 'bold', fontStyle: 'italic' },
    cardNumber: { color: '#FFF', fontSize: 20, fontWeight: '700', letterSpacing: 2, marginVertical: 10 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    cardLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, textTransform: 'uppercase' },
    cardValue: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
    defaultBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
    defaultText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },

    addBtn: { 
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', 
        padding: 20, borderRadius: 24, borderWidth: 2, borderStyle: 'dashed', marginTop: 10 
    },
    addBtnText: { marginLeft: 10, fontWeight: '800', fontSize: 15 },
    secureInfo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 30, gap: 8 },
    secureText: { fontSize: 12, textAlign: 'center' }
});