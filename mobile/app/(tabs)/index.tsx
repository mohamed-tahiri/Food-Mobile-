import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Search, MapPin } from 'lucide-react-native';
import CardPromo from '@/components/ui/card/CardPromo';
import CardRestaurant from '@/components/ui/card/CardRestaurant';
import { categories, offers, restaurants,  } from '@/data/dataMocket';
import CardCategory from '@/components/ui/card/CardCategory';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER DÉVELOPPÉ */}
      <View style={styles.header}>
        {/* Partie Gauche : Localisation */}
        <TouchableOpacity
          style={styles.locationContainer} 
          activeOpacity={0.7}
          onPress={() => console.log("Ouvrir sélection adresse")}
        >
          <Text style={styles.deliveryTo}>Livrer au</Text>
          <View style={styles.locationRow}>
            <View style={styles.iconCircle}>
              <MapPin size={16} color="#FF6B35" fill="#FF6B3520" />
            </View>
            <Text style={styles.address} numberOfLines={1}>
              {"15 Rue de l'Innovation, Paris"}
            </Text>
            <Text style={styles.dropdownArrow}>⌄</Text>
          </View>
        </TouchableOpacity>

        {/* Partie Droite : Profil */}
        <TouchableOpacity 
          onPress={() => router.push('/profile')}
          activeOpacity={0.8}
        >
          <View style={styles.profileContainer}>
            <View style={styles.profilePic}>
               {/* Ici on pourrait mettre une image : <Image source={...} /> */}
               <Text style={styles.profileInitial}>M</Text>
            </View>
            <View style={styles.onlineBadge} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={20} color="#999" />
          <TextInput placeholderTextColor="#999" placeholder="Un restaurant, un plat..." style={styles.searchInput} />
        </View>
      </View>

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

      <Text style={styles.sectionTitle}>Catégories</Text>
      <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{ paddingLeft: 2, paddingVertical: 4 }}
      >
          {categories.map((cat, index) => (
              <CardCategory 
                  key={cat.id} 
                  cat={cat} 
                  isSelected={index === 1}
              />
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
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 60, // Ajusté pour la safe area
    marginBottom: 10 
  },
  locationContainer: {
    flex: 1,
    marginRight: 20,
  },
  deliveryTo: { 
    color: '#BBB', 
    fontSize: 12, 
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4
  },
  locationRow: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  iconCircle: {
    backgroundColor: '#FF6B3515',
    padding: 6,
    borderRadius: 10,
    marginRight: 8
  },
  address: { 
    fontWeight: '700', 
    fontSize: 16, 
    color: '#1A1A1A',
    maxWidth: '80%' 
  },
  dropdownArrow: {
    marginLeft: 5,
    fontSize: 18,
    color: '#FF6B35',
    fontWeight: 'bold',
    marginTop: -5 // Ajustement visuel
  },
  profileContainer: {
    position: 'relative'
  },
  profilePic: { 
    width: 48, 
    height: 48, 
    borderRadius: 16, // Bordures légèrement arrondies (style moderne)
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5
  },
  profileInitial: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18
  },
  onlineBadge: {
    position: 'absolute',
    right: -2,
    top: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50', // Point vert "En ligne"
    borderWidth: 2,
    borderColor: '#FDFDFD'
  },
  promoContainer: { marginTop: 25, flexDirection: 'row' },
  container: { flex: 1, backgroundColor: '#FDFDFD', paddingHorizontal: 20 },
  searchSection: { marginTop: 25 },
  searchBar: { flexDirection: 'row', backgroundColor: '#F1F1F1', padding: 12, borderRadius: 15, alignItems: 'center' },
  searchInput: { marginLeft: 10, flex: 1, fontSize: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 20 },
  catList: { flexDirection: 'row' },
  catItem: { alignItems: 'center', marginRight: 25 },
  catIcon: { fontSize: 30, backgroundColor: '#FFF', padding: 10, borderRadius: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  catName: { marginTop: 8, fontWeight: '500', color: '#444' },
});