import React, { useState } from 'react';
import { 
  Home, 
  Layers, 
  HeartHandshake, 
  Car, 
  ClipboardCheck, 
  History, 
  Database, 
  Globe, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUp,
  ShieldCheck,
  Compass,
  CreditCard,
  Search
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface RightSideNavDockProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenDatabase?: () => void;
}

export const RightSideNavDock: React.FC<RightSideNavDockProps> = ({
  currentPath,
  onNavigate,
  onOpenDatabase
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  const navLinks = [
    { label: t.navHome, path: '/', icon: Home, short: 'Home' },
    { label: t.navWomenBusCard, path: '/maha-bus-women-card', icon: CreditCard, short: 'Bus Card' },
    { label: t.navVehicleSearch, path: '/vehicle-information', icon: Search, short: 'MH Vahan' },
    { label: t.navServices, path: '/services', icon: Layers, short: 'Services' },
    { label: t.navWomenWelfare, path: '/women-services', icon: HeartHandshake, short: 'Women' },
    { label: t.navVehicleHub, path: '/vehicle-dashboard', icon: Car, short: 'Vehicles' },
    { label: t.navMyTracker, path: '/tracker', icon: ClipboardCheck, short: 'Tracker' },
    { 
      label: t.navRecentActivity, 
      path: '/vehicle-dashboard?tab=recent-activity', 
      icon: History, 
      short: 'Activity',
      isRecent: true 
    }
  ];

  const handleNavClick = (path: string) => {
    if (path.includes('?tab=')) {
      onNavigate(path);
      const url = new URL(window.location.href);
      url.pathname = '/vehicle-dashboard';
      url.searchParams.set('tab', 'recent-activity');
      window.history.pushState({}, '', url.toString());
      // trigger hash or custom event if needed
      window.dispatchEvent(new Event('popstate'));
    } else {
      onNavigate(path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside
      id="right-side-navigation-dock"
      aria-label="Right Side Navigation Dock"
      className="fixed right-3 sm:right-4 top-1/2 -translate-y-1/2 z-40 flex items-center select-none"
    >
      {/* Dock Container */}
      <div 
        className={`bg-stone-900/95 text-stone-100 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-amber-500/50 py-3 px-2 flex flex-col items-center gap-1.5 transition-all duration-300 ${
          isExpanded ? 'w-48 sm:w-52 shadow-amber-500/20' : 'w-14 sm:w-16'
        }`}
      >
        {/* Toggle Expand / Collapse */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-1 mb-1 text-stone-400 hover:text-amber-400 flex items-center justify-center transition-colors cursor-pointer"
          title={isExpanded ? 'Collapse Navigation' : 'Expand Navigation'}
        >
          {isExpanded ? (
            <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-amber-400">
              <span>{language === 'hi' ? 'नेविगेशन' : 'Nav Bar'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          ) : (
            <ChevronLeft className="w-4 h-4 text-amber-400 animate-pulse" />
          )}
        </button>

        {/* Brand Dot */}
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center text-white mb-1 shadow-xs shrink-0">
          <Compass className="w-4 h-4 text-amber-200" />
        </div>

        {/* Navigation Items */}
        <div className="w-full flex flex-col gap-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = 
              currentPath === item.path ||
              (item.path === '/maha-bus-women-card' && (currentPath.includes('women-bus-card') || currentPath.includes('bus-card') || currentPath.includes('maha-bus'))) ||
              (item.path === '/vehicle-information' && (currentPath.includes('vehicle-search') || currentPath.includes('vehicle-info') || currentPath.includes('vehicle-information') || currentPath.includes('vahan'))) ||
              (item.path === '/services' && currentPath.includes('/service-detail')) ||
              (item.path !== '/' && currentPath.startsWith(item.path));

            return (
              <button
                key={item.label}
                id={`right-dock-nav-${item.short.toLowerCase()}`}
                onClick={() => handleNavClick(item.path)}
                title={item.label}
                className={`w-full group relative flex items-center gap-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                  isExpanded ? 'px-2.5 py-2 justify-start' : 'p-2 justify-center'
                } ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold shadow-md shadow-orange-500/30'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                <div className="relative shrink-0 flex items-center justify-center">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-400 group-hover:text-amber-300'}`} />
                  {isActive && !isExpanded && (
                    <span className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-stone-900"></span>
                  )}
                  {item.isRecent && (
                    <span className="absolute -left-1 -bottom-1 w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  )}
                </div>

                {isExpanded && (
                  <span className="text-xs font-semibold truncate leading-none">
                    {item.label}
                  </span>
                )}

                {/* Floating Tooltip when collapsed */}
                {!isExpanded && (
                  <div className="absolute right-full mr-2.5 px-2.5 py-1 bg-stone-950 text-white text-[11px] font-semibold rounded-lg shadow-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50 border border-stone-800">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Separator */}
        <div className="w-full my-1.5 h-px bg-stone-800" />

        {/* Language Quick Toggle */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          className={`w-full group relative flex items-center gap-2 rounded-xl transition-all cursor-pointer text-stone-300 hover:text-white hover:bg-stone-800 ${
            isExpanded ? 'px-2.5 py-1.5 justify-start' : 'p-2 justify-center'
          }`}
          title="Toggle Language (English / हिन्दी)"
        >
          <Globe className="w-4 h-4 text-orange-400 shrink-0" />
          {isExpanded ? (
            <span className="text-xs font-medium text-amber-200">
              {language === 'en' ? 'हिन्दी में देखें' : 'Switch English'}
            </span>
          ) : (
            <span className="text-[9px] font-bold uppercase text-amber-300">
              {language.toUpperCase()}
            </span>
          )}
        </button>

        {/* Open Database Modal */}
        {onOpenDatabase && (
          <button
            onClick={onOpenDatabase}
            className={`w-full group relative flex items-center gap-2 rounded-xl transition-all cursor-pointer text-stone-300 hover:text-white hover:bg-stone-800 ${
              isExpanded ? 'px-2.5 py-1.5 justify-start' : 'p-2 justify-center'
            }`}
            title="Citizen Cloud Database"
          >
            <Database className="w-4 h-4 text-blue-400 shrink-0" />
            {isExpanded && (
              <span className="text-xs font-medium text-blue-300">
                {language === 'hi' ? 'क्लाउड डेटाबेस' : 'Citizen DB'}
              </span>
            )}
          </button>
        )}

        {/* Scroll To Top Button */}
        <button
          onClick={scrollToTop}
          className="w-full mt-1 p-1 text-stone-500 hover:text-stone-300 flex items-center justify-center transition-colors cursor-pointer"
          title="Scroll to Top"
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
