// app/login.tsx - Improved Login Screen
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import Animated, {
    Easing,
    FadeInUp,
    SlideInDown,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { GradientBackground, PrimaryButton } from '../src/components';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../src/constants/theme';
import { useI18n } from '../src/i18n';

const { width, height } = Dimensions.get('window');

// Google Logo Component
const GoogleLogo = () => (
    <Svg width={20} height={20} viewBox="0 0 24 24">
        <Path
            d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z"
            fill="#4285F4"
        />
        <Path
            d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1945 21.1039L16.3275 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.2401 24.0008Z"
            fill="#34A853"
        />
        <Path
            d="M5.50253 14.3003C5.00236 12.8099 5.00236 11.1961 5.50253 9.70575V6.61481H1.51649C-0.18551 10.0056 -0.18551 14.0004 1.51649 17.3912L5.50253 14.3003Z"
            fill="#FBBC05"
        />
        <Path
            d="M12.2401 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.034466 12.2401 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50264 9.70575C6.45064 6.86173 9.10947 4.74966 12.2401 4.74966Z"
            fill="#EA4335"
        />
    </Svg>
);

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function LoginScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { t } = useI18n();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Mascot animation
    const mascotY = useSharedValue(0);
    const mascotRotate = useSharedValue(0);

    useEffect(() => {
        mascotY.value = withRepeat(
            withSequence(
                withTiming(-8, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
                withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );

        mascotRotate.value = withRepeat(
            withSequence(
                withTiming(-3, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                withTiming(3, { duration: 2000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
    }, []);

    const mascotAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: mascotY.value },
            { rotate: `${mascotRotate.value}deg` }
        ],
    }));

    const handleSignIn = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace('/home');
    };

    const handleGoogleSignIn = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace('/home');
    };

    const handleRegister = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push('/register');
    };

    const handleForgotPassword = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push('/forgot-password');
    };

    const togglePasswordVisibility = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setShowPassword(!showPassword);
    };

    return (
        <GradientBackground variant="nature">
            <StatusBar style="light" />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView
                    contentContainerStyle={[
                        styles.scrollContent,
                        { paddingTop: insets.top + Spacing.lg }
                    ]}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Mascot */}
                    <Animated.View
                        style={[styles.mascotContainer, mascotAnimatedStyle]}
                        entering={SlideInDown.delay(200).duration(600).springify()}
                    >
                        <Image
                            source={require('../assets/images/ian_cool_nobg.png')}
                            style={styles.mascot}
                            resizeMode="contain"
                        />
                    </Animated.View>

                    {/* Glass Card */}
                    <Animated.View
                        style={styles.glassCard}
                        entering={FadeInUp.delay(400).duration(500)}
                    >
                        {/* Header */}
                        <View style={styles.headerContainer}>
                            <Text style={styles.title}>{t.auth.welcomeBack}</Text>
                            <Text style={styles.subtitle}>{t.auth.missedYou}</Text>
                        </View>

                        {/* Form */}
                        <View style={styles.formContainer}>
                            {/* Email Input */}
                            <Animated.View
                                entering={FadeInUp.delay(500).duration(400)}
                            >
                                <View style={styles.inputWrapper}>
                                    <MaterialIcons name="mail-outline" size={22} color="rgba(255, 255, 255, 0.7)" />
                                    <TextInput
                                        style={styles.input}
                                        placeholder={t.auth.email}
                                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                    />
                                </View>
                            </Animated.View>

                            {/* Password Input */}
                            <Animated.View entering={FadeInUp.delay(600).duration(400)}>
                                <View style={styles.inputWrapper}>
                                    <MaterialIcons name="lock-outline" size={22} color="rgba(255, 255, 255, 0.7)" />
                                    <TextInput
                                        style={styles.input}
                                        placeholder={t.auth.password}
                                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!showPassword}
                                        autoComplete="password"
                                    />
                                    <Pressable onPress={togglePasswordVisibility} style={styles.visibilityButton}>
                                        <MaterialIcons
                                            name={showPassword ? "visibility-off" : "visibility"}
                                            size={22}
                                            color="rgba(255, 255, 255, 0.7)"
                                        />
                                    </Pressable>
                                </View>
                            </Animated.View>

                            {/* Forgot Password */}
                            <Animated.View
                                style={styles.forgotContainer}
                                entering={FadeInUp.delay(700).duration(400)}
                            >
                                <Pressable onPress={handleForgotPassword}>
                                    <Text style={styles.forgotText}>{t.auth.forgotPassword}</Text>
                                </Pressable>
                            </Animated.View>

                            {/* Sign In Button */}
                            <Animated.View entering={FadeInUp.delay(800).duration(400)}>
                                <PrimaryButton
                                    title={t.auth.signIn}
                                    onPress={handleSignIn}
                                    style={styles.signInButton}
                                />
                            </Animated.View>

                            {/* Divider */}
                            <Animated.View
                                style={styles.dividerContainer}
                                entering={FadeInUp.delay(900).duration(400)}
                            >
                                <View style={styles.dividerLine} />
                                <Text style={styles.dividerText}>{t.auth.orContinueWith}</Text>
                                <View style={styles.dividerLine} />
                            </Animated.View>

                            {/* Google Sign In */}
                            <Animated.View entering={FadeInUp.delay(1000).duration(400)}>
                                <SocialButton
                                    icon={<GoogleLogo />}
                                    title={t.auth.signInWithGoogle}
                                    onPress={handleGoogleSignIn}
                                />
                            </Animated.View>

                            {/* Register Link */}
                            <Animated.View
                                style={styles.registerContainer}
                                entering={FadeInUp.delay(1100).duration(400)}
                            >
                                <Text style={styles.registerText}>{t.auth.newHere} </Text>
                                <Pressable onPress={handleRegister}>
                                    <Text style={styles.registerLink}>{t.auth.register}</Text>
                                </Pressable>
                            </Animated.View>
                        </View>
                    </Animated.View>

                    {/* Bottom Spacing */}
                    <View style={{ height: insets.bottom + Spacing.xl }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </GradientBackground>
    );
}

// Social Button Component
interface SocialButtonProps {
    icon: React.ReactNode;
    title: string;
    onPress: () => void;
}

const SocialButton: React.FC<SocialButtonProps> = ({ icon, title, onPress }) => {
    const scale = useSharedValue(1);

    const handlePressIn = () => {
        scale.value = withSpring(0.97, { damping: 15 });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 15 });
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <AnimatedPressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}
            style={animatedStyle}
        >
            <View style={styles.socialButton}>
                {icon}
                <Text style={styles.socialButtonText}>{title}</Text>
            </View>
        </AnimatedPressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
    },
    mascotContainer: {
        width: 150,
        height: 150,
        marginBottom: -Spacing.lg,
        zIndex: 10,
    },
    mascot: {
        width: '100%',
        height: '100%',
    },
    glassCard: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: BorderRadius.xxl,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        padding: Spacing.xl,
        paddingTop: Spacing.xxl + Spacing.md,
        ...Shadows.glass,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    title: {
        ...Typography.h2,
        color: Colors.textLight,
        marginBottom: Spacing.xs,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    subtitle: {
        ...Typography.body,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    formContainer: {
        gap: Spacing.md,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        gap: Spacing.sm,
    },
    input: {
        flex: 1,
        ...Typography.body,
        color: Colors.textLight,
        paddingVertical: Spacing.xs,
    },
    visibilityButton: {
        padding: Spacing.xs,
    },
    forgotContainer: {
        alignItems: 'flex-end',
        marginTop: -Spacing.xs,
    },
    forgotText: {
        ...Typography.caption,
        fontWeight: '600',
        color: Colors.primary,
    },
    signInButton: {
        marginTop: Spacing.xs,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: Spacing.sm,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    dividerText: {
        ...Typography.caption,
        color: 'rgba(255, 255, 255, 0.6)',
        marginHorizontal: Spacing.md,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: BorderRadius.lg,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        ...Shadows.card,
    },
    socialButtonText: {
        ...Typography.bodyBold,
        color: '#333',
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Spacing.xs,
    },
    registerText: {
        ...Typography.body,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    registerLink: {
        ...Typography.bodyBold,
        color: Colors.primary,
    },
});
