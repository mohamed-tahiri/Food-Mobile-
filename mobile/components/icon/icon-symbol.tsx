import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { OpaqueColorValue, StyleProp, TextStyle } from 'react-native';

// 1. On définit d'abord le mapping
const MAPPING = {
    'house.fill': 'home',
    magnifyingglass: 'search',
    'bag.fill': 'shopping-bag',
    'heart.fill': 'favorite',
    'person.fill': 'person',
    'chevron.right': 'chevron-right',
} as const;

// 2. On crée le type à partir des CLÉS du mapping ('house.fill', etc.)
export type IconSymbolName = keyof typeof MAPPING;

interface IconSymbolProps {
    name: IconSymbolName;
    size?: number;
    color: string | OpaqueColorValue;
    style?: StyleProp<TextStyle>;
}

export function IconSymbol({ name, size = 24, color, style }: IconSymbolProps) {
    return (
        <MaterialIcons
            color={color}
            size={size}
            // 3. IMPORTANT : On traduit le nom ici
            name={MAPPING[name]}
            style={style}
        />
    );
}
