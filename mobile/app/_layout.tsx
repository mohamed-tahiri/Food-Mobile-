import { CartProvider } from '@/context/CartContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Stack } from 'expo-router';
import 'react-native-reanimated';

export const unstable_settings = {
    anchor: '(tabs)',
};

export default function RootLayout() {
    return (
        <ThemeProvider>
            <CartProvider>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen
                        name="modal"
                        options={{ presentation: 'modal', title: 'Modal' }}
                    />
                </Stack>
            </CartProvider>
        </ThemeProvider>
    );
}
