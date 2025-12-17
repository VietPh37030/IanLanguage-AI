// app/level.tsx - Level & AI Personality với HSK levels
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    FadeInDown,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientBackground, PageIndicator, PrimaryButton } from '../src/components';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../src/constants/theme';
import { useI18n } from '../src/i18n';

const { width } = Dimensions.get('window');

type LevelGroup = 'beginner' | 'intermediate' | 'advanced';
type Personality = 'serious' | 'fun' | 'encouraging' | 'blunt';

interface LevelOption {
    id: LevelGroup;
    labelKey: 'beginner' | 'intermediate' | 'advanced';
    hskLevels: string;
}

interface PersonalityOption {
    id: Personality;
    icon: keyof typeof MaterialIcons.glyphMap;
    labelKey: 'serious' | 'fun' | 'encouraging' | 'blunt';
    descKey: 'seriousDesc' | 'funDesc' | 'encouragingDesc' | 'bluntDesc';
}

const LEVELS: LevelOption[] = [
    { id: 'beginner', labelKey: 'beginner', hskLevels: 'HSK 1, 2, 3' },
    { id: 'intermediate', labelKey: 'intermediate', hskLevels: 'HSK 4, 5' },
    { id: 'advanced', labelKey: 'advanced', hskLevels: 'HSK 6' },
];

const PERSONALITIES: PersonalityOption[] = [
    { id: 'serious', icon: 'school', labelKey: 'serious', descKey: 'seriousDesc' },
    { id: 'fun', icon: 'sentiment-very-satisfied', labelKey: 'fun', descKey: 'funDesc' },
    { id: 'encouraging', icon: 'volunteer-activism', labelKey: 'encouraging', descKey: 'encouragingDesc' },
    { id: 'blunt', icon: 'mood-bad', labelKey: 'blunt', descKey: 'bluntDesc' },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function LevelScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { t } = useI18n();
    const [selectedLevel, setSelectedLevel] = useState<LevelGroup>('beginner');
    const [selectedPersonality, setSelectedPersonality] = useState<Personality>('fun');

    // Mascot animation
    const mascotBounce = useSharedValue(0);

    useEffect(() => {
        mascotBounce.value = withRepeat(
            withSequence(
                withTiming(-8, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
    }, []);

    const mascotAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: mascotBounce.value }],
    }));

    const handleComplete = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.push('/login');
    };

    const handleSelectLevel = (level: LevelGroup) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedLevel(level);
    };

    const handleSelectPersonality = (personality: Personality) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setSelectedPersonality(personality);
    };

    return (
        <GradientBackground variant="nature">
            <StatusBar style="light" />
            <View style={[styles.container, { paddingTop: insets.top }]}>
                {/* Page Indicators */}
                <Animated.View
                    style={styles.indicatorWrapper}
                    entering={FadeInDown.delay(100).duration(400)}
                >
                    <PageIndicator total={3} current={2} />
                </Animated.View>

                {/* Mascot */}
                <Animated.View
                    style={[styles.mascotContainer, mascotAnimatedStyle]}
                    entering={FadeInDown.delay(200).duration(500).springify()}
                >
                    <Image
                        source={require('../assets/images/ian_thumbs_up_success_nobg.png')}
                        style={styles.mascot}
                        resizeMode="contain"
                    />
                </Animated.View>

                {/* Glass Card */}
                <Animated.View
                    style={[styles.glassCard, { marginBottom: insets.bottom + 20 }]}
                    entering={FadeInUp.delay(400).duration(500)}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {/* Headline */}
                        <Text style={styles.title}>{t.level.title}</Text>

                        {/* Level Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{t.level.currentLevel}</Text>
                            <View style={styles.levelContainer}>
                                {LEVELS.map((level, index) => (
                                    <LevelButton
                                        key={level.id}
                                        label={t.level[level.labelKey]}
                                        hskLevels={level.hskLevels}
                                        isSelected={selectedLevel === level.id}
                                        onSelect={() => handleSelectLevel(level.id)}
                                    />
                                ))}
                            </View>
                        </View>

                        {/* Personality Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{t.level.aiPersonality}</Text>
                            <View style={styles.personalityGrid}>
                                {PERSONALITIES.map((personality, index) => (
                                    <PersonalityCard
                                        key={personality.id}
                                        icon={personality.icon}
                                        label={t.level[personality.labelKey]}
                                        description={t.level[personality.descKey]}
                                        isSelected={selectedPersonality === personality.id}
                                        onSelect={() => handleSelectPersonality(personality.id)}
                                        index={index}
                                        isBlunt={personality.id === 'blunt'}
                                    />
                                ))}
                            </View>
                        </View>
                    </ScrollView>

                    {/* Complete Button */}
                    <View style={styles.buttonWrapper}>
                        <PrimaryButton
                            title={t.common.complete}
                            onPress={handleComplete}
                            icon={<MaterialIcons name="check-circle" size={22} color={Colors.textPrimary} />}
                        />
                    </View>
                </Animated.View>
            </View>
        </GradientBackground>
    );
}

// Level Button Component
interface LevelButtonProps {
    label: string;
    hskLevels: string;
    isSelected: boolean;
    onSelect: () => void;
}

const LevelButton: React.FC<LevelButtonProps> = ({ label, hskLevels, isSelected, onSelect }) => {
    const scale = useSharedValue(1);

    const handlePressIn = () => {
        scale.value = withSpring(0.95, { damping: 15 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 15 });
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const buttonStyle = useAnimatedStyle(() => ({
        backgroundColor: withTiming(
            isSelected ? Colors.primary : 'rgba(255, 255, 255, 0.15)',
            { duration: 200 }
        ),
    }));

    return (
        <AnimatedPressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onSelect}
            style={[styles.levelButton, animatedStyle]}
        >
            <Animated.View style={[styles.levelButtonInner, buttonStyle]}>
                <Text style={[styles.levelButtonText, isSelected && styles.levelButtonTextSelected]}>
                    {label}
                </Text>
                <Text style={[styles.hskText, isSelected && styles.hskTextSelected]}>
                    {hskLevels}
                </Text>
            </Animated.View>
        </AnimatedPressable>
    );
};

// Personality Card Component
interface PersonalityCardProps {
    icon: keyof typeof MaterialIcons.glyphMap;
    label: string;
    description: string;
    isSelected: boolean;
    onSelect: () => void;
    index: number;
    isBlunt?: boolean;
}

const PersonalityCard: React.FC<PersonalityCardProps> = ({
    icon,
    label,
    description,
    isSelected,
    onSelect,
    index,
    isBlunt = false
}) => {
    const scale = useSharedValue(1);

    const handlePressIn = () => {
        scale.value = withSpring(0.92, { damping: 15 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 15 });
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const cardStyle = useAnimatedStyle(() => ({
        backgroundColor: withTiming(
            isSelected
                ? (isBlunt ? '#ff6b6b' : Colors.primary)
                : 'rgba(255, 255, 255, 0.15)',
            { duration: 200 }
        ),
        borderColor: withTiming(
            isSelected
                ? (isBlunt ? '#ff6b6b' : Colors.primary)
                : 'rgba(255, 255, 255, 0.3)',
            { duration: 200 }
        ),
    }));

    return (
        <AnimatedPressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onSelect}
            style={[styles.personalityCardWrapper, animatedStyle]}
        >
            <Animated.View
                style={[styles.personalityCard, cardStyle]}
                entering={FadeInDown.delay(600 + index * 80).duration(400)}
            >
                <MaterialIcons
                    name={icon}
                    size={28}
                    color={isSelected ? (isBlunt ? '#fff' : Colors.textPrimary) : Colors.textLight}
                />
                <Text style={[
                    styles.personalityLabel,
                    isSelected && (isBlunt ? styles.personalityLabelBlunt : styles.personalityLabelSelected)
                ]}>
                    {label}
                </Text>
                <Text style={[
                    styles.personalityDesc,
                    isSelected && (isBlunt ? styles.personalityDescBlunt : styles.personalityDescSelected)
                ]} numberOfLines={2}>
                    {description}
                </Text>
            </Animated.View>
        </AnimatedPressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    indicatorWrapper: {
        paddingVertical: Spacing.md,
        alignItems: 'center',
    },
    mascotContainer: {
        alignItems: 'center',
        height: 140,
        marginBottom: Spacing.xs,
    },
    mascot: {
        width: 130,
        height: 130,
    },
    glassCard: {
        flex: 1,
        marginHorizontal: Spacing.md,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderRadius: BorderRadius.xxl,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        padding: Spacing.lg,
        ...Shadows.glass,
    },
    scrollContent: {
        paddingBottom: Spacing.sm,
    },
    title: {
        ...Typography.h3,
        color: Colors.textLight,
        textAlign: 'center',
        marginBottom: Spacing.lg,
        lineHeight: 30,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    section: {
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        ...Typography.small,
        color: 'rgba(255, 255, 255, 0.9)',
        letterSpacing: 1,
        marginBottom: Spacing.sm,
        marginLeft: Spacing.xs,
    },
    levelContainer: {
        gap: Spacing.xs,
    },
    levelButton: {
        width: '100%',
    },
    levelButtonInner: {
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.md,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    levelButtonText: {
        ...Typography.bodyBold,
        color: Colors.textLight,
    },
    levelButtonTextSelected: {
        color: Colors.textPrimary,
    },
    hskText: {
        ...Typography.small,
        color: 'rgba(255, 255, 255, 0.6)',
        marginTop: 2,
    },
    hskTextSelected: {
        color: Colors.textSecondary,
    },
    personalityGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.md,
        justifyContent: 'center',
    },
    personalityCardWrapper: {
        width: '47%',
    },
    personalityCard: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.sm,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        minHeight: 110,
    },
    personalityLabel: {
        ...Typography.caption,
        fontWeight: '600',
        color: Colors.textLight,
        marginTop: Spacing.xs,
        textAlign: 'center',
    },
    personalityLabelSelected: {
        color: Colors.textPrimary,
    },
    personalityLabelBlunt: {
        color: '#fff',
    },
    personalityDesc: {
        ...Typography.small,
        fontSize: 10,
        color: 'rgba(255, 255, 255, 0.6)',
        textAlign: 'center',
        marginTop: 2,
    },
    personalityDescSelected: {
        color: Colors.textSecondary,
    },
    personalityDescBlunt: {
        color: 'rgba(255, 255, 255, 0.9)',
    },
    buttonWrapper: {
        paddingTop: Spacing.md,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.2)',
    },
});
