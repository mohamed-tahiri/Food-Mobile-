import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { orders } from '@/data/dataMocket';
import CardCommand from '@/components/ui/card/CardCommand';

export default function OrdersScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mes Commandes</Text>
            <FlatList
                data={orders}
                keyExtractor={(order) => order.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => <CardCommand item={item} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDFDFD',
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
