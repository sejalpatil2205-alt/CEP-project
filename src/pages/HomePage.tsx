import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Sparkles, 
  ShieldCheck, 
  Car, 
  CreditCard, 
  Globe, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  ExternalLink, 
  Layers, 
  Landmark,
  Building2,
  HeartPulse,
  GraduationCap,
  Plane,
  Zap,
  Tag,
  HeartHandshake,
  Clock,
  Baby,
  Coins,
  FileText,
  ShieldAlert,
  PhoneCall,
  Scale,
  Receipt,
  ChevronRight,
  Info
} from 'lucide-react';
import { EService, ServiceCategory } from '../types';
import { SERVICES_DATA, CATEGORIES } from '../data/servicesData';
import { ServiceCard } from '../components/ServiceCard';
import { useLanguage } from '../context/LanguageContext';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onSelectService: (slugOrId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectService }) => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('All');

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Women Welfare': return HeartHandshake;
      case 'Vehicle Services': return Car;
      case 'Government': return Landmark;
      case 'Banking': return Building2;
      case 'Health': return HeartPulse;
      case 'Education': return GraduationCap;
      case 'Travel': return Plane;
      case 'Utilities': return Zap;
      default: return Globe;
    }
  };

  // Filtered services based on search and category
  const filteredServices = useMemo(() => {
    return SERVICES_DATA.filter((service) => {
      const matchesCategory =
        selectedCategory === 'All' || service.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        service.title.toLowerCase().includes(q) ||
        service.shortDescription.toLowerCase().includes(q) ||
        service.category.toLowerCase().includes(q) ||
        service.documents.some((d) => d.toLowerCase().includes(q)) ||
        service.department?.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  // Popular highlighted services
  const popularServices = useMemo(() => {
    return SERVICES_DATA.filter((s) => s.isPopular).slice(0, 4);
  }, []);

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      {/* 1. Hero Section - Professional Clean Government Portal */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50 border-b border-slate-200/80 pt-10 sm:pt-16 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8">
        {/* Subtle decorative background lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        
        {/* Tricolor accent bar */}
        <div className="max-w-7xl mx-auto flex items-center justify-center mb-6">
          <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-orange-600 font-bold">{t.portalTitle}</span>
            <span className="text-slate-400">•</span>
            <span>{t.portalSubtitle}</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {t.portalTitle}
            </h1>
            <p className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-blue-700 bg-clip-text text-transparent">
              {t.portalSubtitle}
            </p>
            <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed pt-1">
              {t.portalTagline}
            </p>
          </div>

          {/* Unified Search & Category Bar */}
          <div className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-2.5 max-w-3xl mx-auto text-slate-800">
            {/* Search Input */}
            <div className="relative flex-1 flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                id="home-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-11 pr-4 py-3 sm:py-3.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-xs text-slate-400 hover:text-slate-700 bg-slate-200 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
                >
                  ×
                </button>
              )}
            </div>

            {/* Category Dropdown */}
            <div className="relative md:w-56 flex items-center">
              <Filter className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <select
                id="home-category-dropdown"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as ServiceCategory)}
                className="w-full pl-9 pr-8 py-3 sm:py-3.5 text-xs sm:text-sm font-medium text-slate-800 rounded-xl bg-slate-100 hover:bg-slate-200/80 focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? t.allCategories : (cat === 'Women Welfare' ? t.navWomenWelfare : (cat === 'Vehicle Services' ? t.navVehicleHub : cat))}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 pointer-events-none text-slate-400 text-xs">
                ▼
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => onNavigate('/services')}
              className="px-6 py-3 sm:py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
            >
              <span>{t.browseCatalog}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Keywords Strip */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-slate-500">
            <span className="font-semibold text-slate-600">{t.quickAccess}</span>
            {[
              { label: t.card1Opt1, id: 'fastag-recharge' },
              { label: t.card2Opt1, id: 'echallan-payment' },
              { label: t.card3Opt1, path: '/women-services' },
              { label: language === 'hi' ? 'पीएमएमवीवाई ₹6,000' : 'PMMVY ₹6,000 DBT', id: 'pmmvy-maternity-benefit' },
              { label: language === 'hi' ? 'सुकन्या समृद्धि' : 'Sukanya Samriddhi', id: 'sukanya-samriddhi-yojana' },
              { label: language === 'hi' ? 'ड्राइविंग लाइसेंस' : 'Driving License', id: 'driving-license-sarathi' }
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  if (item.path) onNavigate(item.path);
                  else if (item.id) onSelectService(item.id);
                  else setSearchQuery(item.label);
                }}
                className="bg-white hover:bg-slate-100 text-slate-700 hover:text-blue-700 px-3 py-1 rounded-lg border border-slate-200 shadow-2xs transition-colors cursor-pointer text-xs font-medium"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* MAHARASHTRA TRANSPORT DEDICATED SPOTLIGHT (Women Bus Card + Vehicle Search) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {/* Card A: Women Bus Card (MSRTC Mahila Samman) */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-700 via-orange-800 to-stone-950 text-white p-6 sm:p-7 shadow-xl border-2 border-amber-500/50 flex flex-col justify-between group">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400" />
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-extrabold border border-amber-400/40">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>MSRTC Mahila Samman Yojana</span>
                </span>
                <span className="text-xs font-black bg-white/20 text-white px-2.5 py-0.5 rounded-full">
                  50% Off Pass
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {language === 'mr' ? 'महा.बस महिला कार्ड (Maha.Bus Women Card)' : 'Maha.Bus Women Card'}
              </h3>
              <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                {language === 'mr' 
                  ? 'सर्व एस.टी. (MSRTC) बसेसमध्ये ५०% तिकीट सवलतीसाठी किंवा ज्येष्ठ महिलांना १००% मोफत प्रवासासाठी डिजिटल पास मिळवा.' 
                  : 'Apply for the official 50% bus concession smart pass or 100% free senior travel on all MSRTC ordinary, Asiad & Shivshahi buses.'}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-amber-200">
                <span className="flex items-center gap-1">✓ Instant QR Pass</span>
                <span className="text-amber-500">•</span>
                <span className="flex items-center gap-1">✓ Track Status</span>
                <span className="text-amber-500">•</span>
                <span className="flex items-center gap-1">✓ Download & Print</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-amber-500/30 flex items-center justify-between gap-3 relative z-10">
              <button
                type="button"
                id="btn-home-apply-maha-bus"
                onClick={() => onNavigate('/maha-bus-women-card?tab=apply')}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs sm:text-sm shadow-md cursor-pointer transition-transform hover:scale-102 flex items-center justify-center gap-2"
              >
                <span>{language === 'mr' ? 'महा.बस महिला कार्ड अर्ज' : 'Apply for Maha.Bus Women Card'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                id="btn-home-track-maha-bus"
                onClick={() => onNavigate('/maha-bus-women-card?tab=track')}
                className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 cursor-pointer transition-colors"
              >
                {language === 'mr' ? 'स्थिती तपासा' : 'Check Status'}
              </button>
            </div>
          </div>

          {/* Card B: Vehicle Information Search (MH RTO Vahan) */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 text-white p-6 sm:p-7 shadow-xl border-2 border-stone-700 flex flex-col justify-between group">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-amber-300 to-emerald-500" />
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-extrabold border border-blue-400/40">
                  <Car className="w-3.5 h-3.5" />
                  <span>MH RTO Public Vahan Register</span>
                </span>
                <span className="text-xs font-black bg-white/20 text-white px-2.5 py-0.5 rounded-full">
                  50 RTO Offices
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {language === 'mr' ? 'वाहन माहिती (Vehicle Information)' : 'Vehicle Information'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {language === 'mr'
                  ? 'महाराष्ट्र वाहन क्रमांक प्रविष्ट करा (उदा. MH12AB1234) आणि फिटनेस, विमा, पीयूसी व नोंदणी पडताळणी एका क्लिकवर करा.'
                  : 'Enter any Maharashtra vehicle number (e.g. MH12AB1234) to check statutory roadworthiness, fitness status, insurance, and PUC certificate compliance.'}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-stone-300">
                <span className="flex items-center gap-1">✓ Privacy Protected</span>
                <span className="text-stone-500">•</span>
                <span className="flex items-center gap-1">✓ Fitness & Validity</span>
                <span className="text-stone-500">•</span>
                <span className="flex items-center gap-1">✓ Insurance & PUC</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-stone-800 flex items-center justify-between gap-3 relative z-10">
              <button
                type="button"
                id="btn-home-search-vehicle-info"
                onClick={() => onNavigate('/vehicle-information')}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-black text-xs sm:text-sm shadow-md cursor-pointer transition-transform hover:scale-102 flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>{language === 'mr' ? 'वाहन शोधा (उदा. MH12AB1234)' : 'Search Vehicle (e.g. MH12AB1234)'}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/vehicle-dashboard')}
                className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 cursor-pointer transition-colors"
              >
                FASTag / Garage
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE 3 EQUAL-SIZED SERVICE CARDS IN ONE ROW (Primary Highlight) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-4 mb-8 sm:mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>{t.prioritySectionTag}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.prioritySectionTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            {t.prioritySectionSubtitle}
          </p>
        </div>

        {/* 3 EQUAL-SIZED CARDS IN ONE ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* ============================================================== */}
          {/* CARD 1: FASTag Services */}
          {/* ============================================================== */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 p-6 sm:p-7 flex flex-col justify-between h-full group">
            <div className="flex-1 flex flex-col">
              {/* Top Row: Orange Accent Icon + Category Tags (Blue secondary element) */}
              <div className="flex items-start justify-between gap-3">
                <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200/80 text-orange-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                  <Tag className="w-6 h-6" />
                </div>
                {/* Category tags: Vehicle Services | All India */}
                <div className="flex flex-wrap items-center gap-1.5 justify-end">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    {language === 'hi' ? 'वाहन सेवाएं' : 'Vehicle Services'}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    {language === 'hi' ? 'अखिल भारतीय' : 'All India'}
                  </span>
                </div>
              </div>

              {/* Title: Dark navy/black heading */}
              <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-snug mt-5 group-hover:text-blue-900 transition-colors">
                {t.card1Title}
              </h3>

              {/* Description: Light grey description */}
              <p className="text-sm text-slate-500 leading-relaxed mt-2.5">
                {t.card1Desc}
              </p>

              {/* Options List */}
              <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-2">
                  {t.includedServicesLabel}
                </div>
                
                {/* Option 1: FASTag Recharge */}
                <button
                  onClick={() => onSelectService('fastag-recharge')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/70 hover:border-blue-200 text-left transition-colors cursor-pointer group/item"
                >
                  <span className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800 group-hover/item:text-blue-700">
                    <CreditCard className="w-4 h-4 text-orange-500" />
                    <span>{t.card1Opt1}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/item:text-blue-600 transition-transform group-hover/item:translate-x-0.5" />
                </button>

                {/* Option 2: FASTag Balance Check */}
                <button
                  onClick={() => onSelectService('fastag-balance-check')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/70 hover:border-blue-200 text-left transition-colors cursor-pointer group/item"
                >
                  <span className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800 group-hover/item:text-blue-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>{t.card1Opt2}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/item:text-blue-600 transition-transform group-hover/item:translate-x-0.5" />
                </button>

                {/* Option 3: Active/Blacklist Status */}
                <button
                  onClick={() => onNavigate('/vehicle-dashboard')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/70 hover:border-blue-200 text-left transition-colors cursor-pointer group/item"
                >
                  <span className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800 group-hover/item:text-blue-700">
                    <ShieldAlert className="w-4 h-4 text-orange-500" />
                    <span>{t.card1Opt3}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/item:text-blue-600 transition-transform group-hover/item:translate-x-0.5" />
                </button>

                {/* Option 4: Toll Transaction History */}
                <button
                  onClick={() => onNavigate('/vehicle-dashboard')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/70 hover:border-blue-200 text-left transition-colors cursor-pointer group/item"
                >
                  <span className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800 group-hover/item:text-blue-700">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>{t.card1Opt4}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/item:text-blue-600 transition-transform group-hover/item:translate-x-0.5" />
                </button>
              </div>
            </div>

            {/* Button: View Details & Guide → */}
            <div className="pt-6 mt-2">
              <button
                id="btn-fastag-card-details"
                onClick={() => onSelectService('fastag-recharge')}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors duration-200 shadow-2xs cursor-pointer"
              >
                <span>{t.viewDetailsBtn}</span>
                <ArrowRight className="w-4 h-4 text-orange-300" />
              </button>
            </div>
          </div>

          {/* ============================================================== */}
          {/* CARD 2: e-Challan Services */}
          {/* ============================================================== */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 p-6 sm:p-7 flex flex-col justify-between h-full group">
            <div className="flex-1 flex flex-col">
              {/* Top Row: Orange Accent Icon + Category Tags (Blue secondary element) */}
              <div className="flex items-start justify-between gap-3">
                <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200/80 text-orange-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                  <FileText className="w-6 h-6" />
                </div>
                {/* Category tags: Vehicle Services | All India */}
                <div className="flex flex-wrap items-center gap-1.5 justify-end">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    {language === 'hi' ? 'वाहन सेवाएं' : 'Vehicle Services'}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    {language === 'hi' ? 'अखिल भारतीय' : 'All India'}
                  </span>
                </div>
              </div>

              {/* Title: Dark navy/black heading */}
              <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-snug mt-5 group-hover:text-blue-900 transition-colors">
                {t.card2Title}
              </h3>

              {/* Description: Light grey description */}
              <p className="text-sm text-slate-500 leading-relaxed mt-2.5">
                {t.card2Desc}
              </p>

              {/* Options List */}
              <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-2">
                  {t.includedServicesLabel}
                </div>

                {/* Option 1: Check Challan */}
                <button
                  onClick={() => onSelectService('echallan-payment')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/70 hover:border-blue-200 text-left transition-colors cursor-pointer group/item"
                >
                  <span className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800 group-hover/item:text-blue-700">
                    <Search className="w-4 h-4 text-orange-500" />
                    <span>{t.card2Opt1}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/item:text-blue-600 transition-transform group-hover/item:translate-x-0.5" />
                </button>

                {/* Option 2: View Violation Details */}
                <button
                  onClick={() => onSelectService('echallan-payment')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/70 hover:border-blue-200 text-left transition-colors cursor-pointer group/item"
                >
                  <span className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800 group-hover/item:text-blue-700">
                    <Info className="w-4 h-4 text-blue-600" />
                    <span>{t.card2Opt2}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/item:text-blue-600 transition-transform group-hover/item:translate-x-0.5" />
                </button>

                {/* Option 3: Pay Traffic Fine */}
                <button
                  onClick={() => onSelectService('echallan-payment')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/70 hover:border-blue-200 text-left transition-colors cursor-pointer group/item"
                >
                  <span className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800 group-hover/item:text-blue-700">
                    <Receipt className="w-4 h-4 text-orange-500" />
                    <span>{t.card2Opt3}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/item:text-blue-600 transition-transform group-hover/item:translate-x-0.5" />
                </button>

                {/* Option 4: Maharashtra Vehicle Information Search */}
                <button
                  onClick={() => onNavigate('/vehicle-search')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-amber-50/60 hover:bg-amber-100/70 border border-amber-200/80 text-left transition-colors cursor-pointer group/item"
                >
                  <span className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800 group-hover/item:text-amber-900">
                    <Car className="w-4 h-4 text-orange-600" />
                    <span>MH Vehicle Info Search</span>
                  </span>
                  <span className="text-[10px] uppercase font-extrabold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                    MH RTO
                  </span>
                </button>
              </div>
            </div>

            {/* Button: View Details & Guide → */}
            <div className="pt-6 mt-2">
              <button
                id="btn-echallan-card-details"
                onClick={() => onSelectService('echallan-payment')}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors duration-200 shadow-2xs cursor-pointer"
              >
                <span>{t.viewDetailsBtn}</span>
                <ArrowRight className="w-4 h-4 text-orange-300" />
              </button>
            </div>
          </div>

          {/* ============================================================== */}
          {/* CARD 3: Women Welfare Services */}
          {/* ============================================================== */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 p-6 sm:p-7 flex flex-col justify-between h-full group">
            <div className="flex-1 flex flex-col">
              {/* Top Row: Orange Accent Icon + Category Tags (Blue secondary element) */}
              <div className="flex items-start justify-between gap-3">
                <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200/80 text-orange-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                {/* Category tags: Women Welfare | All India */}
                <div className="flex flex-wrap items-center gap-1.5 justify-end">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    {language === 'hi' ? 'महिला कल्याण' : 'Women Welfare'}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    {language === 'hi' ? 'अखिल भारतीय' : 'All India'}
                  </span>
                </div>
              </div>

              {/* Title: Dark navy/black heading */}
              <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-snug mt-5 group-hover:text-blue-900 transition-colors">
                {t.card3Title}
              </h3>

              {/* Description: Light grey description */}
              <p className="text-sm text-slate-500 leading-relaxed mt-2.5">
                {t.card3Desc}
              </p>

              {/* Options List */}
              <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-2">
                  {t.includedServicesLabel}
                </div>

                {/* Option 1: Women Bus Card (MSRTC Pass) */}
                <button
                  onClick={() => onNavigate('/women-bus-card')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200/90 text-left transition-colors cursor-pointer group/item"
                >
                  <span className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800 group-hover/item:text-amber-900">
                    <CreditCard className="w-4 h-4 text-orange-600" />
                    <span>{t.card3Opt1}</span>
                  </span>
                  <span className="text-[10px] uppercase font-extrabold bg-amber-200/80 text-amber-900 px-1.5 py-0.5 rounded">
                    50% Off
                  </span>
                </button>

                {/* Option 2: Track Bus Card Status */}
                <button
                  onClick={() => onNavigate('/women-bus-card')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/70 hover:border-blue-200 text-left transition-colors cursor-pointer group/item"
                >
                  <span className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800 group-hover/item:text-blue-700">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>{t.card3Opt2}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/item:text-blue-600 transition-transform group-hover/item:translate-x-0.5" />
                </button>

                {/* Option 3: Financial Assistance */}
                <button
                  onClick={() => onNavigate('/women-bus-card')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/70 hover:border-blue-200 text-left transition-colors cursor-pointer group/item"
                >
                  <span className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800 group-hover/item:text-blue-700">
                    <Coins className="w-4 h-4 text-orange-500" />
                    <span>{t.card3Opt3}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/item:text-blue-600 transition-transform group-hover/item:translate-x-0.5" />
                </button>

                {/* Option 4: Card Renewal & Verification */}
                <button
                  onClick={() => onNavigate('/women-bus-card')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/70 hover:border-blue-200 text-left transition-colors cursor-pointer group/item"
                >
                  <span className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800 group-hover/item:text-blue-700">
                    <Scale className="w-4 h-4 text-blue-600" />
                    <span>{t.card3Opt4}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/item:text-blue-600 transition-transform group-hover/item:translate-x-0.5" />
                </button>
              </div>
            </div>

            {/* Button: View Details & Guide → */}
            <div className="pt-6 mt-2">
              <button
                id="btn-women-card-details"
                onClick={() => onNavigate('/women-bus-card')}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-amber-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors duration-200 shadow-2xs cursor-pointer"
              >
                <span>{t.viewDetailsBtn}</span>
                <ArrowRight className="w-4 h-4 text-orange-300" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Key Portal Highlights & Trust Indicators */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-50/90 p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold text-slate-900">20+ E-Services</div>
              <div className="text-xs text-slate-500 font-normal">All India Central & State</div>
            </div>
          </div>

          <div className="bg-slate-50/90 p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold text-slate-900">100% Free Public Guide</div>
              <div className="text-xs text-slate-500 font-normal">No Hidden Fees</div>
            </div>
          </div>

          <div className="bg-slate-50/90 p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ExternalLink className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold text-slate-900">Direct .gov.in Links</div>
              <div className="text-xs text-slate-500 font-normal">Authorized Endpoints</div>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('/tracker')}
            className="bg-slate-900 hover:bg-slate-800 text-white p-4 sm:p-5 rounded-2xl shadow-2xs flex items-center gap-3 cursor-pointer transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-white/10 text-orange-300 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-1">
                Application Tracker <ArrowRight className="w-3.5 h-3.5 text-orange-300" />
              </div>
              <div className="text-xs text-slate-300 font-normal">Save & Check Status</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Complete Services Directory with Tabs & Search */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-slate-200/80 space-y-8">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
                <Globe className="w-3.5 h-3.5" />
                <span>Unified Directory Catalog</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Explore All National E-Services
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Browse government, banking, travel, utilities, and transport procedures
              </p>
            </div>

            {/* Results count */}
            <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200 w-max">
              Showing {filteredServices.length} of {SERVICES_DATA.length} services
            </div>
          </div>

          {/* Category Tabs Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const Icon = getCategoryIcon(cat);
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{cat === 'All' ? 'All Categories' : cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Services Cards Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onViewDetails={onSelectService}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mx-auto border border-orange-200">
              <Search className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-base">No services found</h3>
              <p className="text-xs sm:text-sm text-slate-500">
                We could not find any services matching &quot;{searchQuery}&quot; in &quot;{selectedCategory}&quot;.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* 5. Citizen Advisory & Cyber Safety Guidance */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-orange-600 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Official Citizen Advisory & Safety Guidelines</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              How to Avoid Fake Government E-Service Sites & Scams
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 font-black text-xs flex items-center justify-center">1</span>
                Check for .gov.in or .nic.in
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Official Indian government portals strictly end in <strong className="text-slate-800">.gov.in</strong> or <strong className="text-slate-800">.nic.in</strong>. Avoid portals ending in .com or .org demanding processing fees.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 font-black text-xs flex items-center justify-center">2</span>
                Never Share OTPs for Refunds
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                NHAI, Parivahan, or income tax departments never call or message asking for Aadhaar OTPs or UPI PINs to issue FASTag refunds or clear fines.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 font-black text-xs flex items-center justify-center">3</span>
                Digital Receipt Verification
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Always save the official Acknowledgement / Transaction Receipt with the Application Reference Number (ARN) for real-time tracking in our portal.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
