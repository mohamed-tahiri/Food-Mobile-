import { ShoppingBag, View } from "lucide-react-native";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter } from 'expo-router';

interface CardCommandProps {
    item: Order
}

interface Order {
    id: string;
    store: string;
    date: string;
    price: string;
    status: string;
}

export default function CardCommand ({ item }: CardCommandProps) {
    const router = useRouter(); 
    
    return (
        <TouchableOpacity
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
            <View style={styles.orderCard}>
                <View style={styles.iconContainer}><ShoppingBag color="#FF6B35" /></View>
                <View style={styles.orderInfo}>
                    <Text style={styles.storeName}>{item.store}</Text>
                    <Text style={styles.orderDate}>{item.date}</Text>
                </View>
                <View style={styles.orderPriceSection}>
                    <Text style={styles.price}>{item.price}</Text>
                    <Text style={styles.status}>{item.status}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
  orderCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 15, borderRadius: 15, marginBottom: 15, alignItems: 'center', elevation: 2 },
  iconContainer: { backgroundColor: '#FFF0EB', padding: 10, borderRadius: 12 },
  orderInfo: { marginLeft: 15, flex: 1 },
  storeName: { fontWeight: 'bold', fontSize: 16 },
  orderDate: { color: '#999', fontSize: 13 },
  orderPriceSection: { alignItems: 'flex-end' },
  price: { fontWeight: 'bold', color: '#FF6B35' },
  status: { color: '#4CAF50', fontSize: 12, fontWeight: '500' }
});