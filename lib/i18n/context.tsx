'use client';

import React, { createContext, useContext, useState } from 'react';
import { Locale, translations } from './translations';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: typeof translations['en'];
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tanmiyat_locale') as Locale | null;
      if (saved && (saved === 'en' || saved === 'ar')) {
        return saved;
      }
    }
    return 'en';
  });

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tanmiyat_locale', newLocale);
      document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = newLocale;
    }
  };

  const isRTL = locale === 'ar';
  const t = translations[locale];

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, isRTL }}>
      <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'font-arabic' : ''}>
        {children}
      </div>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
