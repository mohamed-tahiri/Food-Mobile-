import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Platform,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Share2, Plus, Minus, CheckCircle2, Circle, Clock, Flame } from 'lucide-react-native';
import { restaurants } from '@/data/dataMocket';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useCart } from '@/context/CartContext';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient'; 

const { width } = Dimensions.get('window');

export default function DishScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { addToCart } = useCart();
    
    const [quantity, setQuantity] = useState(1);
    const [extras, setExtras] = useState([
        { id: 'e1', name: 'Fromage fondu', price: 1.50, selected: false },
        { id: 'e2', name: 'Bacon croustillant', price: 2.00, selected: false },
        { id: 'e3', name: 'Avocat frais', price: 2.50, selected: false },
        { id: 'e4', name: 'Sauce spéciale', price: 0.50, selected: false },
    ]);

    const backgroundColor = useThemeColor({}, 'background');
    const cardColor = useThemeColor({}, 'card');
    const textColor = useThemeColor({}, 'text');
    const textMuted = useThemeColor({}, 'textMuted');
    const primaryColor = useThemeColor({}, 'primary');
    const borderColor = useThemeColor({}, 'border');

    const dish = useMemo(() => 
        restaurants.flatMap(r => r.menus).find(m => m.id === id), 
    [id]);

    if (!dish) return null;

    const selectedExtrasPrice = extras.filter(ex => ex.selected).reduce((sum, ex) => sum + ex.price, 0);
    const totalPrice = (dish.price + selectedExtrasPrice) * quantity;

    const toggleExtra = (extraId: string) => {
        setExtras(prev => prev.map(ex => 
            ex.id === extraId ? { ...ex, selected: !ex.selected } : ex
        ));
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) { addToCart(dish); }
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.back();
    };

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Image Header avec Dégradé */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: dish.img }} style={styles.image} />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.05)']}
                        style={styles.gradientOverlay}
                    />
                    <View style={styles.headerButtons}>
                        <TouchableOpacity style={styles.roundBtn} onPress={() => router.back()}>
                            <ChevronLeft color="#000" size={24} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.roundBtn} onPress={() => { /* Share logic */ }}>
                            <Share2 color="#000" size={20} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={[styles.content, { backgroundColor }]}>
                    {/* Badge & Titre */}
                    <View style={styles.topRow}>
                        <View style={[styles.tag, { backgroundColor: primaryColor + '15' }]}>
                            <Flame size={14} color={primaryColor} fill={primaryColor} />
                            <Text style={[styles.tagText, { color: primaryColor }]}>Populaire</Text>
                        </View>
                        <View style={styles.timeTag}>
                            <Clock size={14} color={textMuted} />
                            <Text style={{ color: textMuted, fontSize: 12, marginLeft: 4 }}>15 min</Text>
                        </View>
                    </View>

                    <View style={styles.titleRow}>
                        <Text style={[styles.name, { color: textColor }]}>{dish.name}</Text>
                        <Text style={[styles.price, { color: primaryColor }]}>{dish.price.toFixed(2)} €</Text>
                    </View>

                    <Text style={[styles.description, { color: textMuted }]}>{dish.desc}</Text>

                    <View style={[styles.divider, { backgroundColor: borderColor }]} />

                    {/* Suppléments avec nouveau design de ligne */}
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: textColor }]}>Personnalisez votre plat</Text>
                        <Text style={[styles.optionalText, { color: textMuted }]}>Optionnel</Text>
                    </View>

                    {extras.map((extra) => (
                        <TouchableOpacity 
                            key={extra.id} 
                            style={[
                                styles.extraCard, 
                                { 
                                    backgroundColor: extra.selected ? primaryColor + '08' : cardColor,
                                    borderColor: extra.selected ? primaryColor : borderColor
                                }
                            ]}
                            onPress={() => toggleExtra(extra.id)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.extraInfo}>
                                {extra.selected ? (
                                    <CheckCircle2 size={22} color={primaryColor} fill={primaryColor + '20'} />
                                ) : (
                                    <Circle size={22} color={textMuted} />
                                )}
                                <Text style={[styles.extraName, { color: textColor, fontWeight: extra.selected ? '700' : '500' }]}>{extra.name}</Text>
                            </View>
                            <Text style={[styles.extraPrice, { color: extra.selected ? primaryColor : textMuted }]}>+ {extra.price.toFixed(2)} €</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* Footer Premium */}
            <View style={[styles.footer, { backgroundColor: cardColor, borderTopColor: borderColor }]}>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => quantity > 1 && setQuantity(q => q - 1)}>
                        <Minus size={20} color={textColor} />
                    </TouchableOpacity>
                    <Text style={[styles.qtyText, { color: textColor }]}>{quantity}</Text>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(q => q + 1)}>
                        <Plus size={20} color={textColor} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity 
                    style={[styles.addBtn, { backgroundColor: primaryColor }]}
                    onPress={handleAddToCart}
                >
                    <Text style={styles.addBtnText}>Ajouter au panier</Text>
                    <View style={styles.verticalDivider} />
                    <Text style={styles.addBtnPrice}>{totalPrice.toFixed(2)} €</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    imageContainer: { height: width * 0.9, width: width, position: 'relative' },
    image: { width: '100%', height: '100%' },
    gradientOverlay: { ...StyleSheet.absoluteFillObject },
    headerButtons: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    roundBtn: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.95)',
        justifyContent: 'center', alignItems: 'center',
        elevation: 8, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10,
    },
    content: { 
        padding: 24, 
        marginTop: -35, 
        borderTopLeftRadius: 35, 
        borderTopRightRadius: 35,
        flex: 1 
    },
    topRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    tag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    tagText: { fontSize: 12, fontWeight: 'bold', marginLeft: 4 },
    timeTag: { flexDirection: 'row', alignItems: 'center' },
    titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    name: { fontSize: 28, fontWeight: '900', flex: 1, letterSpacing: -0.5 },
    price: { fontSize: 22, fontWeight: '800' },
    description: { fontSize: 15, marginTop: 12, lineHeight: 22, opacity: 0.8 },
    divider: { height: 1, marginVertical: 25 },
    sectionHeader: { marginBottom: 15 },
    sectionTitle: { fontSize: 18, fontWeight: '800' },
    optionalText: { fontSize: 13, marginTop: 4 },
    extraCard: { 
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
        padding: 16, borderRadius: 16, marginBottom: 12,
        borderWidth: 1.5,
    },
    extraInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    extraName: { fontSize: 16 },
    extraPrice: { fontSize: 14, fontWeight: '600' },
    footer: {
        position: 'absolute', bottom: 0, width: '100%',
        flexDirection: 'row', padding: 20, paddingBottom: Platform.OS === 'ios' ? 35 : 20,
        borderTopWidth: 1, alignItems: 'center',
        elevation: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10,
    },
    quantityContainer: {
        flexDirection: 'row', alignItems: 'center', 
        backgroundColor: 'rgba(128,128,128,0.1)', borderRadius: 18,
        marginRight: 15, padding: 4
    },
    qtyBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    qtyText: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 12 },
    addBtn: {
        flex: 1, height: 56, borderRadius: 18,
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
        paddingHorizontal: 20,
    },
    addBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    verticalDivider: { width: 1, height: 20, backgroundColor: 'rgba(255,255,255,0.3)', marginHorizontal: 15 },
    addBtnPrice: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});