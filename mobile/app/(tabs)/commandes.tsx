import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { orders } from '@/data/dataMocket';
import CardCommand from '@/components/ui/card/CardCommand';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function OrdersScreen() {
    // 1. Récupération des couleurs du thème
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Text style={[styles.title, { color: textColor }]}>
                Mes Commandes
            </Text>
            <FlatList
                data={orders}
                keyExtractor={(order) => order.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                // Les cartes recevront le changement de thème
                // si elles utilisent aussi useThemeColor à l'intérieur
                renderItem={({ item }) => <CardCommand item={item} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        paddingHorizontal: 20,
        paddingTop: 60,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
});
