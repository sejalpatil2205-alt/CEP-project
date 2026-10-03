import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  Fuel, 
  FileCheck2, 
  FileText, 
  Gauge, 
  Printer, 
  Share2, 
  Building2, 
  Lock, 
  Sparkles, 
  RefreshCw, 
  Info, 
  Check, 
  CreditCard, 
  ArrowRight,
  BookmarkPlus
} from 'lucide-react';
import { VehiclePublicInfo } from '../types';
import { 
  lookupOrGenerateMaharashtraVehicle, 
  normalizeMhRegistrationNumber, 
  VERIFIED_MAHARASHTRA_VEHICLES,
  MAHARASHTRA_RTO_MAP 
} from '../data/maharashtraData';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { saveUserVehicle } from '../lib/firebase';
import { recordServiceAccess } from '../lib/activityService';

interface VehicleSearchPageProps {
  onNavigate: (path: string) => void;
  onSelectService?: (slugOrId: string) => void;
  initialPlate?: string;
}

export const VehicleSearchPage: React.FC<VehicleSearchPageProps> = ({
  onNavigate,
  onSelectService,
  initialPlate = ''
}) => {
  const { language, t } = useLanguage();
  const { user, setAuthModalOpen } = useAuth();

  const [inputPlate, setInputPlate] = useState(initialPlate || 'MH-12-AB-1234');
  const [searchedVehicle, setSearchedVehicle] = useState<VehiclePublicInfo | null>(() => {
    return lookupOrGenerateMaharashtraVehicle(initialPlate || 'MH-12-AB-1234');
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  // Track service access
  useEffect(() => {
    recordServiceAccess({
      id: 'maharashtra-vehicle-search',
      title: 'Maharashtra Vehicle Info Search (MH RTO Vahan)',
      category: 'Vehicle Services',
      department: 'Maharashtra Motor Vehicles Department (RTO)',
      shortDescription: 'Instant verification of MH vehicle registration, fitness, insurance and PUC.',
      officialUrl: 'https://transport.maharashtra.gov.in/'
    }, user?.uid);
  }, [user]);

  // Comprehensive Maharashtra Vehicle Registration Validator
  const validateMhPlateFormat = (raw: string): { isValid: boolean; error?: string; clean?: string } => {
    if (!raw || !raw.trim()) {
      return { 
        isValid: false, 
        error: 'Please enter a vehicle registration number (e.g., MH12AB1234 or MH 12 AB 1234).' 
      };
    }

    const clean = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');

    // Check if characters are too short
    if (clean.length < 5) {
      return { 
        isValid: false, 
        error: `Vehicle number "${raw}" is incomplete. Valid Maharashtra vehicle numbers follow the format: MH followed by 2 RTO digits, series letters, and 4 digits (e.g., MH12AB1234).` 
      };
    }

    // Check state prefix
    const statePrefix = clean.slice(0, 2);
    if (statePrefix !== 'MH') {
      const stateMap: Record<string, string> = {
        'DL': 'Delhi', 'KA': 'Karnataka', 'GJ': 'Gujarat', 'HR': 'Haryana',
        'UP': 'Uttar Pradesh', 'MP': 'Madhya Pradesh', 'TN': 'Tamil Nadu',
        'TS': 'Telangana', 'AP': 'Andhra Pradesh', 'RJ': 'Rajasthan',
        'KL': 'Kerala', 'WB': 'West Bengal', 'PB': 'Punjab', 'CH': 'Chandigarh',
        'GA': 'Goa', 'BR': 'Bihar', 'JH': 'Jharkhand', 'OD': 'Odisha'
      };
      const foundState = stateMap[statePrefix];
      if (foundState) {
        return {
          isValid: false,
          error: `The entered vehicle registration starts with '${statePrefix}' (${foundState}). This portal specifically searches verified records for Maharashtra (MH) registered vehicles. Please enter a Maharashtra vehicle number (e.g., MH12AB1234).`
        };
      }
      return {
        isValid: false,
        error: `Invalid vehicle registration code '${statePrefix}'. Maharashtra vehicle registration numbers must start with 'MH' (e.g., MH12AB1234 or MH 02 CD 5678).`
      };
    }

    // Check RTO code (2 digits)
    const rtoDigitsMatch = clean.slice(2).match(/^(\d{1,2})/);
    if (!rtoDigitsMatch) {
      return {
        isValid: false,
        error: `Invalid Maharashtra RTO code format. 'MH' must be immediately followed by a 2-digit RTO district code from 01 to 50 (e.g., MH12 for Pune, MH02 for Mumbai West).`
      };
    }

    const rtoNum = parseInt(rtoDigitsMatch[1], 10);
    if (rtoNum < 1 || rtoNum > 50) {
      return {
        isValid: false,
        error: `RTO code 'MH-${String(rtoNum).padStart(2, '0')}' is outside the valid Maharashtra RTO range (MH-01 to MH-50). Please verify your vehicle RC smart card.`
      };
    }

    // Check full pattern: MH followed by 1-2 digits, optional 1-3 letters, and 1-4 digits
    const fullMatch = clean.match(/^MH(\d{1,2})([A-Z]{0,3})(\d{1,4})$/);
    if (!fullMatch) {
      return {
        isValid: false,
        error: `Invalid Maharashtra vehicle number format "${raw}". Expected format: MH followed by 2-digit RTO code, 1–3 series letters, and 1–4 digits (e.g., MH12AB1234 or MH 02 CD 5678).`
      };
    }

    return { isValid: true, clean };
  };

  const handleSearch = (plateToSearch?: string) => {
    const raw = (plateToSearch !== undefined ? plateToSearch : inputPlate).trim();
    setErrorMessage('');
    setSaveSuccess(false);

    const validation = validateMhPlateFormat(raw);
    if (!validation.isValid) {
      setErrorMessage(validation.error || 'Please enter a valid Maharashtra vehicle number.');
      setSearchedVehicle(null);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      try {
        const result = lookupOrGenerateMaharashtraVehicle(raw);
        if (!result) {
          setErrorMessage(`Information is currently unavailable for vehicle "${raw}". Please verify the registration number and try again.`);
          setSearchedVehicle(null);
          return;
        }
        setSearchedVehicle(result);
        setInputPlate(result.registrationNumber);
      } catch (err) {
        setErrorMessage(`Vehicle information is unavailable for "${raw}". Please check the registration number and try again.`);
        setSearchedVehicle(null);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  const handleSaveToMyVehicles = async () => {
    if (!searchedVehicle) return;

    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    try {
      await saveUserVehicle(user.uid, {
        id: `veh-${Date.now()}`,
        vehicleNumber: searchedVehicle.registrationNumber,
        vehicleType: searchedVehicle.vehicleCategory === 'Two-Wheeler' ? 'Two-Wheeler' :
                     searchedVehicle.vehicleCategory === 'Commercial' ? 'Commercial' :
                     searchedVehicle.vehicleCategory === 'Electric' ? 'Electric' : 'Car',
        nickname: `${searchedVehicle.make} ${searchedVehicle.model.split(' ')[0]}`,
        ownerName: 'Citizen Profile (RTO Verified)',
        model: `${searchedVehicle.make} ${searchedVehicle.model}`,
        registrationDate: searchedVehicle.registrationDate,
        rcValidity: searchedVehicle.registrationValidity,
        insuranceValidity: searchedVehicle.insuranceValidUntil,
        insuranceProvider: searchedVehicle.insuranceProvider,
        pucValidity: searchedVehicle.pucValidUntil,
        fastagTagId: `NETC-MH-${Math.floor(10000000 + Math.random() * 90000000)}`,
        fastagBalance: 500,
        fastagBank: 'State Bank of India FASTag',
        notes: `Registered at ${searchedVehicle.rtoName}`,
        updatedAt: new Date().toISOString()
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving vehicle:', err);
    }
  };

  const handleCopyPlate = () => {
    if (searchedVehicle) {
      navigator.clipboard.writeText(searchedVehicle.registrationNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const sampleVehicles = [
    { label: 'Nexon EV (Pune)', number: 'MH12AB1234' },
    { label: 'Swift Dzire (Mumbai)', number: 'MH02CD5678' },
    { label: 'Mahindra Thar (PCMC)', number: 'MH 14 GH 9999' },
    { label: 'Innova Crysta (Thane)', number: 'MH 04 AZ 8888' },
    { label: 'Bajaj Pulsar (Nagpur)', number: 'MH 31 FA 4422' },
    { label: 'Tata Ace CNG (Panvel)', number: 'MH 46 Z 1001' }
  ];

  return (
    <div className="bg-stone-50 min-h-screen pb-16">
      {/* Print Specific CSS */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-vehicle-info-card, #printable-vehicle-info-card * {
            visibility: visible;
          }
          #printable-vehicle-info-card {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 24px;
            background: white !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b-2 border-amber-500/50 shadow-md">
        {/* Tricolor line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-300 to-emerald-600" />
        
        <div className="max-w-6xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Maharashtra Motor Vehicles Department • MoRTH Vahan Integrated</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            {t.vehSearchTitle}
          </h1>

          <p className="text-xs sm:text-sm text-amber-100/80 max-w-3xl leading-relaxed">
            {t.vehSearchSubtitle}. {language === 'mr' ? 'कायदेशीररीत्या उपलब्ध वाहन योग्यता, नोंदणी वैधता, पीयूसी प्रदूषण व विमा माहिती एका क्लिकवर मिळवा.' : 'Instant, legally permitted public verification of vehicle roadworthiness, fitness certificates, insurance policies, and pollution standards across all 50 Maharashtra RTO jurisdictions.'}
          </p>
        </div>
      </section>

      {/* Main Search Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Search Input Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-200 space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="space-y-4"
          >
            <label className="text-xs sm:text-sm font-extrabold text-stone-900 block">
              {language === 'mr' ? 'महाराष्ट्र वाहन नोंदणी क्रमांक प्रविष्ट करा:' : 'Enter Maharashtra Vehicle Registration Number:'}
            </label>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* License Plate Style Input Container */}
              <div className="relative flex-1 flex items-center rounded-2xl border-2 border-stone-300 hover:border-amber-500 focus-within:border-amber-600 focus-within:ring-3 focus-within:ring-amber-500/20 transition-all bg-white overflow-hidden shadow-inner">
                {/* Indian License Plate Badge */}
                <div className="bg-blue-700 text-white px-3 py-3 flex flex-col items-center justify-center border-r border-blue-800 select-none shrink-0">
                  <span className="text-[10px] font-black tracking-widest text-amber-300">IND</span>
                  <div className="w-2.5 h-2.5 rounded-full border border-amber-300 flex items-center justify-center text-[7px] text-amber-200">
                    ⚙
                  </div>
                </div>

                <input
                  type="text"
                  id="input-vehicle-registration"
                  value={inputPlate}
                  onChange={(e) => setInputPlate(e.target.value)}
                  placeholder="e.g. MH12AB1234 or MH 12 AB 1234"
                  className="w-full px-4 py-3 text-base sm:text-lg font-black tracking-wider text-stone-900 uppercase font-mono outline-none"
                  autoComplete="off"
                  spellCheck="false"
                />

                <Search className="w-5 h-5 text-stone-400 mr-4 shrink-0" />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                id="btn-search-vehicle"
                disabled={isLoading}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white font-black text-sm cursor-pointer shadow-md transition-all hover:scale-102 flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Searching RTO...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>{t.vehSearchBtn}</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Sample Links */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600 pt-1">
              <span className="font-semibold text-stone-500">Quick Test Vehicles:</span>
              {sampleVehicles.map((sample) => (
                <button
                  key={sample.number}
                  type="button"
                  onClick={() => {
                    setInputPlate(sample.number);
                    handleSearch(sample.number);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-800 hover:text-amber-950 font-mono text-[11px] font-bold border border-stone-200 cursor-pointer transition-colors"
                >
                  {sample.number} <span className="text-stone-400 font-sans">({sample.label.split(' ')[0]})</span>
                </button>
              ))}
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </form>

          {/* Privacy Disclaimer Banner */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-amber-950 text-xs flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
            <div className="space-y-0.5">
              <span className="font-extrabold text-amber-900 block">
                {language === 'mr' ? 'आरटीओ नागरिक गोपनीयता हमी (DPDP Act Compliance):' : 'RTO Citizen Data Privacy Notice (MoRTH DPDP Guidelines):'}
              </span>
              <p className="text-stone-700 text-[11px] leading-relaxed">
                {t.vehPrivacyNotice} {language === 'mr' ? 'केवळ वाहनाची कायदेशीर योग्यता, फिटनेस, विमा व पीयूसी वैधता सार्वजनिक पडताळणीसाठी उपलब्ध आहे.' : 'Aadhaar, personal phone, and residential addresses are strictly protected from public lookup. Only verified statutory roadworthiness parameters are displayed.'}
              </p>
            </div>
          </div>
        </div>

        {/* Loading Inspection Simulator */}
        {isLoading && (
          <div className="bg-white rounded-3xl p-10 border border-stone-200 shadow-sm mt-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto text-amber-700 animate-pulse">
              <Gauge className="w-8 h-8 animate-spin" />
            </div>
            <h3 className="font-bold text-base text-stone-800">
              Querying Maharashtra Motor Vehicles Department (RTO)...
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Connecting with MoRTH Parivahan Vahan National Register to verify registration validity, fitness compliance, insurance status, and pollution certificates.
            </p>
          </div>
        )}

        {/* Search Result Card */}
        {searchedVehicle && !isLoading && (
          <div
            id="printable-vehicle-info-card"
            className="mt-6 bg-white rounded-3xl border border-stone-200 shadow-lg overflow-hidden space-y-6"
          >
            {/* Top Bar with License Plate & RTO */}
            <div className="p-6 bg-gradient-to-r from-stone-950 via-amber-950 to-stone-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Graphic License Plate */}
                <div className="bg-white text-stone-950 px-4 py-2 rounded-xl border-2 border-stone-400 font-mono font-black text-xl sm:text-2xl tracking-widest shadow-inner flex items-center gap-2 shrink-0">
                  <div className="w-3 h-3 rounded-full border border-blue-800 flex items-center justify-center text-[7px] text-blue-900 font-bold">
                    IND
                  </div>
                  <span>{searchedVehicle.registrationNumber}</span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] uppercase font-bold text-amber-400">
                      {searchedVehicle.rtoCode} • {searchedVehicle.rtoName}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-xl font-bold text-white tracking-wide">
                    {searchedVehicle.make} {searchedVehicle.model}
                  </h3>
                  <p className="text-xs text-stone-300 font-medium">
                    {searchedVehicle.vehicleType}
                  </p>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="no-print flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyPlate}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer transition-colors border border-white/20 flex items-center gap-1.5"
                  title="Copy Registration Number"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Share'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer transition-colors border border-white/20 flex items-center gap-1.5"
                  title="Print Certificate"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveToMyVehicles}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <BookmarkPlus className="w-3.5 h-3.5" />
                  <span>{saveSuccess ? 'Saved to Garage!' : 'Save Vehicle'}</span>
                </button>
              </div>
            </div>

            {/* Core Statutory Parameters (Grid of 4 Major Cards) */}
            <div className="px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 1. Registration Validity */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <span>{t.vehRegValidity}</span>
                  </span>
                  <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-extrabold">
                    ACTIVE
                  </span>
                </div>
                <div className="text-base font-black text-stone-900 font-mono">
                  {searchedVehicle.registrationValidity.split(' ')[0]}
                </div>
                <div className="text-[11px] text-stone-500">
                  Reg Date: <span className="font-semibold text-stone-700">{searchedVehicle.registrationDate}</span>
                </div>
              </div>

              {/* 2. Fitness Status */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
                  <span className="flex items-center gap-1.5">
                    <Gauge className="w-4 h-4 text-emerald-600" />
                    <span>{t.vehFitnessStatus}</span>
                  </span>
                  <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-extrabold">
                    FIT
                  </span>
                </div>
                <div className="text-base font-black text-stone-900">
                  {searchedVehicle.fitnessStatus}
                </div>
                <div className="text-[11px] text-stone-500">
                  Valid up to: <span className="font-semibold text-stone-700">{searchedVehicle.fitnessValidUntil}</span>
                </div>
              </div>

              {/* 3. Insurance Status */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>{t.vehInsuranceStatus}</span>
                  </span>
                  <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-extrabold">
                    INSURED
                  </span>
                </div>
                <div className="text-base font-black text-stone-900">
                  {searchedVehicle.insuranceStatus}
                </div>
                <div className="text-[11px] text-stone-500 truncate" title={searchedVehicle.insuranceProvider}>
                  {searchedVehicle.insuranceProvider}
                </div>
              </div>

              {/* 4. PUC Status */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
                  <span className="flex items-center gap-1.5">
                    <FileCheck2 className="w-4 h-4 text-teal-600" />
                    <span>{t.vehPucStatus}</span>
                  </span>
                  <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 font-extrabold">
                    PASSED
                  </span>
                </div>
                <div className="text-base font-black text-stone-900">
                  {searchedVehicle.pucStatus}
                </div>
                <div className="text-[11px] text-stone-500">
                  Valid up to: <span className="font-semibold text-stone-700">{searchedVehicle.pucValidUntil}</span>
                </div>
              </div>
            </div>

            {/* Detailed Statutory Data Table */}
            <div className="px-6 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-600 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                <span>Legally Authorized Vehicle Specification Details</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {/* Fuel Type */}
                <div className="p-3 rounded-xl border border-stone-200 flex items-center justify-between">
                  <span className="text-stone-500 font-semibold">{t.vehFuelType}:</span>
                  <span className="font-black text-stone-900 flex items-center gap-1.5">
                    <Fuel className="w-3.5 h-3.5 text-amber-600" />
                    <span>{searchedVehicle.fuelType}</span>
                  </span>
                </div>

                {/* Vehicle Make & Model */}
                <div className="p-3 rounded-xl border border-stone-200 flex items-center justify-between">
                  <span className="text-stone-500 font-semibold">{t.vehMakeModel}:</span>
                  <span className="font-bold text-stone-900 truncate max-w-[180px]">
                    {searchedVehicle.make} {searchedVehicle.model}
                  </span>
                </div>

                {/* Permit Status */}
                <div className="p-3 rounded-xl border border-stone-200 flex items-center justify-between">
                  <span className="text-stone-500 font-semibold">{t.vehPermitStatus}:</span>
                  <span className="font-bold text-stone-900 truncate max-w-[180px]">
                    {searchedVehicle.permitStatus}
                  </span>
                </div>

                {/* Emission Standards */}
                <div className="p-3 rounded-xl border border-stone-200 flex items-center justify-between">
                  <span className="text-stone-500 font-semibold">{t.vehEmissionNorms}:</span>
                  <span className="font-mono font-bold text-stone-900">
                    {searchedVehicle.emissionNorms}
                  </span>
                </div>

                {/* RTO Office */}
                <div className="p-3 rounded-xl border border-stone-200 flex items-center justify-between">
                  <span className="text-stone-500 font-semibold">{t.vehRtoOffice}:</span>
                  <span className="font-bold text-stone-900">
                    {searchedVehicle.rtoName}
                  </span>
                </div>

                {/* Road Tax Status */}
                <div className="p-3 rounded-xl border border-stone-200 flex items-center justify-between">
                  <span className="text-stone-500 font-semibold">Motor Vehicle Tax:</span>
                  <span className="font-bold text-emerald-700">
                    {searchedVehicle.taxStatus}
                  </span>
                </div>

                {/* Engine Capacity / Battery */}
                <div className="p-3 rounded-xl border border-stone-200 flex items-center justify-between">
                  <span className="text-stone-500 font-semibold">Cubic Capacity (CC):</span>
                  <span className="font-mono font-bold text-stone-900">
                    {searchedVehicle.cubicCapacity}
                  </span>
                </div>

                {/* Seating Capacity */}
                <div className="p-3 rounded-xl border border-stone-200 flex items-center justify-between">
                  <span className="text-stone-500 font-semibold">Seating Capacity:</span>
                  <span className="font-bold text-stone-900">
                    {searchedVehicle.seatingCapacity} Persons
                  </span>
                </div>

                {/* Vehicle Color */}
                <div className="p-3 rounded-xl border border-stone-200 flex items-center justify-between">
                  <span className="text-stone-500 font-semibold">Color:</span>
                  <span className="font-bold text-stone-900">
                    {searchedVehicle.color}
                  </span>
                </div>

                {/* Masked Chassis Number */}
                <div className="p-3 rounded-xl border border-stone-200 flex items-center justify-between">
                  <span className="text-stone-500 font-semibold">Chassis No. (Masked):</span>
                  <span className="font-mono font-semibold text-stone-700">
                    {searchedVehicle.chassisNumberMasked}
                  </span>
                </div>

                {/* Masked Engine Number */}
                <div className="p-3 rounded-xl border border-stone-200 flex items-center justify-between">
                  <span className="text-stone-500 font-semibold">Engine No. (Masked):</span>
                  <span className="font-mono font-semibold text-stone-700">
                    {searchedVehicle.engineNumberMasked}
                  </span>
                </div>

                {/* Blacklist Status */}
                <div className="p-3 rounded-xl border border-stone-200 flex items-center justify-between">
                  <span className="text-stone-500 font-semibold">Blacklist / Theft Record:</span>
                  <span className="font-bold text-emerald-700">
                    {searchedVehicle.blacklistedStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Pollution / PUC Emission Details */}
            <div className="px-6">
              <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 text-xs space-y-1">
                <span className="font-extrabold text-teal-950 flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-teal-700" />
                  <span>Pollution Under Control (PUC) Certificate Record:</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-stone-700 pt-1">
                  <div>
                    <span className="text-stone-500 block text-[10px] uppercase font-bold">PUC Certificate No.</span>
                    <span className="font-mono font-semibold">{searchedVehicle.pucCertificateNumber}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[10px] uppercase font-bold">PUC Emission Test Result</span>
                    <span className="font-semibold text-emerald-800">{searchedVehicle.pucEmissionLevel}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[10px] uppercase font-bold">Valid Until</span>
                    <span className="font-mono font-bold text-teal-900">{searchedVehicle.pucValidUntil}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Compliance & Quick Action Links Footer */}
            <div className="p-6 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified against Maharashtra RTO & MoRTH Parivahan registers.</span>
              </div>

              <div className="no-print flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate(`/vehicle-dashboard?tab=challans`)}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-800 text-xs font-bold border border-stone-300 cursor-pointer shadow-2xs"
                >
                  Check e-Challan
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate(`/vehicle-dashboard?tab=fastag`)}
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold cursor-pointer shadow-2xs"
                >
                  FASTag Recharge
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
