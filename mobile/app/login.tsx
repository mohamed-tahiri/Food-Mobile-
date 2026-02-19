import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Lock, Mail, ArrowRight } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/auth.service'; // Import du service

export default function LoginScreen() {
    const router = useRouter();
    const { signIn } = useAuth();
    
    const [email, setEmail] = useState('mohamed@estiam.fr');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const primaryColor = useThemeColor({}, 'primary');
    const textColor = useThemeColor({}, 'text');
    const cardColor = useThemeColor({}, 'card');
    const backgroundColor = useThemeColor({}, 'background');

    // LOGIQUE REFACTORISÉE
    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            return Alert.alert("Champs requis", "Remplis tes identifiants 🍕");
        }

        setIsLoading(true);
        try {
            const json = await authService.login({ email, password });

            if (json.success && json.data.accessToken) {
                await signIn(json.data.accessToken, json.data.user);
                router.replace('/(tabs)');
            } else {
                Alert.alert("Échec", json.message || "Identifiants invalides");
            }
        } catch (error) {
            Alert.alert("Erreur", "Connexion au serveur impossible");
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
            <View style={styles.header}>
                <Text style={[styles.title, { color: textColor }]}>Bon retour !</Text>
                <Text style={styles.subtitle}>Connecte-toi pour commander ton prochain repas.</Text>
            </View>

            <View style={styles.form}>
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

                <TouchableOpacity 
                    style={[styles.loginBtn, { backgroundColor: primaryColor }]} 
                    onPress={handleLogin} 
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <>
                            <Text style={styles.loginBtnText}>Se connecter</Text>
                            <ArrowRight size={20} color="#FFF" />
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 25, justifyContent: 'center' },
    header: { marginBottom: 40 },
    title: { fontSize: 32, fontWeight: '900', letterSpacing: -0.5 },
    subtitle: { fontSize: 16, color: '#888', marginTop: 10 },
    form: { gap: 15 },
    inputWrapper: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 15, 
        borderRadius: 18, 
        gap: 12,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.02)'
    },
    input: { flex: 1, fontSize: 16 },
    loginBtn: { 
        flexDirection: 'row', 
        height: 60, 
        borderRadius: 18, 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: 10, 
        marginTop: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    loginBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});