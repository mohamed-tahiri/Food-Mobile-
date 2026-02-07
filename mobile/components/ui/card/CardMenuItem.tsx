import React from 'react';
import { Plus } from 'lucide-react-native';
import { TouchableOpacity, StyleSheet, Text, View, Image } from 'react-native';
import * as Haptics from 'expo-haptics';
import { MenuItem } from '@/types/menuItem';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useCart } from '@/context/CartContext';

interface CardMenuItemProps {
    item: MenuItem;
    onPress?: () => void;
}

export default function CardMenuItem({ item, onPress }: CardMenuItemProps) {
    const { addToCart } = useCart();
    
    const textColor = useThemeColor({}, 'text');
    const textMuted = useThemeColor({}, 'textMuted');
    const backgroundColor = useThemeColor({}, 'background');
    const primaryColor = useThemeColor({}, 'primary');

    const handleAdd = () => {
        addToCart(item);
        // Petite vibration pour le feeling "Premium"
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            style={styles.foodCard}
            onPress={onPress}
        >
            <View style={styles.foodInfo}>
                <Text style={[styles.foodName, { color: textColor }]}>
                    {item.name}
                </Text>
                <Text
                    style={[styles.foodDesc, { color: textMuted }]}
                    numberOfLines={2}
                >
                    {item.desc}
                </Text>
                <Text style={[styles.foodPrice, { color: primaryColor }]}>
                    {item.price} €
                </Text>
            </View>

            <View style={styles.foodImageWrapper}>
                <Image source={{ uri: item.img }} style={styles.foodImage} />
                <TouchableOpacity
                    style={[
                        styles.addBtn,
                        {
                            backgroundColor: primaryColor,
                            borderColor: backgroundColor, // La bordure s'adapte au fond pour l'effet de découpe
                        },
                    ]}
                    activeOpacity={0.8}
                    onPress={handleAdd}
                >
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
        alignItems: 'center',
    },
    foodInfo: { flex: 1 },
    foodName: { fontSize: 17, fontWeight: '700' },
    foodDesc: { fontSize: 13, marginTop: 5, lineHeight: 18 },
    foodPrice: {
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 8,
    },
    foodImageWrapper: { position: 'relative' },
    foodImage: {
        width: 100,
        height: 100,
        borderRadius: 15,
        backgroundColor: '#F5F5F5',
    },
    addBtn: {
        position: 'absolute',
        bottom: -10,
        right: -10,
        width: 35,
        height: 35,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
    },
});
