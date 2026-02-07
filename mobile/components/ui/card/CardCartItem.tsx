import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Trash2, Plus, Minus } from 'lucide-react-native';
import { CartItem } from '@/context/CartContext';

interface CardCartItemProps {
    item: CartItem;
    cardBg: string;
    textColor: string;
    primaryColor: string;
    borderColor: string;
    removeFromCart: (id: string) => void;
    deleteFromCart: (id: string) => void;
    addToCart: (item: CartItem) => void;
}

export default function CardCartItem({ 
    item, 
    cardBg, 
    textColor, 
    primaryColor, 
    borderColor, 
    removeFromCart, 
    addToCart, 
    deleteFromCart
}: CardCartItemProps) {
    return (
        <View style={[styles.itemCard, { backgroundColor: cardBg }]}>
            <Image source={{ uri: item.img }} style={styles.itemImage} />
            
            <View style={styles.itemInfo}>
                <Text style={[styles.itemName, { color: textColor }]} numberOfLines={1}>
                    {item.name}
                </Text>
                <Text style={[styles.itemPrice, { color: primaryColor }]}>
                    {item.price} €
                </Text>
                
                <View style={styles.quantityContainer}>
                    <TouchableOpacity 
                        onPress={() => removeFromCart(item.id)}
                        style={[styles.qtyBtn, { borderColor }]}
                    >
                        <Minus size={16} color={primaryColor} />
                    </TouchableOpacity>
                    
                    <Text style={[styles.qtyText, { color: textColor }]}>
                        {item.quantity}
                    </Text>
                    
                    <TouchableOpacity 
                        onPress={() => addToCart(item)}
                        style={[styles.qtyBtn, { borderColor }]}
                    >
                        <Plus size={16} color={primaryColor} />
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity onPress={() => deleteFromCart(item.id)} style={styles.deleteBtn}>
                <Trash2 size={20} color="#FF3B30" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    itemCard: {
        flexDirection: 'row',
        padding: 12,
        borderRadius: 20,
        marginBottom: 15,
        alignItems: 'center',
    },
    itemImage: { 
        width: 80, 
        height: 80, 
        borderRadius: 15,
        backgroundColor: '#F5F5F5' 
    },
    itemInfo: { 
        flex: 1, 
        marginLeft: 15 
    },
    itemName: { 
        fontSize: 16, 
        fontWeight: '700' 
    },
    itemPrice: { 
        fontSize: 14, 
        fontWeight: '600', 
        marginTop: 4 
    },
    quantityContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginTop: 10 
    },
    qtyBtn: { 
        borderWidth: 1, 
        borderRadius: 8, 
        padding: 4 
    },
    qtyText: { 
        marginHorizontal: 15, 
        fontWeight: 'bold' 
    },
    deleteBtn: { 
        padding: 10 
    },
});