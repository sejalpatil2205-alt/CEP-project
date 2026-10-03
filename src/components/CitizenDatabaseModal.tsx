import React, { useState, useEffect } from 'react';
import { 
  Database, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Car, 
  FileText, 
  Bookmark, 
  Languages, 
  Save, 
  RefreshCw, 
  ExternalLink,
  UserCheck,
  Server,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  db, 
  updateUserCitizenProfile, 
  fetchUserCitizenProfile, 
  subscribeUserVehicles, 
  subscribeUserApplications,
  subscribeUserWomenBusCards 
} from '../lib/firebase';
import { UserVehicleRecord, UserApplicationTracker, WomenBusCardApplication } from '../types';

interface CitizenDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const CitizenDatabaseModal: React.FC<CitizenDatabaseModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const { user, bookmarks, setAuthModalOpen } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [vehicles, setVehicles] = useState<UserVehicleRecord[]>([]);
  const [applications, setApplications] = useState<UserApplicationTracker[]>([]);
  const [womenBusCards, setWomenBusCards] = useState<WomenBusCardApplication[]>([]);

  // Profile fields stored in Firestore
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [state, setState] = useState('Maharashtra');

  useEffect(() => {
    if (user) {
      setFullName(user.displayName || '');
      // Load from Firestore
      fetchUserCitizenProfile(user.uid).then((prof) => {
        if (prof) {
          if (prof.displayName) setFullName(prof.displayName);
          if (prof.phoneNumber) setPhoneNumber(prof.phoneNumber);
          if (prof.state) setState(prof.state);
          if (prof.preferredLanguage && (prof.preferredLanguage === 'en' || prof.preferredLanguage === 'mr' || prof.preferredLanguage === 'hi')) {
            setLanguage(prof.preferredLanguage);
          }
        }
      });

      // Subscriptions
      const unsubVeh = subscribeUserVehicles(user.uid, (list) => setVehicles(list));
      const unsubApps = subscribeUserApplications(user.uid, (list) => setApplications(list));
      const unsubWbc = subscribeUserWomenBusCards(user.uid, (list) => setWomenBusCards(list));

      return () => {
        unsubVeh();
        unsubApps();
        unsubWbc();
      };
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSaveToFirestore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setSaving(true);
    setSaveSuccess(false);
    try {
      await updateUserCitizenProfile(user.uid, {
        displayName: fullName,
        phoneNumber,
        state,
        preferredLanguage: language
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save to Firestore:', err);
    } finally {
      setSaving(false);
    }
  };

  const indianStates = [
    'All India / Central',
    'Andhra Pradesh',
    'Assam',
    'Bihar',
    'Delhi NCR',
    'Gujarat',
    'Haryana',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Punjab',
    'Rajasthan',
    'Tamil Nadu',
    'Telangana',
    'Uttar Pradesh',
    'West Bengal'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in-50 zoom-in-95">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-stone-900 text-white p-5 sm:p-6 flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300 shadow-inner">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-white">
                  {t.citizenDbTitle}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Active Firestore
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {t.citizenDbDesc}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Database Status Strip */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-600" />
            <span>Database: <strong className="font-mono text-slate-800">Firestore (NoSQL Cloud)</strong></span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-500">
              Storage: <strong className="text-emerald-700">Persisted in Realtime</strong>
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Quick Metrics of Stored Data in Firestore */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              Your Cloud Stored Records
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div 
                onClick={() => { onClose(); onNavigate('/vehicle-dashboard'); }}
                className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl hover:shadow-xs transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-amber-700 mb-1">
                  <Car className="w-4 h-4" />
                  <span className="text-xs font-bold">{vehicles.length}</span>
                </div>
                <div className="text-xs font-bold text-slate-800 group-hover:text-amber-700">
                  {t.dbSavedVehicles}
                </div>
                <div className="text-[10px] text-slate-500">
                  FASTag & RC
                </div>
              </div>

              <div 
                onClick={() => { onClose(); onNavigate('/women-bus-card'); }}
                className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl hover:shadow-xs transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-rose-700 mb-1">
                  <CreditCard className="w-4 h-4" />
                  <span className="text-xs font-bold">{womenBusCards.length}</span>
                </div>
                <div className="text-xs font-bold text-slate-800 group-hover:text-rose-700">
                  Bus Cards
                </div>
                <div className="text-[10px] text-slate-500">
                  MSRTC Passes
                </div>
              </div>

              <div 
                onClick={() => { onClose(); onNavigate('/tracker'); }}
                className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl hover:shadow-xs transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-purple-700 mb-1">
                  <FileText className="w-4 h-4" />
                  <span className="text-xs font-bold">{applications.length}</span>
                </div>
                <div className="text-xs font-bold text-slate-800 group-hover:text-purple-700">
                  {t.dbSavedApps}
                </div>
                <div className="text-[10px] text-slate-500">
                  ARN Trackers
                </div>
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
                <div className="flex items-center justify-between text-blue-700 mb-1">
                  <Bookmark className="w-4 h-4" />
                  <span className="text-xs font-bold">{bookmarks.length}</span>
                </div>
                <div className="text-xs font-bold text-slate-800">
                  {t.dbSavedBookmarks}
                </div>
                <div className="text-[10px] text-slate-500">
                  Starred Guides
                </div>
              </div>
            </div>
          </div>

          {/* User Profile & Preferences Form Stored in Firestore */}
          <form onSubmit={handleSaveToFirestore} className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span>Citizen Profile Data (Firestore: /users/{user?.uid ? user.uid.slice(0, 6) + '...' : 'current'})</span>
              </h4>
              <span className="text-[11px] text-slate-400">
                {user ? (user.isAnonymous ? 'Guest Account' : 'Google Auth') : 'Not Signed In'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name / Citizen Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Sharma"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Mobile Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Resident State / Jurisdiction
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {indianStates.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Language (भाषा)
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'mr' | 'hi')}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="en">English (Official Gateway)</option>
                  <option value="mr">मराठी (महाराष्ट्र राजभाषा)</option>
                  <option value="hi">हिन्दी (राष्ट्रभाषा)</option>
                </select>
              </div>
            </div>

            {saveSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Changes successfully updated and stored in Firebase Firestore!</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Encrypted & bound by Zero-Trust Firestore Security Rules
              </span>

              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save to Database</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick links to full database views */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">
              Want to manage specific database items?
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => { onClose(); onNavigate('/vehicle-dashboard'); }}
                className="text-blue-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Vehicle Garage</span>
                <ExternalLink className="w-3 h-3" />
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={() => { onClose(); onNavigate('/tracker'); }}
                className="text-purple-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Applications</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
