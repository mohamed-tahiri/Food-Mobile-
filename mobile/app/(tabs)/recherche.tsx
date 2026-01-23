import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Search, History, TrendingUp, Filter } from 'lucide-react-native';

const CUISINES = [
  { id: '1', name: 'Italien', icon: '🍕' },
  { id: '2', name: 'Japonais', icon: '🍣' },
  { id: '3', name: 'Mexicain', icon: '🌮' },
  { id: '4', name: 'Burger', icon: '🍔' },
  { id: '5', name: 'Santé', icon: '🥗' },
  { id: '6', name: 'Indien', icon: '🍛' },
];

export default function SearchScreen() {
  const [searchText, setSearchText] = useState('');

  return (
    <View style={styles.container}>
      {/* Header & Barre de recherche */}
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
            />
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <Filter size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Recherches récentes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Récents</Text>
            <History size={16} color="#BBB" />
          </View>
          <View style={styles.chipContainer}>
            {['Sushi', 'Pizza Hut', 'Poke Bowl'].map((item, i) => (
              <TouchableOpacity key={i} style={styles.chip}>
                <Text style={styles.chipText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Parcourir les cuisines */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Parcourir par cuisine</Text>
            <TrendingUp size={16} color="#BBB" />
          </View>
          <View style={styles.grid}>
            {CUISINES.map((item) => (
              <TouchableOpacity key={item.id} style={styles.gridItem}>
                <Text style={styles.gridIcon}>{item.icon}</Text>
                <Text style={styles.gridName}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20, backgroundColor: '#FFF' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 15 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  searchBar: { flex: 1, flexDirection: 'row', backgroundColor: '#F2F2F2', padding: 12, borderRadius: 15, alignItems: 'center' },
  input: { flex: 1, marginLeft: 10, fontSize: 16 },
  filterBtn: { backgroundColor: '#FF6B35', padding: 12, borderRadius: 15 },
  section: { marginTop: 25, paddingHorizontal: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#EEE', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  chipText: { color: '#666' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '48%', backgroundColor: '#F9F9F9', padding: 20, borderRadius: 20, alignItems: 'center', marginBottom: 15 },
  gridIcon: { fontSize: 30, marginBottom: 10 },
  gridName: { fontWeight: '600', color: '#444' }
});