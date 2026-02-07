import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Heart } from 'lucide-react-native';
import { favorites } from '@/data/dataMocket';
import CardRestaurant from '@/components/ui/card/CardRestaurant';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function FavoritesScreen() {
    // 1. Couleurs thématiques
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const textMuted = useThemeColor({}, 'textMuted');
    const cardBg = useThemeColor({}, 'card');

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: textColor }]}>
                    Mes Favoris
                </Text>
                <Text style={[styles.subtitle, { color: textMuted }]}>
                    {favorites.length} restaurants enregistrés
                </Text>
            </View>

            <FlatList
                data={favorites}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingBottom: 100, // Ajusté pour la TabBar
                }}
                renderItem={({ item }) => <CardRestaurant resto={item} />}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        {/* Icône adaptée : cardBg donne un gris subtil en light et un gris foncé en dark */}
                        <Heart size={60} color={cardBg} fill={cardBg} />
                        <Text style={[styles.emptyTitle, { color: textColor }]}>
                            {"Aucun favori pour l'instant"}
                        </Text>
                        <Text style={[styles.emptySub, { color: textMuted }]}>
                            Enregistrez vos restaurants préférés pour les
                            retrouver ici.
                        </Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
    title: { fontSize: 28, fontWeight: 'bold' },
    subtitle: { marginTop: 5 },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
    },
    emptySub: { textAlign: 'center', marginTop: 10 },
});
