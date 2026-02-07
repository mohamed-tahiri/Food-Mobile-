import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Cuisine } from '@/types/cuisine';


export default function CardCuisineItem({ item, setSearchText }: { item: Cuisine, setSearchText: (text: string) => void }) {
    
    const backgroundColor = useThemeColor({}, 'background');
    const headerColor = useThemeColor({}, 'tabBar'); 
    const textColor = useThemeColor({}, 'text');
    const borderColor = useThemeColor({}, 'border');
    
    return (
        <TouchableOpacity
            style={[
                styles.gridItem,
                {
                    backgroundColor: headerColor,
                    borderColor: borderColor,
                },
            ]}
            onPress={() => setSearchText(item.name)}
        >
            <View
                style={[
                    styles.iconCircle,
                    {
                        backgroundColor:
                            backgroundColor,
                    },
                ]}
            >
                <Text style={styles.gridIcon}>
                    {item.icon}
                </Text>
            </View>
            <Text
                style={[
                    styles.gridName,
                    { color: textColor },
                ]}
            >
                {item.name}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    gridItem: {
        width: '48%',
        padding: 20,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 15,
        elevation: 2,
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    gridIcon: { fontSize: 30 },
    gridName: { fontWeight: '700' },
});
             