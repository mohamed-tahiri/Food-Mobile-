import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { type LucideIcon } from 'lucide-react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

interface StatCardProps {
    title: string;
    value: string;
    Icon: LucideIcon;
    color: string;
}

export const StatCard = ({ title, value, Icon, color }: StatCardProps) => {
    const cardColor = useThemeColor({}, 'card');
    const textColor = useThemeColor({}, 'text');
    const textMuted = useThemeColor({}, 'textMuted');
    
    return (
        <View style={[styles.statCard, { backgroundColor: cardColor }]}>
            <View style={[styles.statIconBadge, { backgroundColor: color + '15' }]}>
                <Icon size={18} color={color} />
            </View>
            <Text style={[styles.statValue, { color: textColor }]}>{value}</Text>
            <Text style={[styles.statLabel, { color: textMuted }]}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    statCard: {
        width: '30%',
        paddingVertical: 18,
        borderRadius: 24,
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.12,
        shadowRadius: 8
    },
    statIconBadge: { padding: 8, borderRadius: 12, marginBottom: 8 },
    statValue: { fontSize: 18, fontWeight: '900' },
    statLabel: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', marginTop: 2, letterSpacing: 0.5 },
});