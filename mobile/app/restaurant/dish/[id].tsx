import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Share2, Plus, Minus, Clock, Flame } from 'lucide-react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useCart } from '@/context/CartContext';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient'; 
import { ENDPOINTS } from '@/constants/api';
import { ApiResponse } from '@/types/resto';
import { MenuItem } from '@/types/menuItem';

const { width } = Dimensions.get('window');

export default function DishScreen() {
    // On récupère menuId (id du resto) et id (id du plat)
    const { id, menuId } = useLocalSearchParams();
    const router = useRouter();
    const { addToCart } = useCart();
    
    const [dish, setDish] = useState<MenuItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    const backgroundColor = useThemeColor({}, 'background');
    const cardColor = useThemeColor({}, 'card');
    const textColor = useThemeColor({}, 'text');
    const textMuted = useThemeColor({}, 'textMuted');
    const primaryColor = useThemeColor({}, 'primary');
    const borderColor = useThemeColor({}, 'border');

    useEffect(() => {
        const fetchDishData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(ENDPOINTS.RESTAURANT_MENU_DISH(menuId as string, id as string));
                const json: ApiResponse<MenuItem> = await response.json();

                if (json.success) {
                    setDish(json.data);
                }
            } catch (error) {
                console.error("Erreur chargement item menu:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id && menuId) fetchDishData();
    }, [id, menuId]);

    if (isLoading) {
        return (
            <View style={[styles.loader, { backgroundColor }]}>
                <ActivityIndicator size="large" color={primaryColor} />
            </View>
        );
    }

    if (!dish) return null;

    const totalPrice = dish.price * quantity;

    const handleAddToCart = () => {
        // Ajout au panier avec la quantité sélectionnée
        for (let i = 0; i < quantity; i++) {
            addToCart(dish);
        }
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.back();
    };

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Image avec dégradé pour la lisibilité des boutons */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: dish.image }} style={styles.image} />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.1)']}
                        style={styles.gradientOverlay}
                    />
                    <View style={styles.headerButtons}>
                        <TouchableOpacity style={styles.roundBtn} onPress={() => router.back()}>
                            <ChevronLeft color="#000" size={24} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.roundBtn}>
                            <Share2 color="#000" size={20} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.content}>
                    <View style={styles.topRow}>
                        <View style={[styles.tag, { backgroundColor: primaryColor + '15' }]}>
                            <Flame size={14} color={primaryColor} fill={primaryColor} />
                            <Text style={[styles.tagText, { color: primaryColor }]}>Populaire</Text>
                        </View>
                        <View style={styles.timeTag}>
                            <Clock size={14} color={textMuted} />
                            <Text style={{ color: textMuted, fontSize: 12, marginLeft: 4 }}>Préparé avec soin</Text>
                        </View>
                    </View>

                    <View style={styles.titleRow}>
                        <Text style={[styles.name, { color: textColor }]}>{dish.name}</Text>
                        <Text style={[styles.price, { color: primaryColor }]}>{dish.price.toFixed(2)} €</Text>
                    </View>

                    <Text style={[styles.description, { color: textMuted }]}>
                        {dish.description || "Aucune description disponible pour ce plat."}
                    </Text>

                    <View style={[styles.divider, { backgroundColor: borderColor }]} />
                    
                    {/* Information supplémentaire */}
                    <View style={[styles.infoCard, { backgroundColor: cardColor }]}>
                        <Text style={{ color: textColor, fontWeight: 'bold' }}>Note du chef</Text>
                        <Text style={{ color: textMuted, fontSize: 13, marginTop: 4 }}>
                            Produits frais et locaux, cuisinés à la commande.
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Footer Fixe avec Sélecteur de Quantité */}
            <View style={[styles.footer, { backgroundColor: cardColor, borderTopColor: borderColor }]}>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity 
                        style={styles.qtyBtn} 
                        onPress={() => {
                            if (quantity > 1) {
                                setQuantity(q => q - 1);
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            }
                        }}
                    >
                        <Minus size={20} color={textColor} />
                    </TouchableOpacity>
                    <Text style={[styles.qtyText, { color: textColor }]}>{quantity}</Text>
                    <TouchableOpacity 
                        style={styles.qtyBtn} 
                        onPress={() => {
                            setQuantity(q => q + 1);
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                    >
                        <Plus size={20} color={textColor} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity 
                    style={[styles.addBtn, { backgroundColor: primaryColor }]} 
                    onPress={handleAddToCart}
                >
                    <Text style={styles.addBtnText}>Ajouter • {totalPrice.toFixed(2)} €</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    imageContainer: { height: width * 0.9, width: width },
    image: { width: '100%', height: '100%' },
    gradientOverlay: { ...StyleSheet.absoluteFillObject },
    headerButtons: { 
        position: 'absolute', 
        top: 55, 
        left: 20, 
        right: 20, 
        flexDirection: 'row', 
        justifyContent: 'space-between' 
    },
    roundBtn: { 
        width: 44, 
        height: 44, 
        borderRadius: 22, 
        backgroundColor: '#FFF', 
        justifyContent: 'center', 
        alignItems: 'center', 
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    content: { 
        padding: 24,  
        borderTopLeftRadius: 35, 
        borderTopRightRadius: 35, 
        backgroundColor: 'transparent' 
    },
    topRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    tag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    tagText: { fontSize: 12, fontWeight: 'bold', marginLeft: 4 },
    timeTag: { flexDirection: 'row', alignItems: 'center' },
    titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    name: { fontSize: 26, fontWeight: '900', flex: 1, letterSpacing: -0.5 },
    price: { fontSize: 22, fontWeight: '800' },
    description: { fontSize: 15, marginTop: 15, lineHeight: 22, opacity: 0.8 },
    divider: { height: 1, marginVertical: 30 },
    infoCard: { padding: 16, borderRadius: 20 },
    footer: { 
        position: 'absolute', 
        bottom: 0, 
        width: '100%', 
        flexDirection: 'row', 
        padding: 20, 
        paddingBottom: Platform.OS === 'ios' ? 40 : 25, 
        borderTopWidth: 1, 
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    quantityContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: 'rgba(0,0,0,0.05)', 
        borderRadius: 18, 
        marginRight: 15,
        padding: 4 
    },
    qtyBtn: { width: 42, height: 42, justifyContent: 'center', alignItems: 'center' },
    qtyText: { fontSize: 18, fontWeight: '800', marginHorizontal: 10 },
    addBtn: { 
        flex: 1, 
        height: 58, 
        borderRadius: 18, 
        justifyContent: 'center', 
        alignItems: 'center', 
        elevation: 3 
    },
    addBtnText: { color: '#FFF', fontSize: 17, fontWeight: 'bold' }
});