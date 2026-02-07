import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Star, Clock } from 'lucide-react-native';
import { menuItems } from '@/data/dataMocket';
import CardMenuItem from '@/components/ui/card/CardMenuItem';
import { useThemeColor } from '@/hooks/use-theme-color';

const { width } = Dimensions.get('window');

export default function RestaurantDetail() {
    const { name, imageUrl } = useLocalSearchParams();
    const router = useRouter();

    // Couleurs thématiques
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const textMuted = useThemeColor({}, 'textMuted');
    const primaryColor = useThemeColor({}, 'primary');
    const borderColor = useThemeColor({}, 'border');

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* HEADER IMAGE */}
            <View style={styles.imageHeader}>
                <Image
                    source={{
                        uri:
                            (imageUrl as string) ||
                            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
                    }}
                    style={styles.mainImage}
                    resizeMode="cover"
                />
                <View style={styles.overlay} />
                {/* Bouton retour s'adapte au fond de l'image (souvent sombre) */}
                <TouchableOpacity
                    style={[
                        styles.backBtn,
                        { backgroundColor: 'rgba(255,255,255,0.9)' },
                    ]}
                    onPress={() => router.back()}
                >
                    <ChevronLeft color="#000" size={24} />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={[styles.content, { backgroundColor }]}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 150 }}
            >
                <View style={styles.infoSection}>
                    <Text style={[styles.title, { color: textColor }]}>
                        {name || 'Restaurant Detail'}
                    </Text>
                    <View style={styles.metaRow}>
                        <View
                            style={[
                                styles.ratingBox,
                                { backgroundColor: '#FFB30020' },
                            ]}
                        >
                            <Star size={16} color="#FFB300" fill="#FFB300" />
                            <Text style={styles.ratingText}> 4.8</Text>
                            <Text
                                style={[
                                    styles.reviewText,
                                    { color: textMuted },
                                ]}
                            >
                                {' '}
                                (200+ avis)
                            </Text>
                        </View>
                        <View style={styles.timeBox}>
                            <Clock size={16} color={textMuted} />
                            <Text
                                style={[styles.timeText, { color: textMuted }]}
                            >
                                {' '}
                                15-25 min
                            </Text>
                        </View>
                    </View>
                </View>

                <View
                    style={[styles.divider, { backgroundColor: borderColor }]}
                />

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                    Menu populaire
                </Text>

                {menuItems.map((item) => (
                    <CardMenuItem key={item.id} item={item} />
                ))}
            </ScrollView>

            {/* Panier Flottant - Le orange reste la couleur d'action principale */}
            <View style={styles.cartFooter}>
                <TouchableOpacity
                    style={[styles.cartBtn, { backgroundColor: primaryColor }]}
                    activeOpacity={0.9}
                >
                    <View style={styles.cartBadge}>
                        <Text style={styles.cartBadgeText}>2</Text>
                    </View>
                    <Text style={styles.cartBtnText}>Voir le panier</Text>
                    <Text style={styles.cartTotalPrice}>24.50 €</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    imageHeader: { height: 260, width: width, position: 'relative' },
    mainImage: { width: '100%', height: '100%' },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    backBtn: {
        position: 'absolute',
        top: 50,
        left: 20,
        padding: 10,
        borderRadius: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    content: {
        marginTop: -30,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
    },
    infoSection: { paddingTop: 25 },
    title: { fontSize: 28, fontWeight: '800' },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        gap: 15,
    },
    ratingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    ratingText: { fontWeight: 'bold', color: '#FFB300' },
    reviewText: { fontSize: 12 },
    timeBox: { flexDirection: 'row', alignItems: 'center' },
    timeText: { fontWeight: '500' },
    divider: { height: 1, marginVertical: 25 },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    cartFooter: { position: 'absolute', bottom: 30, left: 20, right: 20 },
    cartBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        borderRadius: 20,
        justifyContent: 'space-between',
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    cartBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    cartBadgeText: { color: '#FFF', fontWeight: 'bold' },
    cartBtnText: { color: '#FFF', fontWeight: '800', fontSize: 16 },
    cartTotalPrice: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});
