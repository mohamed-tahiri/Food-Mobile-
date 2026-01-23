import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ChevronLeft, Package, CreditCard } from 'lucide-react-native';

export default function OrderDetailScreen() {
  const { id, store, price, status, date } = useLocalSearchParams();
  const router = useRouter();

  // Simulation de produits dans la commande
  const items = [
    { id: 1, name: 'Menu Burger XL', qty: 1, p: '15.50 €' },
    { id: 2, name: 'Coca Cola 33cl', qty: 1, p: '2.50 €' },
    { id: 3, name: 'Supplément Sauce', qty: 2, p: '1.00 €' },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft color="#000" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails de la commande</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Statut Card */}
        <View style={styles.statusCard}>
          <Package color="#FF6B35" size={40} />
          <Text style={styles.statusText}>{status}</Text>
          <Text style={styles.orderRef}>Commande #{id}</Text>
        </View>

        {/* Info Restaurant */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Restaurant</Text>
          <Text style={styles.storeName}>{store}</Text>
          <Text style={styles.dateText}>{date}</Text>
        </View>

        {/* Articles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Articles</Text>
          {items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.qty}>{item.qty}x</Text>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>{item.p}</Text>
            </View>
          ))}
        </View>

        {/* Résumé Paiement */}
        <View style={styles.section}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total payé</Text>
            <Text style={styles.totalValue}>{price}</Text>
          </View>
          <View style={styles.paymentMethod}>
            <CreditCard size={16} color="#666" />
            <Text style={styles.paymentText}>Payé via Apple Pay (**** 1234)</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDFDFD' },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20, backgroundColor: '#FFF' },
  backBtn: { backgroundColor: '#F5F5F5', padding: 8, borderRadius: 12 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 15 },
  scrollContent: { padding: 20 },
  statusCard: { alignItems: 'center', backgroundColor: '#FFF', padding: 25, borderRadius: 20, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  statusText: { fontSize: 20, fontWeight: 'bold', marginTop: 10, color: '#4CAF50' },
  orderRef: { color: '#999', marginTop: 5 },
  section: { backgroundColor: '#FFF', padding: 20, borderRadius: 20, marginBottom: 15 },
  sectionTitle: { fontSize: 14, color: '#999', fontWeight: '600', marginBottom: 10, textTransform: 'uppercase' },
  storeName: { fontSize: 18, fontWeight: 'bold' },
  dateText: { color: '#666', marginTop: 4 },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  qty: { fontWeight: 'bold', color: '#FF6B35', width: 30 },
  itemName: { flex: 1, color: '#333' },
  itemPrice: { fontWeight: '500' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 15, marginTop: 10 },
  totalLabel: { fontSize: 18, fontWeight: 'bold' },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: '#FF6B35' },
  paymentMethod: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
  paymentText: { color: '#666', fontSize: 12, marginLeft: 8 }
});