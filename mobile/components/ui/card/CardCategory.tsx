import { Category } from "@/types/category";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CardCategoryProps {
  cat: Category;
  isSelected?: boolean;
}

export default function CardCategory({ cat, isSelected = false }: CardCategoryProps){
    return (
        <TouchableOpacity 
            activeOpacity={0.8}
            style={[
                styles.catCard, 
                isSelected ? styles.catCardActive : styles.catCardInactive
            ]}
        >
            <View style={[
                styles.iconWrapper,
                isSelected ? styles.iconWrapperActive : styles.iconWrapperInactive
            ]}>
                <Text style={styles.catIcon}>{cat.icon}</Text>
            </View>
            <Text style={[
                styles.catName,
                isSelected ? styles.catNameActive : styles.catNameInactive
            ]}>
                {cat.name}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
  catCard: {
    flexDirection: 'row', // Alignement horizontal (Icon + Texte)
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 25, // Forme pilule
    marginRight: 12,
    borderWidth: 1,
    // Ombre légère
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  catCardActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  catCardInactive: {
    backgroundColor: '#FFF',
    borderColor: '#F0F0F0',
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
  iconWrapperInactive: {
    backgroundColor: '#F8F9FA',
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
  catNameInactive: {
    color: '#444',
  },
});