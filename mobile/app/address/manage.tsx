import React, { useEffect, useState } from 'react';
import { 
    View, Text, StyleSheet, TouchableOpacity, ScrollView, 
    Platform, ActivityIndicator, Alert, Modal, TextInput, KeyboardAvoidingView 
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, MapPin, Plus, Trash2, X } from 'lucide-react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { addressService } from '@/services/address.service';

export default function ManageAddressScreen() {
    const router = useRouter();
    const [addresses, setAddresses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // States pour le formulaire
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
            console.error("Erreur fetch addresses:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchAddresses(); }, []);

    // Fonction d'ajout
    const handleAddAddress = async () => {
        if (!newAddress.label || !newAddress.street || !newAddress.city) {
            Alert.alert("Champs requis", "Mohamed, merci de remplir tous les champs !");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await addressService.create(newAddress);
            if (res.success) {
                setModalVisible(false);
                setNewAddress({ label: '', street: '', city: '' });
                fetchAddresses(); // Rafraîchir la liste
                Alert.alert("Succès", "Adresse ajoutée avec succès 🏠");
            }
        } catch (error) {
            Alert.alert("Erreur", "Impossible d'ajouter l'adresse.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = (id: string) => {
        Alert.alert("Supprimer", "Voulez-vous supprimer cette adresse ?", [
            { text: "Annuler", style: "cancel" },
            { 
                text: "Supprimer", style: "destructive", 
                onPress: async () => {
                    const res = await addressService.delete(id);
                    if (res.success) setAddresses(prev => prev.filter(addr => addr.id !== id));
                } 
            }
        ]);
    };

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={[styles.header, { backgroundColor: headerColor }]}>
                <TouchableOpacity style={[styles.backBtn, { backgroundColor: cardColor }]} onPress={() => router.back()}>
                    <ChevronLeft color={textColor} size={24} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: textColor }]}>Mes adresses</Text>
                <View style={{ width: 44 }} /> 
            </View>

            {isLoading ? (
                <ActivityIndicator size="large" color={primaryColor} style={{ marginTop: 50 }} />
            ) : (
                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={[styles.sectionTitle, { color: textMuted }]}>Adresses enregistrées</Text>
                    
                    {addresses.map((item) => (
                        <View key={item.id} style={[styles.addressCard, { backgroundColor: cardColor }]}>
                            <View style={styles.addressInfo}>
                                <View style={[styles.iconCircle, { backgroundColor: primaryColor + '15' }]}>
                                    <MapPin size={20} color={primaryColor} />
                                </View>
                                <View style={styles.textGroup}>
                                    <Text style={[styles.label, { color: textColor }]}>{item.label}</Text>
                                    <Text style={[styles.street, { color: textMuted }]}>{item.street}, {item.city}</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => handleDelete(item.id)}>
                                <Trash2 size={18} color="#FF3B30" />
                            </TouchableOpacity>
                        </View>
                    ))}

                    <TouchableOpacity 
                        style={[styles.addBtn, { borderColor: primaryColor }]}
                        onPress={() => setModalVisible(true)}
                    >
                        <Plus size={20} color={primaryColor} />
                        <Text style={[styles.addBtnText, { color: primaryColor }]}>Ajouter une nouvelle adresse</Text>
                    </TouchableOpacity>
                </ScrollView>
            )}

            {/* MODAL FORMULAIRE D'AJOUT */}
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalOverlay}
                >
                    <View style={[styles.modalContent, { backgroundColor: cardColor }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: textColor }]}>Nouvelle adresse</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <X color={textMuted} size={24} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.form}>
                            <Text style={[styles.inputLabel, { color: textMuted }]}>Nom (ex: Domicile, Bureau)</Text>
                            <TextInput 
                                style={[styles.input, { color: textColor, borderColor }]}
                                value={newAddress.label}
                                onChangeText={(text) => setNewAddress({...newAddress, label: text})}
                                placeholder="Domicile" placeholderTextColor={textMuted}
                            />

                            <Text style={[styles.inputLabel, { color: textMuted }]}>Rue</Text>
                            <TextInput 
                                style={[styles.input, { color: textColor, borderColor }]}
                                value={newAddress.street}
                                onChangeText={(text) => setNewAddress({...newAddress, street: text})}
                                placeholder="13 Allée de la Noiseraie" placeholderTextColor={textMuted}
                            />

                            <Text style={[styles.inputLabel, { color: textMuted }]}>Ville</Text>
                            <TextInput 
                                style={[styles.input, { color: textColor, borderColor }]}
                                value={newAddress.city}
                                onChangeText={(text) => setNewAddress({...newAddress, city: text})}
                                placeholder="Noisy-le-Grand" placeholderTextColor={textMuted}
                            />

                            <TouchableOpacity 
                                style={[styles.submitBtn, { backgroundColor: primaryColor }]}
                                onPress={handleAddAddress}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitBtnText}>{`Enregistrer l'adresse`}</Text>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { 
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingHorizontal: 20, paddingBottom: 25, 
        borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 4
    },
    backBtn: { width: 44, height: 44, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    content: { padding: 20, paddingTop: 30 },
    sectionTitle: { fontSize: 12, fontWeight: '800', marginBottom: 20, textTransform: 'uppercase', letterSpacing: 1 },
    addressCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 24, marginBottom: 15, elevation: 2 },
    addressInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    iconCircle: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    textGroup: { marginLeft: 15, flex: 1 },
    label: { fontWeight: '700', fontSize: 16 },
    street: { fontSize: 13, marginTop: 2 },
    addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 20, borderRadius: 24, borderWidth: 2, borderStyle: 'dashed', marginTop: 10 },
    addBtnText: { marginLeft: 10, fontWeight: '800', fontSize: 15 },
    
    // Modal Styles
    modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, minHeight: 450 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
    modalTitle: { fontSize: 20, fontWeight: '900' },
    form: { gap: 15 },
    inputLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginBottom: -5 },
    input: { borderWidth: 1, borderRadius: 15, padding: 15, fontSize: 16 },
    submitBtn: { padding: 18, borderRadius: 20, alignItems: 'center', marginTop: 10 },
    submitBtnText: { color: '#FFF', fontWeight: '900', fontSize: 16 }
});