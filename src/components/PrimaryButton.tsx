import * as Haptics from 'expo-haptics';
import React from 'react';
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    TextStyle,
    ViewStyle
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PrimaryButtonProps {
    title: string;
    onPress: () => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
    disabled?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'glass';
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    title,
    onPress,
    style,
    textStyle,
    disabled = false,
    loading = false,
    icon,
    variant = 'primary',
}) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const handlePressIn = () => {
        scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
        opacity.value = withTiming(0.9, { duration: 100 });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 15, stiffness: 400 });
        opacity.value = withTiming(1, { duration: 100 });
    };

    const handlePress = () => {
        if (!disabled && !loading) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onPress();
        }
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    const getButtonStyle = () => {
        switch (variant) {
            case 'secondary':
                return styles.secondaryButton;
            case 'glass':
                return styles.glassButton;
            default:
                return styles.primaryButton;
        }
    };

    const getTextStyle = () => {
        switch (variant) {
            case 'glass':
                return styles.glassButtonText;
            default:
                return styles.buttonText;
        }
    };

    return (
        <AnimatedPressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
            disabled={disabled || loading}
            style={[
                styles.button,
                getButtonStyle(),
                disabled && styles.disabled,
                animatedStyle,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'glass' ? Colors.textLight : Colors.textPrimary}
                    size="small"
                />
            ) : (
                <>
                    <Text style={[getTextStyle(), textStyle]}>{title}</Text>
                    {icon}
                </>
            )}
        </AnimatedPressable>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 56,
        borderRadius: BorderRadius.full,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        paddingHorizontal: Spacing.xl,
    },
    primaryButton: {
        backgroundColor: Colors.primary,
        ...Shadows.primary,
    },
    secondaryButton: {
        backgroundColor: Colors.glassBgLight,
        borderWidth: 1,
        borderColor: Colors.glassBorderLight,
    },
    glassButton: {
        backgroundColor: Colors.glassBg,
        borderWidth: 1,
        borderColor: Colors.glassBorder,
    },
    disabled: {
        opacity: 0.5,
    },
    buttonText: {
        ...Typography.button,
        color: Colors.textPrimary,
    },
    glassButtonText: {
        ...Typography.button,
        color: Colors.textLight,
    },
});

export default PrimaryButton;
