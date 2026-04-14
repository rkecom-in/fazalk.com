'use client';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Language, Strings } from '@/lib/i18n';
import { getStrings } from '@/lib/i18n';

export type Theme = 'dark' | 'light';

interface GlobalUXContextValue {
  theme: Theme;
  language: Language;
  t: Strings;
  setTheme: (v: Theme) => void;
  setLanguage: (v: Language) => void;
  toggleTheme: () => void;
  toggleLanguage: () => void;
}

const GlobalUXContext = createContext<GlobalUXContextValue | null>(null);

function detectDefaultLanguage(): Language {
  if (typeof navigator === 'undefined') return 'en';
  const lang = navigator.language || '';
  return lang.startsWith('ar') ? 'ar' : 'en';
}

export function GlobalUXProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  // Hydrate from localStorage + detect locale on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('ux-theme') as Theme | null;
    const savedLang = localStorage.getItem('ux-language') as Language | null;

    setThemeState(savedTheme ?? 'dark');
    setLanguageState(savedLang ?? detectDefaultLanguage());
    setMounted(true);
  }, []);

  // Apply theme to <html>
  useEffect(() => {
    if (!mounted) return;
    const html = document.documentElement;
    html.classList.remove('dark', 'light');
    html.classList.add(theme);
    localStorage.setItem('ux-theme', theme);
  }, [theme, mounted]);

  // Apply direction and font class to <html>
  useEffect(() => {
    if (!mounted) return;
    const html = document.documentElement;
    html.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    html.setAttribute('lang', language);
    localStorage.setItem('ux-language', language);
  }, [language, mounted]);

  const setTheme = useCallback((v: Theme) => setThemeState(v), []);
  const setLanguage = useCallback((v: Language) => setLanguageState(v), []);
  const toggleTheme = useCallback(() => setThemeState(t => t === 'dark' ? 'light' : 'dark'), []);
  const toggleLanguage = useCallback(() => setLanguageState(l => l === 'en' ? 'ar' : 'en'), []);

  const t = getStrings(language);

  return (
    <GlobalUXContext.Provider value={{
      theme, language, t,
      setTheme, setLanguage,
      toggleTheme, toggleLanguage,
    }}>
      {children}
    </GlobalUXContext.Provider>
  );
}

export function useGlobalUX() {
  const ctx = useContext(GlobalUXContext);
  if (!ctx) throw new Error('useGlobalUX must be used within GlobalUXProvider');
  return ctx;
}
