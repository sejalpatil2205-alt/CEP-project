import React, { useState, useEffect } from 'react';
import { 
  Car, 
  CreditCard, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  RefreshCw, 
  Wallet, 
  Tag, 
  FileText, 
  Gauge, 
  ArrowRight, 
  ExternalLink,
  Info,
  Calendar,
  Zap,
  MapPin,
  Clock,
  Plus,
  Trash2,
  Lock,
  Sparkles,
  Layers,
  Bike,
  Truck,
  Check,
  BookmarkCheck,
  Fuel,
  Palette,
  History
} from 'lucide-react';
import { SERVICES_DATA, DEMO_VEHICLE } from '../data/servicesData';
import { VehicleSummary, EService, UserVehicleRecord } from '../types';
import { ServiceCard } from '../components/ServiceCard';
import { RecentActivitySection } from '../components/RecentActivitySection';
import { useAuth } from '../context/AuthContext';
import { 
  subscribeUserVehicles, 
  saveUserVehicle, 
  deleteUserVehicle, 
  rechargeVehicleFastag 
} from '../lib/firebase';
import { recordServiceAccess } from '../lib/activityService';

interface VehicleDashboardPageProps {
  onSelectService: (slugOrId: string) => void;
  onNavigate: (path: string) => void;
}

type DashboardTab = 'all' | 'overview' | 'fastag' | 'challans' | 'rc-records' | 'insurance-puc' | 'services-grid' | 'recent-activity';

export const VehicleDashboardPage: React.FC<VehicleDashboardPageProps> = ({
  onSelectService,
  onNavigate
}) => {
  const { user, setAuthModalOpen } = useAuth();
  const [userVehicles, setUserVehicles] = useState<UserVehicleRecord[]>([]);
  const [selectedVehId, setSelectedVehId] = useState<string>('default');
  const [vehicleData, setVehicleData] = useState<VehicleSummary>(DEMO_VEHICLE);
  const [searchVehNumber, setSearchVehNumber] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  
  // Interactive tab state with distinct symbols - reads URL query params
  const [activeTab, setActiveTab] = useState<DashboardTab>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab') as DashboardTab;
      if (tab && ['overview', 'fastag', 'challans', 'rc-records', 'insurance-puc', 'services-grid', 'recent-activity'].includes(tab)) {
        return tab;
      }
    } catch {}
    return 'overview';
  });

  // Listen for browser popstate or tab query changes
  useEffect(() => {
    const handlePop = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab') as DashboardTab;
        if (tab && ['overview', 'fastag', 'challans', 'rc-records', 'insurance-puc', 'services-grid', 'recent-activity'].includes(tab)) {
          setActiveTab(tab);
        }
      } catch {}
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  const handleTabSelect = (tabId: DashboardTab) => {
    setActiveTab(tabId);
    try {
      const url = new URL(window.location.href);
      if (tabId === 'overview') {
        url.searchParams.delete('tab');
      } else {
        url.searchParams.set('tab', tabId);
      }
      window.history.pushState({}, '', url.toString());
    } catch {}
  };

  // Recharge modal state
  const [rechargeModalOpen, setRechargeModalOpen] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('500');
  const [rechargeSuccess, setRechargeSuccess] = useState(false);

  // Add Vehicle modal state
  const [addVehModalOpen, setAddVehModalOpen] = useState(false);
  const [newVehForm, setNewVehForm] = useState({
    vehicleNumber: '',
    vehicleType: 'Car' as UserVehicleRecord['vehicleType'],
    nickname: '',
    ownerName: '',
    model: '',
    registrationDate: '10-Jan-2022',
    rcValidity: '09-Jan-2037 (Active)',
    insuranceValidity: '15-Dec-2026',
    insuranceProvider: 'HDFC ERGO General Insurance',
    pucValidity: '20-Oct-2026 (Valid)',
    fastagTagId: '',
    fastagBalance: 500,
    fastagBank: 'ICICI Bank FASTag',
    notes: ''
  });

  // Subscribe to real-time Firestore vehicles if logged in
  useEffect(() => {
    if (!user) {
      setUserVehicles([]);
      return;
    }

    const unsubscribe = subscribeUserVehicles(user.uid, (vehicles) => {
      setUserVehicles(vehicles);
      if (vehicles.length > 0) {
        const current = vehicles.find((v) => v.id === selectedVehId) || vehicles[0];
        setSelectedVehId(current.id);
        setVehicleData({
          vehicleNumber: current.vehicleNumber,
          ownerName: current.ownerName,
          model: current.model,
          registrationDate: current.registrationDate || '15-Mar-2021',
          rcStatus: 'Active',
          rcValidity: current.rcValidity,
          insuranceValidity: current.insuranceValidity,
          insuranceProvider: current.insuranceProvider,
          pucValidity: current.pucValidity,
          pucStatus: 'Valid',
          fastagTagId: current.fastagTagId,
          fastagStatus: 'Active',
          fastagBalance: current.fastagBalance,
          pendingChallans: DEMO_VEHICLE.pendingChallans
        });
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  // Handle switching active vehicle in user's garage
  const handleSelectGarageVehicle = (v: UserVehicleRecord) => {
    setSelectedVehId(v.id);
    setVehicleData({
      vehicleNumber: v.vehicleNumber,
      ownerName: v.ownerName,
      model: v.model,
      registrationDate: v.registrationDate || '15-Mar-2021',
      rcStatus: 'Active',
      rcValidity: v.rcValidity,
      insuranceValidity: v.insuranceValidity,
      insuranceProvider: v.insuranceProvider,
      pucValidity: v.pucValidity,
      pucStatus: 'Valid',
      fastagTagId: v.fastagTagId,
      fastagStatus: 'Active',
      fastagBalance: v.fastagBalance,
      pendingChallans: DEMO_VEHICLE.pendingChallans
    });
  };

  // Filter only vehicle services (all 10 services)
  const vehicleServices = SERVICES_DATA.filter(
    (s) => s.category === 'Vehicle Services' || s.isVehicleService
  );

  // Handle vehicle lookup simulation
  const handleSimulateLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchVehNumber.trim()) return;

    setIsSimulating(true);

    try {
      const res = await fetch(`/api/vehicle-summary?vehicleNumber=${encodeURIComponent(searchVehNumber.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setVehicleData(data.data);
      } else {
        const clean = searchVehNumber.toUpperCase().trim();
        setVehicleData({
          ...DEMO_VEHICLE,
          vehicleNumber: clean,
          ownerName: user?.displayName || 'Citizen Profile (Demo)',
          model: 'Maruti Suzuki Swift ZXi (Demo)',
          fastagBalance: 450.00
        });
      }
    } catch {
      const clean = searchVehNumber.toUpperCase().trim();
      setVehicleData({
        ...DEMO_VEHICLE,
        vehicleNumber: clean
      });
    } finally {
      setIsSimulating(false);
    }
  };

  const handleExecuteRecharge = async (e: React.FormEvent) => {
    e.preventDefault();
    const addAmt = parseFloat(rechargeAmount) || 0;

    if (user && selectedVehId && userVehicles.some((v) => v.id === selectedVehId)) {
      try {
        await rechargeVehicleFastag(user.uid, selectedVehId, addAmt, vehicleData.fastagBalance);
      } catch (err) {
        console.error('Failed to recharge in Firestore:', err);
      }
    }

    setVehicleData((prev) => ({
      ...prev,
      fastagBalance: prev.fastagBalance + addAmt
    }));
    setRechargeSuccess(true);
    setTimeout(() => {
      setRechargeSuccess(false);
      setRechargeModalOpen(false);
    }, 2000);
  };

  const handleCreateNewVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    const payload: UserVehicleRecord = {
      id: `veh-${Date.now()}`,
      vehicleNumber: newVehForm.vehicleNumber.toUpperCase().trim(),
      vehicleType: newVehForm.vehicleType,
      nickname: newVehForm.nickname || newVehForm.vehicleNumber,
      ownerName: newVehForm.ownerName || user.displayName || 'Citizen Owner',
      model: newVehForm.model || 'Hyundai Creta SX',
      registrationDate: newVehForm.registrationDate,
      rcValidity: newVehForm.rcValidity,
      insuranceValidity: newVehForm.insuranceValidity,
      insuranceProvider: newVehForm.insuranceProvider,
      pucValidity: newVehForm.pucValidity,
      fastagTagId: newVehForm.fastagTagId || `3416-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-0012`,
      fastagBalance: Number(newVehForm.fastagBalance) || 500,
      fastagBank: newVehForm.fastagBank,
      notes: newVehForm.notes,
      updatedAt: new Date().toISOString()
    };

    await saveUserVehicle(user.uid, payload);
    setAddVehModalOpen(false);
  };

  const handleDeleteVehicle = async (vId: string) => {
    if (!user) return;
    if (window.confirm('Delete this vehicle record from your Firestore database?')) {
      await deleteUserVehicle(user.uid, vId);
    }
  };

  // Tab definitions with symbols
  const dashboardTabs = [
    { id: 'overview', label: 'Vehicle Overview', icon: Car, count: null, color: 'text-amber-700' },
    { id: 'recent-activity', label: 'Recent Activity', icon: History, count: 'Last 5', color: 'text-amber-800' },
    { id: 'fastag', label: 'FASTag Wallet', icon: CreditCard, count: `₹${vehicleData.fastagBalance.toFixed(0)}`, color: 'text-orange-700' },
    { id: 'challans', label: 'e-Challans', icon: AlertTriangle, count: vehicleData.pendingChallans?.length ? `${vehicleData.pendingChallans.length} Due` : '0 Due', color: 'text-rose-700' },
    { id: 'rc-records', label: 'RC & Vahan Record', icon: FileText, count: vehicleData.rcStatus, color: 'text-amber-800' },
    { id: 'insurance-puc', label: 'PUC & Insurance', icon: ShieldCheck, count: 'Valid', color: 'text-emerald-800' },
    { id: 'services-grid', label: 'All 10 RTO Services', icon: Gauge, count: '10', color: 'text-stone-800' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 bg-[#FAF7F2]/40">
      {/* 1. Header with Warm Tone & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/80 text-amber-900 text-xs font-bold border border-amber-300/80 shadow-2xs">
            <Car className="w-4 h-4 text-amber-700" />
            <span>Vehicle & FASTag Citizen Dashboard</span>
            <span className="w-1 h-1 rounded-full bg-amber-600"></span>
            <span className="text-amber-800 font-medium">Warm Indian Civic Theme</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight flex items-center gap-3">
            <span>Vehicle Owner Dashboard</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-3xl leading-relaxed">
            Centralized portal for FASTag management, e-Challan traffic violation checks, RC validity, PUC renewal, and official Parivahan Sewa transport services.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {user ? (
            <button
              onClick={() => setAddVehModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer self-start sm:self-center"
            >
              <Car className="w-4 h-4" />
              <span>Add Vehicle to Garage</span>
            </button>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer self-start sm:self-center"
            >
              <Lock className="w-4 h-4" />
              <span>Sign In to Save Vehicles</span>
            </button>
          )}
        </div>
      </div>

      {/* Spotlight: Maharashtra Vehicle Information Search */}
      <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-950 text-white rounded-3xl p-5 sm:p-6 border-2 border-amber-500/40 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Maharashtra Motor Vehicles Department (RTO Vahan)</span>
          </div>
          <h3 className="text-base sm:text-xl font-black text-white">
            Maharashtra Vehicle Information Search (RTO Vahan)
          </h3>
          <p className="text-xs text-stone-300 max-w-xl">
            Lookup any Maharashtra vehicle registration (e.g., MH-12-AB-1234) for official roadworthiness, fitness status, insurance, and PUC certificate validation.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('/vehicle-search')}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs sm:text-sm cursor-pointer shadow-md transition-transform hover:scale-102 flex items-center justify-center gap-2 shrink-0"
        >
          <Search className="w-4 h-4" />
          <span>Search Vehicle Info (MH-12-AB-1234)</span>
        </button>
      </div>

      {/* 2. Logged In User Garage Switcher Bar (Firestore Connected) */}
      {user && userVehicles.length > 0 && (
        <div className="bg-white rounded-2xl p-4 border border-amber-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <Car className="w-4 h-4 text-amber-600" />
                <span>My Saved Garage ({userVehicles.length} vehicles in Firestore)</span>
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                Cloud Synced
              </span>
            </div>
            <button
              onClick={() => setAddVehModalOpen(true)}
              className="text-xs font-bold text-amber-700 hover:text-amber-900 cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {userVehicles.map((v) => {
              const isSelected = selectedVehId === v.id;
              const TypeIcon = v.vehicleType === 'Two-Wheeler' ? Bike : v.vehicleType === 'Commercial' ? Truck : Car;
              return (
                <div
                  key={v.id}
                  className={`flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl border text-xs transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-700 to-orange-700 text-white border-amber-800 font-bold shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 font-medium'
                  }`}
                >
                  <TypeIcon className="w-3.5 h-3.5 shrink-0" />
                  <button
                    onClick={() => handleSelectGarageVehicle(v)}
                    className="cursor-pointer text-left flex items-center gap-1.5"
                  >
                    <span>{v.nickname || v.vehicleNumber}</span>
                    <span className={`text-[10px] font-mono ${isSelected ? 'text-amber-200' : 'text-stone-500'}`}>
                      (₹{v.fastagBalance})
                    </span>
                  </button>
                  {userVehicles.length > 1 && (
                    <button
                      onClick={() => handleDeleteVehicle(v.id)}
                      className={`p-1 rounded-md hover:bg-black/10 cursor-pointer ${
                        isSelected ? 'text-white' : 'text-stone-400 hover:text-rose-600'
                      }`}
                      title="Delete vehicle"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Main Dashboard Navigation Tabs with Distinct Symbols */}
      <div className="bg-white rounded-2xl p-2 border border-stone-200/90 shadow-2xs">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {dashboardTabs.map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`vehicle-tab-${tab.id}`}
                onClick={() => handleTabSelect(tab.id as DashboardTab)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isTabActive
                    ? 'bg-amber-100/90 text-amber-950 border border-amber-300 shadow-xs ring-1 ring-amber-400/30'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isTabActive ? 'text-amber-700' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
                {tab.count && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                    isTabActive ? 'bg-amber-200 text-amber-900' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3.1 Recent Activity Section - Automatically records and displays the last five services */}
      {(activeTab === 'overview' || activeTab === 'recent-activity') && (
        <RecentActivitySection
          onSelectService={(serviceId) => {
            recordServiceAccess({ id: serviceId }, user?.uid);
            onSelectService(serviceId);
          }}
          onNavigate={onNavigate}
        />
      )}

      {/* 4. Warm Color Palette Showcase & Architecture Insight */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50/60 to-stone-50 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <Palette className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-stone-900 text-sm">
                Warm Civic Palette Active
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-200/80 text-amber-900 rounded-full border border-amber-300">
                Warm Saffron • Amber • Sandalwood
              </span>
            </div>
            <p className="text-stone-600 leading-relaxed text-xs">
              Crafted with warm saffron accents, terracotta bronze highlights, and sandalwood ivory surfaces — paired with symbol tabs like <strong>Car 🚗</strong>, <strong>FASTag 💳</strong>, and <strong>e-Challans ⚠️</strong>.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-3.5 h-3.5 rounded-full bg-amber-600 border border-white shadow-xs" title="Warm Amber"></span>
          <span className="w-3.5 h-3.5 rounded-full bg-orange-600 border border-white shadow-xs" title="Terracotta Rust"></span>
          <span className="w-3.5 h-3.5 rounded-full bg-stone-900 border border-white shadow-xs" title="Warm Espresso"></span>
          <span className="w-3.5 h-3.5 rounded-full bg-[#FAF7F2] border border-stone-300 shadow-xs" title="Sandalwood Surface"></span>
        </div>
      </div>

      {/* 5. Conditional Tab Content: Vehicle Overview & Simulator */}
      {(activeTab === 'overview' || activeTab === 'all' || activeTab === 'rc-records' || activeTab === 'insurance-puc') && (
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden space-y-0">
          {/* Top bar with vehicle lookup tool in Warm Espresso Charcoal */}
          <div className="bg-stone-900 text-white p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-base sm:text-lg">Vehicle Status Simulator</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full font-semibold border border-amber-400/30">
                  Vahan Demo Engine
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Enter any Indian registration number (e.g. DL 01 AB 1234, MH 12, KA 03) to simulate a status lookup
              </p>
            </div>

            {/* Search Simulation Form */}
            <form onSubmit={handleSimulateLookup} className="flex items-center gap-2 max-w-md w-full md:w-auto">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchVehNumber}
                  onChange={(e) => setSearchVehNumber(e.target.value)}
                  placeholder="e.g. DL 01 AB 1234"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-stone-800 text-white placeholder-stone-400 rounded-xl border border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono uppercase"
                />
              </div>
              <button
                type="submit"
                disabled={isSimulating}
                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shrink-0 cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                {isSimulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Check Record'}
              </button>
            </form>
          </div>

          {/* Demo Vehicle Summary Grid with Warm Palette Accent Cards */}
          <div className="p-6 sm:p-8 space-y-6 bg-gradient-to-b from-stone-50/50 to-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Field 1: Vehicle & Owner */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs space-y-1 hover:border-amber-300 transition-colors">
                <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                  <Car className="w-3.5 h-3.5 text-amber-600" />
                  <span>Vehicle & Owner</span>
                </div>
                <div className="font-mono text-lg font-black text-stone-900 tracking-wide">
                  {vehicleData.vehicleNumber}
                </div>
                <div className="text-xs text-stone-600 font-semibold">
                  {vehicleData.ownerName}
                </div>
                <div className="text-[11px] text-stone-500">
                  {vehicleData.model}
                </div>
              </div>

              {/* Field 2: RC Status */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs space-y-1 hover:border-amber-300 transition-colors">
                <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-amber-600" />
                    <span>RC Validity</span>
                  </span>
                  <span className="text-emerald-800 bg-emerald-100 font-bold px-1.5 py-0.5 rounded text-[10px] border border-emerald-200">
                    {vehicleData.rcStatus}
                  </span>
                </div>
                <div className="font-bold text-stone-900 text-sm">
                  {vehicleData.rcValidity}
                </div>
                <div className="text-[11px] text-stone-500">
                  Reg Date: {vehicleData.registrationDate}
                </div>
              </div>

              {/* Field 3: Insurance Validity */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs space-y-1 hover:border-amber-300 transition-colors">
                <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span>Insurance Status</span>
                  </span>
                  <span className="text-amber-900 bg-amber-100 font-bold px-1.5 py-0.5 rounded text-[10px] border border-amber-200">
                    Active
                  </span>
                </div>
                <div className="font-bold text-stone-900 text-sm">
                  Valid till {vehicleData.insuranceValidity}
                </div>
                <div className="text-[11px] text-stone-500 truncate">
                  {vehicleData.insuranceProvider}
                </div>
              </div>

              {/* Field 4: PUC Status */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs space-y-1 hover:border-amber-300 transition-colors">
                <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Fuel className="w-3.5 h-3.5 text-amber-600" />
                    <span>PUC Emission</span>
                  </span>
                  <span className="text-emerald-800 bg-emerald-100 font-bold px-1.5 py-0.5 rounded text-[10px] border border-emerald-200">
                    {vehicleData.pucStatus}
                  </span>
                </div>
                <div className="font-bold text-stone-900 text-sm">
                  Valid till {vehicleData.pucValidity}
                </div>
                <div className="text-[11px] text-amber-800 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Mandate clear
                </div>
              </div>
            </div>

            {/* Pending Challan Alert Card */}
            {vehicleData.pendingChallans && vehicleData.pendingChallans.length > 0 && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-rose-950 text-sm flex items-center gap-2">
                      <span>1 Pending Traffic e-Challan Found (Demo Alert)</span>
                      <span className="bg-rose-200 text-rose-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-300">
                        ₹{vehicleData.pendingChallans[0].amount}
                      </span>
                    </div>
                    <p className="text-xs text-rose-800/90 mt-0.5">
                      {vehicleData.pendingChallans[0].violation} • {vehicleData.pendingChallans[0].location} ({vehicleData.pendingChallans[0].date})
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onSelectService('echallan-payment')}
                  className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-xs transition-colors shrink-0 cursor-pointer flex items-center gap-1.5"
                >
                  <span>View Challan Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. FASTag Central Section in Warm Dark Luxury Aesthetics */}
      {(activeTab === 'fastag' || activeTab === 'overview' || activeTab === 'all') && (
        <section className="bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-white shadow-inner">
                <CreditCard className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    FASTag Management Center
                  </h2>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">
                    NETC Integrated
                  </span>
                </div>
                <p className="text-xs text-stone-300">
                  National Electronic Toll Collection (NETC) FastTrack Services & Wallet
                </p>
              </div>
            </div>

            {/* Status and Balance Box */}
            <div className="flex items-center gap-3 bg-stone-800/90 p-3 rounded-2xl border border-stone-700">
              <div className="px-3 border-r border-stone-700 text-right">
                <div className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
                  Tag Status
                </div>
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1 justify-end">
                  <CheckCircle2 className="w-3 h-3" /> {vehicleData.fastagStatus}
                </div>
              </div>
              <div className="px-3 text-left">
                <div className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
                  Wallet Balance
                </div>
                <div className="text-lg font-black text-amber-400 font-mono">
                  ₹{vehicleData.fastagBalance.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* 3 FASTag Core Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Button 1: Recharge FASTag */}
            <div className="bg-stone-800/70 hover:bg-stone-800 transition-colors p-5 rounded-2xl border border-stone-700/80 flex flex-col justify-between gap-4">
              <div className="space-y-1.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">
                  Recharge FASTag
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Add instant balance via UPI, NetBanking, or Bank Portal without any surcharge.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setRechargeModalOpen(true)}
                  className="flex-1 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer text-center"
                >
                  Recharge Simulator
                </button>
                <button
                  onClick={() => onSelectService('fastag-recharge')}
                  title="View step by step recharge guide"
                  className="p-2.5 bg-stone-700 hover:bg-stone-600 text-white rounded-xl transition-colors cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Button 2: Check FASTag Balance */}
            <div className="bg-stone-800/70 hover:bg-stone-800 transition-colors p-5 rounded-2xl border border-stone-700/80 flex flex-col justify-between gap-4">
              <div className="space-y-1.5">
                <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">
                  Check FASTag Balance
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Check blacklist status, toll plaza history, or call toll-free missed call 1033.
                </p>
              </div>
              <button
                onClick={() => onSelectService('fastag-balance-check')}
                className="w-full py-2.5 bg-stone-700 hover:bg-stone-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Check Balance & Status</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Button 3: Buy New FASTag */}
            <div className="bg-stone-800/70 hover:bg-stone-800 transition-colors p-5 rounded-2xl border border-stone-700/80 flex flex-col justify-between gap-4">
              <div className="space-y-1.5">
                <div className="w-9 h-9 rounded-xl bg-amber-600/20 text-amber-300 flex items-center justify-center">
                  <Tag className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">
                  Buy New FASTag
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Order a government-mandated RFID tag with doorstep delivery from SBI, ICICI, etc.
                </p>
              </div>
              <button
                onClick={() => onSelectService('fastag-new-purchase')}
                className="w-full py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Buy New Tag (Step by Step)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 7. Grid of ALL 10 Vehicle-Related Services */}
      {(activeTab === 'services-grid' || activeTab === 'all' || activeTab === 'overview') && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone-200 pb-4">
            <div>
              <div className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-amber-600" />
                <span>MoRTH & RTO Citizen Directory</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
                All 10 Vehicle & RTO E-Services
              </h2>
            </div>
            <div className="text-xs font-semibold text-stone-600 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200 w-max">
              {vehicleServices.length} Essential Vehicle Services
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicleServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onViewDetails={onSelectService}
              />
            ))}
          </div>
        </section>
      )}

      {/* 8. FASTag Recharge Simulation Modal */}
      {rechargeModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                    FASTag Instant Recharge (Simulator)
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    VRN: {vehicleData.vehicleNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRechargeModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {rechargeSuccess ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-stone-900 text-base">Recharge Simulated Successfully!</h4>
                <p className="text-xs text-stone-600">
                  ₹{rechargeAmount} has been credited to Tag {vehicleData.fastagTagId}
                  {user ? ' and saved to your Firestore database.' : '.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleExecuteRecharge} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Select / Enter Amount</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['200', '500', '1000'].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setRechargeAmount(amt)}
                        className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          rechargeAmount === amt
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={rechargeAmount}
                    onChange={(e) => setRechargeAmount(e.target.value)}
                    min="100"
                    placeholder="Enter custom amount (min ₹100)"
                    className="w-full mt-2 px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Target FASTag ID:</span>
                    <span className="font-mono font-bold text-stone-800">{vehicleData.fastagTagId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Database Sync:</span>
                    <span className="font-semibold text-emerald-700">
                      {user ? 'Firestore Connected' : 'Guest Simulator'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setRechargeModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    Simulate Payment ₹{rechargeAmount}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 9. Add Vehicle to Firestore Modal with Vehicle Type Symbols */}
      {addVehModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-900 text-base sm:text-lg flex items-center gap-2">
                <Car className="w-5 h-5 text-amber-600" />
                <span>Add Vehicle to Firestore Garage</span>
              </h3>
              <button
                onClick={() => setAddVehModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewVehicle} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">
                    Registration No (VRN) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newVehForm.vehicleNumber}
                    onChange={(e) => setNewVehForm({ ...newVehForm, vehicleNumber: e.target.value })}
                    placeholder="e.g. DL 08 CA 9999"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-mono font-bold text-stone-900 uppercase focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Vehicle Type Symbol</label>
                  <select
                    value={newVehForm.vehicleType}
                    onChange={(e) => setNewVehForm({ ...newVehForm, vehicleType: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Car">🚗 Car / Sedan / SUV</option>
                    <option value="Two-Wheeler">🏍️ Two-Wheeler / Scooter</option>
                    <option value="Commercial">🚚 Commercial / Truck</option>
                    <option value="Electric">⚡ Electric Vehicle (EV)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Vehicle Make & Model</label>
                  <input
                    type="text"
                    value={newVehForm.model}
                    onChange={(e) => setNewVehForm({ ...newVehForm, model: e.target.value })}
                    placeholder="e.g. Hyundai Creta SX"
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Nickname</label>
                  <input
                    type="text"
                    value={newVehForm.nickname}
                    onChange={(e) => setNewVehForm({ ...newVehForm, nickname: e.target.value })}
                    placeholder="e.g. City Commuter"
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">FASTag Bank / Issuer</label>
                  <input
                    type="text"
                    value={newVehForm.fastagBank}
                    onChange={(e) => setNewVehForm({ ...newVehForm, fastagBank: e.target.value })}
                    placeholder="e.g. SBI FASTag / ICICI"
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Initial FASTag Balance (₹)</label>
                  <input
                    type="number"
                    value={newVehForm.fastagBalance}
                    onChange={(e) => setNewVehForm({ ...newVehForm, fastagBalance: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setAddVehModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Save to Firestore
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
