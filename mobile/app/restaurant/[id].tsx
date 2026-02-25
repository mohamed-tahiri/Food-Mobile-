import React, { useEffect, useState } from 'react';
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
    ActivityIndicator,
    Modal,
    TextInput,
    Alert,
    KeyboardAvoidingView,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { 
    ChevronLeft, 
    Star, 
    Camera, 
    X, 
    Clock, 
    Heart, 
    Share2, 
    Phone, 
    Navigation 
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

// UI Components
import CardMenuItem from '@/components/ui/card/CardMenuItem';
import CardReview from '@/components/ui/card/CardReview';

// Hooks & Services
import { useThemeColor } from '@/hooks/use-theme-color';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoriteContext';
import { restaurantService } from '@/services/restaurant.service';

// Types
import { Resto } from '@/types/resto';

const { width } = Dimensions.get('window');

export default function RestaurantDetail() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    
    const [restaurant, setRestaurant] = useState<Resto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [reviews, setReviews] = useState<any[]>([]);

    const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewImages, setReviewImages] = useState<string[]>([]);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const textMuted = useThemeColor({}, 'textMuted');
    const primaryColor = useThemeColor({}, 'primary');
    const borderColor = useThemeColor({}, 'border');
    const cardColor = useThemeColor({}, 'card');

    const { totalItems, totalPrice } = useCart();
    const { toggleFavorite, isFavorite } = useFavorites();

    const fetchAllData = async () => {
        try {
            const [resDetails, resMenu, resReviews] = await Promise.all([
                restaurantService.getDetails(id as string),
                restaurantService.getMenu(id as string),
                restaurantService.getReviews(id as string)
            ]);

            if (resDetails.success && resMenu.success) {
                setRestaurant({ ...resDetails.data, menuCategories: resMenu.data });
                if (resReviews.success) setReviews(resReviews.data);
            }
        } catch (error) {
            console.error("Erreur liaison globale:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchAllData();
    }, [id]);

    const handlePickReviewImages = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: true,
            selectionLimit: 5 - reviewImages.length,
            quality: 0.6,
        });
        if (!result.canceled) {
            const uris = result.assets.map(asset => asset.uri);
            setReviewImages([...reviewImages, ...uris]);
        }
    };

    const submitReview = async () => {
        if (reviewRating === 0) return Alert.alert("Note requise", "Donne au moins une étoile ! ⭐");
        setIsSubmittingReview(true);
        const formData = new FormData();
        formData.append('restaurantId', String(id));
        formData.append('rating', String(reviewRating));
        formData.append('comment', reviewComment);

        reviewImages.forEach((uri, index) => {
            const fileName = uri.split('/').pop() || `review_${index}.jpg`;
            formData.append('images', { uri, name: fileName, type: 'image/jpeg' } as any);
        });

        try {
            const res = await restaurantService.createReview(formData);
            if (res.success) {
                setIsReviewModalVisible(false);
                setReviewRating(0);
                setReviewComment('');
                setReviewImages([]);
                fetchAllData();
            }
        } catch (error) {
            Alert.alert("Erreur", "Impossible d'envoyer l'avis.");
        } finally {
            setIsSubmittingReview(false);
        }
    };

    if (isLoading) return <View style={[styles.loaderContainer, { backgroundColor }]}><ActivityIndicator size="large" color={primaryColor} /></View>;

    const isFav = isFavorite(String(id));

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Boutons flottants de navigation (au-dessus du ScrollView) */}
            <View style={styles.floatingHeader}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <ChevronLeft color="#000" size={24} />
                </TouchableOpacity>
                <View style={styles.rightActions}>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => toggleFavorite(String(id))}>
                        <Heart size={20} color={isFav ? "#FF3B30" : "#000"} fill={isFav ? "#FF3B30" : "transparent"} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView 
                style={styles.container} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 150 }}
            >
                {/* L'image est maintenant la première chose dans le ScrollView */}
                <View style={styles.imageHeader}>
                    <Image source={{ uri: restaurant?.image }} style={styles.mainImage} resizeMode="cover" />
                    <View style={styles.overlay} />
                </View>

                {/* Le contenu qui remonte sur l'image */}
                <View style={[styles.contentCard, { backgroundColor }]}>
                    <View style={styles.infoSection}>
                        <Text style={[styles.title, { color: textColor }]}>{restaurant?.name}</Text>
                        <View style={styles.metaRow}>
                            <View style={[styles.ratingBox, { backgroundColor: '#FFB30020' }]}>
                                <Star size={16} color="#FFB300" fill="#FFB300" />
                                <Text style={styles.ratingText}> {restaurant?.rating}</Text>
                                <Text style={[styles.reviewText, { color: textMuted }]}> ({restaurant?.reviewCount})</Text>
                            </View>
                            <View style={styles.timeBox}>
                                <Clock size={16} color={textMuted} />
                                <Text style={[styles.timeText, { color: textMuted }]}> {restaurant?.deliveryTime?.min}-{restaurant?.deliveryTime?.max} min</Text>
                            </View>
                        </View>

                        <View style={[styles.actionRow, { borderTopColor: borderColor, borderBottomColor: borderColor }]}>
                            <TouchableOpacity style={styles.contactAction} onPress={() => restaurant?.phone && Linking.openURL(`tel:${restaurant.phone}`)}>
                                <View style={[styles.actionIconCircle, { backgroundColor: primaryColor + '15' }]}><Phone size={20} color={primaryColor} /></View>
                                <Text style={[styles.actionLabel, { color: textColor }]}>Appeler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.contactAction} onPress={() => restaurant?.address && Linking.openURL(Platform.OS === 'ios' ? `maps:0,0?q=${restaurant.address}` : `geo:0,0?q=${restaurant.address}`)}>
                                <View style={[styles.actionIconCircle, { backgroundColor: '#4CAF5015' }]}><Navigation size={20} color="#4CAF50" /></View>
                                <Text style={[styles.actionLabel, { color: textColor }]}>Itinéraire</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Menus */}
                    {restaurant?.menuCategories?.map((category) => (
                        <View key={category.id} style={styles.menuSection}>
                            <Text style={[styles.sectionTitle, { color: textColor }]}>{category.name}</Text>
                            {category.items.map((item) => (
                                <CardMenuItem key={item.id} menuId={String(id)} item={item} />
                            ))}
                        </View>
                    ))}

                    {/* Avis */}
                    <View style={styles.reviewSection}>
                        <View style={styles.reviewHeader}>
                            <Text style={[styles.sectionTitle, { color: textColor }]}>Avis clients</Text>
                            <TouchableOpacity onPress={() => setIsReviewModalVisible(true)}>
                                <Text style={{ color: primaryColor, fontWeight: 'bold' }}>Donner mon avis</Text>
                            </TouchableOpacity>
                        </View>
                        {reviews.length > 0 ? reviews.map((rev) => <CardReview key={rev.id} review={rev} />) : <Text style={{ color: textMuted, textAlign: 'center' }}>Aucun avis.</Text>}
                    </View>
                </View>
            </ScrollView>

            {/* Modal & Footer (Idem précédent) */}
            <Modal visible={isReviewModalVisible} animationType="slide" transparent={true}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: cardColor || '#FFF' }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: textColor }]}>Donner ton avis</Text>
                            <TouchableOpacity onPress={() => setIsReviewModalVisible(false)}><X color={textMuted} size={24} /></TouchableOpacity>
                        </View>
                        <View style={styles.starsContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity key={star} onPress={() => setReviewRating(star)}>
                                    <Star size={35} color={star <= reviewRating ? "#FFB300" : textMuted} fill={star <= reviewRating ? "#FFB300" : "transparent"} />
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TextInput style={[styles.reviewInput, { color: textColor, borderColor }]} placeholder="Ton avis Mohamed..." multiline value={reviewComment} onChangeText={setReviewComment} />
                        <View style={styles.imageSelectionRow}>
                            <TouchableOpacity style={[styles.addPhotoBtn, { borderColor: primaryColor }]} onPress={handlePickReviewImages}>
                                <Camera size={24} color={primaryColor} /><Text style={{ color: primaryColor, fontSize: 10, fontWeight: 'bold' }}>+ PHOTO</Text>
                            </TouchableOpacity>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {reviewImages.map((uri, index) => (
                                    <View key={index} style={styles.previewContainer}>
                                        <Image source={{ uri }} style={styles.previewImage} />
                                        <TouchableOpacity style={styles.removeImgBtn} onPress={() => setReviewImages(reviewImages.filter((_, i) => i !== index))}><X size={10} color="#FFF" /></TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                        <TouchableOpacity style={[styles.submitReviewBtn, { backgroundColor: primaryColor }]} onPress={submitReview} disabled={isSubmittingReview}>
                            {isSubmittingReview ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitText}>Publier</Text>}
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {totalItems > 0 && (
                <View style={styles.cartFooter}>
                    <TouchableOpacity style={[styles.cartBtn, { backgroundColor: primaryColor }]} onPress={() => router.push({ pathname: '/cart/[id]', params: { id: String(restaurant?.id) } })}>
                        <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{totalItems}</Text></View>
                        <Text style={styles.cartBtnText}>Panier</Text>
                        <Text style={styles.cartTotalPrice}>{totalPrice.toFixed(2)} €</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    floatingHeader: { position: 'absolute', top: 0, left: 0, right: 0, height: 100, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 40, zIndex: 10 },
    backBtn: { padding: 10, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.9)', elevation: 5 },
    rightActions: { flexDirection: 'row', gap: 10 },
    actionBtn: { padding: 10, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.9)', elevation: 5 },
    imageHeader: { height: 280, width: width },
    mainImage: { width: '100%', height: '100%' },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.1)' },
    contentCard: { marginTop: -30, borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 20, flex: 1 },
    infoSection: { paddingTop: 25 },
    title: { fontSize: 26, fontWeight: '800' },
    metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 15 },
    ratingBox: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
    ratingText: { fontWeight: 'bold', color: '#FFB300' },
    reviewText: { fontSize: 12 },
    timeBox: { flexDirection: 'row', alignItems: 'center' },
    timeText: { fontWeight: '500' },
    actionRow: { flexDirection: 'row', paddingVertical: 20, marginTop: 20, borderTopWidth: 1, borderBottomWidth: 1, justifyContent: 'space-around' },
    contactAction: { alignItems: 'center', gap: 8 },
    actionIconCircle: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
    actionLabel: { fontSize: 13, fontWeight: '600' },
    menuSection: { marginTop: 25 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
    reviewSection: { marginTop: 30, borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 20 },
    reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    cartFooter: { position: 'absolute', bottom: 30, left: 20, right: 20 },
    cartBtn: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 20, justifyContent: 'space-between', elevation: 10 },
    cartBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
    cartBadgeText: { color: '#FFF', fontWeight: 'bold' },
    cartBtnText: { color: '#FFF', fontWeight: '800', fontSize: 16 },
    cartTotalPrice: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
    modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
    modalContent: { borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, minHeight: 450 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 20, fontWeight: '800' },
    starsContainer: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 20 },
    reviewInput: { borderWidth: 1, borderRadius: 15, padding: 15, height: 100, textAlignVertical: 'top', fontSize: 15, marginBottom: 15 },
    imageSelectionRow: { flexDirection: 'row', gap: 10, marginBottom: 20, alignItems: 'center' },
    addPhotoBtn: { width: 70, height: 70, borderRadius: 15, borderWidth: 2, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' },
    previewContainer: { position: 'relative', marginRight: 10 },
    previewImage: { width: 70, height: 70, borderRadius: 15 },
    removeImgBtn: { position: 'absolute', top: -5, right: -5, backgroundColor: '#FF3B30', borderRadius: 10, padding: 2 },
    submitReviewBtn: { padding: 16, borderRadius: 15, alignItems: 'center' },
    submitText: { color: '#FFF', fontWeight: 'bold' }
});