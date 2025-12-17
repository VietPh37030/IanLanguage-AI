// app/index.tsx - Splash Screen → Smart Navigation
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    FadeIn,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import { GradientBackground, LoadingSpinner } from '../src/components';
import { auth } from '../src/config/firebase';
import { Animations, Colors, Spacing, Typography } from '../src/constants/theme';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    // Animation values
    const logoScale = useSharedValue(0.8);
    const logoOpacity = useSharedValue(0);
    const titleOpacity = useSharedValue(0);
    const loadingOpacity = useSharedValue(0);
    const mascotFloat = useSharedValue(0);

    useEffect(() => {
        checkAuthAndNavigate();
    }, []);

    const checkAuthAndNavigate = async () => {
        try {
            // Check if user is logged in
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                unsubscribe();
                if (user) {
                    // Logged in - skip splash, go straight to home
                    router.replace('/home');
                } else {
                    // Not logged in - show splash animation then go to language
                    startSplashAnimation();
                }
            });
        } catch (error) {
            console.error('Error checking auth:', error);
            startSplashAnimation();
        }
    };

    const startSplashAnimation = () => {
        setIsLoading(false);

        // Sequence animations
        logoOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
        logoScale.value = withDelay(200, withTiming(1, { duration: 600, easing: Easing.out(Easing.back(1.5)) }));
        titleOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));
        loadingOpacity.value = withDelay(1000, withTiming(1, { duration: 400 }));

        // Floating animation for mascot
        mascotFloat.value = withRepeat(
            withSequence(
                withTiming(-10, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
                withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );

        // Navigate to language selection after splash
        setTimeout(() => {
            router.replace('/language');
        }, Animations.splash);
    };

    const logoAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: logoScale.value }],
        opacity: logoOpacity.value,
    }));

    const mascotAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: mascotFloat.value }],
    }));

    const titleAnimatedStyle = useAnimatedStyle(() => ({
        opacity: titleOpacity.value,
    }));

    const loadingAnimatedStyle = useAnimatedStyle(() => ({
        opacity: loadingOpacity.value,
    }));

    return (
        <GradientBackground variant="splash">
            <StatusBar style="light" />
            <View style={styles.container}>
                {/* Glass Card Container */}
                <Animated.View style={[styles.glassCard, logoAnimatedStyle]}>
                    {/* Mascot */}
                    <Animated.View style={[styles.mascotContainer, mascotAnimatedStyle]}>
                        <Image
                            source={require('../assets/images/ian_mascot_default_nobg.png')}
                            style={styles.mascot}
                            resizeMode="contain"
                        />
                    </Animated.View>

                    {/* App Title */}
                    <Animated.View style={[styles.titleContainer, titleAnimatedStyle]}>
                        <Text style={styles.title}>IanLanguage</Text>
                        <Text style={styles.subtitle}>Speak Naturally</Text>
                    </Animated.View>

                    {/* Loading Animation */}
                    <Animated.View style={[styles.loadingContainer, loadingAnimatedStyle]}>
                        <LoadingSpinner size={48} color={Colors.primary} />
                    </Animated.View>
                </Animated.View>

                {/* Footer */}
                <Animated.View
                    style={[styles.footer, loadingAnimatedStyle]}
                    entering={FadeIn.delay(1200).duration(400)}
                >
                    <Text style={styles.footerText}>LOADING RESOURCES</Text>
                    <View style={styles.footerLine} />
                </Animated.View>
            </View>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.lg,
    },
    glassCard: {
        width: '100%',
        maxWidth: 340,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 32,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        padding: Spacing.xl,
        alignItems: 'center',
        shadowColor: 'rgba(31, 38, 135, 0.37)',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 32,
        elevation: 10,
    },
    mascotContainer: {
        width: 180,
        height: 180,
        marginBottom: Spacing.lg,
    },
    mascot: {
        width: '100%',
        height: '100%',
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    title: {
        ...Typography.h1,
        fontSize: 36,
        color: Colors.textLight,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    subtitle: {
        ...Typography.bodyBold,
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: Spacing.xs,
        letterSpacing: 1,
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Spacing.md,
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        alignItems: 'center',
    },
    footerText: {
        ...Typography.small,
        color: 'rgba(255, 255, 255, 0.4)',
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginBottom: Spacing.sm,
    },
    footerLine: {
        width: 48,
        height: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 1,
    },
});