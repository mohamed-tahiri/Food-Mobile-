import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
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
  type LucideIcon 
} from 'lucide-react-native';

// --- COMPOSANT RÉUTILISABLE ---
interface ProfileOptionProps {
  Icon: LucideIcon;
  title: string;
  subtitle?: string;
  color?: string;
  isLast?: boolean; // Pour gérer la bordure finale de la card
  onPress?: () => void;
}

const ProfileOption = ({ Icon, title, subtitle, color = "#333", isLast, onPress }: ProfileOptionProps) => (
  <TouchableOpacity 
    style={[styles.option, isLast && { borderBottomWidth: 0 }]} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.optionLeft}>
      <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
        <Icon size={20} color={color} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.optionTitle, { color: color === "#FF3B30" ? color : "#1A1A1A" }]}>{title}</Text>
        {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    <ChevronRight size={18} color="#CCC" />
  </TouchableOpacity>
);

// --- ÉCRAN PRINCIPAL ---
export default function ProfileScreen() {
  const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Déconnexion", style: "destructive", onPress: () => console.log("Déconnecté") }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* 1. HEADER : IDENTITÉ */}
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

      {/* 2. SECTION : ACTIVITÉ (Spécifique Foodie) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activité</Text>
        <View style={styles.card}>
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

      {/* 3. SECTION : MON COMPTE */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mon Compte</Text>
        <View style={styles.card}>
          <ProfileOption 
            Icon={User} 
            title="Informations personnelles" 
            subtitle="Gérer votre profil"
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
            isLast={true}
          />
        </View>
      </View>

      {/* 4. SECTION : PARAMÈTRES & SÉCURITÉ */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Paramètres & Sécurité</Text>
        <View style={styles.card}>
          <ProfileOption Icon={Bell} title="Notifications" color="#4A90E2" />
          <ProfileOption Icon={ShieldCheck} title="Confidentialité" color="#4A90E2" />
          <ProfileOption Icon={HelpCircle} title="Aide & Support" color="#4A90E2" isLast={true} />
        </View>
      </View>

      {/* 5. ACTION : DÉCONNEXION */}
      <View style={[styles.section, { marginBottom: 30 }]}>
        <View style={styles.card}>
          <ProfileOption 
            Icon={LogOut} 
            title="Déconnexion" 
            color="#FF3B30" 
            onPress={handleLogout}
            isLast={true}
          />
        </View>
      </View>

      <Text style={styles.versionText}>Foodie App Version 1.0.0</Text>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA' 
  },
  header: { 
    alignItems: 'center', 
    paddingTop: Platform.OS === 'ios' ? 80 : 60, 
    paddingBottom: 30, 
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  avatarContainer: { 
    position: 'relative', 
    marginBottom: 15 
  },
  avatar: { 
    width: 90, 
    height: 90, 
    borderRadius: 45, 
    backgroundColor: '#FF6B35', 
    justifyContent: 'center', 
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOpacity: 0.3,
    shadowRadius: 8,
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
    borderColor: '#FFF'
  },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  userEmail: { fontSize: 14, color: '#777', marginTop: 4 },
  section: { 
    paddingHorizontal: 20, 
    marginTop: 25 
  },
  sectionTitle: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#BBB', 
    marginBottom: 12, 
    marginLeft: 5,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: { 
    backgroundColor: '#FFF', 
    borderRadius: 20, 
    overflow: 'hidden', 
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 15,
    elevation: 2,
  },
  option: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F1F1F1' 
  },
  optionLeft: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    flex: 1 
  },
  iconContainer: { 
    padding: 10, 
    borderRadius: 14, 
    marginRight: 16 
  },
  textContainer: { flex: 1 },
  optionTitle: { fontSize: 16, fontWeight: '600' },
  optionSubtitle: { fontSize: 12, color: '#999', marginTop: 2 },
  versionText: { textAlign: 'center', color: '#BBB', fontSize: 12, marginTop: 20 }
});