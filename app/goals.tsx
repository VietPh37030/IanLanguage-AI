// app/goals.tsx - Onboarding 2: Goals (with i18n)
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
    FadeInDown,
    FadeInUp,
    Layout,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientBackground, PageIndicator, PrimaryButton } from '../src/components';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../src/constants/theme';
import { useI18n } from '../src/i18n';

const { width } = Dimensions.get('window');

interface GoalOption {
    id: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    titleKey: 'work' | 'travel' | 'study' | 'hobby' | 'communication';
    descKey: 'workDesc' | 'travelDesc' | 'studyDesc' | 'hobbyDesc' | 'communicationDesc';
}

const GOALS: GoalOption[] = [
    { id: 'work', icon: 'work', titleKey: 'work', descKey: 'workDesc' },
    { id: 'travel', icon: 'flight', titleKey: 'travel', descKey: 'travelDesc' },
    { id: 'study', icon: 'school', titleKey: 'study', descKey: 'studyDesc' },
    { id: 'hobby', icon: 'palette', titleKey: 'hobby', descKey: 'hobbyDesc' },
    { id: 'communication', icon: 'chat-bubble', titleKey: 'communication', descKey: 'communicationDesc' },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface GoalCardProps {
    goal: GoalOption;
    title: string;
    description: string;
    isSelected: boolean;
    onToggle: () => void;
    index: number;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, title, description, isSelected, onToggle, index }) => {
    const scale = useSharedValue(1);

    const handlePressIn = () => {
        scale.value = withSpring(0.95, { damping: 15 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 15 });
    };

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onToggle();
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const cardAnimatedStyle = useAnimatedStyle(() => ({
        backgroundColor: withTiming(
            isSelected ? Colors.primary : 'rgba(255, 255, 255, 0.4)',
            { duration: 200 }
        ),
        borderColor: withTiming(
            isSelected ? Colors.primary : 'rgba(255, 255, 255, 0.6)',
            { duration: 200 }
        ),
    }));

    return (
        <AnimatedPressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
            style={[animatedStyle, styles.cardWrapper]}
        >
            <Animated.View
                style={[styles.goalCard, cardAnimatedStyle]}
                entering={FadeInDown.delay(index * 80).duration(400).springify()}
                layout={Layout.springify()}
            >
                {/* Checkmark in corner */}
                {isSelected && (
                    <View style={styles.checkBadge}>
                        <MaterialIcons name="check" size={14} color={Colors.textPrimary} />
                    </View>
                )}

                <View style={styles.iconContainer}>
                    <MaterialIcons
                        name={goal.icon}
                        size={28}
                        color={isSelected ? Colors.textPrimary : Colors.gradientMiddle}
                    />
                </View>

                <Text style={[styles.goalTitle, isSelected && styles.goalTitleSelected]}>
                    {title}
                </Text>
                <Text style={[styles.goalSubtitle, isSelected && styles.goalSubtitleSelected]}>
                    {description}
                </Text>
            </Animated.View>
        </AnimatedPressable>
    );
};

export default function GoalsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { t } = useI18n();
    const [selectedGoals, setSelectedGoals] = useState<string[]>(['work']);

    const toggleGoal = (goalId: string) => {
        setSelectedGoals(prev =>
            prev.includes(goalId)
                ? prev.filter(id => id !== goalId)
                : [...prev, goalId]
        );
    };

    const handleNext = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push('/level');
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
                    <PageIndicator total={3} current={1} />
                </Animated.View>

                {/* Scrollable Content */}
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Mascot peeking */}
                    <Animated.View
                        style={styles.mascotContainer}
                        entering={FadeInDown.delay(200).duration(500).springify()}
                    >
                        <Image
                            source={require('../assets/images/ian_thinking2_nobg.png')}
                            style={styles.mascot}
                            resizeMode="contain"
                        />
                    </Animated.View>

                    {/* Glass Card */}
                    <Animated.View
                        style={styles.glassCard}
                        entering={FadeInUp.delay(300).duration(500)}
                    >
                        {/* Headline */}
                        <View style={styles.headerContainer}>
                            <Text style={styles.title}>{t.goals.title}</Text>
                            <Text style={styles.subtitle}>{t.goals.subtitle}</Text>
                        </View>

                        {/* Goals Grid */}
                        <View style={styles.goalsGrid}>
                            {GOALS.map((goal, index) => (
                                <GoalCard
                                    key={goal.id}
                                    goal={goal}
                                    title={t.goals[goal.titleKey]}
                                    description={t.goals[goal.descKey]}
                                    isSelected={selectedGoals.includes(goal.id)}
                                    onToggle={() => toggleGoal(goal.id)}
                                    index={index}
                                />
                            ))}
                        </View>
                    </Animated.View>
                </ScrollView>

                {/* Sticky Bottom Button */}
                <Animated.View
                    style={[styles.bottomContainer, { paddingBottom: insets.bottom + Spacing.md }]}
                    entering={FadeInUp.delay(700).duration(400)}
                >
                    <PrimaryButton
                        title={t.common.next}
                        onPress={handleNext}
                        disabled={selectedGoals.length === 0}
                        icon={<MaterialIcons name="arrow-forward" size={22} color={Colors.textPrimary} />}
                    />
                </Animated.View>
            </View>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    indicatorWrapper: {
        paddingVertical: Spacing.lg,
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: Spacing.md,
        paddingBottom: 100,
    },
    mascotContainer: {
        alignItems: 'center',
        marginBottom: -Spacing.xl,
        zIndex: 10,
    },
    mascot: {
        width: 100,
        height: 100,
    },
    glassCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderRadius: BorderRadius.xxl,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        padding: Spacing.lg,
        paddingTop: Spacing.xxl,
        ...Shadows.glass,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    title: {
        ...Typography.h3,
        color: Colors.textPrimary,
        textAlign: 'center',
        marginBottom: Spacing.xs,
    },
    subtitle: {
        ...Typography.caption,
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    goalsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: Spacing.sm,
    },
    cardWrapper: {
        width: (width - Spacing.md * 2 - Spacing.lg * 2 - Spacing.sm) / 2,
    },
    goalCard: {
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        borderWidth: 2,
        minHeight: 120,
        position: 'relative',
    },
    checkBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: BorderRadius.full,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.sm,
    },
    goalTitle: {
        ...Typography.bodyBold,
        color: Colors.textLight,
        textAlign: 'center',
    },
    goalTitleSelected: {
        color: Colors.textPrimary,
    },
    goalSubtitle: {
        ...Typography.small,
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'center',
        marginTop: 2,
    },
    goalSubtitleSelected: {
        color: Colors.textSecondary,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.md,
        backgroundColor: 'rgba(13, 148, 136, 0.4)',
    },
});
