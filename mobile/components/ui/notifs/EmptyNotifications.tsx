import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BellOff } from 'lucide-react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function EmptyNotifications() {
    const textMuted = useThemeColor({}, 'textMuted');
    const textColor = useThemeColor({}, 'text');

    return (
        <View style={styles.container}>
            <View style={styles.iconCircle}>
                <BellOff size={50} color={textMuted} strokeWidth={1.5} />
            </View>
            <Text style={[styles.title, { color: textColor }]}>Tout est calme ici</Text>
            <Text style={[styles.subtitle, { color: textMuted }]}>
                Mohamed, tes promotions et le suivi de tes commandes apparaîtront ici.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100, paddingHorizontal: 50 },
    iconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(0,0,0,0.03)', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    subtitle: { textAlign: 'center', fontSize: 14, lineHeight: 22 }
});