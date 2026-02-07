import { Offer } from '@/types/offer';
import { Tag } from 'lucide-react-native';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

interface CardPromoProps {
    offer: Offer;
}

export default function CardPromo({ offer }: CardPromoProps) {
    // On récupère la couleur de fond du thème pour ajuster le bouton si besoin
    const cardBg = useThemeColor({}, 'card');
    const textColor = useThemeColor({}, 'text');
    // const primaryColor = useThemeColor({}, 'primary');

    return (
        <TouchableOpacity
            key={offer.id}
            activeOpacity={0.9}
            style={[styles.promoCard, { backgroundColor: offer.color }]}
        >
            <View style={styles.promoTextContainer}>
                <View style={styles.promoTag}>
                    <Tag size={12} color="#FFF" />
                    <Text style={styles.promoTagText}> OFFRE LIMITÉE</Text>
                </View>
                <Text style={styles.promoTitle}>{offer.title}</Text>
                <Text style={styles.promoSub}>{offer.sub}</Text>

                <TouchableOpacity
                    style={[styles.promoBtn, { backgroundColor: cardBg }]}
                >
                    {/* Le bouton reste blanc pour garder le contraste sur la couleur vive */}
                    <Text style={[styles.promoBtnText, { color: textColor }]}>
                        En profiter
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.promoIconCircle}>
                <Text style={{ fontSize: 40 }}>🎁</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    promoCard: {
        width: 300,
        height: 160, // Légèrement plus haut pour l'équilibre
        borderRadius: 20,
        marginRight: 15,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
        // Ombre adaptée pour les deux modes
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    promoTextContainer: { flex: 1, zIndex: 2 },
    promoTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.25)',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 10,
    },
    promoTagText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
    promoTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
    promoSub: { color: 'rgba(255,255,255,0.9)', fontSize: 14, marginTop: 5 },
    promoBtn: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 12,
        marginTop: 15,
        alignSelf: 'flex-start',
    },
    promoBtnText: { fontWeight: 'bold', fontSize: 13 },
    promoIconCircle: {
        position: 'absolute',
        right: -10,
        bottom: -5,
        transform: [{ rotate: '15deg' }],
        opacity: 0.2,
    },
});
