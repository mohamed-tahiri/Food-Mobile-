
import { Offer } from '@/types/offer';
import { Tag } from 'lucide-react-native';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface CardPromoProps {
    offer: Offer;
}

export default function CardPromo ({ offer }: CardPromoProps  ) {
    return (
        <TouchableOpacity key={offer.id} style={[styles.promoCard, { backgroundColor: offer.color }]}>
            <View style={styles.promoTextContainer}>
                <View style={styles.promoTag}>
                <Tag size={12} color="#FFF" />
                <Text style={styles.promoTagText}> OFFRE LIMITÉE</Text>
                </View>
                <Text style={styles.promoTitle}>{offer.title}</Text>
                <Text style={styles.promoSub}>{offer.sub}</Text>
                <TouchableOpacity style={styles.promoBtn}>
                <Text style={styles.promoBtnText}>En profiter</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.promoIconCircle}>
                <Text style={{fontSize: 40}}>🎁</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
  promoCard: { 
    width: 300, 
    height: 150, 
    borderRadius: 20, 
    marginRight: 15, 
    padding: 20, 
    flexDirection: 'row', 
    alignItems: 'center',
    overflow: 'hidden'
  },
  promoTextContainer: { flex: 1, zIndex: 2 },
  promoTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginBottom: 10 },
  promoTagText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  promoTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  promoSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 5 },
  promoBtn: { backgroundColor: '#FFF', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10, marginTop: 15, alignSelf: 'flex-start' },
  promoBtnText: { color: '#333', fontWeight: 'bold', fontSize: 12 },
  promoIconCircle: { position: 'absolute', right: -20, bottom: -10, opacity: 0.3 },
})