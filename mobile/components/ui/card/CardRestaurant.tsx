import React from 'react';
import { Clock, Star, Heart } from 'lucide-react-native';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Resto } from '@/types/resto';
import { useThemeColor } from '@/hooks/use-theme-color';

interface CardRestaurantProps {
    resto: Resto;
}

export default function CardRestaurant({ resto }: CardRestaurantProps) {
    const router = useRouter();

    // 1. Récupération des couleurs dynamiques
    const cardBg = useThemeColor({}, 'card');
    const textColor = useThemeColor({}, 'text');
    const textMuted = useThemeColor({}, 'textMuted');
    const borderColor = useThemeColor({}, 'border');

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.card, { backgroundColor: cardBg }]}
            onPress={() =>
                router.push({
                    pathname: '/restaurant/[id]',
                    params: {
                        id: resto.id,
                        name: resto.name,
                        imageUrl: resto.imageUrl,
                    },
                })
            }
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: resto.imageUrl }}
                    style={styles.image}
                    resizeMode="cover"
                />

                <View style={styles.overlay} />

                {resto.promo && (
                    <View style={styles.promoBadge}>
                        <Text style={styles.promoText}>{resto.promo}</Text>
                    </View>
                )}

                <TouchableOpacity
                    style={[styles.heartBtn, { backgroundColor: cardBg }]}
                >
                    <Heart
                        size={20}
                        color={resto.isFavorite ? '#FF3B30' : '#FF6B35'}
                        fill={resto.isFavorite ? '#FF3B30' : 'transparent'}
                    />
                </TouchableOpacity>
            </View>

            {/* Section Informations */}
            <View style={styles.content}>
                <View style={styles.titleRow}>
                    <Text
                        style={[styles.name, { color: textColor }]}
                        numberOfLines={1}
                    >
                        {resto.name}
                    </Text>
                    <View
                        style={[
                            styles.ratingBadge,
                            { backgroundColor: '#FFB30020' },
                        ]}
                    >
                        <Star size={12} color="#FFB300" fill="#FFB300" />
                        <Text style={styles.ratingText}>{resto.rating}</Text>
                    </View>
                </View>

                <Text style={[styles.typeText, { color: textMuted }]}>
                    {resto.type}
                </Text>

                <View style={styles.footer}>
                    <View style={styles.footerItem}>
                        <Clock size={14} color={textMuted} />
                        <Text style={[styles.footerText, { color: textMuted }]}>
                            {' '}
                            {resto.time}
                        </Text>
                    </View>
                    <View
                        style={[styles.dot, { backgroundColor: borderColor }]}
                    />
                    <Text style={[styles.footerText, { color: textMuted }]}>
                        {resto.distance}
                    </Text>
                    <View
                        style={[styles.dot, { backgroundColor: borderColor }]}
                    />
                    <Text style={styles.freeDelivery}>Livraison gratuite</Text>
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
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 15,
        elevation: 4,
    },
    imageContainer: {
        height: 180,
        width: '100%',
        position: 'relative',
        backgroundColor: '#222', // Fond plus sombre pendant le chargement de l'image
    },
    image: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    promoBadge: {
        position: 'absolute',
        top: 15,
        left: 15,
        backgroundColor: '#FF6B35',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
        zIndex: 2,
    },
    promoText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
    heartBtn: {
        position: 'absolute',
        top: 15,
        right: 15,
        padding: 8,
        borderRadius: 20,
        zIndex: 2,
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
    typeText: { fontSize: 13, marginTop: 4 },
    footer: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
    footerItem: { flexDirection: 'row', alignItems: 'center' },
    footerText: { fontSize: 12 },
    dot: {
        width: 3,
        height: 3,
        borderRadius: 2,
        marginHorizontal: 8,
    },
    freeDelivery: { color: '#4CAF50', fontSize: 12, fontWeight: 'bold' },
});
