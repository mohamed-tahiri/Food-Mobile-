// components/ui/CardRestaurant.tsx
import { Clock, Star } from 'lucide-react-native';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export interface Resto {
    id: string;
    name: string;
    rating: string;
    time: string;
    color?: string;  
    image?: string; 
    type?: string;   
}

interface CardRestaurantProps {
    resto: Resto;
}

export default function CardRestaurant({ resto }: CardRestaurantProps){
    const router = useRouter(); 
    const bgColor = resto.color || resto.image || '#DDD';

    return (
        <TouchableOpacity 
          style={styles.restaurantCard}
          onPress={() => router.push({
            pathname: "/restaurant/[id]",
            params: { id: resto.id, name: resto.name }
          })}
        >
          <View style={[styles.cardImagePlaceholder, { backgroundColor: bgColor }]}>
             <Text style={{color: '#fff', fontWeight: 'bold'}}>{resto.name}</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Text style={styles.restaurantName}>{resto.name}</Text>
              <View style={styles.ratingBadge}>
                <Star size={12} color="#FFF" fill="#FFF" />
                <Text style={styles.ratingText}> {resto.rating}</Text>
              </View>
            </View>
            
            {/* Si un type existe (ex: Italien), on l'affiche */}
            {resto.type && <Text style={styles.restaurantType}>{resto.type}</Text>}

            <View style={styles.cardFooter}>
              <Clock size={14} color="#666" />
              <Text style={styles.cardStats}> {resto.time} • Livraison gratuite</Text>
            </View>
          </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    restaurantCard: { backgroundColor: '#FFF', borderRadius: 20, marginBottom: 20, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, overflow: 'hidden' },
    cardImagePlaceholder: { height: 160, justifyContent: 'center', alignItems: 'center' },
    cardContent: { padding: 15 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    restaurantName: { fontSize: 18, fontWeight: 'bold' },  
    restaurantType: { color: '#777', fontSize: 13, marginTop: 4 },
    ratingBadge: { backgroundColor: '#FF6B35', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
    ratingText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
    cardFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
    cardStats: { color: '#666', fontSize: 14 },
});