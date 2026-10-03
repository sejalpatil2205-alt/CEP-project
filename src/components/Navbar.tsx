import React, { useState } from 'react';
import { 
  Building2, 
  Car, 
  Menu, 
  X, 
  Info, 
  Layers, 
  Search, 
  ShieldCheck, 
  Compass, 
  ArrowRight, 
  ClipboardCheck, 
  MessageSquare, 
  Home, 
  HeartHandshake, 
  Database,
  History,
  Sparkles,
  CreditCard
} from 'lucide-react';
import { UserMenu } from './UserMenu';
import { LanguageSwitcher } from './LanguageSwitcher';
import { CitizenDatabaseModal } from './CitizenDatabaseModal';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onSelectService?: (serviceId: string) => void;
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentPath, 
  onNavigate, 
  onSelectService, 
  onOpenSearch 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [databaseModalOpen, setDatabaseModalOpen] = useState(false);
  const { t, language } = useLanguage();

  const navItems = [
    { label: t.navHome, path: '/', icon: Home },
    { label: t.navWomenBusCard, path: '/maha-bus-women-card', icon: CreditCard, badge: '50% Off' },
    { label: t.navVehicleSearch, path: '/vehicle-information', icon: Car, badge: 'MH RTO' },
    { label: t.navServices, path: '/services', icon: Layers },
    { label: t.navWomenWelfare, path: '/women-services', icon: HeartHandshake },
    { label: t.navVehicleHub, path: '/vehicle-dashboard', icon: Car, badge: 'FASTag' },
    { label: t.navMyTracker, path: '/tracker', icon: ClipboardCheck },
    { 
      label: t.navRecentActivity, 
      path: '/vehicle-dashboard?tab=recent-activity', 
      icon: History, 
      badge: 'Last 5',
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
      window.dispatchEvent(new Event('popstate'));
    } else {
      onNavigate(path);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-md border-b-2 border-amber-500/50 shadow-md shadow-stone-900/5">
        {/* Top micro-bar with warm Indian tricolor strip and citizen helpline quick info */}
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-amber-300 to-emerald-600" />
        <div className="bg-stone-950 text-stone-200 text-xs py-1.5 px-4 sm:px-6 hidden sm:flex justify-between items-center border-b border-stone-800">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-amber-400 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              {t.govBadge}
            </span>
            <span className="text-stone-700">|</span>
            <span className="text-stone-300 font-medium">{t.allIndiaDirectory}</span>
          </div>
          <div className="flex items-center gap-4 text-stone-300 font-medium">
            <span className="flex items-center gap-1.5 text-amber-300">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              {t.helplineFastag}
            </span>
            <span className="text-stone-700">|</span>
            <span className="text-stone-300">
              {t.helplineEmergency}
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            {/* Left: Brand Logo */}
            <button
              id="nav-brand-logo"
              onClick={() => handleNavClick('/')}
              className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer shrink-0"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-600 via-orange-600 to-stone-950 flex items-center justify-center text-white shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform border border-amber-400/40">
                <Compass className="w-6 h-6 text-amber-200" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-stone-950">
                    E-
                  </span>
                  <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-transparent bg-clip-text font-black text-xl sm:text-2xl">
                    Services
                  </span>
                </div>
                <p className="text-[11px] font-bold text-amber-800 tracking-wide -mt-0.5">
                  {t.portalSubtitle}
                </p>
              </div>
            </button>

            {/* Right Side: High-Visibility Navigation Bar + Tools */}
            <div className="flex items-center gap-2 lg:gap-3 ml-auto">
              {/* Desktop Navigation Links Placed to the Right */}
              <nav 
                id="main-desktop-navigation-bar" 
                aria-label="Portal Services Navigation"
                className="hidden xl:flex items-center gap-1.5 bg-stone-100/90 p-1.5 rounded-2xl border border-stone-200/90 shadow-2xs"
              >
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isRecentActivity = item.isRecent && (currentPath.includes('tab=recent-activity') || (typeof window !== 'undefined' && window.location.search.includes('tab=recent-activity')));
                  const isActive = !isRecentActivity && (
                    currentPath === item.path || 
                    (item.path !== '/' && currentPath.startsWith(item.path)) ||
                    (item.path === '/maha-bus-women-card' && (currentPath.includes('women-bus-card') || currentPath.includes('bus-card') || currentPath.includes('maha-bus'))) ||
                    (item.path === '/vehicle-information' && (currentPath.includes('vehicle-search') || currentPath.includes('vehicle-info') || currentPath.includes('vehicle-information') || currentPath.includes('vahan'))) ||
                    (item.path === '/services' && currentPath.includes('service-detail'))
                  );

                  const activeNow = isRecentActivity || isActive;

                  return (
                    <button
                      key={item.path}
                      id={`nav-link-${item.path.replace(/[\/?=]/g, '-') || 'home'}`}
                      onClick={() => handleNavClick(item.path)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all relative flex items-center gap-1.5 cursor-pointer ${
                        activeNow
                          ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-sm shadow-orange-500/25 border border-amber-500 scale-102'
                          : 'text-stone-800 hover:text-stone-950 hover:bg-white bg-transparent border border-transparent'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${activeNow ? 'text-white' : 'text-stone-500'}`} />
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className={`text-[10px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded-full ${
                          activeNow 
                            ? 'bg-white/20 text-white border border-white/30' 
                            : item.isRecent 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-orange-100 text-orange-900 border border-orange-300/80'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Language Switcher Dropdown */}
              <LanguageSwitcher />

              {/* Citizen Cloud Database Button */}
              <button
                id="nav-database-btn"
                type="button"
                onClick={() => setDatabaseModalOpen(true)}
                title="Citizen Cloud Database (Firestore Stored Data)"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold cursor-pointer shadow-xs transition-colors"
              >
                <Database className="w-4 h-4 text-blue-600" />
                <span>{language === 'hi' ? 'डेटाबेस' : 'Database'}</span>
              </button>

              {/* Quick Search Button */}
              <button
                id="nav-quick-search-btn"
                onClick={() => {
                  if (onOpenSearch) onOpenSearch();
                  else handleNavClick('/services');
                }}
                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border border-stone-200 bg-stone-100 hover:bg-stone-200/80 text-stone-700 text-xs font-semibold cursor-pointer transition-colors"
                title="Search services (Ctrl+K)"
              >
                <Search className="w-4 h-4 text-stone-500" />
                <span className="hidden 2xl:inline">{t.searchPlaceholder.slice(0, 16)}...</span>
                <kbd className="bg-white px-1.5 py-0.5 rounded border border-stone-300 text-[10px] text-stone-600 font-mono">
                  Ctrl K
                </kbd>
              </button>

              {/* User Profile / Google Sign-in Dropdown */}
              <UserMenu
                onNavigate={handleNavClick}
                onSelectService={(serviceId) => {
                  if (onSelectService) onSelectService(serviceId);
                  else onNavigate(`/service-detail?id=${serviceId}`);
                }}
              />

              {/* Mobile Hamburger Toggle */}
              <button
                id="nav-mobile-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2.5 rounded-xl text-stone-800 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 border border-stone-300 focus:outline-none cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t-2 border-amber-500/40 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2">
            <div className="mb-3 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenSearch) onOpenSearch();
                    else onNavigate('/services');
                  }}
                  readOnly
                  className="w-full pl-9 pr-3 py-2 text-xs bg-stone-100 rounded-xl border border-stone-200 cursor-pointer text-stone-700"
                />
              </div>
              <button
                onClick={() => setDatabaseModalOpen(true)}
                className="p-2 text-blue-600 bg-blue-50 border border-blue-200 rounded-xl text-xs font-bold"
                title="Database"
              >
                <Database className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isRecentActivity = item.isRecent && (currentPath.includes('tab=recent-activity') || (typeof window !== 'undefined' && window.location.search.includes('tab=recent-activity')));
                const isActive = !isRecentActivity && (
                  currentPath === item.path || 
                  (item.path !== '/' && currentPath.startsWith(item.path)) ||
                  (item.path === '/maha-bus-women-card' && (currentPath.includes('women-bus-card') || currentPath.includes('bus-card') || currentPath.includes('maha-bus'))) ||
                  (item.path === '/vehicle-information' && (currentPath.includes('vehicle-search') || currentPath.includes('vehicle-info') || currentPath.includes('vehicle-information') || currentPath.includes('vahan'))) ||
                  (item.path === '/services' && currentPath.includes('service-detail'))
                );
                const activeNow = isRecentActivity || isActive;

                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between cursor-pointer transition-colors ${
                      activeNow
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-stone-800 hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${activeNow ? 'text-white' : 'text-stone-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        activeNow ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-900 border border-orange-200'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Citizen Database Modal */}
      <CitizenDatabaseModal
        isOpen={databaseModalOpen}
        onClose={() => setDatabaseModalOpen(false)}
        onNavigate={handleNavClick}
      />
    </>
  );
};
