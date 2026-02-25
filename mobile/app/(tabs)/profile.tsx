import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    ScrollView, 
    Alert, 
    Image, 
    ActivityIndicator, 
    Platform 
} from 'react-native';
import { 
    LogOut, 
    ChevronRight, 
    Share2, 
    ShoppingBag, 
    Moon, 
    Sun, 
    Camera,
    MapPin,
    CreditCard,
    Star,
    TrendingUp,
    type LucideIcon 
} from 'lucide-react-native';

// Services & Hooks
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAppTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { authService } from '@/services/auth.service';
import { orderService } from '@/services/order.service';
import { StatCard } from '@/components/ui/profile/StatCard';
import { ProfileOption } from '@/components/ui/profile/ProfileOption';

export default function ProfileScreen() {
    const router = useRouter();
    const { isDark, toggleTheme } = useAppTheme();
    const { signOut, user, signIn, token } = useAuth();
    
    const [isUploading, setIsUploading] = useState(false);
    const [orderCount, setOrderCount] = useState<number>(0);
    const [isStatsLoading, setIsStatsLoading] = useState(true);

    const backgroundColor = useThemeColor({}, 'background');
    const headerColor = useThemeColor({}, 'tabBar');
    const textColor = useThemeColor({}, 'text');
    const textMuted = useThemeColor({}, 'textMuted');
    const cardColor = useThemeColor({}, 'card');

    const fetchStats = async () => {
        try {
            const res = await orderService.getOrders();
            if (res.success) {
                setOrderCount(res.data.length);
            }
        } catch (error) {
            console.error("Erreur stats commandes:", error);
        } finally {
            setIsStatsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission requise', 'Accès à la galerie nécessaire pour changer la photo.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            uploadAvatar(result.assets[0].uri);
        }
    };

    const uploadAvatar = async (uri: string) => {
        setIsUploading(true);
        try {
            const formData = new FormData();
            const fileName = uri.split('/').pop() || 'profile.jpg';
            const match = /\.(\w+)$/.exec(fileName);
            const type = match ? `image/${match[1]}` : `image/jpeg`;

            formData.append('file', {
                uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
                name: fileName,
                type: type,
            } as any);

            const uploadRes = await authService.uploadAvatar(formData);
            
            if (uploadRes.success) {
                const photoUrl = uploadRes.data.url;
                const updateRes = await authService.updateProfile({ photo: photoUrl });

                if (updateRes.success) {
                    await signIn(token!, updateRes.data);
                    Alert.alert('Succès', 'Photo de profil mise à jour !');
                }
            }
        } catch (error) {
            Alert.alert('Erreur', "Impossible de mettre à jour l'image.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor }]} showsVerticalScrollIndicator={false}>
            {/* Header avec Avatar */}
            <View style={[styles.header, { backgroundColor: headerColor }]}>
                <TouchableOpacity 
                    style={styles.avatarWrapper} 
                    onPress={handlePickImage} 
                    disabled={isUploading}
                >
                    <View style={[styles.avatar, { backgroundColor: '#FF6B35' }]}>
                        {user?.photo ? (
                            <Image source={{ uri: user.photo }} style={styles.imageAvatar} />
                        ) : (
                            <Text style={styles.avatarText}>
                                {user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'MT'}
                            </Text>
                        )}
                    </View>
                    <View style={styles.cameraBadge}>
                        {isUploading ? (
                            <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                            <Camera size={14} color="#FFF" />
                        )}
                    </View>
                </TouchableOpacity>

                <Text style={[styles.userName, { color: textColor }]}>{user?.name || "Mohamed Tahiri"}</Text>
                <Text style={[styles.userEmail, { color: textMuted }]}>{user?.email || "mohamed.tahiri@estiam.fr"}</Text>
            </View>

            {/* Statistiques Cards */}
            <View style={styles.statsRow}>
                <StatCard
                    title="Commandes" 
                    value={isStatsLoading ? "..." : orderCount.toString()}
                    Icon={ShoppingBag} 
                    color="#FF6B35" 
                />
                <StatCard title="Avis" value="5" Icon={Star} color="#FFB300" />
                <StatCard title="Points" value="450" Icon={TrendingUp} color="#4CAF50" />
            </View>

            {/* Section : Informations */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: textMuted }]}>Informations personnelles</Text>
                <View style={[styles.card, { backgroundColor: cardColor }]}>
                    <ProfileOption
                        Icon={MapPin} 
                        title="Mes adresses" 
                        subtitle="Noisy-le-Grand, Buc..." 
                        color="#4A90E2"
                        onPress={() => router.push('/address/manage')} 
                    />
                    <ProfileOption 
                        Icon={CreditCard} 
                        title="Moyens de paiement" 
                        subtitle="Visa, Mastercard..." 
                        color="#9C27B0"
                        isLast={true}
                        onPress={() => router.push('/payment/manage')} // Nouvelle route
                    />
                </View>
            </View>

            {/* Section : Activité */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: textMuted }]}>Activité</Text>
                <View style={[styles.card, { backgroundColor: cardColor }]}>
                    <ProfileOption 
                        Icon={ShoppingBag} 
                        title="Historique des commandes" 
                        color="#FF6B35"
                        onPress={() => router.push('/(tabs)/commandes')}
                    />
                    <ProfileOption 
                        Icon={Star} 
                        title="Mes avis publiés" 
                        color="#FFB300"
                        isLast={true}
                        onPress={() => Alert.alert("Avis", "Affichage de vos avis en cours de développement")} 
                    />
                </View>
            </View>

            {/* Section : Paramètres & Déconnexion */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: textMuted }]}>Paramètres</Text>
                <View style={[styles.card, { backgroundColor: cardColor }]}>
                    <ProfileOption 
                        Icon={isDark ? Sun : Moon} 
                        title={isDark ? 'Mode Clair' : 'Mode Sombre'} 
                        color={isDark ? '#FFB300' : '#4A90E2'} 
                        onPress={toggleTheme} 
                    />
                    <ProfileOption 
                        Icon={Share2} 
                        title="Inviter des amis" 
                        color="#4CAF50" 
                    />
                    <ProfileOption 
                        Icon={LogOut} 
                        title="Déconnexion" 
                        color="#FF3B30" 
                        onPress={() => Alert.alert('Déconnexion', 'Voulez-vous vous déconnecter ?', [
                            { text: 'Annuler', style: 'cancel' },
                            { text: 'Déconnexion', style: 'destructive', onPress: signOut }
                        ])} 
                        isLast={true} 
                    />
                </View>
            </View>

            <Text style={styles.versionText}>Foodie App v1.1.0 - Mohamed Tahiri</Text>
            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { 
        alignItems: 'center', 
        paddingTop: 60, 
        paddingBottom: 40, 
        borderBottomLeftRadius: 35, 
        borderBottomRightRadius: 35,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12
    },
    avatarWrapper: { position: 'relative', marginBottom: 15 },
    avatar: { 
        width: 110, 
        height: 110, 
        borderRadius: 55, 
        justifyContent: 'center', 
        alignItems: 'center', 
        overflow: 'hidden',
        borderWidth: 4,
        borderColor: '#FFF'
    },
    imageAvatar: { width: '100%', height: '100%' },
    avatarText: { color: '#FFF', fontSize: 38, fontWeight: '900' },
    cameraBadge: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: '#333',
        width: 34,
        height: 34,
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFF'
    },
    userName: { fontSize: 24, fontWeight: '900', marginTop: 10 },
    userEmail: { fontSize: 14, marginTop: 4, fontWeight: '500' },
    
    // Stats Styles
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: -30,
    },
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

    section: { paddingHorizontal: 20, marginTop: 30 },
    sectionTitle: { fontSize: 13, fontWeight: '900', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1.2, marginLeft: 5 },
    card: { borderRadius: 28, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
    
    option: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    optionLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    iconContainer: { padding: 10, borderRadius: 15, marginRight: 18 },
    textContainer: { flex: 1 },
    optionTitle: { fontSize: 16, fontWeight: '700' },
    optionSubtitle: { fontSize: 12, marginTop: 3, fontWeight: '500' },
    versionText: { textAlign: 'center', fontSize: 12, color: '#999', marginTop: 40, fontWeight: '600' }
});