import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TranslationDictionary, TRANSLATIONS } from '../translations/translations';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: TranslationDictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('esh_language') as Language;
    if (saved === 'en' || saved === 'mr' || saved === 'hi') {
      return saved;
    }
    return 'en';
  });

  const setLanguage = async (newLang: Language) => {
    setLanguageState(newLang);
    localStorage.setItem('esh_language', newLang);

    // If user is logged in, sync their preferred language to their Firestore profile
    if (auth.currentUser) {
      try {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await setDoc(userRef, { preferredLanguage: newLang }, { merge: true });
      } catch (err) {
        console.warn('Could not sync language preference to Firestore:', err);
      }
    }
  };

  const toggleLanguage = () => {
    const nextLang: Language = language === 'en' ? 'mr' : language === 'mr' ? 'hi' : 'en';
    setLanguage(nextLang);
  };

  const t = TRANSLATIONS[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
