// app/_layout.tsx - Root Layout với i18n Provider
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { I18nProvider } from "../src/i18n";

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={styles.container}>
            <I18nProvider>
                <Stack
                    screenOptions={{
                        headerShown: false,
                        animation: 'slide_from_right',
                        animationDuration: 350,
                        gestureEnabled: true,
                        gestureDirection: 'horizontal',
                    }}
                >
                    {/* Splash Screen */}
                    <Stack.Screen
                        name="index"
                        options={{
                            animation: 'fade',
                        }}
                    />

                    {/* Language Selection - First after Splash */}
                    <Stack.Screen
                        name="language"
                        options={{
                            animation: 'fade',
                            gestureEnabled: false,
                        }}
                    />

                    {/* Onboarding Flow */}
                    <Stack.Screen
                        name="welcome"
                        options={{
                            animation: 'slide_from_right',
                        }}
                    />
                    <Stack.Screen name="goals" />
                    <Stack.Screen name="level" />

                    {/* Auth */}
                    <Stack.Screen
                        name="login"
                        options={{
                            animation: 'slide_from_bottom',
                        }}
                    />
                    <Stack.Screen
                        name="register"
                        options={{
                            animation: 'slide_from_right',
                        }}
                    />
                    <Stack.Screen
                        name="forgot-password"
                        options={{
                            animation: 'slide_from_bottom',
                            presentation: 'modal',
                        }}
                    />
                    <Stack.Screen
                        name="profile-setup"
                        options={{
                            animation: 'fade',
                            gestureEnabled: false,
                        }}
                    />

                    {/* Main App */}
                    <Stack.Screen
                        name="home"
                        options={{
                            animation: 'fade',
                            gestureEnabled: false,
                        }}
                    />
                </Stack>
            </I18nProvider>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});