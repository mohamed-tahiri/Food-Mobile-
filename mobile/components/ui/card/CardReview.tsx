import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Star } from 'lucide-react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function CardReview({ review }: { review: any }) {
    // Utilisation des couleurs dynamiques pour supporter le mode sombre
    const textColor = useThemeColor({}, 'text');
    const textMuted = useThemeColor({}, 'textMuted');
    const borderColor = useThemeColor({}, 'border');
    const cardColor = useThemeColor({}, 'card');
    const primaryColor = useThemeColor({}, 'primary');

    return (
        <View style={[styles.container, { backgroundColor: cardColor, borderColor }]}>
            <View style={styles.header}>
                {/* Avatar avec bordure légère */}
                <Image 
                    source={{ uri: review.userAvatar || 'https://ui-avatars.com/api/?name=' + review.userName }} 
                    style={styles.avatar} 
                />
                
                <View style={styles.userInfo}>
                    <Text style={[styles.userName, { color: textColor }]}>{review.userName}</Text>
                    <View style={styles.ratingRow}>
                        {[...Array(5)].map((_, i) => (
                            <Star 
                                key={i} 
                                size={14} 
                                color={i < review.rating ? "#FFB300" : "#E0E0E0"} 
                                fill={i < review.rating ? "#FFB300" : "transparent"} 
                                style={{ marginRight: 2 }}
                            />
                        ))}
                    </View>
                </View>
                
                <Text style={[styles.date, { color: textMuted }]}>
                    {new Date(review.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                </Text>
            </View>

            <Text style={[styles.comment, { color: textColor }]}>
                {review.comment}
            </Text>

            {/* Galerie d'images de l'avis */}
            {review.images?.length > 0 && (
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    style={styles.imageScroll}
                    contentContainerStyle={{ paddingRight: 20 }}
                >
                    {review.images.map((img: string, idx: number) => (
                        <Image key={idx} source={{ uri: img }} style={styles.reviewImg} />
                    ))}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        padding: 16, 
        borderRadius: 20, 
        marginBottom: 16, 
        borderWidth: 1,
        // Ombre légère pour iOS/Android
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 12 
    },
    avatar: { 
        width: 44, 
        height: 44, 
        borderRadius: 22, 
        backgroundColor: '#F0F0F0' 
    },
    userInfo: { 
        marginLeft: 12, 
        flex: 1 
    },
    userName: { 
        fontWeight: '700', 
        fontSize: 15,
        letterSpacing: 0.3
    },
    ratingRow: { 
        flexDirection: 'row', 
        marginTop: 3 
    },
    date: { 
        fontSize: 12, 
        fontWeight: '500' 
    },
    comment: { 
        fontSize: 14, 
        lineHeight: 20,
        marginBottom: 4
    },
    imageScroll: { 
        marginTop: 14 
    },
    reviewImg: { 
        width: 100, 
        height: 100, 
        borderRadius: 14, 
        marginRight: 10,
        backgroundColor: '#F5F5F5'
    }
});