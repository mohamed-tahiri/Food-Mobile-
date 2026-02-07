import { Cuisine } from '@/types/cuisine';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

interface CardCuisineProps {
    item: Cuisine;
}

export default function CardCuisine({ item }: CardCuisineProps) {
    // 1. Récupération des couleurs dynamiques
    const cardBg = useThemeColor({}, 'card'); // Gris très clair en light, Anthracite en dark
    const textColor = useThemeColor({}, 'text');
    const borderColor = useThemeColor({}, 'border');

    return (
        <TouchableOpacity
            key={item.id}
            style={[
                styles.gridItem,
                { backgroundColor: cardBg, borderColor: borderColor },
            ]}
        >
            <Text style={styles.gridIcon}>{item.icon}</Text>
            <Text style={[styles.gridName, { color: textColor }]}>
                {item.name}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    gridItem: {
        width: '48%',
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 1, // Ajout d'une bordure pour la définition en mode sombre
        // Ombre légère
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    gridIcon: {
        fontSize: 32, // Un peu plus grand pour le visuel
        marginBottom: 10,
    },
    gridName: {
        fontWeight: '600',
        fontSize: 15,
    },
});
