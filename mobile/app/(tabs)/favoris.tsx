import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Heart } from 'lucide-react-native';
import { favorites } from '@/data/dataMocket';
import CardRestaurant from '@/components/ui/card/CardRestaurant';

export default function FavoritesScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes Favoris</Text>
        <Text style={styles.subtitle}>{favorites.length} restaurants enregistrés</Text>
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        renderItem={({ item }) => (
          <CardRestaurant resto={item} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Heart size={60} color="#EEE" />
            <Text style={styles.emptyTitle}>{"Aucun favori pour l'instant"}</Text>
            <Text style={styles.emptySub}>Enregistrez vos restaurants préférés pour les retrouver ici.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { color: '#888', marginTop: 5 },
  emptyContainer: { alignItems: 'center', marginTop: 100, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, color: '#333' },
  emptySub: { textAlign: 'center', color: '#999', marginTop: 10 }
});