// app/welcome.tsx - Onboarding 1: Welcome (with i18n)
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    FadeInDown,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    GradientBackground,
    PageIndicator,
    PrimaryButton
} from '../src/components';
import { BorderRadius, Colors, Spacing, Typography } from '../src/constants/theme';
import { useI18n } from '../src/i18n';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { t } = useI18n();

    // Animation values
    const mascotFloat = useSharedValue(0);
    const mascotScale = useSharedValue(0.9);
    const glowOpacity = useSharedValue(0.3);

    useEffect(() => {
        // Floating animation
        mascotFloat.value = withRepeat(
            withSequence(
                withTiming(-12, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );

        // Scale bounce
        mascotScale.value = withDelay(
            300,
            withSequence(
                withTiming(1.05, { duration: 400, easing: Easing.out(Easing.back(2)) }),
                withTiming(1, { duration: 200 })
            )
        );

        // Glow pulse
        glowOpacity.value = withRepeat(
            withSequence(
                withTiming(0.5, { duration: 1500 }),
                withTiming(0.2, { duration: 1500 })
            ),
            -1,
            true
        );
    }, []);

    const mascotAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: mascotFloat.value },
            { scale: mascotScale.value }
        ],
    }));

    const glowAnimatedStyle = useAnimatedStyle(() => ({
        opacity: glowOpacity.value,
    }));

    const handleStart = () => {
        router.push('/goals');
    };

    return (
        <GradientBackground variant="nature">
            <StatusBar style="light" />
            <View style={[styles.container, { paddingTop: insets.top + Spacing.lg }]}>
                {/* Mascot Section */}
                <View style={styles.mascotSection}>
                    <Animated.View style={[styles.mascotWrapper, mascotAnimatedStyle]}>
                        {/* Glow effect behind mascot */}
                        <Animated.View style={[styles.mascotGlow, glowAnimatedStyle]} />
                        <Image
                            source={require('../assets/images/ian_excited_nobg.png')}
                            style={styles.mascot}
                            resizeMode="contain"
                        />
                    </Animated.View>
                </View>

                {/* Glass Card Content */}
                <Animated.View
                    style={styles.cardWrapper}
                    entering={FadeInDown.delay(400).duration(600).springify()}
                >
                    <View style={styles.glassCard}>
                        {/* Headline */}
                        <Animated.Text
                            style={styles.title}
                            entering={FadeInUp.delay(600).duration(500)}
                        >
                            {t.welcome.title}
                        </Animated.Text>

                        {/* Body Text */}
                        <Animated.Text
                            style={styles.bodyText}
                            entering={FadeInUp.delay(750).duration(500)}
                        >
                            {t.welcome.subtitle}
                        </Animated.Text>

                        {/* Page Indicators */}
                        <Animated.View
                            style={styles.indicatorContainer}
                            entering={FadeInUp.delay(900).duration(400)}
                        >
                            <PageIndicator total={3} current={0} />
                        </Animated.View>

                        {/* Start Button */}
                        <Animated.View
                            style={styles.buttonContainer}
                            entering={FadeInUp.delay(1000).duration(500)}
                        >
                            <PrimaryButton
                                title={t.common.start}
                                onPress={handleStart}
                                icon={<MaterialIcons name="arrow-forward" size={22} color={Colors.textPrimary} />}
                            />
                        </Animated.View>
                    </View>
                </Animated.View>

                {/* Bottom safe area */}
                <View style={{ height: insets.bottom + Spacing.md }} />
            </View>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: Spacing.md,
    },
    mascotSection: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.lg,
    },
    mascotWrapper: {
        width: width * 0.7,
        maxWidth: 300,
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mascotGlow: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 999,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        transform: [{ scale: 0.9 }],
    },
    mascot: {
        width: '100%',
        height: '100%',
    },
    cardWrapper: {
        width: '100%',
        paddingHorizontal: Spacing.xs,
        paddingBottom: Spacing.md,
    },
    glassCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderRadius: BorderRadius.xxl,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        padding: Spacing.lg,
        alignItems: 'center',
        shadowColor: 'rgba(31, 38, 135, 0.37)',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 32,
        elevation: 8,
    },
    title: {
        ...Typography.h2,
        fontSize: 24,
        color: Colors.textPrimary,
        textAlign: 'center',
        marginBottom: Spacing.sm,
        lineHeight: 32,
    },
    bodyText: {
        ...Typography.body,
        color: Colors.textSecondary,
        textAlign: 'center',
        paddingHorizontal: Spacing.sm,
        marginBottom: Spacing.lg,
        lineHeight: 24,
    },
    indicatorContainer: {
        marginBottom: Spacing.lg,
    },
    buttonContainer: {
        width: '100%',
    },
});
