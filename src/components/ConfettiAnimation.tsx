// src/components/ConfettiAnimation.tsx - Simple confetti animation thay thế cho Rive
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { Colors } from '../constants/theme';

const { width } = Dimensions.get('window');

const CONFETTI_COLORS = [
    Colors.primary,
    '#22c55e',
    '#3b82f6',
    '#f97316',
    '#ec4899',
    '#8b5cf6',
];

interface ConfettiPieceProps {
    index: number;
    color: string;
}

const ConfettiPiece: React.FC<ConfettiPieceProps> = ({ index, color }) => {
    const translateY = useSharedValue(-50);
    const translateX = useSharedValue(0);
    const rotate = useSharedValue(0);
    const opacity = useSharedValue(1);

    useEffect(() => {
        const startX = (Math.random() - 0.5) * width * 0.8;
        const delay = index * 100;

        translateY.value = withDelay(
            delay,
            withRepeat(
                withTiming(300, { duration: 2000, easing: Easing.out(Easing.quad) }),
                -1,
                false
            )
        );

        translateX.value = withDelay(
            delay,
            withRepeat(
                withSequence(
                    withTiming(startX + 30, { duration: 1000 }),
                    withTiming(startX - 30, { duration: 1000 })
                ),
                -1,
                true
            )
        );

        rotate.value = withDelay(
            delay,
            withRepeat(
                withTiming(360, { duration: 1500, easing: Easing.linear }),
                -1,
                false
            )
        );

        opacity.value = withDelay(
            delay,
            withRepeat(
                withSequence(
                    withTiming(1, { duration: 1500 }),
                    withTiming(0, { duration: 500 })
                ),
                -1,
                false
            )
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: translateY.value },
            { translateX: translateX.value },
            { rotate: `${rotate.value}deg` },
        ],
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                styles.confettiPiece,
                { backgroundColor: color },
                animatedStyle,
            ]}
        />
    );
};

interface ConfettiAnimationProps {
    count?: number;
}

export const ConfettiAnimation: React.FC<ConfettiAnimationProps> = ({
    count = 20,
}) => {
    return (
        <View style={styles.container} pointerEvents="none">
            {Array.from({ length: count }).map((_, index) => (
                <ConfettiPiece
                    key={index}
                    index={index}
                    color={CONFETTI_COLORS[index % CONFETTI_COLORS.length]}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        overflow: 'hidden',
    },
    confettiPiece: {
        position: 'absolute',
        width: 10,
        height: 10,
        borderRadius: 2,
    },
});

export default ConfettiAnimation;
