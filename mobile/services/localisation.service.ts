import * as Location from 'expo-location';

export const getCurrentAddress = async (): Promise<string> => {
    try {
        // 1. Demander la permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            throw new Error('Permission refusée');
        }

        // 2. Obtenir les coordonnées
        const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
        });

        // 3. Traduire en adresse
        const reverseGeocode = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        });

        if (reverseGeocode.length > 0) {
            const { streetNumber, street, city } = reverseGeocode[0];
            return `${streetNumber ? streetNumber + ' ' : ''}${street || ''}, ${city}`;
        }

        return "Adresse introuvable";
    } catch (error) {
        console.error("Erreur Localisation:", error);
        throw error;
    }
};