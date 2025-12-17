// src/components/LoadingSpinner.tsx - Custom loading animation thay thế cho Rive
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';
import { Colors } from '../constants/theme';

interface LoadingSpinnerProps {
    size?: number;
    color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 48,
    color = Colors.primary,
}) => {
    const rotation = useSharedValue(0);

    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360, { duration: 1000, easing: Easing.linear }),
            -1,
            false
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Animated.View style={[styles.spinner, animatedStyle, {
                width: size,
                height: size,
                borderRadius: size / 2,
                borderWidth: size * 0.06,
                borderTopColor: color,
            }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    spinner: {
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderStyle: 'solid',
    },
});

export default LoadingSpinner;
