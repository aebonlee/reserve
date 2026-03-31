import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { translations } from '../utils/translations';

type Language = 'ko' | 'en';

interface LanguageContextValue {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }): React.ReactElement => {
  const [language, setLanguage] = useState<Language>('ko');

  const toggleLanguage = (): void => {
    setLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: unknown = translations[language];
    for (const k of keys) {
      value = (value as Record<string, unknown> | undefined)?.[k];
    }
    return (typeof value === 'string' ? value : key);
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
