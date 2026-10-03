import React, { useState, useMemo } from 'react';
import { 
  HeartHandshake, 
  Sparkles, 
  ShieldCheck, 
  Coins, 
  Building2, 
  PhoneCall, 
  ArrowRight, 
  Search, 
  Filter, 
  ExternalLink, 
  CheckCircle2, 
  Baby, 
  GraduationCap, 
  Landmark, 
  Flame, 
  Home, 
  HeartPulse, 
  Info,
  Bookmark,
  Clock,
  Banknote,
  AlertTriangle,
  FileCheck2,
  Lock,
  CreditCard,
  QrCode
} from 'lucide-react';
import { EService } from '../types';
import { SERVICES_DATA } from '../data/servicesData';
import { ServiceCard } from '../components/ServiceCard';
import { useAuth } from '../context/AuthContext';

interface WomenServicesPageProps {
  onNavigate: (path: string) => void;
  onSelectService: (slugOrId: string) => void;
}

export const WomenServicesPage: React.FC<WomenServicesPageProps> = ({
  onNavigate,
  onSelectService
}) => {
  const { user, setAuthModalOpen } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('All');
  
  // Interactive Eligibility Finder State
  const [eligibilityCategory, setEligibilityCategory] = useState<'all' | 'maternity' | 'girlchild' | 'business' | 'safety' | 'subsidies'>('all');

  // Filter women services
  const womenServices = useMemo(() => {
    return SERVICES_DATA.filter((s) => s.category === 'Women Welfare' || s.isWomenService);
  }, []);

  const filteredServices = useMemo(() => {
    return womenServices.filter((service) => {
      // Subcategory / Tag matching
      let matchesCategory = true;
      if (selectedSubcategory === 'Maternity & Nutrition') {
        matchesCategory = service.id.includes('pmmvy') || service.title.includes('Matru') || service.category === 'Health';
      } else if (selectedSubcategory === 'Girl Child Savings & Education') {
        matchesCategory = service.id.includes('sukanya') || service.id.includes('beti') || service.id.includes('scholarship');
      } else if (selectedSubcategory === 'Business & Loans') {
        matchesCategory = service.id.includes('stand-up') || service.id.includes('mahila-samman') || service.title.includes('Loan');
      } else if (selectedSubcategory === 'Safety & Grievance Aid') {
        matchesCategory = service.id.includes('ncw') || service.id.includes('one-stop');
      } else if (selectedSubcategory === 'Housing & Free LPG') {
        matchesCategory = service.id.includes('sakhi-working') || service.id.includes('ujjwala');
      }

      // Search query
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        service.title.toLowerCase().includes(q) ||
        service.shortDescription.toLowerCase().includes(q) ||
        service.documents.some((d) => d.toLowerCase().includes(q)) ||
        service.eligibility.some((e) => e.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [womenServices, selectedSubcategory, searchQuery]);

  const womenSubcategories = [
    { id: 'All', label: 'All Women Schemes', icon: HeartHandshake, count: womenServices.length },
    { id: 'Maternity & Nutrition', label: 'Maternity DBT (₹6,000)', icon: Baby, count: 1 },
    { id: 'Girl Child Savings & Education', label: 'Sukanya (8.2% SSY)', icon: Coins, count: 1 },
    { id: 'Business & Loans', label: 'Loans & MSSC (₹1 Cr)', icon: Landmark, count: 2 },
    { id: 'Safety & Grievance Aid', label: 'NCW Helpline 24/7', icon: ShieldCheck, count: 2 },
    { id: 'Housing & Free LPG', label: 'Sakhi Niwas & Ujjwala', icon: Home, count: 2 }
  ];

  const emergencyHelplines = [
    { number: '7827170170', title: 'NCW 24/7 Helpline', desc: 'National Commission for Women round-the-clock emergency support' },
    { number: '181', title: 'Women in Distress', desc: 'Single-window national helpline for legal, counseling & police aid' },
    { number: '112', title: 'National Emergency', desc: 'All-in-one police, fire, and ambulance instant dispatch' },
    { number: '1091', title: 'Women Police Helpline', desc: 'Direct anti-eve teasing and emergency patrol assistance' },
    { number: '1930', title: 'Cyber Crime Helpline', desc: 'Report cyber harassment, identity theft, and online financial fraud' }
  ];

  return (
    <div className="space-y-10 sm:space-y-14 pb-16 bg-[#FAF7F2]/40">
      {/* 1. Dedicated Women Section Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 text-white pt-10 sm:pt-16 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 rounded-b-3xl sm:rounded-b-[2.5rem] shadow-xl border-b border-stone-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f43f5e10_1px,transparent_1px),linear-gradient(to_bottom,#f43f5e10_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-5 sm:space-y-7 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs sm:text-sm font-bold backdrop-blur-md shadow-inner">
            <HeartHandshake className="w-4 h-4 text-rose-400" />
            <span>Mission Shakti • Women & Child Empowerment E-Services</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Women Welfare & Citizen Schemes{' '}
              <span className="bg-gradient-to-r from-rose-400 via-amber-300 to-orange-400 text-transparent bg-clip-text">
                Central Portal
              </span>
            </h1>
            <p className="text-xs sm:text-base text-stone-300 max-w-2xl mx-auto leading-relaxed">
              Complete government guides for Maternity Cash Benefits (PMMVY ₹6,000), Sukanya Samriddhi 8.2% Savings, Stand-Up India ₹1 Crore Business Loans, Free Ujjwala 2.0 LPG, and 24/7 NCW Safety Grievance Support.
            </p>
          </div>

          {/* Quick Search & Subcategory Bar */}
          <div className="bg-white p-2.5 sm:p-3.5 rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200 flex flex-col sm:flex-row gap-2.5 max-w-3xl mx-auto text-stone-800">
            <div className="relative flex-1 flex items-center">
              <Search className="w-5 h-5 text-stone-400 absolute left-4 pointer-events-none" />
              <input
                id="women-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search PMMVY, Sukanya Samriddhi, Mahila Samman, Stand-Up loans..."
                className="w-full pl-11 pr-4 py-3 sm:py-3.5 text-xs sm:text-sm text-stone-900 placeholder-stone-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 bg-stone-50/90"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-xs text-stone-400 hover:text-stone-700 bg-stone-200 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
                >
                  ×
                </button>
              )}
            </div>

            <button
              onClick={() => onNavigate('/tracker')}
              className="px-5 py-3 sm:py-3.5 bg-gradient-to-r from-rose-600 via-amber-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
            >
              <Clock className="w-4 h-4" />
              <span>Track Application ARN</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Key Benefit Categories Summary Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div 
            onClick={() => setSelectedSubcategory('Maternity & Nutrition')}
            className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-2xs hover:border-rose-300 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Baby className="w-5 h-5" />
            </div>
            <div className="mt-3">
              <div className="text-base sm:text-lg font-black text-stone-900">₹6,000 Maternity</div>
              <div className="text-xs text-stone-500 font-medium">PMMVY Direct DBT to Mother</div>
            </div>
          </div>

          <div 
            onClick={() => setSelectedSubcategory('Girl Child Savings & Education')}
            className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-2xs hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Coins className="w-5 h-5" />
            </div>
            <div className="mt-3">
              <div className="text-base sm:text-lg font-black text-stone-900">8.2% Sukanya (SSY)</div>
              <div className="text-xs text-stone-500 font-medium">100% Sovereign Tax-Free</div>
            </div>
          </div>

          <div 
            onClick={() => setSelectedSubcategory('Business & Loans')}
            className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-2xs hover:border-orange-300 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-800 border border-orange-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Landmark className="w-5 h-5" />
            </div>
            <div className="mt-3">
              <div className="text-base sm:text-lg font-black text-stone-900">₹1 Cr Stand-Up Loan</div>
              <div className="text-xs text-stone-500 font-medium">Women Entrepreneurship</div>
            </div>
          </div>

          <div 
            onClick={() => setSelectedSubcategory('Safety & Grievance Aid')}
            className="bg-gradient-to-br from-rose-900 via-rose-950 to-stone-900 p-4 sm:p-5 rounded-2xl text-white shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-white/15 text-rose-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="mt-3">
              <div className="text-sm font-bold text-white flex items-center gap-1">
                24/7 Helpline 181 <ArrowRight className="w-3.5 h-3.5 text-rose-200" />
              </div>
              <div className="text-[11px] text-rose-200/90 font-normal">NCW 7827170170 & Sakhi</div>
            </div>
          </div>
        </div>
      </section>

      {/* Spotlight: Maharashtra Women Bus Card Service Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-700 via-orange-800 to-stone-950 text-white p-6 sm:p-8 shadow-xl border-2 border-amber-500/40">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400" />
          <div className="absolute -right-6 -bottom-8 opacity-10 pointer-events-none text-8xl font-black">
            MSRTC
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Maharashtra Government Dedicated Scheme • Mahila Samman Yojana</span>
              </div>
              <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                MSRTC Women Bus Concession Card (महिला बस कार्ड)
              </h3>
              <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                Avail 50% fare concession on all MSRTC ordinary, semi-luxury (Asiad) & Shivshahi buses across Maharashtra. Apply online, generate your digital smart card with verified QR code, or renew an existing pass.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-amber-200/90 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>50% Flat Concession</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>100% Free for Seniors (75+ Yrs)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-amber-300" />
                  <span>Digital Pass with QR Code</span>
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => onNavigate('/women-bus-card')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs sm:text-sm shadow-lg cursor-pointer transition-transform hover:scale-102 flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Open Women Bus Card Portal</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/women-bus-card')}
                className="w-full sm:w-auto px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 cursor-pointer transition-colors flex items-center justify-center gap-2"
              >
                <span>Track Status / Renew</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Subcategory Filter Tabs with Symbols */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-rose-700 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-rose-500" />
              <span>Dedicated Citizen Services</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
              Government Schemes for Women
            </h2>
          </div>

          <div className="text-xs font-semibold text-stone-600 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200 w-max">
            Showing {filteredServices.length} schemes
          </div>
        </div>

        {/* Subcategory Tabs with Tab Symbols */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {womenSubcategories.map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedSubcategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedSubcategory(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-xs'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200/90'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-stone-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Services Grid */}
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
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-xs max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <Search className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-stone-900 text-base">No women schemes found</h3>
              <p className="text-xs sm:text-sm text-stone-500">
                Try selecting &quot;All Women Schemes&quot; or clear the search keyword.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSubcategory('All');
              }}
              className="px-4 py-2 bg-gradient-to-r from-rose-600 to-amber-600 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* 4. Interactive Quick Eligibility & Recommendation Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-stone-800 space-y-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-400/30">
              <FileCheck2 className="w-3.5 h-3.5" /> Quick Scheme Matching Guide
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              Which Scheme is Right for You or Your Family?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Select your primary goal to see the exact recommended government scheme and direct entitlement:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-stone-800/80 p-5 rounded-2xl border border-stone-700/80 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                  <Baby className="w-4 h-4" /> Expecting or New Mother
                </div>
                <h4 className="font-extrabold text-white text-base">PMMVY (₹5,000–₹6,000 DBT)</h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Direct cash transfer in mother&apos;s bank account after 1 antenatal checkup & child vaccination.
                </p>
              </div>
              <button
                onClick={() => onSelectService('pmmvy-maternity-benefit')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-300 hover:text-white pt-2 cursor-pointer"
              >
                <span>View PMMVY Guide & Checklist</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-stone-800/80 p-5 rounded-2xl border border-stone-700/80 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <Coins className="w-4 h-4" /> Girl Child under 10 Years
                </div>
                <h4 className="font-extrabold text-white text-base">Sukanya Samriddhi (SSY 8.2%)</h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Open account at Post Office with min ₹250. Highest sovereign interest with 100% tax exemption under 80C.
                </p>
              </div>
              <button
                onClick={() => onSelectService('sukanya-samriddhi-yojana')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-white pt-2 cursor-pointer"
              >
                <span>View Sukanya Samriddhi Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-stone-800/80 p-5 rounded-2xl border border-stone-700/80 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                  <Landmark className="w-4 h-4" /> Starting Business / Self-Employed
                </div>
                <h4 className="font-extrabold text-white text-base">Stand-Up India (₹10L–₹1 Cr)</h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Bank loans for manufacturing, services, or trading greenfield projects with SIDBI credit guarantee.
                </p>
              </div>
              <button
                onClick={() => onSelectService('stand-up-india-women')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 hover:text-white pt-2 cursor-pointer"
              >
                <span>View Stand-Up India Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 24/7 National Emergency & Safety Directory for Women */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 uppercase tracking-wider">
                <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
                <span>Immediate Safety & Rapid Relief Directory</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-stone-900">
                24/7 Citizen Emergency & Women Safety Helplines
              </h3>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full w-max flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Toll-Free & Active Nationwide
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {emergencyHelplines.map((item) => (
              <div
                key={item.number}
                className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2 hover:border-rose-300 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-stone-900 text-sm">{item.title}</span>
                    <a
                      href={`tel:${item.number}`}
                      className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-mono font-bold text-xs flex items-center gap-1 shadow-2xs"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>{item.number}</span>
                    </a>
                  </div>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 flex items-start gap-3 text-xs text-stone-700">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-950 font-bold">One Stop Centres (Sakhi) across All Districts:</strong> If facing acute crisis or domestic violence, walk directly into the nearest District Civil Hospital One Stop Centre for free emergency medical aid, police reporting, counseling, and 5-day safe temporary shelter.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
