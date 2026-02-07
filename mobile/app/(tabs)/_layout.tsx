import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { IconSymbol } from '@/components/icon/icon-symbol';

export default function TabLayout() {
    // 1. Récupération des couleurs dynamiques
    const activeColor = useThemeColor({}, 'primary');
    const inactiveColor = useThemeColor({}, 'textMuted');
    const tabBarBg = useThemeColor({}, 'tabBar');

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: activeColor,
                tabBarInactiveTintColor: inactiveColor,
                headerShown: false,
                // On applique la couleur de fond dynamique ici
                tabBarStyle: [styles.tabBar, { backgroundColor: tabBarBg }],
                tabBarLabelStyle: styles.tabBarLabel,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Accueil',
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={24} name="house.fill" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="recherche"
                options={{
                    title: 'Recherche',
                    tabBarIcon: ({ color }) => (
                        <IconSymbol
                            size={24}
                            name="magnifyingglass"
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="commandes"
                options={{
                    title: 'Commandes',
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={24} name="bag.fill" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="favoris"
                options={{
                    title: 'Favoris',
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={24} name="heart.fill" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profil',
                    tabBarIcon: ({ color }) => (
                        <IconSymbol
                            size={24}
                            name="person.fill"
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        borderTopWidth: 0,
        // backgroundColor: '#FFFFFF', <-- Supprimé car géré dynamiquement plus haut
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        height: Platform.OS === 'ios' ? 90 : 70,
        paddingBottom: Platform.OS === 'ios' ? 30 : 10,
        paddingTop: 10,
        // Ombre pour iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1, // Un peu plus d'opacité pour que l'ombre soit visible
        shadowRadius: 10,
        // Ombre pour Android
        elevation: 20,
    },
    tabBarLabel: {
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 0,
    },
});
