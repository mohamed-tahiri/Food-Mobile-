import { Category } from '@/types/category';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

interface CardCategoryProps {
    cat: Category;
    isSelected?: boolean;
}

export default function CardCategory({
    cat,
    isSelected = false,
}: CardCategoryProps) {
    // 1. Récupération des couleurs du thème
    const backgroundColor = useThemeColor({}, 'background');
    const cardColor = useThemeColor({}, 'card');
    const textColor = useThemeColor({}, 'text');
    const primaryColor = useThemeColor({}, 'primary');
    const borderColor = useThemeColor({}, 'border');

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={[
                styles.catCard,
                isSelected
                    ? {
                          backgroundColor: primaryColor,
                          borderColor: primaryColor,
                      }
                    : { backgroundColor: cardColor, borderColor: borderColor },
            ]}
        >
            <View
                style={[
                    styles.iconWrapper,
                    isSelected
                        ? styles.iconWrapperActive
                        : { backgroundColor: backgroundColor }, // Fond de l'icône s'adapte au thème
                ]}
            >
                <Text style={styles.catIcon}>{cat.icon}</Text>
            </View>
            <Text
                style={[
                    styles.catName,
                    isSelected ? styles.catNameActive : { color: textColor }, // Texte s'adapte au thème
                ]}
            >
                {cat.name}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    catCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 25,
        marginRight: 12,
        borderWidth: 1,
        // Ombre adaptée
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconWrapper: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    iconWrapperActive: {
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    catIcon: {
        fontSize: 18,
    },
    catName: {
        fontSize: 14,
        fontWeight: '600',
    },
    catNameActive: {
        color: '#FFF',
    },
});
