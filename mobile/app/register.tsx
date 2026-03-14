import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Lock, Mail, User, ArrowRight, ArrowLeft, Utensils } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/auth.service';

export default function RegisterScreen() {
    const router = useRouter();
    const { signIn } = useAuth();
    
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const primaryColor = useThemeColor({}, 'primary');
    const textColor = useThemeColor({}, 'text');
    const cardColor = useThemeColor({}, 'card');
    const backgroundColor = useThemeColor({}, 'background');

    const handleRegister = async () => {
        // Correction : Vérification avec firstName et lastName
        if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
            return Alert.alert("Presque prêt !", "Remplis tous les champs pour rejoindre la table 🍽️");
        }
        if (password !== confirmPassword) {
            return Alert.alert("Oups", "Les mots de passe ne sont pas jumeaux 🍕");
        }

        setIsLoading(true);
        try {
            // On envoie un objet complet au service
            const json = await authService.register({ 
                firstName, 
                lastName, 
                email, 
                password 
            });

            if (json.success && json.data.accessToken) {
                await signIn(json.data.accessToken, json.data.user);
                router.replace('/(tabs)');
            } else {
                Alert.alert("Échec de la recette", json.message || "Erreur lors de la création");
            }
        } catch (error) {
            Alert.alert("Erreur", "Le chef est débordé (serveur injoignable)");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            style={[styles.container, { backgroundColor }]}
        >
            <Stack.Screen options={{ headerShown: false }} />
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={24} color={textColor} />
                </TouchableOpacity>

                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <Utensils size={30} color={primaryColor} />
                    </View>
                    <Text style={[styles.title, { color: textColor }]}>Rejoins le club !</Text>
                    <Text style={styles.subtitle}>Crée ton profil pour découvrir et partager tes meilleures pépites culinaires.</Text>
                </View>

                <View style={styles.form}>
                    {/* PRÉNOM */}
                    <View style={[styles.inputWrapper, { backgroundColor: cardColor }]}>
                        <User size={20} color={primaryColor} />
                        <TextInput 
                            style={[styles.input, { color: textColor }]}
                            placeholder="Prénom"
                            placeholderTextColor="#888"
                            value={firstName}
                            onChangeText={setFirstName}
                        />
                    </View>

                    {/* NOM */}
                    <View style={[styles.inputWrapper, { backgroundColor: cardColor }]}>
                        <User size={20} color={primaryColor} />
                        <TextInput 
                            style={[styles.input, { color: textColor }]}
                            placeholder="Nom"
                            placeholderTextColor="#888"
                            value={lastName}
                            onChangeText={setLastName}
                        />
                    </View>

                    {/* EMAIL */}
                    <View style={[styles.inputWrapper, { backgroundColor: cardColor }]}>
                        <Mail size={20} color={primaryColor} />
                        <TextInput 
                            style={[styles.input, { color: textColor }]}
                            placeholder="Email"
                            placeholderTextColor="#888"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    {/* MOT DE PASSE */}
                    <View style={[styles.inputWrapper, { backgroundColor: cardColor }]}>
                        <Lock size={20} color={primaryColor} />
                        <TextInput 
                            style={[styles.input, { color: textColor }]}
                            placeholder="Mot de passe"
                            placeholderTextColor="#888"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    {/* CONFIRMATION */}
                    <View style={[styles.inputWrapper, { backgroundColor: cardColor }]}>
                        <Lock size={20} color={primaryColor} />
                        <TextInput 
                            style={[styles.input, { color: textColor }]}
                            placeholder="Confirme ton secret"
                            placeholderTextColor="#888"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity 
                        style={[styles.registerBtn, { backgroundColor: primaryColor }]} 
                        onPress={handleRegister} 
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <>
                                <Text style={styles.registerBtnText}>Créer mon compte</Text>
                                <ArrowRight size={20} color="#FFF" />
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push('/login')} style={styles.footerLink}>
                        <Text style={styles.subtitle}>Déjà membre ? <Text style={{ color: primaryColor, fontWeight: 'bold' }}>Connecte-toi</Text></Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

// Les styles restent identiques, ils étaient déjà très bien !
const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { padding: 25, paddingTop: 50 },
    backBtn: { marginBottom: 15, width: 40, height: 40, justifyContent: 'center' },
    iconContainer: { marginBottom: 15 },
    header: { marginBottom: 30 },
    title: { fontSize: 30, fontWeight: '900', letterSpacing: -0.5 },
    subtitle: { fontSize: 15, color: '#888', marginTop: 8, lineHeight: 22 },
    form: { gap: 12 }, // Réduit un peu le gap car il y a plus de champs
    inputWrapper: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 15, 
        borderRadius: 20, 
        gap: 12,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.02)'
    },
    input: { flex: 1, fontSize: 16 },
    registerBtn: { 
        flexDirection: 'row', 
        height: 62, 
        borderRadius: 20, 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: 10, 
        marginTop: 15,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8
    },
    registerBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    footerLink: { marginTop: 15, alignItems: 'center', paddingBottom: 40 }
});