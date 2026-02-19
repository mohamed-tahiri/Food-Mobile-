import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { Search, History, TrendingUp, X } from 'lucide-react-native';

// UI Components
import CardRestaurant from '@/components/ui/card/CardRestaurant';
import CardCuisineItem from '@/components/ui/card/CardCuisineItem';

// Services & Hooks
import { restaurantService } from '@/services/restaurant.service';
import { useThemeColor } from '@/hooks/use-theme-color';

// Types
import { Resto } from '@/types/resto';
import { Category } from '@/types/category';

export default function SearchScreen() {
    const [searchText, setSearchText] = useState('');
    const [allRestos, setAllRestos] = useState<Resto[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [filteredRestos, setFilteredRestos] = useState<Resto[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const backgroundColor = useThemeColor({}, 'background');
    const headerColor = useThemeColor({}, 'tabBar'); 
    const textColor = useThemeColor({}, 'text');
    const textMuted = useThemeColor({}, 'textMuted');
    const primaryColor = useThemeColor({}, 'primary');
    const borderColor = useThemeColor({}, 'border');

    // Utilisation du SERVICE pour charger les données initiales
    const loadInitialData = async () => {
        setIsLoading(true);
        try {
            const [resRestos, resCats] = await Promise.all([
                restaurantService.getAll(),
                restaurantService.getCategories()
            ]);

            if (resRestos.success) setAllRestos(resRestos.data);
            if (resCats.success) setCategories(resCats.data);
        } catch (error) {
            console.error("Erreur Service Search :", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadInitialData();
    }, []);

    // Logique de filtrage + Suggestions (Mohamed : toujours 3 résultats minimum)
    useEffect(() => {
        const query = searchText.trim().toLowerCase();
        
        if (query.length > 0) {
            let matches = allRestos.filter(
                (resto) =>
                    resto.name.toLowerCase().includes(query) ||
                    resto.cuisine?.some(c => c.toLowerCase().includes(query))
            );

            // Algorithme de suggestion si peu de résultats
            if (matches.length < 3) {
                const suggestions = allRestos
                    .filter(r => !matches.find(m => m.id === r.id))
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 3 - matches.length);
                
                matches = [...matches, ...suggestions];
            }

            setFilteredRestos(matches);
        } else {
            setFilteredRestos([]);
        }
    }, [searchText, allRestos]);

    const clearSearch = () => setSearchText('');

    return (
        <View style={[styles.container, { backgroundColor }]}>
            {/* Header & Search Bar */}
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
                        />
                        {searchText.length > 0 && (
                            <TouchableOpacity onPress={clearSearch}>
                                <X size={18} color={textMuted} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {isLoading ? (
                    <ActivityIndicator size="large" color={primaryColor} style={{ marginTop: 50 }} />
                ) : searchText.length > 0 ? (
                    <View style={styles.resultsSection}>
                        <Text style={[styles.resultsCount, { color: textMuted }]}>
                            {filteredRestos.filter(r => r.name.toLowerCase().includes(searchText.toLowerCase())).length} correspondances directes
                        </Text>

                        {filteredRestos.map((resto, index) => {
                            const isMatch = resto.name.toLowerCase().includes(searchText.toLowerCase()) || 
                                          resto.cuisine?.some(c => c.toLowerCase().includes(searchText.toLowerCase()));
                            
                            return (
                                <View key={resto.id}>
                                    {!isMatch && index > 0 && (
                                        <View style={styles.suggestionHeader}>
                                            <Text style={[styles.suggestionTitle, { color: textColor }]}>Suggestions pour vous</Text>
                                        </View>
                                    )}
                                    <CardRestaurant resto={resto} />
                                </View>
                            );
                        })}
                    </View>
                ) : (
                    <>
                        {/* Section Historique */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: textColor }]}>Récents</Text>
                                <TouchableOpacity>
                                    <Text style={[styles.clearAllText, { color: primaryColor }]}>Effacer</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.chipContainer}>
                                {['Sushi', 'Pizza', 'Burger'].map((item, i) => (
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

                        {/* Section Parcourir via Categories Service */}
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
                                        setSearchText={setSearchText} 
                                    />
                                ))}
                            </View>
                        </View>
                    </>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 15 },
    searchContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    searchBar: { flex: 1, flexDirection: 'row', padding: 12, borderRadius: 15, alignItems: 'center' },
    input: { flex: 1, marginLeft: 10, fontSize: 16 },
    scrollContent: { paddingBottom: 100 },
    section: { marginTop: 25, paddingHorizontal: 20 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold' },
    clearAllText: { fontSize: 14, fontWeight: '600' },
    chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 25, borderWidth: 1 },
    chipText: { fontWeight: '500' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 10 },
    resultsSection: { paddingHorizontal: 20, marginTop: 20 },
    resultsCount: { fontSize: 14, marginBottom: 15 },
    suggestionHeader: { marginTop: 10, marginBottom: 20, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', paddingTop: 20 },
    suggestionTitle: { fontSize: 18, fontWeight: 'bold' }
});