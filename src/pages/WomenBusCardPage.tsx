import React, { useState, useEffect, useMemo } from 'react';
import { 
  HeartHandshake, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  Search, 
  Plus, 
  Filter, 
  Download, 
  Printer, 
  RefreshCw, 
  Calendar, 
  User, 
  Phone, 
  MapPin, 
  Sparkles, 
  Building2, 
  FileText, 
  QrCode, 
  Eye, 
  ArrowRight, 
  Upload, 
  Check, 
  ChevronRight,
  ExternalLink,
  Info
} from 'lucide-react';
import { WomenBusCardApplication, WomenBusCardStatus, WomenConcessionType } from '../types';
import { 
  MAHARASHTRA_DISTRICTS, 
  MSRTC_DEPOTS, 
  SAMPLE_WOMEN_BUS_CARDS 
} from '../data/maharashtraData';
import { DigitalWomenBusCard } from '../components/DigitalWomenBusCard';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  subscribeUserWomenBusCards, 
  saveUserWomenBusCard, 
  renewWomenBusCard 
} from '../lib/firebase';
import { recordServiceAccess } from '../lib/activityService';

interface WomenBusCardPageProps {
  onNavigate: (path: string) => void;
  onSelectService?: (slugOrId: string) => void;
}

export const WomenBusCardPage: React.FC<WomenBusCardPageProps> = ({
  onNavigate,
  onSelectService
}) => {
  const { language, t } = useLanguage();
  const { user, setAuthModalOpen } = useAuth();

  // Cards State: Seeded initially with sample applications, then synced with Firestore / LocalStorage
  const [cards, setCards] = useState<WomenBusCardApplication[]>(() => {
    try {
      const saved = localStorage.getItem('msrtc_women_bus_cards');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return SAMPLE_WOMEN_BUS_CARDS;
  });

  // Track service access
  useEffect(() => {
    recordServiceAccess({
      id: 'msrtc-women-bus-card',
      title: 'MSRTC Women Bus Card (Mahila Samman Pass)',
      category: 'Women Welfare',
      department: 'Maharashtra State Road Transport Corporation (MSRTC)',
      shortDescription: 'Official Maharashtra 50% concession digital bus pass for women passengers.',
      officialUrl: 'https://msrtc.maharashtra.gov.in/'
    }, user?.uid);
  }, [user]);

  // Sync to Firestore if user logged in
  useEffect(() => {
    if (!user) return;
    const unsub = subscribeUserWomenBusCards(user.uid, (firestoreCards) => {
      if (firestoreCards && firestoreCards.length > 0) {
        setCards((prev) => {
          // Merge firestore cards with local list
          const combined = [...firestoreCards];
          prev.forEach((p) => {
            if (!combined.some((c) => c.id === p.id)) {
              combined.push(p);
            }
          });
          return combined;
        });
      }
    });
    return () => unsub();
  }, [user]);

  // Save to localStorage whenever cards change
  useEffect(() => {
    try {
      localStorage.setItem('msrtc_women_bus_cards', JSON.stringify(cards));
    } catch {}
  }, [cards]);

  // UI Navigation / Filter state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'apply' | 'track' | 'guidelines'>('dashboard');
  const [statusFilter, setStatusFilter] = useState<'All' | WomenBusCardStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Track Status query
  const [trackQuery, setTrackQuery] = useState('');
  const [trackResult, setTrackResult] = useState<WomenBusCardApplication | null>(null);
  const [trackError, setTrackError] = useState('');

  // Selected Card for Modal Viewer / Print
  const [selectedCardForView, setSelectedCardForView] = useState<WomenBusCardApplication | null>(null);
  const [submittedApplication, setSubmittedApplication] = useState<WomenBusCardApplication | null>(null);
  const [womenDeclarationAccepted, setWomenDeclarationAccepted] = useState(true);
  const [isRenewing, setIsRenewing] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Sync initial tab from URL query if present (?tab=apply or ?tab=track)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'apply') {
      setActiveTab('apply');
    } else if (tabParam === 'track' || tabParam === 'status') {
      setActiveTab('track');
    }
  }, []);

  // Form State for Application
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '1996-06-15',
    mobileNumber: '',
    email: '',
    street: '',
    cityOrTaluka: '',
    district: 'Pune',
    pincode: '',
    idProofType: 'Aadhaar Card' as 'Aadhaar Card' | 'Voter ID' | 'PAN Card' | 'Ration Card',
    idProofNumber: '',
    photographUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    emergencyName: '',
    emergencyRelation: 'Spouse',
    emergencyPhone: '',
    concessionType: 'Mahila Samman (50% Concession)' as WomenConcessionType,
    depotOffice: 'Pune Swargate Depot',
    instantApproval: true
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preset avatar samples for photograph
  const avatarPresets = [
    { label: 'Option 1', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80' },
    { label: 'Option 2', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' },
    { label: 'Option 3', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
    { label: 'Option 4', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80' }
  ];

  // Filtered cards list
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const matchStatus = statusFilter === 'All' || card.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        card.fullName.toLowerCase().includes(q) ||
        (card.cardId && card.cardId.toLowerCase().includes(q)) ||
        card.id.toLowerCase().includes(q) ||
        card.address.district.toLowerCase().includes(q) ||
        card.mobileNumber.includes(q);

      return matchStatus && matchSearch;
    });
  }, [cards, statusFilter, searchQuery]);

  // Calculate age from date of birth
  const computedAge = useMemo(() => {
    if (!formData.dateOfBirth) return 0;
    const dob = new Date(formData.dateOfBirth);
    const diffMs = Date.now() - dob.getTime();
    const ageDate = new Date(diffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }, [formData.dateOfBirth]);

  // Handle local photo file upload
  const handlePhotoUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Selected photo must be smaller than 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormData((prev) => ({
          ...prev,
          photographUrl: event.target!.result as string
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Form Validation
  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      errs.fullName = 'Full Name must be at least 3 letters long as per Govt ID.';
    }
    if (!formData.mobileNumber.trim() || !/^\d{10}$/.test(formData.mobileNumber.replace(/\D/g, ''))) {
      errs.mobileNumber = 'Please enter a valid 10-digit mobile number.';
    }
    if (!formData.street.trim()) {
      errs.street = 'Street or locality address is required.';
    }
    if (!formData.cityOrTaluka.trim()) {
      errs.cityOrTaluka = 'Taluka or City is required.';
    }
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode.trim())) {
      errs.pincode = 'Valid 6-digit Maharashtra postal pincode is required.';
    }
    if (!formData.idProofNumber.trim()) {
      errs.idProofNumber = 'Document verification number is required.';
    }
    if (!formData.emergencyName.trim()) {
      errs.emergencyName = 'Emergency contact person name is required.';
    }
    if (!formData.emergencyPhone.trim() || !/^\d{10}$/.test(formData.emergencyPhone.replace(/\D/g, ''))) {
      errs.emergencyPhone = 'Valid 10-digit emergency contact phone is required.';
    }
    if (!womenDeclarationAccepted) {
      errs.declaration = 'Please confirm the declaration confirming female citizen eligibility.';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit Application Form
  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate verification delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newIdNum = Math.floor(10000 + Math.random() * 90000);
      const appId = `WBC-2025-${newIdNum}`;
      const cardNum = `MSRTC-WBC-MH-${newIdNum}`;

      const now = new Date();
      const validUntilDate = new Date();
      validUntilDate.setFullYear(validUntilDate.getFullYear() + 2); // 2 years validity
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const formatDisplayDate = (d: Date) => 
        `${String(d.getDate()).padStart(2, '0')}-${months[d.getMonth()]}-${d.getFullYear()}`;

      const newCard: WomenBusCardApplication = {
        id: appId,
        cardId: cardNum,
        fullName: formData.fullName.trim(),
        dateOfBirth: formData.dateOfBirth,
        age: computedAge,
        mobileNumber: formData.mobileNumber.trim(),
        email: formData.email.trim() || `${formData.fullName.toLowerCase().replace(/\s+/g, '.') || 'user'}@citizen.msrtc`,
        address: {
          street: formData.street.trim(),
          cityOrTaluka: formData.cityOrTaluka.trim(),
          district: formData.district,
          pincode: formData.pincode.trim(),
          state: 'Maharashtra'
        },
        idProofType: formData.idProofType,
        idProofNumber: formData.idProofNumber.trim(),
        photographUrl: formData.photographUrl,
        emergencyContact: {
          name: formData.emergencyName.trim(),
          relationship: formData.emergencyRelation,
          phoneNumber: formData.emergencyPhone.trim()
        },
        concessionType: formData.concessionType,
        status: formData.instantApproval ? 'Approved' : 'Pending',
        appliedDate: now.toISOString().split('T')[0],
        verifiedDate: formData.instantApproval ? formatDisplayDate(now) : undefined,
        validFrom: formData.instantApproval ? formatDisplayDate(now) : undefined,
        validUntil: formData.instantApproval ? formatDisplayDate(validUntilDate) : undefined,
        depotOffice: formData.depotOffice,
        qrPayload: `https://transport.maharashtra.gov.in/verify?card=${cardNum}&name=${encodeURIComponent(formData.fullName.trim())}&status=${formData.instantApproval ? 'Approved' : 'Pending'}`,
        userId: user?.uid,
        updatedAt: now.toISOString()
      };

      // Save locally
      const updated = [newCard, ...cards];
      setCards(updated);

      // Save to Firestore if signed in
      if (user) {
        await saveUserWomenBusCard(user.uid, newCard).catch((err) => {
          console.warn('Firestore sync optional:', err);
        });
      }

      setSuccessToast(`Application ${appId} submitted successfully! Reference Number: ${appId}`);
      setSubmittedApplication(newCard);

      // Reset form
      setFormData({
        fullName: '',
        dateOfBirth: '1996-06-15',
        mobileNumber: '',
        email: '',
        street: '',
        cityOrTaluka: '',
        district: 'Pune',
        pincode: '',
        idProofType: 'Aadhaar Card',
        idProofNumber: '',
        photographUrl: avatarPresets[0].url,
        emergencyName: '',
        emergencyRelation: 'Spouse',
        emergencyPhone: '',
        concessionType: 'Mahila Samman (50% Concession)',
        depotOffice: 'Pune Swargate Depot',
        instantApproval: true
      });
    } catch (err: any) {
      console.error('Error submitting application:', err);
      alert('Error creating bus card. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Track Status
  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError('');
    setTrackResult(null);

    const q = trackQuery.trim().toUpperCase();
    if (!q) {
      setTrackError('Please enter a Card ID or Application Reference Number.');
      return;
    }

    const found = cards.find(
      (c) =>
        c.id.toUpperCase() === q ||
        (c.cardId && c.cardId.toUpperCase() === q) ||
        c.mobileNumber.replace(/\D/g, '') === q.replace(/\D/g, '')
    );

    if (found) {
      setTrackResult(found);
    } else {
      setTrackError(`No application record found for "${trackQuery}". Please verify the Card ID or apply for a new pass.`);
    }
  };

  // Handle Renew Card
  const handleRenewCard = async (cardIdToRenew: string) => {
    setIsRenewing(true);
    try {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 2);
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const validUntil = `${String(futureDate.getDate()).padStart(2, '0')}-${months[futureDate.getMonth()]}-${futureDate.getFullYear()}`;

      const updated = cards.map((c) => {
        if (c.id === cardIdToRenew || c.cardId === cardIdToRenew) {
          return {
            ...c,
            status: 'Approved' as WomenBusCardStatus,
            validUntil,
            qrPayload: `https://transport.maharashtra.gov.in/verify?card=${c.cardId || c.id}&name=${encodeURIComponent(c.fullName)}&status=Approved`,
            updatedAt: new Date().toISOString()
          };
        }
        return c;
      });

      setCards(updated);

      if (user) {
        await renewWomenBusCard(user.uid, cardIdToRenew, 2).catch(() => {});
      }

      const renewedCard = updated.find((c) => c.id === cardIdToRenew || c.cardId === cardIdToRenew);
      if (renewedCard) {
        setSelectedCardForView(renewedCard);
      }
      setSuccessToast('Bus Card validity successfully renewed for 2 years!');
    } catch (err) {
      console.error('Error renewing card:', err);
    } finally {
      setIsRenewing(false);
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen pb-16">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-700 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 border border-emerald-500">
          <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{successToast}</span>
          <button 
            type="button" 
            onClick={() => setSuccessToast(null)}
            className="ml-2 text-emerald-200 hover:text-white font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Hero Header: Maharashtra Transport Themed */}
      <section className="relative overflow-hidden bg-gradient-to-r from-amber-700 via-orange-800 to-stone-950 text-white py-10 px-4 sm:px-6 lg:px-8 shadow-md">
        {/* Tricolor & MSRTC strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-300 to-emerald-600" />
        
        {/* Background decorative patterns */}
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <div className="w-72 h-72 rounded-full border-12 border-amber-300 flex items-center justify-center font-black text-8xl text-amber-200">
            MSRTC
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold tracking-wide">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>{t.wbcBadge}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                {t.wbcTitle}
              </h1>
              <p className="text-sm sm:text-base text-amber-100/90 max-w-3xl leading-relaxed">
                {t.wbcSubtitle}. {language === 'mr' ? 'सर्व साध्या, निमआराम (आशियाड) व शिवशाही बसेसमध्ये ५०% तिकीट सवलतीसाठी अधिकृत डिजिटल स्मार्ट पास.' : 'Avail 50% fare concession or free senior travel across all MSRTC ordinary, semi-luxury & Shivshahi buses in Maharashtra.'}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                id="btn-wbc-apply-top"
                onClick={() => setActiveTab('apply')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs sm:text-sm font-extrabold shadow-md cursor-pointer transition-transform hover:scale-102"
              >
                <Plus className="w-4 h-4" />
                <span>{t.wbcApplyBtn}</span>
              </button>

              <button
                type="button"
                id="btn-wbc-track-top"
                onClick={() => setActiveTab('track')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900/80 hover:bg-stone-900 text-stone-200 border border-amber-500/40 text-xs sm:text-sm font-bold cursor-pointer transition-colors"
              >
                <Search className="w-4 h-4 text-amber-400" />
                <span>{t.wbcTrackBtn}</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-amber-500/20 text-xs">
            <div className="p-3 rounded-xl bg-black/25 border border-amber-500/20">
              <span className="text-stone-300 block text-[11px] uppercase font-bold">Fare Concession</span>
              <span className="text-xl font-black text-amber-300">50% Flat</span>
              <span className="text-[10px] text-stone-400 block mt-0.5">All MSRTC Standard Buses</span>
            </div>
            <div className="p-3 rounded-xl bg-black/25 border border-amber-500/20">
              <span className="text-stone-300 block text-[11px] uppercase font-bold">Senior Women (75+ Yrs)</span>
              <span className="text-xl font-black text-emerald-400">100% Free</span>
              <span className="text-[10px] text-stone-400 block mt-0.5">Amrit Jyeshtha Scheme</span>
            </div>
            <div className="p-3 rounded-xl bg-black/25 border border-amber-500/20">
              <span className="text-stone-300 block text-[11px] uppercase font-bold">Smart Digital Pass</span>
              <span className="text-xl font-black text-amber-200">QR Code</span>
              <span className="text-[10px] text-stone-400 block mt-0.5">Instant Conductor ETM Scan</span>
            </div>
            <div className="p-3 rounded-xl bg-black/25 border border-amber-500/20">
              <span className="text-stone-300 block text-[11px] uppercase font-bold">Pass Validity</span>
              <span className="text-xl font-black text-white">2 Years</span>
              <span className="text-[10px] text-stone-400 block mt-0.5">Renewable Online & Depots</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex border-b border-stone-200 overflow-x-auto gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'dashboard'
                ? 'border-amber-600 text-amber-900 bg-amber-50/50 rounded-t-xl'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <CreditCard className="w-4 h-4 text-amber-600" />
            <span>{language === 'mr' ? 'माझे बस कार्ड्स' : 'My Bus Cards'} ({cards.length})</span>
          </button>

          <button
            type="button"
            id="tab-apply-card"
            onClick={() => setActiveTab('apply')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'apply'
                ? 'border-amber-600 text-amber-900 bg-amber-50/50 rounded-t-xl'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Plus className="w-4 h-4 text-amber-600" />
            <span>{t.wbcApplyBtn}</span>
          </button>

          <button
            type="button"
            id="tab-track-status"
            onClick={() => setActiveTab('track')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'track'
                ? 'border-amber-600 text-amber-900 bg-amber-50/50 rounded-t-xl'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Search className="w-4 h-4 text-amber-600" />
            <span>{t.wbcTrackBtn}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guidelines')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'guidelines'
                ? 'border-amber-600 text-amber-900 bg-amber-50/50 rounded-t-xl'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Info className="w-4 h-4 text-amber-600" />
            <span>{language === 'mr' ? 'योजना नियम व मार्गदर्शक' : 'Scheme Guidelines'}</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Dashboard / Cards List */}
      {activeTab === 'dashboard' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
          {/* Filters & Search Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {(['All', 'Approved', 'Pending', 'Expired', 'Rejected'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {st === 'All' ? 'All Cards' :
                   st === 'Approved' ? t.wbcStatusApproved :
                   st === 'Pending' ? t.wbcStatusPending :
                   st === 'Expired' ? t.wbcStatusExpired : t.wbcStatusRejected}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Name, Card ID, District..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 outline-none"
              />
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCards.map((card) => {
              const isApproved = card.status === 'Approved';
              const isPending = card.status === 'Pending';
              const isExpired = card.status === 'Expired';
              const isRejected = card.status === 'Rejected';

              return (
                <div
                  key={card.id}
                  className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  {/* Top Bar with Status */}
                  <div className="p-4 bg-gradient-to-r from-stone-900 to-amber-950 text-white flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-amber-300 font-bold block">
                        {card.cardId || `APP-${card.id}`}
                      </span>
                      <span className="text-xs font-bold text-stone-200">
                        {card.concessionType.split('(')[0]}
                      </span>
                    </div>

                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                      isApproved ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40' :
                      isPending ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40' :
                      isExpired ? 'bg-rose-500/20 text-rose-300 border border-rose-400/40' :
                      'bg-stone-500/20 text-stone-300'
                    }`}>
                      {isApproved && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                      {isPending && <Clock className="w-3 h-3 text-amber-400" />}
                      {isExpired && <AlertCircle className="w-3 h-3 text-rose-400" />}
                      {isRejected && <XCircle className="w-3 h-3 text-red-400" />}
                      <span>{card.status}</span>
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                      <img
                        src={card.photographUrl}
                        alt={card.fullName}
                        className="w-14 h-16 rounded-xl object-cover border border-amber-400/40 shadow-xs bg-stone-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-stone-900 text-sm sm:text-base truncate">
                          {card.fullName}
                        </h4>
                        <p className="text-xs text-stone-500 font-medium">
                          Age: {card.age} Yrs • DOB: {card.dateOfBirth}
                        </p>
                        <p className="text-xs text-stone-600 font-mono mt-0.5">
                          {card.mobileNumber}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-stone-100 text-stone-600">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-400 block">District</span>
                        <span className="font-medium text-stone-800">{card.address.district}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-400 block">Validity</span>
                        <span className={`font-semibold font-mono ${isExpired ? 'text-rose-600' : 'text-emerald-700'}`}>
                          {card.validUntil || 'Pending Approval'}
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80 text-[11px] text-amber-950 flex items-center justify-between">
                      <span className="font-bold">MSRTC Depot:</span>
                      <span className="text-stone-700">{card.depotOffice || 'Maharashtra ST'}</span>
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCardForView(card)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-600" />
                      <span>{t.wbcViewCardBtn}</span>
                    </button>

                    {isExpired ? (
                      <button
                        type="button"
                        onClick={() => handleRenewCard(card.id)}
                        disabled={isRenewing}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isRenewing ? 'animate-spin' : ''}`} />
                        <span>{t.wbcRenewBtn}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedCardForView(card)}
                        className="inline-flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                        title="Download / Print"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Print</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCards.length === 0 && (
            <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-md mx-auto space-y-3">
              <CreditCard className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="font-bold text-stone-800 text-base">No Bus Cards Found</h3>
              <p className="text-xs text-stone-500">
                No cards matched your filter. Apply for a new Women Bus Card to get your instant QR-enabled digital pass.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('apply')}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold cursor-pointer hover:bg-amber-700"
              >
                <Plus className="w-4 h-4" />
                <span>Apply for Women Bus Card</span>
              </button>
            </div>
          )}
        </main>
      )}

      {/* Tab 2: Application Form */}
      {activeTab === 'apply' && (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="border-b border-stone-200 pb-4">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-700">
                <Sparkles className="w-4 h-4" />
                <span>MSRTC Official Application Portal</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
                {language === 'mr' ? 'नवीन महिला बस सवलत कार्ड अर्ज' : 'Apply for Maharashtra Women Bus Card'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
                Fill the applicant details below to generate your unique Maharashtra Women Bus Card ID and instant QR-coded smart pass.
              </p>
            </div>

            <form onSubmit={handleSubmitApplication} className="space-y-6">
              {/* Concession Scheme Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-800 block">
                  {t.wbcConcessionTypeLabel} <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: 'Mahila Samman (50% Concession)',
                      title: 'Mahila Samman Scheme (50% Fare Concession)',
                      desc: 'Eligible for all female residents in Maharashtra on Ordinary, Asiad & Shivshahi buses.'
                    },
                    {
                      id: 'Amrit Jyeshtha Nagrik (100% Free - 75+ Yrs)',
                      title: 'Amrit Jyeshtha Nagrik (100% Free Travel)',
                      desc: 'Eligible for senior citizen women aged 75 years and above.'
                    },
                    {
                      id: 'Working Women Smart Pass',
                      title: 'Working Women Monthly Route Pass',
                      desc: 'Dedicated daily commute pass for women employees with express boarding.'
                    },
                    {
                      id: 'Girl Student Special Concession',
                      title: 'Girl Student Bus Concession Pass',
                      desc: 'Subsidized school and college education travel pass across state.'
                    }
                  ].map((scheme) => (
                    <label
                      key={scheme.id}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                        formData.concessionType === scheme.id
                          ? 'border-amber-600 bg-amber-50/60 shadow-xs'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="concessionType"
                        value={scheme.id}
                        checked={formData.concessionType === scheme.id}
                        onChange={() => setFormData({ ...formData, concessionType: scheme.id as any })}
                        className="mt-1 text-amber-600 focus:ring-amber-500"
                      />
                      <div>
                        <span className="text-xs font-bold text-stone-900 block leading-snug">
                          {scheme.title}
                        </span>
                        <span className="text-[11px] text-stone-600 mt-0.5 block leading-relaxed">
                          {scheme.desc}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Personal Details */}
              <div className="space-y-4 pt-2 border-t border-stone-100">
                <h3 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-600" />
                  <span>Applicant Personal Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      {t.wbcFullNameLabel} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g., Anjali Ramesh Patil"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
                        formErrors.fullName ? 'border-rose-500 focus:ring-rose-200' : 'border-stone-300 focus:ring-amber-500/30 focus:border-amber-600'
                      }`}
                    />
                    {formErrors.fullName && (
                      <p className="text-[11px] text-rose-600 mt-1">{formErrors.fullName}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        {t.wbcDobLabel} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        Computed Age
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={`${computedAge} Years`}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-100 text-xs font-semibold text-stone-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      {t.wbcMobileLabel} (for SMS Alerts) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.mobileNumber}
                      onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                      placeholder="10-digit mobile number (e.g., 9822144510)"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
                        formErrors.mobileNumber ? 'border-rose-500 focus:ring-rose-200' : 'border-stone-300 focus:ring-amber-500/30 focus:border-amber-600'
                      }`}
                    />
                    {formErrors.mobileNumber && (
                      <p className="text-[11px] text-rose-600 mt-1">{formErrors.mobileNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g., anjali.patil@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600"
                    />
                  </div>
                </div>
              </div>

              {/* Residential Address in Maharashtra */}
              <div className="space-y-4 pt-2 border-t border-stone-100">
                <h3 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <span>Residential Address in Maharashtra</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Street / House No. / Society / Village <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      placeholder="e.g., Flat 402, Shivshahi Enclave, Sinhagad Road"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
                        formErrors.street ? 'border-rose-500 focus:ring-rose-200' : 'border-stone-300 focus:ring-amber-500/30 focus:border-amber-600'
                      }`}
                    />
                    {formErrors.street && (
                      <p className="text-[11px] text-rose-600 mt-1">{formErrors.street}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Taluka / City <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.cityOrTaluka}
                      onChange={(e) => setFormData({ ...formData, cityOrTaluka: e.target.value })}
                      placeholder="e.g., Haveli / Pune City"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
                        formErrors.cityOrTaluka ? 'border-rose-500 focus:ring-rose-200' : 'border-stone-300 focus:ring-amber-500/30 focus:border-amber-600'
                      }`}
                    />
                    {formErrors.cityOrTaluka && (
                      <p className="text-[11px] text-rose-600 mt-1">{formErrors.cityOrTaluka}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Maharashtra District <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600"
                    >
                      {MAHARASHTRA_DISTRICTS.map((dist) => (
                        <option key={dist} value={dist}>{dist}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Pincode <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      placeholder="6-digit pincode (e.g., 411051)"
                      maxLength={6}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
                        formErrors.pincode ? 'border-rose-500 focus:ring-rose-200' : 'border-stone-300 focus:ring-amber-500/30 focus:border-amber-600'
                      }`}
                    />
                    {formErrors.pincode && (
                      <p className="text-[11px] text-rose-600 mt-1">{formErrors.pincode}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Preferred MSRTC Depot for Physical Card Pickup (Optional)
                    </label>
                    <select
                      value={formData.depotOffice}
                      onChange={(e) => setFormData({ ...formData, depotOffice: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600"
                    >
                      {MSRTC_DEPOTS.map((depot) => (
                        <option key={depot} value={depot}>{depot}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* ID Verification Details */}
              <div className="space-y-4 pt-2 border-t border-stone-100">
                <h3 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>ID Verification & Eligibility Proof</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      {t.wbcIdProofLabel} <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.idProofType}
                      onChange={(e) => setFormData({ ...formData, idProofType: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600"
                    >
                      <option value="Aadhaar Card">Aadhaar Card (UIDAI)</option>
                      <option value="Voter ID">Voter ID / e-EPIC</option>
                      <option value="PAN Card">PAN Card (Income Tax)</option>
                      <option value="Ration Card">Maharashtra Smart Ration Card</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      {t.wbcIdNumberLabel} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.idProofNumber}
                      onChange={(e) => setFormData({ ...formData, idProofNumber: e.target.value })}
                      placeholder="e.g., 9482-1029-4412 or EPIC ID"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
                        formErrors.idProofNumber ? 'border-rose-500 focus:ring-rose-200' : 'border-stone-300 focus:ring-amber-500/30 focus:border-amber-600'
                      }`}
                    />
                    {formErrors.idProofNumber && (
                      <p className="text-[11px] text-rose-600 mt-1">{formErrors.idProofNumber}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Exclusive Scheme for Women Users Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200/90 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <HeartHandshake className="w-5 h-5 text-amber-100" />
                </div>
                <div className="space-y-0.5 text-xs text-amber-950">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-amber-900 text-sm">
                      Exclusive Scheme for Women Citizens (केवळ महिला नागरिकांसाठी)
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-black uppercase tracking-wider">
                      Female Only
                    </span>
                  </div>
                  <p className="text-stone-700 leading-relaxed text-[11px]">
                    Under Government of Maharashtra resolution and MSRTC Mahila Samman Scheme, all female passengers traveling in ordinary, semi-luxury (Asiad), and Shivshahi buses receive 50% fare concession (or 100% free travel for senior women aged 75+ under Amrit Jyeshtha).
                  </p>
                </div>
              </div>

              {/* Photograph Selection & Preview */}
              <div className="space-y-4 pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-600" />
                    <span>Applicant Photograph (Photo Upload) <span className="text-rose-500">*</span></span>
                  </h3>
                  <span className="text-[11px] text-stone-500 font-medium">Clear front-facing passport photo</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="relative shrink-0">
                    <img
                      src={formData.photographUrl}
                      alt="Applicant Preview"
                      className="w-24 h-28 rounded-2xl object-cover border-2 border-amber-600 shadow-md bg-stone-200"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-amber-600 text-white rounded-full p-1 border border-white">
                      <Check className="w-3 h-3" />
                    </div>
                  </div>

                  <div className="space-y-3 text-center sm:text-left flex-1">
                    <div>
                      <span className="text-xs font-bold text-stone-800 block mb-1.5">
                        Upload photograph from your device or camera:
                      </span>
                      <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                        <input
                          type="file"
                          id="applicant-photo-upload-input"
                          accept="image/*"
                          onChange={handlePhotoUploadFile}
                          className="hidden"
                        />
                        <label
                          htmlFor="applicant-photo-upload-input"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Choose Photo File</span>
                        </label>
                        <span className="text-[11px] text-stone-500">
                          (PNG, JPG, WebP up to 5MB)
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-200/80">
                      <span className="text-[11px] font-semibold text-stone-600 block mb-1">
                        Or select sample photo / paste image URL:
                      </span>
                      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                        {avatarPresets.map((preset, idx) => (
                          <button
                            key={preset.url}
                            type="button"
                            onClick={() => setFormData({ ...formData, photographUrl: preset.url })}
                            className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-transform cursor-pointer hover:scale-105 ${
                              formData.photographUrl === preset.url ? 'border-amber-600 ring-2 ring-amber-400' : 'border-stone-300 opacity-70'
                            }`}
                            title={`Sample photo ${idx + 1}`}
                          >
                            <img src={preset.url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="url"
                          value={formData.photographUrl}
                          onChange={(e) => setFormData({ ...formData, photographUrl: e.target.value })}
                          placeholder="Or paste direct image URL (https://...)"
                          className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs w-full max-w-sm outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-4 pt-2 border-t border-stone-100">
                <h3 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-rose-600" />
                  <span>Emergency Contact Details (Required on Bus Card)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Contact Person Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.emergencyName}
                      onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                      placeholder="e.g., Ramesh Patil"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
                        formErrors.emergencyName ? 'border-rose-500 focus:ring-rose-200' : 'border-stone-300 focus:ring-amber-500/30 focus:border-amber-600'
                      }`}
                    />
                    {formErrors.emergencyName && (
                      <p className="text-[11px] text-rose-600 mt-1">{formErrors.emergencyName}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Relationship <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.emergencyRelation}
                      onChange={(e) => setFormData({ ...formData, emergencyRelation: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600"
                    >
                      <option value="Spouse">Spouse / पती</option>
                      <option value="Father">Father / वडील</option>
                      <option value="Mother">Mother / आई</option>
                      <option value="Brother">Brother / भाऊ</option>
                      <option value="Sister">Sister / बहीण</option>
                      <option value="Son">Son / मुलगा</option>
                      <option value="Daughter">Daughter / मुलगी</option>
                      <option value="Guardian">Guardian / पालक</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Emergency Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.emergencyPhone}
                      onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                      placeholder="10-digit number"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
                        formErrors.emergencyPhone ? 'border-rose-500 focus:ring-rose-200' : 'border-stone-300 focus:ring-amber-500/30 focus:border-amber-600'
                      }`}
                    />
                    {formErrors.emergencyPhone && (
                      <p className="text-[11px] text-rose-600 mt-1">{formErrors.emergencyPhone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Women Citizen Eligibility Declaration */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-2">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="womenDeclarationCheckbox"
                    checked={womenDeclarationAccepted}
                    onChange={(e) => setWomenDeclarationAccepted(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <label htmlFor="womenDeclarationCheckbox" className="text-xs text-amber-950 cursor-pointer leading-relaxed">
                    <span className="font-extrabold text-amber-900 block">
                      Citizen Eligibility Declaration for Women Bus Concession Scheme <span className="text-rose-600">*</span>
                    </span>
                    <span className="text-stone-700 block mt-0.5">
                      I declare that the applicant is a female resident of Maharashtra applying under the MSRTC Mahila Samman Scheme for 50% bus concession or 100% free travel for senior citizens (75+ yrs). All information and uploaded documents are genuine.
                    </span>
                  </label>
                </div>
                {formErrors.declaration && (
                  <p className="text-[11px] text-rose-600 font-semibold pl-7">{formErrors.declaration}</p>
                )}
              </div>

              {/* Instant Verification Checkbox */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="instantApprovalCheck"
                  checked={formData.instantApproval}
                  onChange={(e) => setFormData({ ...formData, instantApproval: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <label htmlFor="instantApprovalCheck" className="text-xs text-stone-800 cursor-pointer">
                  <span className="font-bold block">Instant Digital Verification & QR Pass Generation (Recommended)</span>
                  <span className="text-stone-600 block mt-0.5">
                    Automatically verifies ID syntax against state registers and activates your Approved Women Bus Pass immediately. You can view, download, or print it right away.
                  </span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-submit-bus-card-app"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-700 hover:from-amber-700 hover:to-orange-700 text-white text-xs sm:text-sm font-extrabold shadow-md cursor-pointer transition-transform hover:scale-102 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Submit Application</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      )}

      {/* Tab 3: Track Status */}
      {activeTab === 'track' && (
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-stone-200 pb-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700 block">
                Real-Time Verification
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
                {language === 'mr' ? 'महिला बस कार्ड अर्जाची स्थिती तपासा' : 'Track Women Bus Card Application Status'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
                Enter your Application Reference Number (e.g. <span className="font-mono font-bold text-amber-800">WBC-2025-01048</span>), Card ID (<span className="font-mono font-bold text-amber-800">MSRTC-WBC-MH-94821</span>), or registered mobile number.
              </p>
            </div>

            <form onSubmit={handleTrackSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={trackQuery}
                    onChange={(e) => setTrackQuery(e.target.value)}
                    placeholder="Enter Card ID (e.g., MSRTC-WBC-MH-94821) or Mobile"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-stone-300 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 uppercase font-mono"
                  />
                </div>
                <button
                  type="submit"
                  id="btn-track-lookup"
                  className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-extrabold cursor-pointer transition-colors shadow-xs"
                >
                  Track Status
                </button>
              </div>

              {/* Sample quick buttons for user convenience */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-stone-500">
                <span>Try sample numbers:</span>
                {['WBC-2025-01048', 'MSRTC-WBC-MH-55209', 'WBC-2025-03810'].map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => {
                      setTrackQuery(sample);
                    }}
                    className="text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded font-mono text-[11px] cursor-pointer"
                  >
                    {sample}
                  </button>
                ))}
              </div>

              {trackError && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{trackError}</span>
                </div>
              )}
            </form>

            {/* Track Result Display */}
            {trackResult && (
              <div className="mt-6 pt-6 border-t border-stone-200 space-y-4">
                <div className="p-4 rounded-2xl bg-stone-900 text-white flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider block">
                      Application Found
                    </span>
                    <h3 className="text-base sm:text-lg font-bold">
                      {trackResult.fullName}
                    </h3>
                    <p className="text-xs text-stone-300 font-mono">
                      Card ID: {trackResult.cardId || `APP-${trackResult.id}`} • Ref: {trackResult.id}
                    </p>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    trackResult.status === 'Approved' ? 'bg-emerald-500 text-white' :
                    trackResult.status === 'Pending' ? 'bg-amber-500 text-stone-950' :
                    trackResult.status === 'Expired' ? 'bg-rose-500 text-white' : 'bg-stone-500 text-white'
                  }`}>
                    {trackResult.status}
                  </span>
                </div>

                {/* Timeline stages */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                  <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wide">
                    Application Milestone Timeline
                  </h4>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xs font-bold">✓</div>
                      <div className="text-xs">
                        <span className="font-bold text-stone-900 block">Application Form Submitted</span>
                        <span className="text-stone-500 text-[11px]">Applied on {trackResult.appliedDate} via Online Portal</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        trackResult.status === 'Approved' || trackResult.status === 'Expired' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-stone-900'
                      }`}>
                        {trackResult.status === 'Approved' || trackResult.status === 'Expired' ? '✓' : '●'}
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-stone-900 block">ID & Residential Verification</span>
                        <span className="text-stone-500 text-[11px]">
                          {trackResult.status === 'Approved'
                            ? `Verified by MSRTC Division (${trackResult.depotOffice})`
                            : 'Scrutiny of Aadhaar / Voter ID under progress by Divisional Transport Office'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        trackResult.status === 'Approved' ? 'bg-emerald-600 text-white' :
                        trackResult.status === 'Expired' ? 'bg-rose-600 text-white' : 'bg-stone-300 text-stone-600'
                      }`}>
                        {trackResult.status === 'Approved' ? '✓' : trackResult.status === 'Expired' ? '!' : '3'}
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-stone-900 block">Digital Smart Card Issuance</span>
                        <span className="text-stone-500 text-[11px]">
                          {trackResult.status === 'Approved'
                            ? `Active & Valid until ${trackResult.validUntil}`
                            : trackResult.status === 'Expired'
                              ? `Pass expired on ${trackResult.validUntil}. Renewal is due.`
                              : 'Pending final division approval'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedCardForView(trackResult)}
                    className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold cursor-pointer transition-colors text-center"
                  >
                    View & Print Digital Pass
                  </button>

                  {trackResult.status === 'Expired' && (
                    <button
                      type="button"
                      onClick={() => handleRenewCard(trackResult.id)}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors"
                    >
                      Renew Pass
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      )}

      {/* Tab 4: Guidelines */}
      {activeTab === 'guidelines' && (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
                Official Government Resolution
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
                {language === 'mr' ? 'महिला सन्मान योजना – नियम व अटी' : 'MSRTC Mahila Samman Scheme Guidelines & FAQ'}
              </h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-950">
                <h4 className="font-black text-sm mb-1 text-amber-900">What is the Mahila Samman Scheme?</h4>
                <p>
                  In accordance with the Government of Maharashtra budget declaration, MSRTC (Maharashtra State Road Transport Corporation) extends a 50% fare concession on ticket pricing to all female passengers traveling within Maharashtra state borders.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-2">
                  <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Eligible Bus Types</span>
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-stone-600">
                    <li>Ordinary / Lal Dabba (लाल परी) buses</li>
                    <li>Semi-Luxury / Asiad (निमआराम) buses</li>
                    <li>Shivshahi AC & Non-AC buses</li>
                    <li>City buses operated by MSRTC</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-2">
                  <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Mandatory Documents</span>
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-stone-600">
                    <li>Valid Proof of Identity (Aadhaar, Voter ID, PAN, Ration Card)</li>
                    <li>Proof of Age (for Amrit Jyeshtha 75+ free scheme)</li>
                    <li>Recent Passport-size photograph</li>
                    <li>Emergency contact mobile number</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-stone-200 space-y-2">
                <h4 className="font-bold text-stone-900">How to use the Digital Card while traveling?</h4>
                <p className="text-xs text-stone-600">
                  When boarding any MSRTC bus or booking tickets at the ST depot counter, present the digital QR card on your mobile phone or carry a printed copy. The bus conductor will scan the QR code using their Electronic Ticketing Machine (ETM) to verify validity and issue your 50% discounted ticket instantly.
                </p>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Modal: View & Print Digital Bus Card */}
      {selectedCardForView && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative border border-stone-200 my-8">
            <button
              type="button"
              onClick={() => setSelectedCardForView(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100 cursor-pointer"
              title="Close"
            >
              ✕
            </button>

            <DigitalWomenBusCard
              card={selectedCardForView}
              onRenew={handleRenewCard}
              onClose={() => setSelectedCardForView(null)}
              isRenewing={isRenewing}
            />
          </div>
        </div>
      )}

      {/* Modal: Application Submission Acknowledgement with Reference Number */}
      {submittedApplication && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-stone-200 text-center space-y-5 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner border border-emerald-300">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 block">
                MSRTC Official Acknowledgement
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-stone-900">
                Application Submitted!
              </h3>
              <p className="text-xs text-stone-600">
                Your Maha.Bus Women Card application has been registered successfully.
              </p>
            </div>

            {/* Reference Number Box */}
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-dashed border-amber-300 space-y-2">
              <span className="text-[10px] uppercase font-extrabold text-amber-800 tracking-wider block">
                Application Reference Number
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-xl sm:text-2xl font-black text-amber-950 tracking-wider">
                  {submittedApplication.id}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(submittedApplication.id);
                    setSuccessToast('Reference number copied to clipboard!');
                  }}
                  className="p-1.5 rounded-lg bg-white border border-amber-300 text-amber-800 hover:bg-amber-100 cursor-pointer shadow-2xs"
                  title="Copy Reference Number"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
              <div className="text-[11px] text-stone-600 font-mono">
                Official Card ID: <span className="font-bold text-stone-900">{submittedApplication.cardId || `APP-${submittedApplication.id}`}</span>
              </div>
            </div>

            {/* Applicant Details Summary */}
            <div className="text-xs text-stone-600 space-y-1.5 text-left bg-stone-50 p-3.5 rounded-xl border border-stone-200">
              <div className="flex justify-between">
                <span className="text-stone-500">Applicant Name:</span>
                <span className="font-bold text-stone-900">{submittedApplication.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Mobile Number:</span>
                <span className="font-mono font-medium text-stone-800">{submittedApplication.mobileNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Concession Scheme:</span>
                <span className="font-medium text-stone-800">{submittedApplication.concessionType.split('(')[0]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Current Status:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{submittedApplication.status}</span>
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                id="btn-view-digital-card-after-app"
                onClick={() => {
                  const card = submittedApplication;
                  setSubmittedApplication(null);
                  setSelectedCardForView(card);
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-extrabold text-xs sm:text-sm cursor-pointer shadow-md transition-transform hover:scale-102 flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>View & Download Digital Card</span>
              </button>

              <button
                type="button"
                id="btn-check-status-after-app"
                onClick={() => {
                  const refId = submittedApplication.id;
                  setSubmittedApplication(null);
                  setTrackQuery(refId);
                  setActiveTab('track');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs cursor-pointer border border-stone-300 flex items-center justify-center gap-1.5"
              >
                <Search className="w-4 h-4 text-amber-700" />
                <span>Check Application / Card Status</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSubmittedApplication(null);
                  setActiveTab('dashboard');
                }}
                className="w-full text-xs text-stone-500 hover:text-stone-800 py-1 cursor-pointer"
              >
                Close & Go to My Bus Cards
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
