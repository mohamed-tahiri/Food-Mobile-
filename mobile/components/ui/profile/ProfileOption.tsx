import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight, type LucideIcon } from 'lucide-react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

interface ProfileOptionProps {
    Icon: LucideIcon;
    title: string;
    subtitle?: string;
    color?: string;
    isLast?: boolean;
    onPress?: () => void;
}

export const ProfileOption = ({ Icon, title, subtitle, color = '#333', isLast, onPress }: ProfileOptionProps) => {
    const textColor = useThemeColor({}, 'text');
    const textMuted = useThemeColor({}, 'textMuted');
    const borderColor = useThemeColor({}, 'border');

    return (
        <TouchableOpacity 
            style={[styles.option, !isLast && { borderBottomWidth: 1, borderBottomColor: borderColor }]} 
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.optionLeft}>
                <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
                    <Icon size={20} color={color} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.optionTitle, { color: color === '#FF3B30' ? color : textColor }]}>
                        {title}
                    </Text>
                    {subtitle && <Text style={[styles.optionSubtitle, { color: textMuted }]}>{subtitle}</Text>}
                </View>
            </View>
            <ChevronRight size={18} color={textMuted} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    option: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    optionLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    iconContainer: { padding: 10, borderRadius: 15, marginRight: 18 },
    textContainer: { flex: 1 },
    optionTitle: { fontSize: 16, fontWeight: '700' },
    optionSubtitle: { fontSize: 12, marginTop: 3, fontWeight: '500' },
});