import React from 'react';
import { Clock, Star, Heart, MapPin } from 'lucide-react-native';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Resto } from '@/types/resto';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useFavorites } from '@/context/FavoriteContext';

interface CardRestaurantProps {
    resto: Resto;
}

export default function CardRestaurant({ resto }: CardRestaurantProps) {
    const router = useRouter();
    const { toggleFavorite, isFavorite } = useFavorites();

    const cardBg = useThemeColor({}, 'card');
    const textColor = useThemeColor({}, 'text');
    const textMuted = useThemeColor({}, 'textMuted');
    const borderColor = useThemeColor({}, 'border');
    const primaryColor = useThemeColor({}, 'primary');

    const active = isFavorite(resto.id);

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.card, { backgroundColor: cardBg }]}
            onPress={() =>
                router.push({
                    pathname: '/restaurant/[id]',
                    params: { id: resto.id },
                })
            }
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: resto.image }}
                    style={styles.image}
                    resizeMode="cover"
                />

                <View style={styles.overlay} />

                {/* Badge de prix (Ex: €€€) */}
                <View style={styles.priceBadge}>
                    <Text style={styles.priceText}>
                        {Array(resto.priceRange).fill('€').join('')}
                    </Text>
                </View>

                {/* Bouton Favoris */}
                <TouchableOpacity
                    style={[styles.heartBtn, { backgroundColor: cardBg }]}
                    onPress={(e) => {
                        e.stopPropagation();
                        toggleFavorite(resto.id);
                    }}
                >
                    <Heart
                        size={18}
                        color={active ? '#FF3B30' : textColor}
                        fill={active ? '#FF3B30' : 'transparent'}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={styles.titleRow}>
                    <Text style={[styles.name, { color: textColor }]} numberOfLines={1}>
                        {resto.name}
                    </Text>
                    <View style={[styles.ratingBadge, { backgroundColor: '#FFB30020' }]}>
                        <Star size={12} color="#FFB300" fill="#FFB300" />
                        <Text style={styles.ratingText}>{resto.rating}</Text>
                    </View>
                </View>

                {/* Conversion du tableau cuisine en string */}
                <Text style={[styles.typeText, { color: textMuted }]} numberOfLines={1}>
                    {resto.cuisine?.join(' • ')}
                </Text>

                <View style={styles.footer}>
                    <View style={styles.footerItem}>
                        <Clock size={14} color={textMuted} />
                        <Text style={[styles.footerText, { color: textMuted }]}>
                            {' '}{resto.deliveryTime.min}-{resto.deliveryTime.max} min
                        </Text>
                    </View>

                    <View style={[styles.dot, { backgroundColor: borderColor }]} />

                    <View style={styles.footerItem}>
                        <MapPin size={14} color={textMuted} />
                        <Text style={[styles.footerText, { color: textMuted }]}>
                            {' '}Paris ({(Math.random() * 2).toFixed(1)} km)
                        </Text>
                    </View>

                    <View style={[styles.dot, { backgroundColor: borderColor }]} />

                    {/* Affichage conditionnel des frais de livraison */}
                    {resto.deliveryFee === 0 ? (
                        <Text style={styles.freeDelivery}>Offert</Text>
                    ) : (
                        <Text style={[styles.footerText, { color: textMuted }]}>
                            {resto.deliveryFee}€ livr.
                        </Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 24,
        marginBottom: 20,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
    },
    imageContainer: {
        height: 160,
        width: '100%',
        position: 'relative',
    },
    image: { width: '100%', height: '100%' },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    priceBadge: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    priceText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
    heartBtn: {
        position: 'absolute',
        top: 12,
        right: 12,
        padding: 8,
        borderRadius: 20,
    },
    content: { padding: 16 },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: { fontSize: 18, fontWeight: 'bold', flex: 1 },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    ratingText: {
        marginLeft: 4,
        fontWeight: 'bold',
        color: '#FFB300',
        fontSize: 13,
    },
    typeText: { fontSize: 13, marginTop: 4, fontWeight: '500' },
    footer: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
    footerItem: { flexDirection: 'row', alignItems: 'center' },
    footerText: { fontSize: 12, fontWeight: '500' },
    dot: {
        width: 3,
        height: 3,
        borderRadius: 2,
        marginHorizontal: 8,
    },
    freeDelivery: { color: '#4CAF50', fontSize: 12, fontWeight: 'bold' },
});