import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { Search, MapPin, SlidersHorizontal } from 'lucide-react-native';
import CardPromo from '@/components/ui/card/CardPromo';
import CardRestaurant from '@/components/ui/card/CardRestaurant';
import { offers } from '@/data/dataMocket';
import CardCategory from '@/components/ui/card/CardCategory';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getCurrentAddress } from '@/services/localisation.service';
import FilterBottomSheet from '@/components/ui/FilterBottomSheet';
import BottomSheet from '@gorhom/bottom-sheet';
import { ENDPOINTS } from '@/constants/api';
import { Resto } from '@/types/resto';
import { Category } from '@/types/category';

export default function HomeScreen() {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [displayAddress, setDisplayAddress] = useState("Chargement...");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeSort, setActiveSort] = useState<string | null>(null);

    const [dataRestaurants, setDataRestaurants] = useState<Resto[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();

    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const textMuted = useThemeColor({}, 'textMuted');
    const cardColor = useThemeColor({}, 'card');
    const primaryColor = useThemeColor({}, 'primary');
    const primaryLight = useThemeColor({}, 'primaryLight');

    const handleOpenFilters = useCallback(() => {
        bottomSheetRef.current?.expand();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // On lance les deux appels en même temps pour gagner du temps
            const [resRestos, resCats] = await Promise.all([
                fetch(ENDPOINTS.RESTAURANTS),
                fetch(ENDPOINTS.CATEGORIES)
            ]);

            const jsonRestos = await resRestos.json();
            const jsonCats = await resCats.json();

            setDataRestaurants(jsonRestos.data || jsonRestos);
            setCategories(jsonCats.data || jsonCats);
        } catch (error) {
            console.error("Erreur Fetch API :", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const fetchLocation = async () => {
            try {
                const address = await getCurrentAddress();
                setDisplayAddress(address);
            } catch (err) {
                setDisplayAddress("13 Allée de la Noiseraie, Noisy-le-Grand");
            }
        };
        fetchLocation();
    }, []);

    // LOGIQUE DE FILTRAGE + TRI CORRIGÉE
    const filteredRestaurants = dataRestaurants.filter((resto: Resto) => {
        const search = searchQuery.toLowerCase().trim();
        const normalizedName = resto.name.toLowerCase();
        
        // On vérifie si une des cuisines correspond à la catégorie sélectionnée
        const isAllSelected = !selectedCategory || selectedCategory === 'Tout';
        const matchCategory = isAllSelected 
            ? true 
            : resto.cuisine?.some(c => c.toLowerCase().includes(selectedCategory!.toLowerCase()));
        
        // Recherche par nom ou par type de cuisine
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
            >
                {/* Header Localisation & Profil */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.locationContainer} activeOpacity={0.7}>
                        <Text style={[styles.deliveryTo, { color: textMuted }]}>Livrer au</Text>
                        <View style={styles.locationRow}>
                            <View style={[styles.iconCircle, { backgroundColor: primaryLight }]}>
                                <MapPin size={16} color={primaryColor} fill={`${primaryColor}20`} />
                            </View>
                            <Text style={[styles.address, { color: textColor }]} numberOfLines={1}>{displayAddress}</Text>
                            <Text style={[styles.dropdownArrow, { color: primaryColor }]}>⌄</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push('/profile')} activeOpacity={0.8}>
                        <View style={styles.profileContainer}>
                            <View style={[styles.profilePic, { backgroundColor: primaryColor }]}>
                                <Text style={styles.profileInitial}>M</Text>
                            </View>
                            <View style={[styles.onlineBadge, { borderColor: backgroundColor }]} />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Barre de Recherche + Bouton Filtre */}
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
                    <TouchableOpacity 
                        style={[styles.filterBtn, { backgroundColor: primaryColor }]} 
                        onPress={handleOpenFilters}
                    >
                        <SlidersHorizontal size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {/* Contenu Restant */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promoContainer} snapToInterval={310} decelerationRate="fast">
                    {offers.map((offer) => (
                        <CardPromo key={offer.id} offer={offer} />
                    ))}
                </ScrollView>
                
                <Text style={[styles.sectionTitle, { color: textColor }]}>Catégories</Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
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

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                    {selectedCategory && selectedCategory !== 'Tout' 
                        ? `Restaurants : ${selectedCategory}` 
                        : 'Populaires à proximité'}
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
                                <Text style={{ color: textMuted, textAlign: 'center', fontSize: 16 }}>
                                    {`Aucun résultat trouvé 🍕`}
                                </Text>
                            </View>
                        )}
                    </>
                )}
                
                <View style={{ height: 100 }} />
            </ScrollView>

            <FilterBottomSheet 
                ref={bottomSheetRef} 
                onApply={(sortType) => setActiveSort(sortType)} 
            />
        </View>
    );
}

// Les styles restent les mêmes que précédemment
const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 60, marginBottom: 20 },
    locationContainer: { flex: 1, marginRight: 20 },
    deliveryTo: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', marginBottom: 4 },
    locationRow: { flexDirection: 'row', alignItems: 'center' },
    iconCircle: { padding: 6, borderRadius: 10, marginRight: 8 },
    address: { fontWeight: '700', fontSize: 16, maxWidth: '80%' },
    dropdownArrow: { marginLeft: 5, fontSize: 18, fontWeight: 'bold' },
    profileContainer: { position: 'relative' },
    profilePic: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', elevation: 5 },
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