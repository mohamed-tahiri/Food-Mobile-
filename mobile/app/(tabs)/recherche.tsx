import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Search, History, TrendingUp, Filter, X } from 'lucide-react-native';
import { cuisines, restaurants } from '@/data/dataMocket';
import CardRestaurant from '@/components/ui/card/CardRestaurant';
import { Resto } from '@/types/resto';

export default function SearchScreen() {
  const [searchText, setSearchText] = useState('');
  const [filteredRestos, setFilteredRestos] = useState<Resto[]>([]);

  useEffect(() => {
    if (searchText.trim().length > 0) {
      const filtered = restaurants.filter(resto => 
        resto.name.toLowerCase().includes(searchText.toLowerCase()) ||
        resto.type.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredRestos(filtered);
    } else {
      setFilteredRestos([]);
    }
  }, [searchText]);

  const clearSearch = () => {
    setSearchText('');
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Rechercher</Text>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#999" />
            <TextInput 
              placeholder="Restaurants ou plats..." 
              style={styles.input}
              value={searchText}
              onChangeText={setSearchText}
              autoFocus={false}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={clearSearch}>
                <X size={18} color="#999" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <Filter size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {searchText.length > 0 ? (
          /* ÉTAT : RÉSULTATS DE RECHERCHE */
          <View style={styles.resultsSection}>
            <Text style={styles.resultsCount}>
              {filteredRestos.length} résultats trouvés
            </Text>
            {filteredRestos.map((resto) => (
              <CardRestaurant key={resto.id} resto={resto} />
            ))}
            {filteredRestos.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Aucun restaurant ne correspond à votre recherche.</Text>
              </View>
            )}
          </View>
        ) : (
          /* ÉTAT PAR DÉFAUT : HISTORIQUE ET CUISINES */
          <>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Récents</Text>
                <TouchableOpacity>
                   <Text style={styles.clearAllText}>Effacer</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.chipContainer}>
                {['Sushi', 'Pizza Hut', 'Burger'].map((item, i) => (
                  <TouchableOpacity 
                    key={i} 
                    style={styles.chip}
                    onPress={() => setSearchText(item)}
                  >
                    <History size={14} color="#FF6B35" style={{marginRight: 6}} />
                    <Text style={styles.chipText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Parcourir par cuisine</Text>
                <TrendingUp size={16} color="#BBB" />
              </View>
              <View style={styles.grid}>
                {cuisines.map((item) => (
                  <TouchableOpacity 
                    key={item.id} 
                    style={styles.gridItem}
                    onPress={() => setSearchText(item.name)}
                  >
                    <View style={styles.iconCircle}>
                       <Text style={styles.gridIcon}>{item.icon}</Text>
                    </View>
                    <Text style={styles.gridName}>{item.name}</Text>
                  </TouchableOpacity>
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
  container: { flex: 1, backgroundColor: '#FDFDFD' },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20, backgroundColor: '#FFF' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 15, color: '#1A1A1A' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  searchBar: { flex: 1, flexDirection: 'row', backgroundColor: '#F2F2F2', padding: 12, borderRadius: 15, alignItems: 'center' },
  input: { flex: 1, marginLeft: 10, fontSize: 16, color: '#333' },
  filterBtn: { backgroundColor: '#FF6B35', padding: 12, borderRadius: 15, elevation: 2 },
  
  scrollContent: { paddingBottom: 100 },
  section: { marginTop: 25, paddingHorizontal: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  clearAllText: { color: '#FF6B35', fontSize: 14, fontWeight: '500' },
  
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF', 
    borderWidth: 1, 
    borderColor: '#EEE', 
    paddingHorizontal: 15, 
    paddingVertical: 10, 
    borderRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1
  },
  chipText: { color: '#555', fontWeight: '500' },
  
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { 
    width: '48%', 
    backgroundColor: '#FFF', 
    padding: 20, 
    borderRadius: 25, 
    alignItems: 'center', 
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F5F5F5',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  gridIcon: { fontSize: 30 },
  gridName: { fontWeight: '700', color: '#444' },

  /* Résultats */
  resultsSection: { paddingHorizontal: 20, marginTop: 20 },
  resultsCount: { fontSize: 14, color: '#888', marginBottom: 20 },
  emptyState: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#999', textAlign: 'center', fontSize: 16 }
});