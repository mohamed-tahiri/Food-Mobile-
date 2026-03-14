import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ChevronRight, Utensils, Zap, MapPin } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const SLIDES = [
    {
        id: '1',
        title: 'Trouvez vos favoris',
        description: 'Découvrez les meilleurs restaurants de votre quartier avec des menus mis à jour.',
        icon: Utensils,
        color: '#FF6433'
    },
    {
        id: '2',
        title: 'Livraison Rapide',
        description: 'Commandez en deux clics et recevez votre repas chaud en moins de 30 minutes.',
        icon: Zap,
        color: '#4CAF50'
    },
    {
        id: '3',
        title: 'Suivi en Temps Réel',
        description: 'Suivez votre livreur sur la carte depuis la cuisine jusqu’à votre porte.',
        icon: MapPin,
        color: '#2196F3'
    }
];

export default function OnboardingScreen() {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const primaryColor = useThemeColor({}, 'primary');

    const handleComplete = async () => {
        try {
            await AsyncStorage.setItem('@onboarding_seen', 'true');
            console.log('Onboarding status saved');
            
            router.replace('/login'); 
        } catch (e) {
            console.error("Erreur storage:", e);
        }
    };

    const handleNext = () => {
        if (currentIndex < SLIDES.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            handleComplete();
        }
    };

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <FlatList
                ref={flatListRef}
                data={SLIDES}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(e) => {
                    setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width));
                }}
                renderItem={({ item }) => (
                    <View style={styles.slide}>
                        <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                            <item.icon size={100} color={item.color} />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={[styles.title, { color: textColor }]}>{item.title}</Text>
                            <Text style={styles.description}>{item.description}</Text>
                        </View>
                    </View>
                )}
                keyExtractor={(item) => item.id}
            />

            <View style={styles.footer}>
                <View style={styles.pagination}>
                    {SLIDES.map((_, i) => (
                        <View 
                            key={i} 
                            style={[
                                styles.dot, 
                                { backgroundColor: i === currentIndex ? primaryColor : '#D1D1D1',
                                  width: i === currentIndex ? 24 : 8 }
                            ]} 
                        />
                    ))}
                </View>

                {/* Button */}
                <TouchableOpacity 
                    style={[styles.button, { backgroundColor: primaryColor }]} 
                    onPress={handleNext}
                >
                    <Text style={styles.buttonText}>
                        {currentIndex === SLIDES.length - 1 ? "C'est parti !" : "Suivant"}
                    </Text>
                    <ChevronRight size={20} color="#FFF" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    slide: { width, justifyContent: 'center', alignItems: 'center', padding: 40 },
    iconContainer: { width: 200, height: 200, borderRadius: 100, justifyContent: 'center', alignItems: 'center', marginBottom: 50 },
    textContainer: { alignItems: 'center' },
    title: { fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 20 },
    description: { fontSize: 16, color: '#888', textAlign: 'center', lineHeight: 24 },
    footer: { padding: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    pagination: { flexDirection: 'row', gap: 8 },
    dot: { height: 8, borderRadius: 4 },
    button: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 25, borderRadius: 30, gap: 10 },
    buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});