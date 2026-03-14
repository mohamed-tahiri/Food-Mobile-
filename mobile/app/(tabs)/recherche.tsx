import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    FlatList,
    Alert,
} from 'react-native';
import { Search, History, TrendingUp, X, Mic } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CardRestaurant from '@/components/ui/card/CardRestaurant';
import CardCuisineItem from '@/components/ui/card/CardCuisineItem';

import { restaurantService } from '@/services/restaurant.service';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Resto } from '@/types/resto';
import { Category } from '@/types/category';

const RECENT_SEARCHES_KEY = 'RECENT_SEARCHES';

export default function SearchScreen() {
    const [searchText, setSearchText] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [allRestos, setAllRestos] = useState<Resto[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [filteredRestos, setFilteredRestos] = useState<Resto[]>([]);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);

    const backgroundColor = useThemeColor({}, 'background');
    const headerColor = useThemeColor({}, 'tabBar'); 
    const textColor = useThemeColor({}, 'text');
    const textMuted = useThemeColor({}, 'textMuted');
    const primaryColor = useThemeColor({}, 'primary');
    const borderColor = useThemeColor({}, 'border');

    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            try {
                const [resRestos, resCats, storedSearches] = await Promise.all([
                    restaurantService.getAll(),
                    restaurantService.getCategories(), 
                    AsyncStorage.getItem(RECENT_SEARCHES_KEY)
                ]);

                if (resRestos.success) setAllRestos(resRestos.data);
                if (resCats.success) setCategories(resCats.data);
                if (storedSearches) setRecentSearches(JSON.parse(storedSearches));
            } catch (error) {
                console.error("Erreur Initialisation Search :", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadInitialData();
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchText);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchText]);

    useEffect(() => {
        const query = debouncedQuery.trim().toLowerCase();
        if (query.length > 0) {
            setIsSearching(true);
            const matches = allRestos.filter(
                (resto) =>
                    resto.name.toLowerCase().includes(query) ||
                    resto.cuisine?.some(c => c.toLowerCase().includes(query))
            );
            setFilteredRestos(matches);
            setIsSearching(false);
        } else {
            setFilteredRestos([]);
        }
    }, [debouncedQuery, allRestos]);

    const saveSearch = async (term: string) => {
        const cleanTerm = term.trim();
        if (!cleanTerm) return;
        const filtered = recentSearches.filter(s => s !== cleanTerm);
        const newHistory = [cleanTerm, ...filtered].slice(0, 5);
        setRecentSearches(newHistory);
        await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(newHistory));
    };

    const startVoiceSearch = () => {
        Alert.alert("Recherche vocale", "Écoute en cours... (Simulé pour Mohamed)");
        
        setTimeout(() => {
            const voiceResult = "Burger"; 
            setSearchText(voiceResult);
            saveSearch(voiceResult);
        }, 2000);
    };

    const renderHeader = () => (
        <View style={{ paddingHorizontal: 20 }}>
            {recentSearches.length > 0 && searchText === "" && (
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: textColor }]}>Récents</Text>
                        <TouchableOpacity onPress={() => setRecentSearches([])}>
                            <Text style={[styles.clearAllText, { color: primaryColor }]}>Effacer</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.chipContainer}>
                        {recentSearches.map((item, i) => (
                            <TouchableOpacity
                                key={i}
                                style={[styles.chip, { backgroundColor: headerColor, borderColor }]}
                                onPress={() => setSearchText(item)}
                            >
                                <History size={14} color={primaryColor} style={{ marginRight: 6 }} />
                                <Text style={[styles.chipText, { color: textColor }]}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}

            {searchText === "" && (
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: textColor }]}>Parcourir par cuisine</Text>
                        <TrendingUp size={16} color={textMuted} />
                    </View>
                    <View style={styles.grid}>
                        {categories.map((cat) => (
                            <CardCuisineItem
                                key={cat.id}
                                item={cat}
                                // Si la cuisine est sélectionnée, on pourrait changer le style ici
                                // isActive={searchText.toLowerCase() === cat.name.toLowerCase()}
                                setSearchText={(val) => {
                                    setSearchText(val);
                                    saveSearch(val);
                                }} 
                            />
                        ))}
                    </View>
                </View>
            )}
        </View>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Search size={50} color={textMuted} />
            <Text style={[styles.emptyText, { color: textMuted }]}>
                {searchText ? "Aucun restaurant trouvé pour cette recherche." : "Trouvez votre prochain repas !"}
            </Text>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <View style={[styles.header, { backgroundColor: headerColor }]}>
                <Text style={[styles.title, { color: textColor }]}>Rechercher</Text>
                <View style={styles.searchContainer}>
                    <View style={[styles.searchBar, { backgroundColor, borderColor, borderWidth: 1 }]}>
                        <Search size={20} color={textMuted} />
                        <TextInput
                            placeholder="Restaurants ou cuisines..."
                            placeholderTextColor={textMuted}
                            style={[styles.input, { color: textColor }]}
                            value={searchText}
                            onChangeText={setSearchText}
                            onSubmitEditing={() => saveSearch(searchText)}
                            returnKeyType="search"
                        />
                        {searchText.length > 0 ? (
                            <TouchableOpacity onPress={() => setSearchText('')}>
                                <X size={18} color={textMuted} />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={startVoiceSearch}>
                                <Mic size={20} color={primaryColor} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>

            {isLoading ? (
                <ActivityIndicator size="large" color={primaryColor} style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={searchText ? filteredRestos : []}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={{ paddingHorizontal: 20, marginBottom: 15 }}>
                            <CardRestaurant resto={item} />
                        </View>
                    )}
                    ListHeaderComponent={renderHeader}
                    ListEmptyComponent={renderEmptyState}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20, marginBottom: 20 },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 15 },
    searchContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    searchBar: { flex: 1, flexDirection: 'row', padding: 12, borderRadius: 15, alignItems: 'center' },
    input: { flex: 1, marginLeft: 10, fontSize: 16 },
    section: { marginTop: 25 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold' },
    clearAllText: { fontSize: 14, fontWeight: '600' },
    chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 25, borderWidth: 1 },
    chipText: { fontWeight: '500' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    emptyContainer: { alignItems: 'center', marginTop: 100, paddingHorizontal: 40 },
    emptyText: { marginTop: 15, textAlign: 'center', fontSize: 16 }
});