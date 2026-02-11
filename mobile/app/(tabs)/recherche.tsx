import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { Search, History, TrendingUp, X } from 'lucide-react-native';
import { cuisines, restaurants } from '@/data/dataMocket';
import CardRestaurant from '@/components/ui/card/CardRestaurant';
import { Resto } from '@/types/resto';
import { useThemeColor } from '@/hooks/use-theme-color';
import CardCuisineItem from '@/components/ui/card/CardCuisineItem';

export default function SearchScreen() {
    const [searchText, setSearchText] = useState('');
    const [filteredRestos, setFilteredRestos] = useState<Resto[]>([]);

    const backgroundColor = useThemeColor({}, 'background');
    const headerColor = useThemeColor({}, 'tabBar'); 
    const textColor = useThemeColor({}, 'text');
    const textMuted = useThemeColor({}, 'textMuted');
    const primaryColor = useThemeColor({}, 'primary');
    const borderColor = useThemeColor({}, 'border');

    useEffect(() => {
        if (searchText.trim().length > 0) {
            let filtered = restaurants.filter(
                (resto) =>
                    resto.name.toLowerCase().includes(searchText.toLowerCase()) ||
                    resto.type.toLowerCase().includes(searchText.toLowerCase()),
            );

            setFilteredRestos(filtered);
        } else {
            setFilteredRestos([]);
        }
    }, [searchText]);

    const clearSearch = () => setSearchText('');

    return (
        <View style={[styles.container, { backgroundColor }]}>
            {/* HEADER */}
            <View style={[styles.header, { backgroundColor: headerColor }]}>
                <Text style={[styles.title, { color: textColor }]}>Rechercher</Text>
                <View style={styles.searchContainer}>
                    <View
                        style={[
                            styles.searchBar,
                            {
                                backgroundColor: backgroundColor,
                                borderColor: borderColor,
                                borderWidth: 1,
                            },
                        ]}
                    >
                        <Search size={20} color={textMuted} />
                        <TextInput
                            placeholder="Restaurants ou plats..."
                            placeholderTextColor={textMuted}
                            style={[styles.input, { color: textColor }]}
                            value={searchText}
                            onChangeText={setSearchText}
                            autoFocus={false}
                        />
                        {searchText.length > 0 && (
                            <TouchableOpacity onPress={clearSearch}>
                                <X size={18} color={textMuted} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {searchText.length > 0 ? (
                    <View style={styles.resultsSection}>
                        <View style={styles.resultsHeader}>
                            <Text style={[styles.resultsCount, { color: textMuted }]}>
                                {filteredRestos.length} résultats trouvés
                            </Text>
                        </View>

                        {filteredRestos.map((resto) => (
                            <CardRestaurant key={resto.id} resto={resto} />
                        ))}

                        {filteredRestos.length === 0 && (
                            <View style={styles.emptyState}>
                                <Text style={[styles.emptyText, { color: textMuted }]}>
                                    {`Aucun résultat pour ${searchText} 🍕`}
                                </Text>
                            </View>
                        )}
                    </View>
                ) : (
                    <>
                        {/* Section Récents */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: textColor }]}>Récents</Text>
                                <TouchableOpacity>
                                    <Text style={styles.clearAllText}>Effacer</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.chipContainer}>
                                {['Sushi', 'Pizza', 'Burger'].map((item, i) => (
                                    <TouchableOpacity
                                        key={i}
                                        style={[styles.chip, { backgroundColor: headerColor, borderColor: borderColor }]}
                                        onPress={() => setSearchText(item)}
                                    >
                                        <History size={14} color={primaryColor} style={{ marginRight: 6 }} />
                                        <Text style={[styles.chipText, { color: textColor }]}>{item}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Section Cuisine */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: textColor }]}>Parcourir par cuisine</Text>
                                <TrendingUp size={16} color={textMuted} />
                            </View>
                            <View style={styles.grid}>
                                {cuisines.map((item) => (
                                    <CardCuisineItem
                                        key={item.id}
                                        item={item}
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
    filterBtn: { padding: 12, borderRadius: 15, elevation: 2 },
    scrollContent: { paddingBottom: 100 },
    section: { marginTop: 25, paddingHorizontal: 20 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold' },
    clearAllText: { color: '#FF6B35', fontSize: 14, fontWeight: '500' },
    chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 25, elevation: 1 },
    chipText: { fontWeight: '500' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    resultsSection: { paddingHorizontal: 20, marginTop: 20 },
    resultsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    resultsCount: { fontSize: 14 },
    activeSortBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    emptyState: { alignItems: 'center', marginTop: 50 },
    emptyText: { textAlign: 'center', fontSize: 16 },
});