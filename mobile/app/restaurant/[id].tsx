import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Star, } from 'lucide-react-native';

export default function RestaurantDetail() {
  const { id, name } = useLocalSearchParams();
  const router = useRouter();

  const menuItems = [
    { id: 1, name: 'Burger Signature', price: '14.50€', desc: 'Bœuf, cheddar, oignons caramélisés' },
    { id: 2, name: 'Frites Maison', price: '4.00€', desc: 'Coupées au couteau, sel de Guérande' },
  ];

  return (
    <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
      {/* Header Image */}
      <View style={styles.imageHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft color="#000" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>{name || "Restaurant Detail"}</Text>
        <View style={styles.infoRow}>
          <Star size={16} color="#FF6B35" fill="#FF6B35" />
          <Text style={styles.infoText}> 4.8 (200+ avis) • 15-25 min</Text>
        </View>

        <Text style={styles.sectionTitle}>Menu</Text>
        {menuItems.map((item) => (
          <View key={item.id} style={styles.foodItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.foodName}>{item.name}</Text>
              <Text style={styles.foodDesc}>{item.desc}</Text>
              <Text style={styles.foodPrice}>{item.price}</Text>
            </View>
            <TouchableOpacity style={styles.addBtn}>
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>+</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  imageHeader: { height: 200, backgroundColor: '#FFB399', justifyContent: 'center' },
  backBtn: { position: 'absolute', top: 50, left: 20, backgroundColor: '#FFF', padding: 8, borderRadius: 20 },
  content: { padding: 20, marginTop: -20, backgroundColor: '#FFF', borderTopLeftRadius: 25, borderTopRightRadius: 25 },
  title: { fontSize: 26, fontWeight: 'bold' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  infoText: { color: '#666', marginLeft: 5 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 30, marginBottom: 15 },
  foodItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  foodName: { fontSize: 16, fontWeight: '600' },
  foodDesc: { color: '#888', fontSize: 13, marginVertical: 4 },
  foodPrice: { fontWeight: 'bold', color: '#FF6B35' },
  addBtn: { backgroundColor: '#FF6B35', width: 35, height: 35, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }
});