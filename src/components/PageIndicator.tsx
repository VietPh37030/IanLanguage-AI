import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { Colors, Spacing } from '../constants/theme';

interface PageIndicatorProps {
    total: number;
    current: number;
    style?: ViewStyle;
}

export const PageIndicator: React.FC<PageIndicatorProps> = ({
    total,
    current,
    style,
}) => {
    return (
        <View style={[styles.container, style]}>
            {Array.from({ length: total }).map((_, index) => (
                <Dot key={index} isActive={index === current} />
            ))}
        </View>
    );
};

interface DotProps {
    isActive: boolean;
}

const Dot: React.FC<DotProps> = ({ isActive }) => {
    const animatedStyle = useAnimatedStyle(() => ({
        width: withSpring(isActive ? 32 : 10, { damping: 15, stiffness: 200 }),
        backgroundColor: withTiming(
            isActive ? Colors.primary : 'rgba(255, 255, 255, 0.4)',
            { duration: 200 }
        ),
        shadowOpacity: withTiming(isActive ? 0.6 : 0, { duration: 200 }),
    }));

    return (
        <Animated.View style={[styles.dot, animatedStyle]} />
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
    },
    dot: {
        height: 10,
        borderRadius: 5,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 10,
    },
});

export default PageIndicator;
