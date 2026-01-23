import React from 'react';
import { ShoppingBag } from "lucide-react-native";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native"; // Correction ici
import { useRouter } from 'expo-router';
import { Order } from '@/types/order';

interface CardCommandProps {
  item: Order
}

export default function CardCommand ({ item }: CardCommandProps) {
    const router = useRouter(); 
    
    // Couleur dynamique selon le statut
    const statusColor = item.status === 'Livré' ? '#4CAF50' : '#FF6B35';

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            style={styles.orderCard}
            onPress={() => router.push({
                pathname: "/order/[id]",
                params: { 
                    id: item.id, 
                    store: item.store, 
                    price: item.price, 
                    status: item.status, 
                    date: item.date 
                }
            })}
        >
            <View style={styles.iconContainer}>
                <ShoppingBag color="#FF6B35" size={22} />
            </View>
            
            <View style={styles.orderInfo}>
                <Text style={styles.storeName} numberOfLines={1}>{item.store}</Text>
                <Text style={styles.orderDate}>{item.date}</Text>
            </View>
            
            <View style={styles.orderPriceSection}>
                <Text style={styles.price}>{item.price}</Text>
                <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
                    <Text style={[styles.statusText, { color: statusColor }]}>{item.status}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
  orderCard: { 
    flexDirection: 'row', 
    backgroundColor: '#FFF', 
    padding: 15, 
    borderRadius: 18, 
    marginBottom: 15, 
    alignItems: 'center',
    // Ombre plus douce
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: { 
    backgroundColor: '#FFF0EB', 
    padding: 12, 
    borderRadius: 14 
  },
  orderInfo: { 
    marginLeft: 15, 
    flex: 1 
  },
  storeName: { 
    fontWeight: 'bold', 
    fontSize: 16, 
    color: '#1A1A1A' 
  },
  orderDate: { 
    color: '#999', 
    fontSize: 13, 
    marginTop: 2 
  },
  orderPriceSection: { 
    alignItems: 'flex-end' 
  },
  price: { 
    fontWeight: 'bold', 
    color: '#1A1A1A',
    fontSize: 15,
    marginBottom: 5
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: { 
    fontSize: 11, 
    fontWeight: 'bold',
    textTransform: 'uppercase'
  }
});