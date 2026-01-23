import React from 'react';
import { Plus } from "lucide-react-native";
import { TouchableOpacity, StyleSheet, Text, View, Image } from "react-native";
import { MenuItem } from '@/types/menuItem';

interface CardMenuItemProps {
    item: MenuItem;
    onPress?: () => void;
}

export default function CardMenuItem({ item, onPress }: CardMenuItemProps) {
    return (
        <TouchableOpacity 
            activeOpacity={0.7} 
            style={styles.foodCard} 
            onPress={onPress}
        >
            <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.foodDesc} numberOfLines={2}>{item.desc}</Text>
                <Text style={styles.foodPrice}>{item.price} €</Text>
            </View>
            
            <View style={styles.foodImageWrapper}>
                <Image source={{ uri: item.img }} style={styles.foodImage} />
                <TouchableOpacity style={styles.addBtn} activeOpacity={0.8}>
                    <Plus size={20} color="#FFF" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
  foodCard: { 
    flexDirection: 'row', 
    marginBottom: 25, 
    gap: 15, 
    alignItems: 'center' 
  },
  foodInfo: { flex: 1 },
  foodName: { fontSize: 17, fontWeight: '700', color: '#1A1A1A' },
  foodDesc: { color: '#888', fontSize: 13, marginTop: 5, lineHeight: 18 },
  foodPrice: { color: '#FF6B35', fontWeight: 'bold', fontSize: 16, marginTop: 8 },
  foodImageWrapper: { position: 'relative' },
  foodImage: { width: 100, height: 100, borderRadius: 15, backgroundColor: '#F5F5F5' },
  addBtn: { 
    position: 'absolute', 
    bottom: -10, 
    right: -10, 
    backgroundColor: '#FF6B35', 
    width: 35, 
    height: 35, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 3, 
    borderColor: '#FFF' 
  },
});