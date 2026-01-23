import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { orders } from '@/data/dataMocket';
import CardCommand from '@/components/ui/CardCommand';

export default function OrdersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes Commandes</Text>
      <FlatList
        data={orders}
        keyExtractor={(order) => order.id}
        renderItem={({ item }) => (
          <CardCommand item={item} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDFDFD', padding: 20, paddingTop: 60 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
});