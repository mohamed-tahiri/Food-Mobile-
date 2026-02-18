import React from 'react';
import { Plus } from 'lucide-react-native';
import { TouchableOpacity, StyleSheet, Text, View, Image } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'expo-router';
import { MenuItem } from '@/types/menuItem';

interface CardMenuItemProps {
    item: MenuItem;
    menuId: string;
    onPress?: () => void;
}

export default function CardMenuItem({ item, menuId, onPress }: CardMenuItemProps) {
    const { addToCart } = useCart();
    const router = useRouter();
    
    const textColor = useThemeColor({}, 'text');
    const textMuted = useThemeColor({}, 'textMuted');
    const backgroundColor = useThemeColor({}, 'background');
    const primaryColor = useThemeColor({}, 'primary');

    // Ajout au panier avec retour haptique
    const handleAdd = () => {
        addToCart(item);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            router.push({
                pathname: '/restaurant/dish/[id]',
                params: { id: item.id, menuId: menuId },
            });
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            style={styles.foodCard}
            onPress={handlePress}
        >
            <View style={styles.foodInfo}>
                <Text style={[styles.foodName, { color: textColor }]}>
                    {item.name}
                </Text>
                <Text
                    style={[styles.foodDesc, { color: textMuted }]}
                    numberOfLines={2}
                >
                    {item.description}
                </Text>
                <Text style={[styles.foodPrice, { color: primaryColor }]}>
                    {item.price.toFixed(2)} €
                </Text>
            </View>

            <View style={styles.foodImageWrapper}>
                {/* Correction : item.image au lieu de item.img */}
                <Image source={{ uri: item.image }} style={styles.foodImage} />
                
                {/* Bouton d'ajout rapide */}
                <TouchableOpacity
                    style={[
                        styles.addBtn,
                        {
                            backgroundColor: primaryColor,
                            borderColor: backgroundColor, 
                        },
                    ]}
                    activeOpacity={0.8}
                    onPress={(e) => {
                        e.stopPropagation(); // Évite de déclencher la navigation vers le plat
                        handleAdd();
                    }}
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
        bottom: -5,
        right: -5,
        width: 35,
        height: 35,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        zIndex: 10,
    },
});