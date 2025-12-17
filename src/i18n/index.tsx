// src/i18n/index.tsx - i18n Context và Hook
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { en, TranslationKeys, vi, zhCN, zhTW } from './locales';

// Supported languages
export type LanguageCode = 'en' | 'vi' | 'zh-CN' | 'zh-TW';

export interface LanguageOption {
    code: LanguageCode;
    name: string;
    nativeName: string;
    flag: string;
}

export const LANGUAGES: LanguageOption[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
    { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '中文 (简体)', flag: '🇨🇳' },
    { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '中文 (繁體)', flag: '🇹🇼' },
];

// Get translations for language
const translations: Record<LanguageCode, TranslationKeys> = {
    en,
    vi,
    'zh-CN': zhCN,
    'zh-TW': zhTW,
};

// Storage keys
const STORAGE_KEYS = {
    NATIVE_LANGUAGE: '@ianlanguage_native_lang',
    TARGET_LANGUAGE: '@ianlanguage_target_lang',
};

// Context type
interface I18nContextType {
    t: TranslationKeys;
    nativeLanguage: LanguageCode;
    targetLanguage: LanguageCode;
    setNativeLanguage: (lang: LanguageCode) => Promise<void>;
    setTargetLanguage: (lang: LanguageCode) => Promise<void>;
    isLoading: boolean;
}

// Create context
const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Provider component
interface I18nProviderProps {
    children: ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
    const [nativeLanguage, setNativeLang] = useState<LanguageCode>('en');
    const [targetLanguage, setTargetLang] = useState<LanguageCode>('zh-CN');
    const [isLoading, setIsLoading] = useState(true);

    // Load saved languages on mount
    useEffect(() => {
        loadSavedLanguages();
    }, []);

    const loadSavedLanguages = async () => {
        try {
            const savedNative = await AsyncStorage.getItem(STORAGE_KEYS.NATIVE_LANGUAGE);
            const savedTarget = await AsyncStorage.getItem(STORAGE_KEYS.TARGET_LANGUAGE);

            if (savedNative) setNativeLang(savedNative as LanguageCode);
            if (savedTarget) setTargetLang(savedTarget as LanguageCode);
        } catch (error) {
            console.error('Error loading languages:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const setNativeLanguage = async (lang: LanguageCode) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.NATIVE_LANGUAGE, lang);
            setNativeLang(lang);
        } catch (error) {
            console.error('Error saving native language:', error);
        }
    };

    const setTargetLanguage = async (lang: LanguageCode) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.TARGET_LANGUAGE, lang);
            setTargetLang(lang);
        } catch (error) {
            console.error('Error saving target language:', error);
        }
    };

    // Get translations based on native language (app interface language)
    const t = translations[nativeLanguage] || translations.en;

    return (
        <I18nContext.Provider
            value={{
                t,
                nativeLanguage,
                targetLanguage,
                setNativeLanguage,
                setTargetLanguage,
                isLoading,
            }}
        >
            {children}
        </I18nContext.Provider>
    );
};

// Hook to use i18n
export const useI18n = () => {
    const context = useContext(I18nContext);
    if (context === undefined) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
};

// Export languages for language selection screen
export { LANGUAGES as availableLanguages };
