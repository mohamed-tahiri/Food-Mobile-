import React, { useEffect, useState } from 'react';
import { 
    View, Text, StyleSheet, TouchableOpacity, ScrollView, 
    Platform, ActivityIndicator, Alert, Modal, TextInput, KeyboardAvoidingView 
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, MapPin, Plus, Trash2, X, CheckCircle2 } from 'lucide-react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { addressService } from '@/services/address.service';

export default function ManageAddressScreen() {
    const router = useRouter();
    const [addresses, setAddresses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [modalVisible, setModalVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newAddress, setNewAddress] = useState({ label: '', street: '', city: '' });

    const backgroundColor = useThemeColor({}, 'background');
    const headerColor = useThemeColor({}, 'tabBar');
    const textColor = useThemeColor({}, 'text');
    const textMuted = useThemeColor({}, 'textMuted');
    const cardColor = useThemeColor({}, 'card');
    const primaryColor = useThemeColor({}, 'primary');
    const borderColor = useThemeColor({}, 'border');

    const fetchAddresses = async () => {
        setIsLoading(true);
        try {
            const res = await addressService.getAll();
            if (res.success) setAddresses(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchAddresses(); }, []);

    const handleSetDefault = async (id: string) => {
        console.log("Setting default address to ID:", id);

        try {
            const res = await addressService.setDefault(id);
            if (res.success) {
                setAddresses(res.data); // On met à jour la liste avec le retour du serveur
            }
        } catch (error) {
            Alert.alert("Erreur", "Impossible de changer l'adresse par défaut.");
        }
    };

    const handleAddAddress = async () => {
        if (!newAddress.label || !newAddress.street || !newAddress.city) {
            Alert.alert("Oups", "Mohamed, remplis tout le formulaire !");
            return;
        }
        setIsSubmitting(true);
        try {
            const res = await addressService.create(newAddress);
            if (res.success) {
                setModalVisible(false);
                setNewAddress({ label: '', street: '', city: '' });
                fetchAddresses();
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = (id: string) => {
        Alert.alert("Supprimer", "Supprimer cette adresse ?", [
            { text: "Non" },
            { text: "Oui", style: "destructive", onPress: async () => {
                const res = await addressService.delete(id);
                if (res.success) fetchAddresses();
            }}
        ]);
    };

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={[styles.header, { backgroundColor: headerColor }]}>
                <TouchableOpacity style={[styles.backBtn, { backgroundColor: cardColor }]} onPress={() => router.back()}>
                    <ChevronLeft color={textColor} size={24} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: textColor }]}>Mes Adresses</Text>
                <View style={{ width: 44 }} />
            </View>

            {isLoading ? (
                <ActivityIndicator size="large" color={primaryColor} style={{ marginTop: 50 }} />
            ) : (
                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={[styles.sectionTitle, { color: textMuted }]}>Adresse de livraison</Text>
                    
                    {addresses.map((item) => (
                        <TouchableOpacity 
                            key={item.id} 
                            activeOpacity={0.9}
                            onPress={() => handleSetDefault(item.id)}
                            style={[
                                styles.addressCard, 
                                { 
                                    backgroundColor: item.isDefault ? primaryColor : cardColor,
                                    borderColor: item.isDefault ? primaryColor : borderColor,
                                    elevation: item.isDefault ? 8 : 2
                                }
                            ]}
                        >
                            <View style={styles.addressInfo}>
                                <View style={[
                                    styles.iconCircle, 
                                    { backgroundColor: item.isDefault ? 'rgba(255,255,255,0.2)' : primaryColor + '15' }
                                ]}>
                                    <MapPin size={22} color={item.isDefault ? '#FFF' : primaryColor} />
                                </View>
                                <View style={styles.textGroup}>
                                    <View style={styles.labelRow}>
                                        <Text style={[styles.label, { color: item.isDefault ? '#FFF' : textColor }]}>
                                            {item.label}
                                        </Text>
                                        {item.isDefault && (
                                            <View style={styles.badge}>
                                                <CheckCircle2 size={12} color={primaryColor} />
                                                <Text style={[styles.badgeText, { color: primaryColor }]}>ACTIF</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text style={[styles.street, { color: item.isDefault ? 'rgba(255,255,255,0.8)' : textMuted }]}>
                                        {item.street}, {item.city}
                                    </Text>
                                </View>
                            </View>
                            
                            {!item.isDefault && (
                                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                                    <Trash2 size={18} color="#FF3B30" />
                                </TouchableOpacity>
                            )}
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity style={[styles.addBtn, { borderColor: primaryColor }]} onPress={() => setModalVisible(true)}>
                        <Plus size={20} color={primaryColor} />
                        <Text style={[styles.addBtnText, { color: primaryColor }]}>Ajouter une adresse</Text>
                    </TouchableOpacity>
                </ScrollView>
            )}

            {/* Modal de formulaire d'ajout */}
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: cardColor }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: textColor }]}>Nouvelle adresse</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}><X color={textMuted} size={24} /></TouchableOpacity>
                        </View>
                        <TextInput 
                            style={[styles.input, { color: textColor, borderColor }]} 
                            placeholder="Nom (ex: Maison)" value={newAddress.label} 
                            onChangeText={(t) => setNewAddress({...newAddress, label: t})} 
                        />
                        <TextInput 
                            style={[styles.input, { color: textColor, borderColor }]} 
                            placeholder="Rue" value={newAddress.street} 
                            onChangeText={(t) => setNewAddress({...newAddress, street: t})} 
                        />
                        <TextInput 
                            style={[styles.input, { color: textColor, borderColor }]} 
                            placeholder="Ville" value={newAddress.city} 
                            onChangeText={(t) => setNewAddress({...newAddress, city: t})} 
                        />
                        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: primaryColor }]} onPress={handleAddAddress} disabled={isSubmitting}>
                            {isSubmitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitText}>Enregistrer</Text>}
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
    backBtn: { width: 44, height: 44, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    content: { padding: 20 },
    sectionTitle: { fontSize: 12, fontWeight: '800', marginBottom: 20, textTransform: 'uppercase' },
    addressCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 25, marginBottom: 15, borderWidth: 1 },
    addressInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    iconCircle: { width: 50, height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    textGroup: { marginLeft: 15, flex: 1 },
    labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    label: { fontSize: 16, fontWeight: '800' },
    badge: { backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, gap: 4 },
    badgeText: { fontSize: 10, fontWeight: '900' },
    street: { fontSize: 13, marginTop: 4 },
    deleteBtn: { padding: 10 },
    addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 20, borderRadius: 25, borderWidth: 2, borderStyle: 'dashed', marginTop: 10 },
    addBtnText: { marginLeft: 10, fontWeight: '800' },
    modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { padding: 25, borderTopLeftRadius: 30, borderTopRightRadius: 30, minHeight: 400 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    modalTitle: { fontSize: 20, fontWeight: '800' },
    input: { borderWidth: 1, borderRadius: 15, padding: 15, marginBottom: 15 },
    submitBtn: { padding: 18, borderRadius: 15, alignItems: 'center' },
    submitText: { color: '#FFF', fontWeight: '800' }
});