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
} from 'react-native';
import { Search, MapPin, SlidersHorizontal } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import BottomSheet from '@gorhom/bottom-sheet';

// UI Components
import CardPromo from '@/components/ui/card/CardPromo';
import CardRestaurant from '@/components/ui/card/CardRestaurant';
import CardCategory from '@/components/ui/card/CardCategory';
import FilterBottomSheet from '@/components/ui/FilterBottomSheet';

// Services & Context
import { restaurantService } from '@/services/restaurant.service';
import { getCurrentAddress } from '@/services/localisation.service';
import { useAuth } from '@/context/AuthContext';
import { useThemeColor } from '@/hooks/use-theme-color';

// Types & Data
import { offers } from '@/data/dataMocket';
import { Resto } from '@/types/resto';
import { Category } from '@/types/category';

export default function HomeScreen() {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const { user } = useAuth(); // Récupération de Mohamed depuis le contexte
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

    // Utilisation des SERVICES pour charger les données
    const loadData = async () => {
        try {
            const [resRestos, resCats] = await Promise.all([
                restaurantService.getAll(),
                restaurantService.getCategories()
            ]);

            if (resRestos.success) setDataRestaurants(resRestos.data);
            if (resCats.success) setCategories(resCats.data);
        } catch (error) {
            console.error("Erreur lors du chargement des services :", error);
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
                console.error(err);
                setDisplayAddress("13 Allée de la Noiseraie, Noisy-le-Grand");
            }
        };
        fetchLocation();
    }, []);

    // Logique de filtrage (reste en local pour la réactivité)
    const filteredRestaurants = dataRestaurants.filter((resto: Resto) => {
        const search = searchQuery.toLowerCase().trim();
        const normalizedName = resto.name.toLowerCase();
        const isAllSelected = !selectedCategory || selectedCategory === 'Tout';
        
        const matchCategory = isAllSelected 
            ? true 
            : resto.categories?.includes(selectedCategory!) || resto.cuisine?.some(c => c.toLowerCase().includes(selectedCategory!.toLowerCase()));
        
        const matchSearch = normalizedName.includes(search) || 
                           resto.cuisine?.some(c => c.toLowerCase().includes(search));

        return matchCategory && matchSearch;
    }).sort((a, b) => {
        if (activeSort === 'rating') return b.rating - a.rating;
        if (activeSort === 'time') return a.deliveryTime.max - b.deliveryTime.max;
        return 0;
    });

    return (
        <View style={{ flex: 1, backgroundColor }}>
            <ScrollView
                style={[styles.container, { backgroundColor }]}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={primaryColor} />
                }
            >
                {/* Header avec infos de Mohamed (Dynamique) */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.locationContainer} activeOpacity={0.7}>
                        <Text style={[styles.deliveryTo, { color: textMuted }]}>Livrer au</Text>
                        <View style={styles.locationRow}>
                            <View style={[styles.iconCircle, { backgroundColor: primaryLight }]}>
                                <MapPin size={16} color={primaryColor} fill={`${primaryColor}20`} />
                            </View>
                            <Text style={[styles.address, { color: textColor }]} numberOfLines={1}>{displayAddress}</Text>
                        </View>
                    </TouchableOpacity>

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

                {/* Barre de Recherche */}
                <View style={styles.searchSection}>
                    <View style={[styles.searchBar, { backgroundColor: cardColor }]}>
                        <Search size={20} color={textMuted} />
                        <TextInput
                            placeholderTextColor={textMuted}
                            placeholder="Un restaurant, un plat..."
                            style={[styles.searchInput, { color: textColor }]}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                    <TouchableOpacity style={[styles.filterBtn, { backgroundColor: primaryColor }]} onPress={handleOpenFilters}>
                        <SlidersHorizontal size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {/* Promos (Data Mockée) */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promoContainer} snapToInterval={310} decelerationRate="fast">
                    {offers.map((offer) => (
                        <CardPromo key={offer.id} offer={offer} />
                    ))}
                </ScrollView>
                
                {/* Catégories Dynamiques */}
                <Text style={[styles.sectionTitle, { color: textColor }]}>Catégories</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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

                {/* Restaurants */}
                <Text style={[styles.sectionTitle, { color: textColor }]}>
                    {selectedCategory && selectedCategory !== 'Tout' ? `Restaurants : ${selectedCategory}` : 'Populaires à proximité'}
                </Text>

                {isLoading ? (
                    <ActivityIndicator size="large" color={primaryColor} style={{ marginTop: 50 }} />
                ) : (
                    <>
                        {filteredRestaurants.map((resto: Resto) => (
                            <CardRestaurant key={resto.id} resto={resto} />
                        ))}
                        {filteredRestaurants.length === 0 && (
                            <View style={styles.emptyContainer}>
                                <Text style={{ color: textMuted, textAlign: 'center', fontSize: 16 }}>Aucun résultat trouvé 🍕</Text>
                            </View>
                        )}
                    </>
                )}
                
                <View style={{ height: 100 }} />
            </ScrollView>

            <FilterBottomSheet ref={bottomSheetRef} onApply={(sortType) => setActiveSort(sortType)} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 60, marginBottom: 20 },
    locationContainer: { flex: 1, marginRight: 20 },
    deliveryTo: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 0.5 },
    locationRow: { flexDirection: 'row', alignItems: 'center' },
    iconCircle: { padding: 8, borderRadius: 12, marginRight: 10 },
    address: { fontWeight: '800', fontSize: 16, flex: 1 },
    profileContainer: { position: 'relative' },
    profilePic: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', elevation: 4 },
    profileInitial: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
    onlineBadge: { position: 'absolute', right: -2, top: -2, width: 14, height: 14, borderRadius: 7, backgroundColor: '#4CAF50', borderWidth: 2 },
    searchSection: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 10 },
    searchBar: { flex: 1, flexDirection: 'row', padding: 12, borderRadius: 15, alignItems: 'center' },
    searchInput: { marginLeft: 10, flex: 1, fontSize: 16 },
    filterBtn: { padding: 12, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
    promoContainer: { marginTop: 25 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 20 },
    emptyContainer: { padding: 50, alignItems: 'center' }
});