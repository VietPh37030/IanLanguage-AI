// Theme colors và constants cho IanLanguage
// Phong cách: Glassmorphism + Nature Green + Modern Chinese

export const Colors = {
    // Primary colors
    primary: '#f9f506', // Vàng chủ đạo
    primaryDark: '#eae605',

    // Nature gradient colors
    gradientStart: '#4ade80', // Light green
    gradientMiddle: '#22c55e', // Green
    gradientEnd: '#0d9488', // Teal

    // Background
    backgroundLight: '#f8f8f5',
    backgroundDark: '#1a1f16', // Dark moss green

    // Text
    textPrimary: '#0d3f35',
    textSecondary: 'rgba(13, 63, 53, 0.7)',
    textLight: '#ffffff',
    textMuted: 'rgba(255, 255, 255, 0.7)',

    // Glass effects
    glassBg: 'rgba(255, 255, 255, 0.25)',
    glassBgLight: 'rgba(255, 255, 255, 0.4)',
    glassBgDark: 'rgba(0, 0, 0, 0.3)',
    glassBorder: 'rgba(255, 255, 255, 0.4)',
    glassBorderLight: 'rgba(255, 255, 255, 0.6)',

    // Status
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',

    // Pinyin special color (for Chinese learning)
    pinyin: '#fb923c', // Orange for pinyin

    // Dark mode specific
    darkCard: 'rgba(255, 255, 255, 0.1)',
    darkSurface: '#0f1a0d',
};

export const Gradients = {
    nature: ['#4ade80', '#22c55e', '#0d9488'],
    splash: ['#34d399', '#059669', '#115e59'],
    mesh: [
        'rgba(74, 222, 128, 0.8)',
        'rgba(16, 185, 129, 0.6)',
        'rgba(13, 148, 136, 0.8)',
    ],
};

export const Shadows = {
    glass: {
        shadowColor: 'rgba(31, 38, 135, 0.15)',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 32,
        elevation: 8,
    },
    primary: {
        shadowColor: '#f9f506',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 14,
        elevation: 6,
    },
    card: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
};

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const BorderRadius = {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
    full: 9999,
};

export const Typography = {
    // Headings
    h1: {
        fontSize: 32,
        fontWeight: '700' as const,
        lineHeight: 40,
    },
    h2: {
        fontSize: 28,
        fontWeight: '700' as const,
        lineHeight: 36,
    },
    h3: {
        fontSize: 24,
        fontWeight: '600' as const,
        lineHeight: 32,
    },
    // Body
    body: {
        fontSize: 16,
        fontWeight: '400' as const,
        lineHeight: 24,
    },
    bodyBold: {
        fontSize: 16,
        fontWeight: '600' as const,
        lineHeight: 24,
    },
    // Small
    caption: {
        fontSize: 14,
        fontWeight: '500' as const,
        lineHeight: 20,
    },
    small: {
        fontSize: 12,
        fontWeight: '500' as const,
        lineHeight: 16,
    },
    // Button
    button: {
        fontSize: 18,
        fontWeight: '700' as const,
        lineHeight: 24,
    },
};

// Animation durations
export const Animations = {
    fast: 150,
    normal: 300,
    slow: 500,
    splash: 2500,
};

export default {
    Colors,
    Gradients,
    Shadows,
    Spacing,
    BorderRadius,
    Typography,
    Animations,
};
