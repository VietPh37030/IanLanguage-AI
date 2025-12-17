import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Gradients } from '../constants/theme';

interface GradientBackgroundProps {
    children: React.ReactNode;
    style?: ViewStyle;
    colors?: string[];
    variant?: 'splash' | 'nature' | 'mesh';
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
    children,
    style,
    colors,
    variant = 'nature',
}) => {
    const gradientColors = colors || Gradients[variant] || Gradients.nature;

    return (
        <View style={[styles.container, style]}>
            <LinearGradient
                colors={gradientColors as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
            />
            {/* Decorative orbs for glassmorphism depth */}
            <View style={styles.orbTop} />
            <View style={styles.orbBottom} />
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
    },
    orbTop: {
        position: 'absolute',
        top: -100,
        left: -100,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: 'rgba(249, 245, 6, 0.2)',
        opacity: 0.6,
    },
    orbBottom: {
        position: 'absolute',
        bottom: -80,
        right: -80,
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: 'rgba(94, 234, 212, 0.25)',
        opacity: 0.6,
    },
});

export default GradientBackground;
