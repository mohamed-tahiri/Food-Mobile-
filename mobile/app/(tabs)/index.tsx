import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Platform,
} from 'react-native';
import { Search, MapPin, SlidersHorizontal, Bell } from 'lucide-react-native';
import { useRouter, Stack } from 'expo-router';
import BottomSheet from '@gorhom/bottom-sheet';

// Hooks & Contexts
import { useNotifications } from '@/hooks/use-notifications';
import { useAuth } from '@/context/AuthContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { restaurantService } from '@/services/restaurant.service';
import { getCurrentAddress } from '@/services/localisation.service';

// UI Components
import CardPromo from '@/components/ui/card/CardPromo';
import CardRestaurant from '@/components/ui/card/CardRestaurant';
import CardCategory from '@/components/ui/card/CardCategory';
import FilterBottomSheet from '@/components/ui/FilterBottomSheet';

// Types & Data
import { offers } from '@/data/dataMocket';
import { Resto } from '@/types/resto';
import { Category } from '@/types/category';

export default function HomeScreen() {
    const { unreadCount, refresh: refreshNotifications } = useNotifications();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const { user } = useAuth(); 
    const router = useRouter();

    // States
    const [displayAddress, setDisplayAddress] = useState("Chargement...");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeSort, setActiveSort] = useState<string | null>(null);
    const [dataRestaurants, setDataRestaurants] = useState<Resto[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Theme colors
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const textMuted = useThemeColor({}, 'textMuted');
    const cardColor = useThemeColor({}, 'card');
    const primaryColor = useThemeColor({}, 'primary');
    const primaryLight = useThemeColor({}, 'primaryLight');

    const handleOpenFilters = useCallback(() => {
        bottomSheetRef.current?.expand();
    }, []);

    // Chargement des données
    const loadData = async () => {
        try {
            const [resRestos, resCats] = await Promise.all([
                restaurantService.getAll(),
                restaurantService.getCategories()
            ]);

            if (resRestos.success) setDataRestaurants(resRestos.data);
            if (resCats.success) setCategories(resCats.data);
            
            // Rafraîchir aussi les notifications
            refreshNotifications();
        } catch (error) {
            console.error("Erreur Home LoadData:", error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadData();
    }, []);

    useEffect(() => {
        loadData();
        const fetchLocation = async () => {
            try {
                const address = await getCurrentAddress();
                setDisplayAddress(address);
            } catch (err) {
                console.log(err);
                setDisplayAddress("13 Allée de la Noiseraie, Noisy-le-Grand");
            }
        };
        fetchLocation();
    }, []);

    // Filtrage & Tri
    const filteredRestaurants = dataRestaurants.filter((resto: Resto) => {
        const search = searchQuery.toLowerCase().trim();
        const isAllSelected = !selectedCategory || selectedCategory === 'Tout';
        
        const matchCategory = isAllSelected 
            ? true 
            : resto.categories?.includes(selectedCategory!) || 
              resto.cuisine?.some(c => c.toLowerCase().includes(selectedCategory!.toLowerCase()));
        
        const matchSearch = resto.name.toLowerCase().includes(search) || 
                           resto.cuisine?.some(c => c.toLowerCase().includes(search));

        return matchCategory && matchSearch;
    }).sort((a, b) => {
        if (activeSort === 'rating') return b.rating - a.rating;
        if (activeSort === 'time') return a.deliveryTime.max - b.deliveryTime.max;
        return 0;
    });

    return (
        <View style={{ flex: 1, backgroundColor }}>
            <Stack.Screen options={{ headerShown: false }} />
            
            <ScrollView
                style={[styles.container, { backgroundColor }]}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={primaryColor} />
                }
            >
                {/* Header Section */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.locationContainer} onPress={() => router.push('/(tabs)/profile')}>
                        <Text style={[styles.deliveryTo, { color: textMuted }]}>Livrer au</Text>
                        <View style={styles.locationRow}>
                            <View style={[styles.iconCircle, { backgroundColor: primaryLight }]}>
                                <MapPin size={16} color={primaryColor} fill={`${primaryColor}20`} />
                            </View>
                            <Text style={[styles.address, { color: textColor }]} numberOfLines={1}>{displayAddress}</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.headerRight}>
                        {/* Cloche de Notifications avec Badge */}
                        <TouchableOpacity 
                            style={[styles.notifBtn, { backgroundColor: cardColor }]} 
                            onPress={() => router.push('/notifications')}
                        >
                            <Bell size={22} color={textColor} />
                            {unreadCount > 0 && (
                                <View style={[styles.notifBadge, { backgroundColor: '#FF3B30' }]}>
                                    <Text style={styles.notifBadgeText}>{unreadCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        {/* Profile Pic de Mohamed */}
                        <TouchableOpacity onPress={() => router.push('/profile')} activeOpacity={0.8}>
                            <View style={styles.profileContainer}>
                                <View style={[styles.profilePic, { backgroundColor: primaryColor }]}>
                                    <Text style={styles.profileInitial}>
                                        {user?.name ? user.name.charAt(0).toUpperCase() : 'M'}
                                    </Text>
                                </View>
                                <View style={[styles.onlineBadge, { borderColor: backgroundColor }]} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Search Bar */}
                <View style={styles.searchSection}>
                    <View style={[styles.searchBar, { backgroundColor: cardColor }]}>
                        <Search size={20} color={textMuted} />
                        <TextInput
                            placeholderTextColor={textMuted}
                            placeholder="Pizza, Sushi, Burgers..."
                            style={[styles.searchInput, { color: textColor }]}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                    <TouchableOpacity style={[styles.filterBtn, { backgroundColor: primaryColor }]} onPress={handleOpenFilters}>
                        <SlidersHorizontal size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {/* Banner Promos */}
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    style={styles.promoContainer} 
                    snapToInterval={310} 
                    decelerationRate="fast"
                >
                    {offers.map((offer) => (
                        <CardPromo key={offer.id} offer={offer} />
                    ))}
                </ScrollView>
                
                {/* Categories */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>Catégories</Text>
                    <TouchableOpacity><Text style={{ color: primaryColor, fontWeight: 'bold' }}>Voir tout</Text></TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
                    <CardCategory 
                        cat={{ id: 'all', name: 'Tout', icon: '🍽️', slug: '', image:'', restaurantCount: 0 }} 
                        isSelected={selectedCategory === null || selectedCategory === 'Tout'} 
                        setSelectedCategory={setSelectedCategory}
                    />
                    {categories.map((cat: Category) => (
                        <CardCategory
                            key={cat.id}
                            cat={cat}
                            isSelected={selectedCategory === cat.name}
                            setSelectedCategory={setSelectedCategory}
                        />
                    ))}
                </ScrollView>

                {/* Restaurants List */}
                <Text style={[styles.sectionTitle, { color: textColor, marginTop: 20, marginBottom: 20 }]}>
                    {selectedCategory && selectedCategory !== 'Tout' ? `${selectedCategory}` : 'Populaires à proximité'}
                </Text>

                {isLoading ? (
                    <ActivityIndicator size="large" color={primaryColor} style={{ marginTop: 50 }} />
                ) : (
                    <View style={styles.restaurantList}>
                        {filteredRestaurants.map((resto: Resto) => (
                            <CardRestaurant key={resto.id} resto={resto} />
                        ))}
                        {filteredRestaurants.length === 0 && (
                            <View style={styles.emptyContainer}>
                                <Text style={{ color: textMuted, textAlign: 'center', fontSize: 16 }}>{`Aucun restaurant trouvé pour "${searchQuery}" 🍕`}</Text>
                            </View>
                        )}
                    </View>
                )}
                
                <View style={{ height: 100 }} />
            </ScrollView>

            <FilterBottomSheet ref={bottomSheetRef} onApply={(sortType) => setActiveSort(sortType)} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Platform.OS === 'ios' ? 60 : 40, marginBottom: 20 },
    locationContainer: { flex: 1, marginRight: 10 },
    deliveryTo: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 1 },
    locationRow: { flexDirection: 'row', alignItems: 'center' },
    iconCircle: { padding: 8, borderRadius: 12, marginRight: 10 },
    address: { fontWeight: '800', fontSize: 15, flex: 1 },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    notifBtn: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', position: 'relative' },
    notifBadge: { position: 'absolute', top: 12, right: 12, width: 16, height: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
    notifBadgeText: { color: '#FFF', fontSize: 8, fontWeight: 'bold' },
    profileContainer: { position: 'relative' },
    profilePic: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 4 },
    profileInitial: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
    onlineBadge: { position: 'absolute', right: -2, top: -2, width: 14, height: 14, borderRadius: 7, backgroundColor: '#4CAF50', borderWidth: 2 },
    searchSection: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 10 },
    searchBar: { flex: 1, flexDirection: 'row', padding: 12, borderRadius: 15, alignItems: 'center' },
    searchInput: { marginLeft: 10, flex: 1, fontSize: 16 },
    filterBtn: { padding: 12, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
    promoContainer: { marginTop: 25 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 20 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold' },
    restaurantList: { gap: 15 },
    emptyContainer: { padding: 50, alignItems: 'center' }
});