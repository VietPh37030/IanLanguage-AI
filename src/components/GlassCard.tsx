import React, { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
    FadeIn
} from 'react-native-reanimated';
import { BorderRadius, Colors, Shadows } from '../constants/theme';

interface GlassCardProps extends PropsWithChildren {
    style?: ViewStyle;
    intensity?: number;
    tint?: 'light' | 'dark' | 'default';
    animated?: boolean;
    delay?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
    children,
    style,
    intensity = 60,
    tint = 'light',
    animated = true,
    delay = 0,
}) => {
    const AnimatedView = animated ? Animated.View : View;

    return (
        <AnimatedView
            entering={animated ? FadeIn.delay(delay).duration(500) : undefined}
            style={[styles.container, style]}
        >
            <View style={styles.glassBackground}>
                {children}
            </View>
        </AnimatedView>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        borderRadius: BorderRadius.xxl,
    },
    glassBackground: {
        backgroundColor: Colors.glassBg,
        borderWidth: 1,
        borderColor: Colors.glassBorder,
        borderRadius: BorderRadius.xxl,
        ...Shadows.glass,
    },
});

export default GlassCard;
