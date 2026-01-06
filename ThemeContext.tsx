import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
export type Language = 'en' | 'hi';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string; // Simple translation helper
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const TRANSLATIONS: Record<string, Record<Language, string>> = {
  'welcome': { en: 'Hi', hi: 'Namaste' },
  'ec_score': { en: 'EC Score', hi: 'EC Score' },
  'guard_rails': { en: 'RBI Guard Rails Active', hi: 'RBI Suraksha Active' },
  'guard_desc': { en: 'Spends restricted to essentials. P2P transfers blocked.', hi: 'Kewal zaroori kharch. P2P transfer band hai.' },
  'spend_limit': { en: 'Cumulative Spend Limit', hi: 'Kul Kharch Limit' },
  'used': { en: 'Used', hi: 'Prayog hua' },
  'shared_limit': { en: 'Spend across Fuel, Grocery, Pharma...', hi: 'Fuel, Rashan aur Dawa ke liye...' },
  'next_level': { en: 'Next Level: Repay to unlock +₹1000 Spend Limit!', hi: 'Agla Level: Payment karein aur ₹1000 Limit badhayein!' },
  'ec_cash_desc': { en: 'Self-transfer only', hi: 'Khud ke account mein' },
  'get_now': { en: 'Get Now', hi: 'Abhi Lein' },
  'scan_pay': { en: 'Scan & Pay', hi: 'Scan & Pay' },
  'scan_desc': { en: 'Verified Merchants Only', hi: 'Verified Dukandar Only' },
  'scan_btn': { en: 'Scan QR', hi: 'QR Scan Karein' },
  'quick_cat': { en: 'Quick Categories', hi: 'Jaldi Pay Karein' },
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme) return savedTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const t = (key: string): string => {
    const entry = TRANSLATIONS[key];
    if (!entry) return key; // Fallback to key if not found
    return entry[language];
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, language, setLanguage, t }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};