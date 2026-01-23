import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Search, MapPin } from 'lucide-react-native';
import CardPromo from '@/components/ui/CardPromo';
import CardRestaurant from '@/components/ui/CardRestaurant';
import { categories, offers, restaurants,  } from '@/data/dataMocket';
import CardCategory from '@/components/ui/CardCategory';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.deliveryTo}>Livrer au</Text>
          <View style={styles.locationRow}>
            <MapPin size={18} color="#FF6B35" />
            <Text style={styles.address}> {"15 Rue de l'Innovation, Paris"}</Text>
          </View>
        </View>
        <View style={styles.profilePic} />
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={20} color="#999" />
          <TextInput placeholderTextColor="#999" placeholder="Un restaurant, un plat..." style={styles.searchInput} />
        </View>
      </View>

      {/* SECTION OFFRES PROMO */}
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

      {/* Catégories */}
      <Text style={styles.sectionTitle}>Catégories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catList}>
        {categories.map((cat) => (
          <CardCategory key={cat.id} cat={cat} />
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Populaires à proximité</Text>
      
      {restaurants.map((resto) => (
        <CardRestaurant key={resto.id} resto={resto} />
      ))}
      <View style={{ height: 100 }} /> 
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  promoContainer: { marginTop: 25, flexDirection: 'row' },
  container: { flex: 1, backgroundColor: '#FDFDFD', paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 60 },
  deliveryTo: { color: '#999', fontSize: 12 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  address: { fontWeight: 'bold', fontSize: 16 },
  profilePic: { width: 45, height: 45, borderRadius: 25, backgroundColor: '#FF6B35' },
  searchSection: { marginTop: 25 },
  searchBar: { flexDirection: 'row', backgroundColor: '#F1F1F1', padding: 12, borderRadius: 15, alignItems: 'center' },
  searchInput: { marginLeft: 10, flex: 1, fontSize: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 20 },
  catList: { flexDirection: 'row' },
  catItem: { alignItems: 'center', marginRight: 25 },
  catIcon: { fontSize: 30, backgroundColor: '#FFF', padding: 10, borderRadius: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  catName: { marginTop: 8, fontWeight: '500', color: '#444' },
});