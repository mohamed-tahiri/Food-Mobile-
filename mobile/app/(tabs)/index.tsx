import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import { Search, MapPin } from 'lucide-react-native';
import CardPromo from '@/components/ui/card/CardPromo';
import CardRestaurant from '@/components/ui/card/CardRestaurant';
import { categories, offers, restaurants } from '@/data/dataMocket';
import CardCategory from '@/components/ui/card/CardCategory';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getCurrentAddress } from '@/services/localisation.service';

export default function HomeScreen() {
    const [displayAddress, setDisplayAddress] = useState("Chargement...");

    const router = useRouter();

    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const textMuted = useThemeColor({}, 'textMuted');
    const cardColor = useThemeColor({}, 'card');
    const primaryColor = useThemeColor({}, 'primary');
    const primaryLight = useThemeColor({}, 'primaryLight');

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const address = await getCurrentAddress();
                setDisplayAddress(address);
            } catch (err) {
                console.error("Erreur localisation, adresse par défaut utilisée:", err);
                setDisplayAddress("13 Allée de la Noiseraie, Noisy-le-Grand");
            }
        };

        fetchLocation();
    }, []);

    return (
        <ScrollView
            style={[styles.container, { backgroundColor }]}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.locationContainer}
                    activeOpacity={0.7}
                    onPress={() => console.log('Ouvrir sélection adresse')}
                >
                    {/* Couleur muette dynamique */}
                    <Text style={[styles.deliveryTo, { color: textMuted }]}>
                        Livrer au
                    </Text>
                    <View style={styles.locationRow}>
                        <View
                            style={[
                                styles.iconCircle,
                                { backgroundColor: primaryLight },
                            ]}
                        >
                            <MapPin
                                size={16}
                                color={primaryColor}
                                fill={`${primaryColor}20`}
                            />
                        </View>
                        <Text
                            style={[styles.address, { color: textColor }]}
                            numberOfLines={1}
                        >
                            {displayAddress}
                        </Text>
                        <Text
                            style={[
                                styles.dropdownArrow,
                                { color: primaryColor },
                            ]}
                        >
                            ⌄
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push('/profile')}
                    activeOpacity={0.8}
                >
                    <View style={styles.profileContainer}>
                        <View
                            style={[
                                styles.profilePic,
                                { backgroundColor: primaryColor },
                            ]}
                        >
                            <Text style={styles.profileInitial}>M</Text>
                        </View>
                        {/* Le badge reste vert, mais la bordure s'adapte au fond */}
                        <View
                            style={[
                                styles.onlineBadge,
                                { borderColor: backgroundColor },
                            ]}
                        />
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.searchSection}>
                {/* Barre de recherche avec fond de carte dynamique */}
                <View
                    style={[styles.searchBar, { backgroundColor: cardColor }]}
                >
                    <Search size={20} color={textMuted} />
                    <TextInput
                        placeholderTextColor={textMuted}
                        placeholder="Un restaurant, un plat..."
                        style={[styles.searchInput, { color: textColor }]}
                    />
                </View>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.promoContainer}
                snapToInterval={310}
                decelerationRate="fast"
            >
                {offers.map((offer) => (
                    <CardPromo key={offer.id} offer={offer} />
                ))}
            </ScrollView>

            <Text style={[styles.sectionTitle, { color: textColor }]}>
                Catégories
            </Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: 2, paddingVertical: 4 }}
            >
                {categories.map((cat, index) => (
                    <CardCategory
                        key={cat.id}
                        cat={cat}
                        isSelected={index === 1}
                    />
                ))}
            </ScrollView>

            <Text style={[styles.sectionTitle, { color: textColor }]}>
                Populaires à proximité
            </Text>

            {restaurants.map((resto) => (
                <CardRestaurant key={resto.id} resto={resto} />
            ))}
            <View style={{ height: 100 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 10,
    },
    locationContainer: { flex: 1, marginRight: 20 },
    deliveryTo: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    locationRow: { flexDirection: 'row', alignItems: 'center' },
    iconCircle: {
        padding: 6,
        borderRadius: 10,
        marginRight: 8,
    },
    address: {
        fontWeight: '700',
        fontSize: 16,
        maxWidth: '80%',
    },
    dropdownArrow: {
        marginLeft: 5,
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: -5,
    },
    profileContainer: { position: 'relative' },
    profilePic: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000', // Noir pour l'ombre même en light
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    profileInitial: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
    onlineBadge: {
        position: 'absolute',
        right: -2,
        top: -2,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#4CAF50',
        borderWidth: 2,
    },
    promoContainer: { marginTop: 25, flexDirection: 'row' },
    container: { flex: 1, paddingHorizontal: 20 },
    searchSection: { marginTop: 25 },
    searchBar: {
        flexDirection: 'row',
        padding: 12,
        borderRadius: 15,
        alignItems: 'center',
    },
    searchInput: { marginLeft: 10, flex: 1, fontSize: 16 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 20 },
});
