// app/profile-setup.tsx - Profile Setup Screen (First Login)
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientBackground, PrimaryButton } from '../src/components';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../src/constants/theme';
import { useI18n } from '../src/i18n';

const { width } = Dimensions.get('window');
const AVATAR_SIZE = (width - Spacing.lg * 2 - Spacing.md * 3) / 4;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Avatar options
const AVATARS = [
    { id: 'default', source: require('../assets/images/ian_mascot_default_nobg.png') },
    { id: 'happy', source: require('../assets/images/ian_mascot_default_nobg.png') },
    { id: 'cool', source: require('../assets/images/ian_mascot_default_nobg.png') },
    { id: 'study', source: require('../assets/images/ian_mascot_default_nobg.png') },
];

// Learning goals
const GOALS = [
    { id: 'travel', emoji: '✈️', label: 'Travel' },
    { id: 'work', emoji: '💼', label: 'Work' },
    { id: 'culture', emoji: '🎭', label: 'Culture' },
    { id: 'fun', emoji: '🎮', label: 'For Fun' },
    { id: 'school', emoji: '📚', label: 'School' },
    { id: 'family', emoji: '👨‍👩‍👧‍👦', label: 'Family' },
];

interface AvatarCardProps {
    source: any;
    isSelected: boolean;
    onSelect: () => void;
    delay: number;
}

const AvatarCard: React.FC<AvatarCardProps> = ({ source, isSelected, onSelect, delay }) => {
    const scale = useSharedValue(1);

    const handlePressIn = () => {
        scale.value = withSpring(0.9);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <AnimatedPressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onSelect}
            style={animatedStyle}
        >
            <Animated.View
                style={[
                    styles.avatarCard,
                    isSelected && styles.avatarCardSelected,
                ]}
                entering={FadeInDown.delay(delay).duration(400)}
            >
                <Image source={source} style={styles.avatarImage} resizeMode="contain" />
                {isSelected && (
                    <View style={styles.avatarCheck}>
                        <Text style={styles.checkText}>✓</Text>
                    </View>
                )}
            </Animated.View>
        </AnimatedPressable>
    );
};

interface GoalChipProps {
    emoji: string;
    label: string;
    isSelected: boolean;
    onToggle: () => void;
    delay: number;
}

const GoalChip: React.FC<GoalChipProps> = ({ emoji, label, isSelected, onToggle, delay }) => {
    const scale = useSharedValue(1);

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        scale.value = withSpring(0.9, {}, () => {
            scale.value = withSpring(1);
        });
        onToggle();
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <AnimatedPressable onPress={handlePress} style={animatedStyle}>
            <Animated.View
                style={[styles.goalChip, isSelected && styles.goalChipSelected]}
                entering={FadeInDown.delay(delay).duration(300)}
            >
                <Text style={styles.goalEmoji}>{emoji}</Text>
                <Text style={[styles.goalLabel, isSelected && styles.goalLabelSelected]}>
                    {label}
                </Text>
            </Animated.View>
        </AnimatedPressable>
    );
};

export default function ProfileSetupScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { t } = useI18n();

    const [displayName, setDisplayName] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState('default');
    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleAvatarSelect = (id: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setSelectedAvatar(id);
    };

    const handleGoalToggle = (id: string) => {
        setSelectedGoals(prev =>
            prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
        );
    };

    const handleComplete = async () => {
        if (!displayName.trim()) return;

        setIsLoading(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        try {
            // Save profile to Firebase (optional - can add Firestore later)
            // For now, just navigate to home
            router.replace('/home');
        } catch (error) {
            console.error('Error saving profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const isComplete = displayName.trim().length > 0 && selectedGoals.length > 0;

    return (
        <GradientBackground variant="nature">
            <StatusBar style="light" />
            <View style={[styles.container, { paddingTop: insets.top + Spacing.lg }]}>
                {/* Header */}
                <Animated.View
                    style={styles.header}
                    entering={FadeInDown.delay(100).duration(500)}
                >
                    <Text style={styles.title}>Set Up Your Profile</Text>
                    <Text style={styles.subtitle}>Tell us a bit about yourself</Text>
                </Animated.View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Avatar Selection */}
                    <Animated.View
                        style={styles.section}
                        entering={FadeInDown.delay(200).duration(500)}
                    >
                        <Text style={styles.sectionTitle}>Choose Your Avatar</Text>
                        <View style={styles.avatarGrid}>
                            {AVATARS.map((avatar, index) => (
                                <AvatarCard
                                    key={avatar.id}
                                    source={avatar.source}
                                    isSelected={selectedAvatar === avatar.id}
                                    onSelect={() => handleAvatarSelect(avatar.id)}
                                    delay={300 + index * 50}
                                />
                            ))}
                        </View>
                    </Animated.View>

                    {/* Display Name */}
                    <Animated.View
                        style={styles.section}
                        entering={FadeInDown.delay(400).duration(500)}
                    >
                        <Text style={styles.sectionTitle}>Your Name</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your name"
                                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                value={displayName}
                                onChangeText={setDisplayName}
                                autoCapitalize="words"
                            />
                        </View>
                    </Animated.View>

                    {/* Learning Goals */}
                    <Animated.View
                        style={styles.section}
                        entering={FadeInDown.delay(500).duration(500)}
                    >
                        <Text style={styles.sectionTitle}>Why are you learning?</Text>
                        <Text style={styles.sectionHint}>Select all that apply</Text>
                        <View style={styles.goalsGrid}>
                            {GOALS.map((goal, index) => (
                                <GoalChip
                                    key={goal.id}
                                    emoji={goal.emoji}
                                    label={goal.label}
                                    isSelected={selectedGoals.includes(goal.id)}
                                    onToggle={() => handleGoalToggle(goal.id)}
                                    delay={600 + index * 50}
                                />
                            ))}
                        </View>
                    </Animated.View>
                </ScrollView>

                {/* Bottom Button */}
                <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + Spacing.md }]}>
                    <PrimaryButton
                        title="Complete Setup ✨"
                        onPress={handleComplete}
                        disabled={!isComplete || isLoading}
                    />
                </View>
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
    },
    subtitle: {
        ...Typography.body,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        marginTop: Spacing.xs,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: Spacing.xl,
    },
    section: {
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        ...Typography.bodyBold,
        color: Colors.textLight,
        marginBottom: Spacing.sm,
    },
    sectionHint: {
        ...Typography.caption,
        color: 'rgba(255, 255, 255, 0.6)',
        marginBottom: Spacing.md,
    },
    avatarGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    avatarCard: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: BorderRadius.lg,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadows.card,
    },
    avatarCardSelected: {
        borderColor: Colors.primary,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    avatarImage: {
        width: AVATAR_SIZE - 16,
        height: AVATAR_SIZE - 16,
    },
    avatarCheck: {
        position: 'absolute',
        bottom: -8,
        right: -8,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    inputWrapper: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        paddingHorizontal: Spacing.md,
    },
    input: {
        ...Typography.body,
        color: Colors.textLight,
        paddingVertical: Spacing.md,
    },
    goalsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    goalChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: BorderRadius.full,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    goalChipSelected: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    goalEmoji: {
        fontSize: 18,
        marginRight: Spacing.xs,
    },
    goalLabel: {
        ...Typography.caption,
        color: Colors.textLight,
    },
    goalLabelSelected: {
        color: Colors.textPrimary,
        fontWeight: '600',
    },
    bottomContainer: {
        paddingTop: Spacing.md,
    },
});
