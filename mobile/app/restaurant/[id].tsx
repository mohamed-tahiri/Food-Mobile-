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

const { width } = Dimensions.get('window');

export default function RestaurantDetail() {
    const { name, imageUrl } = useLocalSearchParams();
    const router = useRouter();

    return (
        <View style={styles.container}>
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
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => router.back()}
                >
                    <ChevronLeft color="#000" size={24} />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                <View style={styles.infoSection}>
                    <Text style={styles.title}>
                        {name || 'Restaurant Detail'}
                    </Text>
                    <View style={styles.metaRow}>
                        <View style={styles.ratingBox}>
                            <Star size={16} color="#FFB300" fill="#FFB300" />
                            <Text style={styles.ratingText}> 4.8</Text>
                            <Text style={styles.reviewText}> (200+ avis)</Text>
                        </View>
                        <View style={styles.timeBox}>
                            <Clock size={16} color="#666" />
                            <Text style={styles.timeText}> 15-25 min</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>Menu populaire</Text>

                {/* Utilisation du composant réutilisable */}
                {menuItems.map((item) => (
                    <CardMenuItem key={item.id} item={item} />
                ))}
            </ScrollView>

            {/* Panier Flottant */}
            <View style={styles.cartFooter}>
                <TouchableOpacity style={styles.cartBtn} activeOpacity={0.9}>
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

// Les styles restent identiques à ton code original pour la page
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
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
        backgroundColor: '#FFF',
        padding: 10,
        borderRadius: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    content: {
        marginTop: -30,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
    },
    infoSection: { paddingTop: 25 },
    title: { fontSize: 28, fontWeight: '800', color: '#1A1A1A' },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        gap: 15,
    },
    ratingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF9E6',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    ratingText: { fontWeight: 'bold', color: '#FFB300' },
    reviewText: { color: '#888', fontSize: 12 },
    timeBox: { flexDirection: 'row', alignItems: 'center' },
    timeText: { color: '#666', fontWeight: '500' },
    divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 25 },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 20,
    },
    cartFooter: { position: 'absolute', bottom: 30, left: 20, right: 20 },
    cartBtn: {
        backgroundColor: '#FF6B35',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        borderRadius: 20,
        justifyContent: 'space-between',
        elevation: 10,
        shadowColor: '#FF6B35',
        shadowOpacity: 0.4,
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
