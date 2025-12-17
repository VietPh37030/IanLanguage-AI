// app/home.tsx - Home Screen (with i18n)
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ConfettiAnimation, GradientBackground } from '../src/components';
import { Colors, Spacing, Typography } from '../src/constants/theme';
import { useI18n } from '../src/i18n';

export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const { t } = useI18n();

    return (
        <GradientBackground variant="nature">
            <StatusBar style="light" />
            <View style={[styles.container, { paddingTop: insets.top + Spacing.xl }]}>
                {/* Success Animation with Custom Confetti */}
                <Animated.View
                    style={styles.successContainer}
                    entering={FadeIn.delay(200).duration(600)}
                >
                    <ConfettiAnimation count={25} />

                    <Image
                        source={require('../assets/images/ian_level_up_crown_nobg.png')}
                        style={styles.mascot}
                        resizeMode="contain"
                    />
                </Animated.View>

                {/* Welcome Message */}
                <Animated.View
                    style={styles.textContainer}
                    entering={FadeIn.delay(600).duration(500)}
                >
                    <Text style={styles.title}>{t.home.welcome}</Text>
                    <Text style={styles.subtitle}>{t.home.setupComplete}</Text>
                </Animated.View>

                {/* Placeholder Card */}
                <Animated.View
                    style={styles.placeholderContainer}
                    entering={FadeIn.delay(800).duration(500)}
                >
                    <View style={styles.placeholderCard}>
                        <MaterialIcons name="construction" size={48} color={Colors.primary} />
                        <Text style={styles.placeholderTitle}>{t.home.comingSoon}</Text>
                        <Text style={styles.placeholderText}>{t.home.placeholder}</Text>
                    </View>
                </Animated.View>
            </View>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
    },
    successContainer: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
        position: 'relative',
        height: 200,
        justifyContent: 'center',
    },
    mascot: {
        width: 180,
        height: 180,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    title: {
        ...Typography.h2,
        color: Colors.textLight,
        textAlign: 'center',
        marginBottom: Spacing.sm,
    },
    subtitle: {
        ...Typography.body,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        lineHeight: 24,
    },
    placeholderContainer: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
    },
    placeholderCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        padding: Spacing.xl,
        alignItems: 'center',
    },
    placeholderTitle: {
        ...Typography.h3,
        color: Colors.textLight,
        marginTop: Spacing.md,
        marginBottom: Spacing.sm,
    },
    placeholderText: {
        ...Typography.body,
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'center',
        lineHeight: 22,
    },
});
