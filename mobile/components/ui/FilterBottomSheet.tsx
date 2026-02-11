import React, { useMemo, useCallback, forwardRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Star, Clock, Banknote, Check } from 'lucide-react-native';

interface FilterBottomSheetProps {
    onApply: (filterId: string | null) => void;
}

// Utilisation de forwardRef pour permettre au parent (HomeScreen) de contrôler l'ouverture
// eslint-disable-next-line react/display-name
const FilterBottomSheet = forwardRef<BottomSheet, FilterBottomSheetProps>(({ onApply }, ref) => {
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const primaryColor = useThemeColor({}, 'primary');
    const cardColor = useThemeColor({}, 'card');
    const textMuted = useThemeColor({}, 'textMuted');

    const snapPoints = useMemo(() => ['45%', '60%'], []);

    const filters = [
        { id: 'rating', name: 'Mieux notés', icon: <Star size={18} color="#FFB300" /> },
        { id: 'time', name: 'Plus rapides', icon: <Clock size={18} color="#4CAF50" /> },
        { id: 'price', name: 'Prix', icon: <Banknote size={18} color={primaryColor} /> },
    ];

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop 
                {...props} 
                disappearsOnIndex={-1} 
                appearsOnIndex={0} 
                opacity={0.5} 
            />
        ),
        []
    );

    const handleApply = () => {
        onApply(selectedFilter);
        // On ferme via la ref passée par le parent
        (ref as React.MutableRefObject<BottomSheet>).current?.close();
    };

    return (
        <BottomSheet
            ref={ref}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose
            backdropComponent={renderBackdrop}
            backgroundStyle={{ backgroundColor }}
            handleIndicatorStyle={{ backgroundColor: primaryColor }}
        >
            <BottomSheetView style={styles.content}>
                <Text style={[styles.title, { color: textColor }]}>Trier les restaurants</Text>

                <View style={styles.section}>
                    <View style={styles.chipRow}>
                        {filters.map((filter) => {
                            const isActive = selectedFilter === filter.id;
                            return (
                                <TouchableOpacity 
                                    key={filter.id} 
                                    style={[
                                        styles.chip, 
                                        { backgroundColor: isActive ? primaryColor : cardColor }
                                    ]}
                                    onPress={() => setSelectedFilter(isActive ? null : filter.id)}
                                >
                                    {filter.icon}
                                    <Text style={[styles.chipText, { color: isActive ? '#FFF' : textColor }]}>
                                        {filter.name}
                                    </Text>
                                    {isActive && <Check size={14} color="#FFF" style={{marginLeft: 5}} />}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity 
                        style={styles.resetBtn}
                        onPress={() => setSelectedFilter(null)}
                    >
                        <Text style={{ color: textMuted, fontWeight: '600' }}>Réinitialiser</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.applyBtn, { backgroundColor: primaryColor }]}
                        onPress={handleApply}
                    >
                        <Text style={styles.applyBtnText}>Appliquer</Text>
                    </TouchableOpacity>
                </View>
            </BottomSheetView>
        </BottomSheet>
    );
});

const styles = StyleSheet.create({
    content: { padding: 24, flex: 1 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 25, textAlign: 'center' },
    section: { marginBottom: 25 },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
    chip: { 
        flexDirection: 'row',
        paddingHorizontal: 16, 
        paddingVertical: 12, 
        borderRadius: 20,
        alignItems: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: 'transparent'
    },
    chipText: { fontWeight: '600', fontSize: 14 },
    footer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginTop: 'auto', 
        gap: 15,
        marginBottom: 20 
    },
    resetBtn: { padding: 15 },
    applyBtn: { 
        flex: 1,
        height: 55, 
        borderRadius: 18, 
        justifyContent: 'center', 
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5
    },
    applyBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});

export default FilterBottomSheet;