import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LogOut, ChevronRight, Share2, ShoppingBag, Moon, Sun } from 'lucide-react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAppTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';

// Composant réutilisable pour les options
const ProfileOption = ({ Icon, title, subtitle, color = '#333', isLast, onPress }: any) => {
    const textColor = useThemeColor({}, 'text');
    const textMuted = useThemeColor({}, 'textMuted');
    const borderColor = useThemeColor({}, 'border');

    return (
        <TouchableOpacity style={[styles.option, !isLast && { borderBottomWidth: 1, borderBottomColor: borderColor }]} onPress={onPress}>
            <View style={styles.optionLeft}>
                <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}><Icon size={20} color={color} /></View>
                <View style={styles.textContainer}>
                    <Text style={[styles.optionTitle, { color: color === '#FF3B30' ? color : textColor }]}>{title}</Text>
                    {subtitle && <Text style={[styles.optionSubtitle, { color: textMuted }]}>{subtitle}</Text>}
                </View>
            </View>
            <ChevronRight size={18} color={textMuted} />
        </TouchableOpacity>
    );
};

export default function ProfileScreen() {
    const router = useRouter(); // <--- Initialisation
    const { isDark, toggleTheme } = useAppTheme();
    const { signOut, user } = useAuth(); // Récupération des infos de Mohamed

    const backgroundColor = useThemeColor({}, 'background');
    const headerColor = useThemeColor({}, 'tabBar');
    const textColor = useThemeColor({}, 'text');
    const textMuted = useThemeColor({}, 'textMuted');
    const cardColor = useThemeColor({}, 'card');

    return (
        <ScrollView style={[styles.container, { backgroundColor }]} showsVerticalScrollIndicator={false}>
            <View style={[styles.header, { backgroundColor: headerColor }]}>
                <View style={styles.avatarContainer}>
                    <View style={[styles.avatar, { backgroundColor: '#FF6B35' }]}>
                        <Text style={styles.avatarText}>
                            {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'MT'}
                        </Text>
                    </View>
                </View>
                <Text style={[styles.userName, { color: textColor }]}>{user?.name || "Mohamed Tahiri"}</Text>
                <Text style={[styles.userEmail, { color: textMuted }]}>{user?.email || "chargement..."}</Text>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: textMuted }]}>Préférences</Text>
                <View style={[styles.card, { backgroundColor: cardColor }]}>
                    <ProfileOption Icon={isDark ? Sun : Moon} title={isDark ? 'Mode Clair' : 'Mode Sombre'} color={isDark ? '#FFB300' : '#4A90E2'} isLast={true} onPress={toggleTheme} />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: textMuted }]}>Activité</Text>
                <View style={[styles.card, { backgroundColor: cardColor }]}>
                    <ProfileOption 
                        Icon={ShoppingBag} 
                        title="Mes commandes" color="#FF6B35"
                        onPress={() => router.push('/(tabs)/commandes')}
                     />
                    <ProfileOption Icon={Share2} title="Parrainer" color="#4CAF50" isLast={true} />
                </View>
            </View>

            <View style={[styles.section, { marginBottom: 30 }]}>
                <View style={[styles.card, { backgroundColor: cardColor }]}>
                    <ProfileOption Icon={LogOut} title="Déconnexion" color="#FF3B30" onPress={() => Alert.alert('Déconnexion', 'Voulez-vous partir ?', [{text: 'Non'}, {text: 'Oui', onPress: signOut}])} isLast={true} />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { alignItems: 'center', paddingTop: 60, paddingBottom: 30, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
    avatarContainer: { marginBottom: 15 },
    avatar: { width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center' },
    avatarText: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
    userName: { fontSize: 22, fontWeight: 'bold' },
    userEmail: { fontSize: 14, marginTop: 4 },
    section: { paddingHorizontal: 20, marginTop: 25 },
    sectionTitle: { fontSize: 12, fontWeight: '700', marginBottom: 10, textTransform: 'uppercase' },
    card: { borderRadius: 20, overflow: 'hidden' },
    option: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
    optionLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    iconContainer: { padding: 10, borderRadius: 14, marginRight: 16 },
    textContainer: { flex: 1 },
    optionTitle: { fontSize: 16, fontWeight: '600' },
    optionSubtitle: { fontSize: 12 },
});