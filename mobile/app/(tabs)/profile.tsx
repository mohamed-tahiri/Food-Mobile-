import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Platform,
} from 'react-native';
import {
    User,
    CreditCard,
    Bell,
    LogOut,
    ChevronRight,
    Settings,
    MapPin,
    HelpCircle,
    Share2,
    ShieldCheck,
    ShoppingBag,
    Moon,
    Sun,
    type LucideIcon,
} from 'lucide-react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAppTheme } from '@/context/ThemeContext'; // Import crucial

interface ProfileOptionProps {
    Icon: LucideIcon;
    title: string;
    subtitle?: string;
    color?: string;
    isLast?: boolean;
    onPress?: () => void;
}

const ProfileOption = ({
    Icon,
    title,
    subtitle,
    color = '#333',
    isLast,
    onPress,
}: ProfileOptionProps) => {
    const textColor = useThemeColor({}, 'text');
    const textMuted = useThemeColor({}, 'textMuted');
    const borderColor = useThemeColor({}, 'border');

    return (
        <TouchableOpacity
            style={[
                styles.option,
                !isLast && {
                    borderBottomWidth: 1,
                    borderBottomColor: borderColor,
                },
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.optionLeft}>
                <View
                    style={[
                        styles.iconContainer,
                        { backgroundColor: color + '20' },
                    ]}
                >
                    <Icon size={20} color={color} />
                </View>
                <View style={styles.textContainer}>
                    <Text
                        style={[
                            styles.optionTitle,
                            { color: color === '#FF3B30' ? color : textColor },
                        ]}
                    >
                        {title}
                    </Text>
                    {subtitle && (
                        <Text
                            style={[
                                styles.optionSubtitle,
                                { color: textMuted },
                            ]}
                        >
                            {subtitle}
                        </Text>
                    )}
                </View>
            </View>
            <ChevronRight size={18} color={textMuted} />
        </TouchableOpacity>
    );
};

export default function ProfileScreen() {
    const { isDark, toggleTheme } = useAppTheme();

    const backgroundColor = useThemeColor({}, 'background');
    const headerColor = useThemeColor({}, 'tabBar');
    const textColor = useThemeColor({}, 'text');
    const textMuted = useThemeColor({}, 'textMuted');
    const cardColor = useThemeColor({}, 'card');

    const handleLogout = () => {
        Alert.alert(
            'Déconnexion',
            'Êtes-vous sûr de vouloir vous déconnecter ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Déconnexion',
                    style: 'destructive',
                    onPress: () => console.log('Déconnecté'),
                },
            ],
        );
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor }]}
            showsVerticalScrollIndicator={false}
        >
            {/* HEADER */}
            <View style={[styles.header, { backgroundColor: headerColor }]}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>MT</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.editBadge, { borderColor: headerColor }]}
                    >
                        <Settings size={14} color="#FFF" />
                    </TouchableOpacity>
                </View>
                <Text style={[styles.userName, { color: textColor }]}>
                    Med Tahiri
                </Text>
                <Text style={[styles.userEmail, { color: textMuted }]}>
                    med.tahiri@estiam.education
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: textMuted }]}>
                    Préférences
                </Text>
                <View style={[styles.card, { backgroundColor: cardColor }]}>
                    <ProfileOption
                        Icon={isDark ? Sun : Moon}
                        title={isDark ? 'Mode Clair' : 'Mode Sombre'}
                        subtitle={
                            isDark
                                ? 'Passer au thème lumineux'
                                : 'Passer au thème nuit'
                        }
                        color={isDark ? '#FFB300' : '#4A90E2'}
                        isLast={true}
                        onPress={toggleTheme}
                    />
                </View>
            </View>

            {/* ACTIVITÉ */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: textMuted }]}>
                    Activité
                </Text>
                <View style={[styles.card, { backgroundColor: cardColor }]}>
                    <ProfileOption
                        Icon={ShoppingBag}
                        title="Mes commandes"
                        subtitle="Historique et factures"
                        color="#FF6B35"
                    />
                    <ProfileOption
                        Icon={Share2}
                        title="Parrainer un ami"
                        subtitle="Gagnez 10€ de réduction"
                        color="#4CAF50"
                        isLast={true}
                    />
                </View>
            </View>

            {/* MON COMPTE */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: textMuted }]}>
                    Mon Compte
                </Text>
                <View style={[styles.card, { backgroundColor: cardColor }]}>
                    <ProfileOption
                        Icon={User}
                        title="Informations personnelles"
                        color="#FF6B35"
                    />
                    <ProfileOption
                        Icon={MapPin}
                        title="Adresses enregistrées"
                        color="#FF6B35"
                    />
                    <ProfileOption
                        Icon={CreditCard}
                        title="Paiements"
                        subtitle="Visa **** 4242"
                        color="#FF6B35"
                        isLast={true}
                    />
                </View>
            </View>

            {/* PARAMÈTRES */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: textMuted }]}>
                    Paramètres & Sécurité
                </Text>
                <View style={[styles.card, { backgroundColor: cardColor }]}>
                    <ProfileOption
                        Icon={Bell}
                        title="Notifications"
                        color="#4A90E2"
                    />
                    <ProfileOption
                        Icon={ShieldCheck}
                        title="Confidentialité"
                        color="#4A90E2"
                    />
                    <ProfileOption
                        Icon={HelpCircle}
                        title="Aide & Support"
                        color="#4A90E2"
                        isLast={true}
                    />
                </View>
            </View>

            {/* DÉCONNEXION */}
            <View style={[styles.section, { marginBottom: 30 }]}>
                <View style={[styles.card, { backgroundColor: cardColor }]}>
                    <ProfileOption
                        Icon={LogOut}
                        title="Déconnexion"
                        color="#FF3B30"
                        onPress={handleLogout}
                        isLast={true}
                    />
                </View>
            </View>

            <Text style={[styles.versionText, { color: textMuted }]}>
                Foodie App Version 1.0.0
            </Text>
            <View style={{ height: 100 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 80 : 60,
        paddingBottom: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    avatarContainer: { position: 'relative', marginBottom: 15 },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#FF6B35',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    avatarText: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#333',
        padding: 8,
        borderRadius: 20,
        borderWidth: 3,
    },
    userName: { fontSize: 22, fontWeight: 'bold' },
    userEmail: { fontSize: 14, marginTop: 4 },
    section: { paddingHorizontal: 20, marginTop: 25 },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 12,
        marginLeft: 5,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    card: {
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 15,
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    optionLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    iconContainer: { padding: 10, borderRadius: 14, marginRight: 16 },
    textContainer: { flex: 1 },
    optionTitle: { fontSize: 16, fontWeight: '600' },
    optionSubtitle: { fontSize: 12, marginTop: 2 },
    versionText: { textAlign: 'center', fontSize: 12, marginTop: 20 },
});
