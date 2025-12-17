// app/language.tsx - Language Selection Screen
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
    FadeInDown,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientBackground, PrimaryButton } from '../src/components';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../src/constants/theme';
import { LANGUAGES, LanguageCode, useI18n } from '../src/i18n';

const { width } = Dimensions.get('window');

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface LanguageCardProps {
    flag: string;
    name: string;
    nativeName: string;
    isSelected: boolean;
    onSelect: () => void;
    delay: number;
}

const LanguageCard: React.FC<LanguageCardProps> = ({
    flag,
    name,
    nativeName,
    isSelected,
    onSelect,
    delay,
}) => {
    const scale = useSharedValue(1);

    const handlePressIn = () => {
        scale.value = withSpring(0.95, { damping: 15 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 15 });
    };

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onSelect();
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const cardStyle = useAnimatedStyle(() => ({
        backgroundColor: withTiming(
            isSelected ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.25)',
            { duration: 200 }
        ),
        borderColor: withTiming(
            isSelected ? Colors.primary : 'rgba(255, 255, 255, 0.4)',
            { duration: 200 }
        ),
        borderWidth: isSelected ? 3 : 1,
    }));

    return (
        <AnimatedPressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
            style={[animatedStyle, styles.cardWrapper]}
        >
            <Animated.View
                style={[styles.languageCard, cardStyle]}
                entering={FadeInDown.delay(delay).duration(400).springify()}
            >
                {/* Checkmark badge in corner */}
                {isSelected && (
                    <View style={styles.checkBadge}>
                        <Text style={styles.checkBadgeText}>✓</Text>
                    </View>
                )}
                <Text style={styles.flag}>{flag}</Text>
                <View style={styles.languageInfo}>
                    <Text style={[styles.languageName, isSelected && styles.languageNameSelected]}>
                        {name}
                    </Text>
                    <Text style={[styles.nativeName, isSelected && styles.nativeNameSelected]}>
                        {nativeName}
                    </Text>
                </View>
            </Animated.View>
        </AnimatedPressable>
    );
};

export default function LanguageScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { setNativeLanguage, setTargetLanguage } = useI18n();

    const [step, setStep] = useState<'native' | 'target'>('native');
    const [selectedNative, setSelectedNative] = useState<LanguageCode | null>(null);
    const [selectedTarget, setSelectedTarget] = useState<LanguageCode | null>(null);

    const handleNativeSelect = (code: LanguageCode) => {
        setSelectedNative(code);
    };

    const handleTargetSelect = (code: LanguageCode) => {
        setSelectedTarget(code);
    };

    const handleNext = async () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        if (step === 'native' && selectedNative) {
            await setNativeLanguage(selectedNative);
            setStep('target');
        } else if (step === 'target' && selectedTarget) {
            await setTargetLanguage(selectedTarget);
            router.replace('/welcome');
        }
    };

    const isNextDisabled = step === 'native' ? !selectedNative : !selectedTarget;

    // Filter out native language from target options
    const targetLanguages = LANGUAGES.filter(lang => lang.code !== selectedNative);

    return (
        <GradientBackground variant="nature">
            <StatusBar style="light" />
            <View style={[styles.container, { paddingTop: insets.top + Spacing.xl }]}>
                {/* Header */}
                <Animated.View
                    style={styles.header}
                    entering={FadeInDown.delay(100).duration(500)}
                >
                    <Text style={styles.title}>
                        {step === 'native' ? 'Choose Your Language' : 'What do you want to learn?'}
                    </Text>
                    <Text style={styles.subtitle}>
                        {step === 'native'
                            ? 'Select your native language'
                            : 'Select the language you want to learn'}
                    </Text>
                </Animated.View>

                {/* Step Indicator */}
                <Animated.View
                    style={styles.stepIndicator}
                    entering={FadeInDown.delay(200).duration(400)}
                >
                    <View style={[styles.stepDot, step === 'native' && styles.stepDotActive]} />
                    <View style={styles.stepLine} />
                    <View style={[styles.stepDot, step === 'target' && styles.stepDotActive]} />
                </Animated.View>

                {/* Language Grid */}
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.gridContainer}>
                        {step === 'native' ? (
                            LANGUAGES.map((lang, index) => (
                                <LanguageCard
                                    key={lang.code}
                                    flag={lang.flag}
                                    name={lang.name}
                                    nativeName={lang.nativeName}
                                    isSelected={selectedNative === lang.code}
                                    onSelect={() => handleNativeSelect(lang.code)}
                                    delay={300 + index * 80}
                                />
                            ))
                        ) : (
                            targetLanguages.map((lang, index) => (
                                <LanguageCard
                                    key={lang.code}
                                    flag={lang.flag}
                                    name={lang.name}
                                    nativeName={lang.nativeName}
                                    isSelected={selectedTarget === lang.code}
                                    onSelect={() => handleTargetSelect(lang.code)}
                                    delay={100 + index * 80}
                                />
                            ))
                        )}
                    </View>
                </ScrollView>

                {/* Bottom Button */}
                <Animated.View
                    style={[styles.bottomContainer, { paddingBottom: insets.bottom + Spacing.md }]}
                    entering={FadeInUp.delay(600).duration(400)}
                >
                    <PrimaryButton
                        title={step === 'native' ? 'Next' : 'Continue'}
                        onPress={handleNext}
                        disabled={isNextDisabled}
                    />
                </Animated.View>
            </View>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: Spacing.lg,
    },
    header: {
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    title: {
        ...Typography.h2,
        color: Colors.textLight,
        textAlign: 'center',
        marginBottom: Spacing.xs,
    },
    subtitle: {
        ...Typography.body,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
    },
    stepIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.xl,
    },
    stepDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    stepDotActive: {
        backgroundColor: Colors.primary,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 8,
    },
    stepLine: {
        width: 60,
        height: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginHorizontal: Spacing.sm,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: Spacing.xl,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: Spacing.sm,
    },
    cardWrapper: {
        width: (width - Spacing.lg * 2 - Spacing.sm) / 2,
    },
    languageCard: {
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        ...Shadows.card,
        minHeight: 120,
    },
    flag: {
        fontSize: 36,
        marginRight: Spacing.md,
    },
    languageInfo: {
        flex: 1,
    },
    languageName: {
        ...Typography.bodyBold,
        color: Colors.textLight,
        marginBottom: 2,
    },
    languageNameSelected: {
        color: Colors.textPrimary,
    },
    nativeName: {
        ...Typography.caption,
        color: 'rgba(255, 255, 255, 0.7)',
    },
    nativeNameSelected: {
        color: Colors.textSecondary,
    },
    checkBadge: {
        position: 'absolute',
        top: -6,
        right: -6,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    checkBadgeText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    bottomContainer: {
        paddingTop: Spacing.md,
    },
});
