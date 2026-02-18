import { CartProvider } from '@/context/CartContext';
import { FavoriteProvider } from '@/context/FavoriteContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '@/context/AuthContext';

export const unstable_settings = {
    anchor: '(tabs)',
};

export default function RootLayout() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <FavoriteProvider>
                    <CartProvider>
                        <GestureHandlerRootView style={{ flex: 1 }}>
                            <Stack>
                                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                                <Stack.Screen
                                    name="modal"
                                    options={{ presentation: 'modal', title: 'Modal' }}
                                />
                            </Stack>
                        </GestureHandlerRootView>
                    </CartProvider>
                </FavoriteProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
