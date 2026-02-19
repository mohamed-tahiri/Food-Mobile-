import React, { useState } from 'react';
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
    type LucideIcon 
} from 'lucide-react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAppTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { authService } from '@/services/auth.service';

// Composant réutilisable pour les options de menu
interface ProfileOptionProps {
    Icon: LucideIcon;
    title: string;
    subtitle?: string;
    color?: string;
    isLast?: boolean;
    onPress?: () => void;
}

const ProfileOption = ({ Icon, title, subtitle, color = '#333', isLast, onPress }: ProfileOptionProps) => {
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
                <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
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

export default function ProfileScreen() {
    const router = useRouter();
    const { isDark, toggleTheme } = useAppTheme();
    const { signOut, user, signIn, token } = useAuth();
    
    const [isUploading, setIsUploading] = useState(false);

    const backgroundColor = useThemeColor({}, 'background');
    const headerColor = useThemeColor({}, 'tabBar');
    const textColor = useThemeColor({}, 'text');
    const textMuted = useThemeColor({}, 'textMuted');
    const cardColor = useThemeColor({}, 'card');

    // LOGIQUE DE CHANGEMENT D'IMAGE
    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission requise', 'Mohamed, nous avons besoin d\'accès à ta galerie pour changer ta photo !');
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

            // Formatage du fichier pour l'envoi multipart
            formData.append('file', {
                uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
                name: fileName,
                type: type,
            } as any);

            // 1. Appel API pour uploader le fichier
            const uploadRes = await authService.uploadAvatar(formData);
            
            if (uploadRes.success) {
                // 2. Mise à jour de l'URL photo dans le profil de Mohamed
                const photoUrl = uploadRes.data.url;
                const updateRes = await authService.updateProfile({ photo: photoUrl });

                if (updateRes.success) {
                    // 3. Sync locale avec le contexte Auth
                    await signIn(token!, updateRes.data);
                    Alert.alert('Succès', 'Ta photo de profil a été mise à jour 📸');
                }
            }
        } catch (error) {
            console.error("Erreur upload avatar:", error);
            Alert.alert('Erreur', "Impossible de mettre à jour l'image. Vérifie ta connexion.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor }]} showsVerticalScrollIndicator={false}>
            {/* HEADER AVEC AVATAR DYNAMIQUE */}
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
                                {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'MT'}
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
                <Text style={[styles.userEmail, { color: textMuted }]}>{user?.email || "chargement..."}</Text>
            </View>

            {/* SECTIONS DE MENU */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: textMuted }]}>Préférences</Text>
                <View style={[styles.card, { backgroundColor: cardColor }]}>
                    <ProfileOption 
                        Icon={isDark ? Sun : Moon} 
                        title={isDark ? 'Mode Clair' : 'Mode Sombre'} 
                        color={isDark ? '#FFB300' : '#4A90E2'} 
                        isLast={true} 
                        onPress={toggleTheme} 
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: textMuted }]}>Activité</Text>
                <View style={[styles.card, { backgroundColor: cardColor }]}>
                    <ProfileOption 
                        Icon={ShoppingBag} 
                        title="Mes commandes" 
                        color="#FF6B35"
                        onPress={() => router.push('/(tabs)/commandes')}
                     />
                    <ProfileOption Icon={Share2} title="Parrainer" color="#4CAF50" isLast={true} />
                </View>
            </View>

            <View style={[styles.section, { marginBottom: 30 }]}>
                <View style={[styles.card, { backgroundColor: cardColor }]}>
                    <ProfileOption 
                        Icon={LogOut} 
                        title="Déconnexion" 
                        color="#FF3B30" 
                        onPress={() => Alert.alert('Déconnexion', 'Voulez-vous partir ?', [
                            { text: 'Non', style: 'cancel' },
                            { text: 'Oui', style: 'destructive', onPress: signOut }
                        ])} 
                        isLast={true} 
                    />
                </View>
            </View>

            <Text style={styles.versionText}>Foodie App v1.0.2 - Mohamed Tahiri</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { 
        alignItems: 'center', 
        paddingTop: 60, 
        paddingBottom: 30, 
        borderBottomLeftRadius: 30, 
        borderBottomRightRadius: 30,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10
    },
    avatarWrapper: { position: 'relative', marginBottom: 15 },
    avatar: { 
        width: 100, 
        height: 100, 
        borderRadius: 50, 
        justifyContent: 'center', 
        alignItems: 'center', 
        overflow: 'hidden',
        borderWidth: 3,
        borderColor: '#FFF'
    },
    imageAvatar: { width: '100%', height: '100%' },
    avatarText: { color: '#FFF', fontSize: 36, fontWeight: 'bold' },
    cameraBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#333',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF'
    },
    userName: { fontSize: 24, fontWeight: 'bold' },
    userEmail: { fontSize: 14, marginTop: 4, opacity: 0.8 },
    section: { paddingHorizontal: 20, marginTop: 25 },
    sectionTitle: { fontSize: 12, fontWeight: '800', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
    card: { borderRadius: 24, overflow: 'hidden' },
    option: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18 },
    optionLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    iconContainer: { padding: 10, borderRadius: 14, marginRight: 16 },
    textContainer: { flex: 1 },
    optionTitle: { fontSize: 16, fontWeight: '700' },
    optionSubtitle: { fontSize: 12, marginTop: 2 },
    versionText: { textAlign: 'center', fontSize: 11, color: '#999', marginVertical: 20 }
});