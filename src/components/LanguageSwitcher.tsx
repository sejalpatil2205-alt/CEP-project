import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../translations/translations';

interface LanguageSwitcherProps {
  compact?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ compact = false }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages: { code: Language; label: string; subLabel: string; native: string }[] = [
    {
      code: 'en',
      label: 'English',
      subLabel: 'National & Official Interface',
      native: 'English (EN)'
    },
    {
      code: 'mr',
      label: 'मराठी',
      subLabel: 'महाराष्ट्र राज्य अधिकृत भाषा',
      native: 'मराठी (MR)'
    },
    {
      code: 'hi',
      label: 'हिन्दी',
      subLabel: 'राष्ट्रभाषा • Official Language',
      native: 'हिन्दी (HI)'
    }
  ];

  const currentLangObj = languages.find((l) => l.code === language) || languages[0];

  const handleSelectLanguage = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        id="navbar-language-switcher-btn"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        title="Toggle Portal Language (English / मराठी / हिन्दी)"
        className={`flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white/95 hover:bg-slate-50 text-slate-700 transition-all shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/30 ${
          compact ? 'px-2 py-1 text-xs' : 'px-2.5 py-1.5 text-xs sm:text-sm font-medium'
        }`}
      >
        <div className="w-5 h-5 rounded-lg bg-orange-50 border border-orange-200/80 text-orange-600 flex items-center justify-center shrink-0">
          <Globe className="w-3.5 h-3.5" />
        </div>
        <span className="font-semibold text-slate-800">
          {language === 'mr' ? 'मराठी' : language === 'hi' ? 'हिन्दी' : 'English'}
        </span>
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase">
          {language.toUpperCase()}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-amber-600' : ''}`} />
      </button>

      {isOpen && (
        <div
          id="navbar-language-dropdown-menu"
          className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in-50 zoom-in-95 origin-top-right focus:outline-none"
        >
          <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Select Portal Language</span>
            <span className="text-amber-600">भाषा चुनें</span>
          </div>

          <div className="p-1 space-y-1">
            {languages.map((item) => {
              const isSelected = language === item.code;
              return (
                <button
                  key={item.code}
                  id={`lang-option-${item.code}`}
                  onClick={() => handleSelectLanguage(item.code)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50 text-amber-950 font-bold border border-amber-200/90'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[11px] uppercase ${
                      isSelected
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {item.code}
                    </span>
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{item.native}</span>
                        {item.code === 'hi' && (
                          <span className="text-[10px] text-orange-600 bg-orange-50 px-1 rounded font-normal">
                            लोकप्रिय
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 font-normal">
                        {item.subLabel}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-500 flex items-center justify-between">
            <span>Synced with Firestore</span>
            <span className="text-emerald-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Auto-saved
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
