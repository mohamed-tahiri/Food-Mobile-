import { Cuisine } from "@/types/cuisine";
import { TouchableOpacity, StyleSheet, Text } from "react-native";

interface CardCuisineProps {
    item: Cuisine
}

export default function CardCuisine({ item }: CardCuisineProps) {
    return (
        <TouchableOpacity key={item.id} style={styles.gridItem}>
            <Text style={styles.gridIcon}>{item.icon}</Text>
            <Text style={styles.gridName}>{item.name}</Text>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
  gridItem: { width: '48%', backgroundColor: '#F9F9F9', padding: 20, borderRadius: 20, alignItems: 'center', marginBottom: 15 },
  gridIcon: { fontSize: 30, marginBottom: 10 },
  gridName: { fontWeight: '600', color: '#444' }
});