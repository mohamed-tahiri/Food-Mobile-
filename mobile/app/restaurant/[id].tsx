import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Dimensions,
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
    Phone, 
    Navigation,
    Bike,
    MapPin
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
import { addressService } from '@/services/address.service';

// Types
import { Resto } from '@/types/resto';

const { width } = Dimensions.get('window');

export default function RestaurantDetail() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    
    const [restaurant, setRestaurant] = useState<Resto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [reviews, setReviews] = useState<any[]>([]);
    
    // États pour la livraison dynamique
    const [currentAddress, setCurrentAddress] = useState<any>(null);
    const [deliveryInfo, setDeliveryInfo] = useState({ time: '--', cost: '--' });

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

    // Calcul dynamique de livraison
    const calculateDeliveryEstimation = (address: any) => {
        const distanceSimulated = 3.2; 
        const estimatedTime = 15 + Math.round(distanceSimulated * 4);
        const estimatedCost = (2.00 + (distanceSimulated * 0.5)).toFixed(2);

        setDeliveryInfo({
            time: `${estimatedTime}-${estimatedTime + 10}`,
            cost: estimatedCost
        });
    };

    const fetchAllData = async () => {
        try {
            const [resDetails, resMenu, resReviews, resAddr] = await Promise.all([
                restaurantService.getDetails(id as string),
                restaurantService.getMenu(id as string),
                restaurantService.getReviews(id as string),
                addressService.getAll()
            ]);

            console.log(resReviews);

            // 1. Charger Restaurant & Menu
            if (resDetails.success && resMenu.success) {
                setRestaurant({ ...resDetails.data, menuCategories: resMenu.data });
            }

            // 2. Charger les Reviews (Avis)
            if (resReviews.success) {
                setReviews(resReviews.data);
            }

            if (resAddr.success && resAddr.data.length > 0) {
                const defaultAddr = resAddr.data.find((a: any) => a.isDefault === true) || resAddr.data[0];
                setCurrentAddress(defaultAddr);
                calculateDeliveryEstimation(defaultAddr);
            }
        } catch (error) {
            console.error("Erreur fetch global:", error);
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
        if (reviewRating === 0) return Alert.alert("Note requise", "Hey, donne au moins une étoile ! ⭐");
        
        setIsSubmittingReview(true);
        const formData = new FormData();
        formData.append('restaurantId', String(id));
        formData.append('rating', String(reviewRating));
        formData.append('comment', reviewComment);

        reviewImages.forEach((uri, index) => {
            const fileName = uri.split('/').pop() || `review_${index}.jpg`;
            // @ts-ignore
            formData.append('images', { uri, name: fileName, type: 'image/jpeg' });
        });

        try {
            const res = await restaurantService.createReview(formData);

            console.log("Response from review submission:", res);
            
            if (res.success) {
                setIsReviewModalVisible(false);
                setReviewRating(0);
                setReviewComment('');
                setReviewImages([]);
                fetchAllData();

                Alert.alert("Merci !", "Ton avis a été publié avec succès. 🎉");
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

            {/* Header Flottant */}
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

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
                <View style={styles.imageHeader}>
                    <Image source={{ uri: restaurant?.image }} style={styles.mainImage} resizeMode="cover" />
                    <View style={styles.overlay} />
                </View>

                <View style={[styles.contentCard, { backgroundColor }]}>
                    <View style={styles.infoSection}>
                        <Text style={[styles.title, { color: textColor }]}>{restaurant?.name}</Text>
                        
                        <View style={styles.metaRow}>
                            <View style={[styles.ratingBox, { backgroundColor: '#FFB30020' }]}>
                                <Star size={16} color="#FFB300" fill="#FFB300" />
                                <Text style={styles.ratingText}> {restaurant?.rating}</Text>
                                <Text style={[styles.reviewText, { color: textMuted }]}> ({restaurant?.reviewCount})</Text>
                            </View>

                            <View style={styles.infoBadge}>
                                <Clock size={16} color={primaryColor} />
                                <Text style={[styles.infoBadgeText, { color: textColor }]}>{deliveryInfo.time} min</Text>
                            </View>

                            <View style={styles.infoBadge}>
                                <Bike size={16} color="#4CAF50" />
                                <Text style={[styles.infoBadgeText, { color: textColor }]}>{deliveryInfo.cost} €</Text>
                            </View>
                        </View>

                        {/* Barre d'adresse actuelle */}
                        <TouchableOpacity 
                            style={[styles.addressBar, { backgroundColor: cardColor }]}
                            onPress={() => router.push('/address/manage')}
                        >
                            <MapPin size={14} color={primaryColor} />
                            <Text style={[styles.addressText, { color: textMuted }]} numberOfLines={1}>
                                {currentAddress ? `Livrer à : ${currentAddress.street}` : "Ajouter une adresse"}
                            </Text>
                            <Text style={{ color: primaryColor, fontSize: 12, fontWeight: '700' }}>Changer</Text>
                        </TouchableOpacity>

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

                    {/* Menu par Catégories */}
                    {restaurant?.menuCategories?.map((category) => (
                        <View key={category.id} style={styles.menuSection}>
                            <Text style={[styles.sectionTitle, { color: textColor }]}>{category.name}</Text>
                            {category.items.map((item) => (
                                <CardMenuItem key={item.id} menuId={String(id)} item={item} />
                            ))}
                        </View>
                    ))}

                    {/* Section des Avis */}
                    <View style={styles.reviewSection}>
                        <View style={styles.reviewHeader}>
                            <Text style={[styles.sectionTitle, { color: textColor }]}>Avis clients</Text>
                            <TouchableOpacity onPress={() => setIsReviewModalVisible(true)}>
                                <Text style={{ color: primaryColor, fontWeight: 'bold' }}>Donner mon avis</Text>
                            </TouchableOpacity>
                        </View>
                        {reviews.length > 0 ? (
                            reviews.map((rev) => <CardReview key={rev.id} review={rev} />)
                        ) : (
                            <Text style={{ color: textMuted, textAlign: 'center', marginVertical: 20 }}>Hey, sois le premier à donner un avis ! ✍️</Text>
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* Modal de Review */}
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
                        <TextInput style={[styles.reviewInput, { color: textColor, borderColor }]} placeholder="Alors, c'était comment ?" multiline value={reviewComment} onChangeText={setReviewComment} />
                        
                        <View style={styles.imageSelectionRow}>
                            <TouchableOpacity style={[styles.addPhotoBtn, { borderColor: primaryColor }]} onPress={handlePickReviewImages}>
                                <Camera size={24} color={primaryColor} />
                                <Text style={{ color: primaryColor, fontSize: 10, fontWeight: 'bold' }}>+ PHOTO</Text>
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
                            {isSubmittingReview ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitText}>Publier mon avis</Text>}
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Panier Flottant */}
            {totalItems > 0 && (
                <View style={styles.cartFooter}>
                    <TouchableOpacity style={[styles.cartBtn, { backgroundColor: primaryColor }]} onPress={() => router.push({ pathname: '/cart/[id]', params: { id: String(restaurant?.id) } })}>
                        <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{totalItems}</Text></View>
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
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    floatingHeader: { position: 'absolute', top: 0, left: 0, right: 0, height: 100, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 40, zIndex: 10 },
    backBtn: { padding: 10, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.9)', elevation: 5 },
    rightActions: { flexDirection: 'row', gap: 10 },
    actionBtn: { padding: 10, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.9)', elevation: 5 },
    imageHeader: { height: 280, width: width },
    mainImage: { width: '100%', height: '100%' },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.1)' },
    contentCard: { marginTop: -30, borderTopLeftRadius: 35, borderTopRightRadius: 35, paddingHorizontal: 20, flex: 1 },
    infoSection: { paddingTop: 25 },
    title: { fontSize: 28, fontWeight: '900', letterSpacing: -0.5 },
    metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 15, gap: 10 },
    ratingBox: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
    ratingText: { fontWeight: 'bold', color: '#FFB300', fontSize: 14 },
    reviewText: { fontSize: 12 },
    infoBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.04)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
    infoBadgeText: { fontWeight: '700', fontSize: 13 },
    addressBar: { flexDirection: 'row', alignItems: 'center', marginTop: 18, padding: 12, borderRadius: 15, gap: 8 },
    addressText: { flex: 1, fontSize: 12, fontWeight: '500' },
    actionRow: { flexDirection: 'row', paddingVertical: 20, marginTop: 15, borderTopWidth: 1, borderBottomWidth: 1, justifyContent: 'space-around' },
    contactAction: { alignItems: 'center', gap: 8 },
    actionIconCircle: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
    actionLabel: { fontSize: 13, fontWeight: '600' },
    menuSection: { marginTop: 30 },
    sectionTitle: { fontSize: 20, fontWeight: '900', marginBottom: 15 },
    reviewSection: { marginTop: 30, borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 20, paddingBottom: 50 },
    reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    cartFooter: { position: 'absolute', bottom: 30, left: 20, right: 20 },
    cartBtn: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 22, justifyContent: 'space-between', elevation: 12 },
    cartBadge: { backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12 },
    cartBadgeText: { color: '#FFF', fontWeight: '900' },
    cartBtnText: { color: '#FFF', fontWeight: '900', fontSize: 16 },
    cartTotalPrice: { color: '#FFF', fontWeight: '900', fontSize: 16 },
    modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { borderTopLeftRadius: 35, borderTopRightRadius: 35, padding: 25, minHeight: 520 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
    modalTitle: { fontSize: 22, fontWeight: '900' },
    starsContainer: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 25 },
    reviewInput: { borderWidth: 1, borderRadius: 20, padding: 18, height: 120, textAlignVertical: 'top', fontSize: 15, marginBottom: 20 },
    imageSelectionRow: { flexDirection: 'row', gap: 12, marginBottom: 25, alignItems: 'center' },
    addPhotoBtn: { width: 75, height: 75, borderRadius: 18, borderWidth: 2, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' },
    previewContainer: { position: 'relative', marginRight: 12 },
    previewImage: { width: 75, height: 75, borderRadius: 18 },
    removeImgBtn: { position: 'absolute', top: -6, right: -6, backgroundColor: '#FF3B30', borderRadius: 12, padding: 4 },
    submitReviewBtn: { padding: 18, borderRadius: 20, alignItems: 'center' },
    submitText: { color: '#FFF', fontWeight: '900', fontSize: 16 }
});