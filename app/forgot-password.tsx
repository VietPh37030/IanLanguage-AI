// app/forgot-password.tsx - Forgot Password Screen with OTP Flow
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Rive from 'rive-react-native';
import { GradientBackground, PrimaryButton } from '../src/components';
import { BorderRadius, Colors, Spacing, Typography } from '../src/constants/theme';
import { useI18n } from '../src/i18n';

type Step = 'email' | 'otp' | 'newPassword' | 'success';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { t } = useI18n();

    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedOtp, setGeneratedOtp] = useState('');

    const otpInputs = useRef<(TextInput | null)[]>([]);

    // Generate a 6-digit OTP
    const generateOtp = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const handleSendCode = async () => {
        if (!email.trim() || !email.includes('@')) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        try {
            // Simulate sending OTP (in real app, call your backend API)
            const code = generateOtp();
            setGeneratedOtp(code);

            // In development, show the OTP (remove in production!)
            console.log('Generated OTP:', code);
            Alert.alert('Demo Mode', `Your OTP is: ${code}\n(In production, this would be sent to your email)`);

            setStep('otp');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (error) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Error', 'Failed to send code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (value: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            otpInputs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            otpInputs.current[index - 1]?.focus();
        }
    };

    const handleVerifyCode = () => {
        const enteredOtp = otp.join('');

        if (enteredOtp.length !== 6) {
            Alert.alert('Error', 'Please enter the complete 6-digit code');
            return;
        }

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        if (enteredOtp === generatedOtp) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setStep('newPassword');
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Error', t.forgotPassword.invalidCode);
            setOtp(['', '', '', '', '', '']);
            otpInputs.current[0]?.focus();
        }
    };

    const handleResetPassword = async () => {
        if (!newPassword || newPassword.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        setIsLoading(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        try {
            // In real app, call Firebase or backend to update password
            // For demo, just simulate success
            await new Promise(resolve => setTimeout(resolve, 1500));

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setStep('success');
        } catch (error) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Error', 'Failed to reset password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToLogin = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.replace('/login');
    };

    const handleResendCode = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        handleSendCode();
    };

    const renderEmailStep = () => (
        <>
            <Animated.View
                style={styles.header}
                entering={FadeInDown.delay(100).duration(500)}
            >
                <Text style={styles.emoji}>🔐</Text>
                <Text style={styles.title}>{t.forgotPassword.title}</Text>
                <Text style={styles.subtitle}>{t.forgotPassword.subtitle}</Text>
            </Animated.View>

            <Animated.View
                style={styles.inputContainer}
                entering={FadeInDown.delay(200).duration(500)}
            >
                <View style={styles.inputWrapper}>
                    <Text style={styles.inputIcon}>✉️</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={t.forgotPassword.enterEmail}
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                    />
                </View>
            </Animated.View>

            <Animated.View
                style={styles.buttonContainer}
                entering={FadeInUp.delay(300).duration(500)}
            >
                <PrimaryButton
                    title={t.forgotPassword.sendCode}
                    onPress={handleSendCode}
                    disabled={isLoading || !email.trim()}
                />
            </Animated.View>
        </>
    );

    const renderOtpStep = () => (
        <>
            <Animated.View
                style={styles.header}
                entering={FadeInDown.delay(100).duration(500)}
            >
                <Text style={styles.emoji}>📧</Text>
                <Text style={styles.title}>{t.forgotPassword.enterCode}</Text>
                <Text style={styles.subtitle}>
                    {t.forgotPassword.codeSubtitle} {email}
                </Text>
            </Animated.View>

            <Animated.View
                style={styles.otpContainer}
                entering={FadeInDown.delay(200).duration(500)}
            >
                {otp.map((digit, index) => (
                    <TextInput
                        key={index}
                        ref={(ref) => { otpInputs.current[index] = ref; }}
                        style={[styles.otpInput, digit && styles.otpInputFilled]}
                        value={digit}
                        onChangeText={(value) => handleOtpChange(value.slice(-1), index)}
                        onKeyPress={(e) => handleOtpKeyPress(e, index)}
                        keyboardType="number-pad"
                        maxLength={1}
                        selectTextOnFocus
                    />
                ))}
            </Animated.View>

            <Animated.View
                style={styles.buttonContainer}
                entering={FadeInUp.delay(300).duration(500)}
            >
                <PrimaryButton
                    title={t.forgotPassword.verifyCode}
                    onPress={handleVerifyCode}
                    disabled={otp.join('').length !== 6}
                />
            </Animated.View>

            <Animated.View
                style={styles.resendContainer}
                entering={FadeInUp.delay(400).duration(500)}
            >
                <Pressable onPress={handleResendCode}>
                    <Text style={styles.resendText}>{t.forgotPassword.resendCode}</Text>
                </Pressable>
            </Animated.View>
        </>
    );

    const renderNewPasswordStep = () => (
        <>
            <Animated.View
                style={styles.header}
                entering={FadeInDown.delay(100).duration(500)}
            >
                <Text style={styles.emoji}>🔒</Text>
                <Text style={styles.title}>{t.forgotPassword.newPassword}</Text>
            </Animated.View>

            <Animated.View
                style={styles.inputContainer}
                entering={FadeInDown.delay(200).duration(500)}
            >
                <View style={styles.inputWrapper}>
                    <Text style={styles.inputIcon}>🔑</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={t.forgotPassword.newPassword}
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry
                    />
                </View>
            </Animated.View>

            <Animated.View
                style={styles.inputContainer}
                entering={FadeInDown.delay(300).duration(500)}
            >
                <View style={styles.inputWrapper}>
                    <Text style={styles.inputIcon}>🔑</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={t.forgotPassword.confirmNewPassword}
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />
                </View>
            </Animated.View>

            <Animated.View
                style={styles.buttonContainer}
                entering={FadeInUp.delay(400).duration(500)}
            >
                <PrimaryButton
                    title={t.forgotPassword.resetPassword}
                    onPress={handleResetPassword}
                    disabled={isLoading || !newPassword || !confirmPassword}
                />
            </Animated.View>
        </>
    );

    const renderSuccessStep = () => (
        <Animated.View
            style={styles.successContainer}
            entering={FadeInDown.delay(100).duration(500)}
        >
            <Text style={styles.successEmoji}>✅</Text>
            <Text style={styles.successTitle}>{t.forgotPassword.successTitle}</Text>
            <Text style={styles.successSubtitle}>{t.forgotPassword.successSubtitle}</Text>

            <View style={styles.successButton}>
                <PrimaryButton
                    title={t.forgotPassword.backToLogin}
                    onPress={handleBackToLogin}
                />
            </View>
        </Animated.View>
    );

    return (
        <GradientBackground variant="nature">
            <StatusBar style="light" />
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={[styles.content, { paddingTop: insets.top + Spacing.xl }]}>
                    {/* Loading Overlay */}
                    {isLoading && (
                        <View style={styles.loadingOverlay}>
                            <Rive
                                resourceName="loading"
                                style={styles.riveLoading}
                                autoplay
                            />
                        </View>
                    )}

                    {step === 'email' && renderEmailStep()}
                    {step === 'otp' && renderOtpStep()}
                    {step === 'newPassword' && renderNewPasswordStep()}
                    {step === 'success' && renderSuccessStep()}

                    {/* Back to Login */}
                    {step !== 'success' && (
                        <Animated.View
                            style={styles.backContainer}
                            entering={FadeInUp.delay(500).duration(500)}
                        >
                            <Pressable onPress={handleBackToLogin}>
                                <Text style={styles.backText}>← {t.forgotPassword.backToLogin}</Text>
                            </Pressable>
                        </Animated.View>
                    )}
                </View>
            </KeyboardAvoidingView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: Spacing.lg,
        justifyContent: 'center',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    riveLoading: {
        width: 150,
        height: 150,
    },
    header: {
        alignItems: 'center',
        marginBottom: Spacing.xxl,
    },
    emoji: {
        fontSize: 64,
        marginBottom: Spacing.md,
    },
    title: {
        ...Typography.h2,
        color: Colors.textLight,
        textAlign: 'center',
        marginBottom: Spacing.sm,
    },
    subtitle: {
        ...Typography.body,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        paddingHorizontal: Spacing.lg,
    },
    inputContainer: {
        marginBottom: Spacing.md,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        paddingHorizontal: Spacing.md,
    },
    inputIcon: {
        fontSize: 20,
        marginRight: Spacing.sm,
    },
    input: {
        flex: 1,
        ...Typography.body,
        color: Colors.textLight,
        paddingVertical: Spacing.md,
    },
    buttonContainer: {
        marginTop: Spacing.md,
        marginBottom: Spacing.lg,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.lg,
    },
    otpInput: {
        width: 48,
        height: 56,
        borderRadius: BorderRadius.md,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        ...Typography.h3,
        color: Colors.textLight,
        textAlign: 'center',
    },
    otpInputFilled: {
        borderColor: Colors.primary,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
    resendContainer: {
        alignItems: 'center',
    },
    resendText: {
        ...Typography.bodyBold,
        color: Colors.primary,
    },
    successContainer: {
        alignItems: 'center',
    },
    successEmoji: {
        fontSize: 80,
        marginBottom: Spacing.lg,
    },
    successTitle: {
        ...Typography.h2,
        color: Colors.textLight,
        textAlign: 'center',
        marginBottom: Spacing.sm,
    },
    successSubtitle: {
        ...Typography.body,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        marginBottom: Spacing.xxl,
    },
    successButton: {
        width: '100%',
    },
    backContainer: {
        alignItems: 'center',
        marginTop: Spacing.lg,
    },
    backText: {
        ...Typography.bodyBold,
        color: Colors.textLight,
    },
});
