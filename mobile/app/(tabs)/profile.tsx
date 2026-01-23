import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
// On importe les icônes et le type LucideIcon séparément
import { 
  User, 
  CreditCard, 
  Bell, 
  LogOut, 
  ChevronRight, 
  Settings,
  MapPin,
  HelpCircle,
  type LucideIcon 
} from 'lucide-react-native';

// 1. Définition de l'interface pour les props
interface ProfileOptionProps {
  Icon: LucideIcon;
  title: string;
  subtitle?: string;
  color?: string;
  onPress?: () => void;
}

// 2. Composant réutilisable pour les lignes du menu
const ProfileOption = ({ Icon, title, subtitle, color = "#333", onPress }: ProfileOptionProps) => (
  <TouchableOpacity style={styles.option} onPress={onPress}>
    <View style={styles.optionLeft}>
      <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
        <Icon size={22} color={color} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.optionTitle, { color: color === "#FF3B30" ? color : "#1A1A1A" }]}>{title}</Text>
        {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    <ChevronRight size={18} color="#CCC" />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Déconnexion", style: "destructive", onPress: () => console.log("User logged out") }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* En-tête du profil */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>MT</Text>
          </View>
          <TouchableOpacity style={styles.editBadge}>
            <Settings size={14} color="#FFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>Med Tahiri</Text>
        <Text style={styles.userEmail}>med.tahiri@estiam.education</Text>
      </View>

      {/* Section Compte */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mon Compte</Text>
        <View style={styles.card}>
          <ProfileOption 
            Icon={User} 
            title="Informations personnelles" 
            subtitle="Nom, email, téléphone"
            color="#FF6B35" 
          />
          <ProfileOption 
            Icon={MapPin} 
            title="Adresses enregistrées" 
            subtitle="Domicile, Travail..."
            color="#FF6B35" 
          />
          <ProfileOption 
            Icon={CreditCard} 
            title="Paiements" 
            subtitle="Visa **** 4242"
            color="#FF6B35" 
          />
        </View>
      </View>

      {/* Section Préférences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Paramètres</Text>
        <View style={styles.card}>
          <ProfileOption Icon={Bell} title="Notifications" color="#4A90E2" />
          <ProfileOption Icon={HelpCircle} title="Aide & Support" color="#4A90E2" />
          <ProfileOption 
            Icon={LogOut} 
            title="Déconnexion" 
            color="#FF3B30" 
            onPress={handleLogout}
          />
        </View>
      </View>

      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { alignItems: 'center', paddingTop: 60, paddingBottom: 30, backgroundColor: '#FFF' },
  avatarContainer: { position: 'relative', marginBottom: 15 },
  avatar: { 
    width: 90, 
    height: 90, 
    borderRadius: 45, 
    backgroundColor: '#FF6B35', 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
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
    borderColor: '#FFF'
  },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  userEmail: { fontSize: 14, color: '#777', marginTop: 4 },
  section: { paddingHorizontal: 20, marginTop: 25 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#888', marginBottom: 10, marginLeft: 5 },
  card: { backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  option: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F8F9FA' },
  optionLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconContainer: { padding: 8, borderRadius: 12, marginRight: 15 },
  textContainer: { flex: 1 },
  optionTitle: { fontSize: 16, fontWeight: '500' },
  optionSubtitle: { fontSize: 12, color: '#999', marginTop: 2 },
  versionText: { textAlign: 'center', color: '#BBB', fontSize: 12, marginVertical: 30 }
});