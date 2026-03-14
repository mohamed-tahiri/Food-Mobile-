import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Tag, Star, Info, Clock } from 'lucide-react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function NotificationCard({ item }: { item: any }) {
    const textColor = useThemeColor({}, 'text');
    const textMuted = useThemeColor({}, 'textMuted');
    const cardColor = useThemeColor({}, 'card');
    const primaryColor = useThemeColor({}, 'primary');

    const getIcon = () => {
        switch (item.type) {
            case 'promotion': return <Tag size={18} color="#FF9500" />;
            case 'new_restaurant': return <Star size={18} color="#FFCC00" />;
            default: return <Info size={18} color={primaryColor} />;
        }
    };

    return (
        <TouchableOpacity style={[styles.card, { backgroundColor: cardColor }]}>
            <View style={styles.iconWrapper}>
                {getIcon()}
            </View>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: textColor }]}>{item.title}</Text>
                    {!item.isRead && <View style={[styles.dot, { backgroundColor: primaryColor }]} />}
                </View>
                <Text style={[styles.body, { color: textMuted }]} numberOfLines={2}>
                    {item.body}
                </Text>
                <View style={styles.footer}>
                    <Clock size={12} color={textMuted} />
                    <Text style={[styles.date, { color: textMuted }]}>Il y a 2h</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: { flexDirection: 'row', padding: 16, marginHorizontal: 20, marginBottom: 12, borderRadius: 20, alignItems: 'center' },
    iconWrapper: { width: 45, height: 45, borderRadius: 15, backgroundColor: 'rgba(0,0,0,0.03)', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    content: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    title: { fontWeight: '700', fontSize: 15 },
    dot: { width: 8, height: 8, borderRadius: 4 },
    body: { fontSize: 13, lineHeight: 18, marginBottom: 8 },
    footer: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    date: { fontSize: 11, fontWeight: '500' }
});