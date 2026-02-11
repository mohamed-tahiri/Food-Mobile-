import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Share,
    Linking,
    Platform,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Star, Clock, Heart, Share2, Phone, Navigation } from 'lucide-react-native';
import CardMenuItem from '@/components/ui/card/CardMenuItem';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoriteContext';
import { restaurants } from '@/data/dataMocket';

const { width } = Dimensions.get('window');

export default function RestaurantDetail() {
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const textMuted = useThemeColor({}, 'textMuted');
    const primaryColor = useThemeColor({}, 'primary');
    const borderColor = useThemeColor({}, 'border');

    const { totalItems, totalPrice } = useCart();
    const { toggleFavorite, isFavorite } = useFavorites();
    const { id } = useLocalSearchParams();
    const router = useRouter();
    
    const restaurant = restaurants.find((r) => r.id === id);

    const handleCall = () => {
        if (restaurant?.phone) Linking.openURL(`tel:${restaurant.phone}`);
    };

    const handleGetDirection = () => {
        if (restaurant?.address) {
            const url = Platform.select({
                ios: `maps:0,0?q=${restaurant.address}`,
                android: `geo:0,0?q=${restaurant.address}`,
            });
            Linking.openURL(url!);
        }
    };

    const active = isFavorite(String(id));

    const onShare = async () => {
        try {
            await Share.share({
                message: `Regarde ce restaurant sur Foodie App : ${restaurant?.name || 'Restaurant'} !`,
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.imageHeader}>
                <Image
                    source={{
                        uri: restaurant?.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
                    }}
                    style={styles.mainImage}
                    resizeMode="cover"
                />
                <View style={styles.overlay} />
                
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <ChevronLeft color="#000" size={24} />
                </TouchableOpacity>

                <View style={styles.rightActions}>
                    <TouchableOpacity style={styles.actionBtn} onPress={onShare}>
                        <Share2 color="#000" size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => toggleFavorite(String(id))}>
                        <Heart 
                            size={20} 
                            color={active ? "#FF3B30" : "#000"} 
                            fill={active ? "#FF3B30" : "transparent"}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                style={[styles.content, { backgroundColor }]}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 150 }}
            >
                <View style={styles.infoSection}>
                    <Text style={[styles.title, { color: textColor }]}>
                        {restaurant?.name || 'Détails du Restaurant'}
                    </Text>

                    <View style={styles.metaRow}>
                        <View style={[styles.ratingBox, { backgroundColor: '#FFB30020' }]}>
                            <Star size={16} color="#FFB300" fill="#FFB300" />
                            <Text style={styles.ratingText}> {restaurant?.rating || '4.5'}</Text>
                            <Text style={[styles.reviewText, { color: textMuted }]}> (200+ avis)</Text>
                        </View>
                        <View style={styles.timeBox}>
                            <Clock size={16} color={textMuted} />
                            <Text style={[styles.timeText, { color: textMuted }]}> {restaurant?.time || '20-30 min'}</Text>
                        </View>
                    </View>

                    {/* Section Actions Rapides */}
                    <View style={[styles.actionRow, { borderTopColor: borderColor, borderBottomColor: borderColor }]}>
                        <TouchableOpacity style={styles.contactAction} onPress={handleCall}>
                            <View style={[styles.actionIconCircle, { backgroundColor: primaryColor + '15' }]}>
                                <Phone size={20} color={primaryColor} />
                            </View>
                            <Text style={[styles.actionLabel, { color: textColor }]}>Appeler</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.contactAction} onPress={handleGetDirection}>
                            <View style={[styles.actionIconCircle, { backgroundColor: '#4CAF5015' }]}>
                                <Navigation size={20} color="#4CAF50" />
                            </View>
                            <Text style={[styles.actionLabel, { color: textColor }]}>Itinéraire</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={[styles.divider, { backgroundColor: borderColor }]} />

                <Text style={[styles.sectionTitle, { color: textColor }]}>Menu populaire</Text>

                {restaurant?.menus.map((item) => (
                    <CardMenuItem key={item.id} item={item} />
                ))}
            </ScrollView>

            {totalItems > 0 && (
                <View style={styles.cartFooter}>
                    <TouchableOpacity
                        style={[styles.cartBtn, { backgroundColor: primaryColor }]}
                        activeOpacity={0.9}
                        onPress={() => router.push('/cart/cart')} 
                    >
                        <View style={styles.cartBadge}>
                            <Text style={styles.cartBadgeText}>{totalItems}</Text>
                        </View>
                        <Text style={styles.cartBtnText}>Voir le panier</Text>
                        <Text style={styles.cartTotalPrice}>{totalPrice.toFixed(2)} €</Text>
                    </TouchableOpacity>
                </View>
            )} 
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    imageHeader: { height: 260, width: width, position: 'relative' },
    mainImage: { width: '100%', height: '100%' },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.1)' },
    backBtn: {
        position: 'absolute',
        top: 50,
        left: 20,
        padding: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
        elevation: 5,
    },
    rightActions: { position: 'absolute', top: 50, right: 20, flexDirection: 'row', gap: 10 },
    actionBtn: {
        padding: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
        elevation: 5,
    },
    content: {
        marginTop: -30,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
    },
    infoSection: { paddingTop: 25 },
    title: { fontSize: 28, fontWeight: '800' },
    metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 15 },
    ratingBox: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
    ratingText: { fontWeight: 'bold', color: '#FFB300' },
    reviewText: { fontSize: 12 },
    timeBox: { flexDirection: 'row', alignItems: 'center' },
    timeText: { fontWeight: '500' },
    actionRow: {
        flexDirection: 'row',
        paddingTop: 20,
        marginTop: 20,
        borderTopWidth: 1,
        justifyContent: 'space-around',
    },
    contactAction: { alignItems: 'center', gap: 8 },
    actionIconCircle: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
    actionLabel: { fontSize: 14, fontWeight: '600' },
    sectionTitleSmall: { fontSize: 16, fontWeight: '700', marginTop: 25, marginBottom: 15 },
    mapContainer: {
        height: 150,
        width: '100%',
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    staticMap: { width: '100%', height: '100%' },
    markerFixed: { position: 'absolute', top: '35%', left: '47%', padding: 8, borderRadius: 20, elevation: 5 },
    mapOverlay: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        right: 10,
        padding: 12,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        elevation: 2,
    },
    addressText: { fontSize: 13, fontWeight: '600', flex: 1 },
    divider: { height: 1, marginTop: 30, marginBottom: 25 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    cartFooter: { position: 'absolute', bottom: 30, left: 20, right: 20 },
    cartBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        borderRadius: 20,
        justifyContent: 'space-between',
        elevation: 10,
    },
    cartBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
    cartBadgeText: { color: '#FFF', fontWeight: 'bold' },
    cartBtnText: { color: '#FFF', fontWeight: '800', fontSize: 16 },
    cartTotalPrice: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});