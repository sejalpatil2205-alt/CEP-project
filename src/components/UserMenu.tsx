import React, { useState, useRef, useEffect } from 'react';
import { 
  User as UserIcon, 
  LogOut, 
  Bookmark, 
  Car, 
  FileText, 
  ShieldCheck, 
  ChevronDown, 
  ExternalLink,
  Sparkles,
  Layers,
  Database,
  History,
  CreditCard,
  Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SERVICES_DATA } from '../data/servicesData';

interface UserMenuProps {
  onNavigate: (path: string) => void;
  onSelectService: (serviceId: string) => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ onNavigate, onSelectService }) => {
  const { user, logoutUser, bookmarks, setAuthModalOpen } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <button
        id="btn-nav-sign-in"
        onClick={() => setAuthModalOpen(true)}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
      >
        <UserIcon className="w-3.5 h-3.5" />
        <span>Sign In</span>
      </button>
    );
  }

  // Filter bookmarked service items
  const bookmarkedServices = SERVICES_DATA.filter((s) => bookmarks.includes(s.id));

  return (
    <div className="relative" ref={menuRef}>
      <button
        id="btn-user-profile-menu"
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer text-left"
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || 'User'}
            className="w-7 h-7 rounded-full object-cover border border-slate-300"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
            {(user.displayName || user.email || 'C')[0].toUpperCase()}
          </div>
        )}
        <div className="hidden sm:block text-left max-w-[110px]">
          <div className="text-xs font-bold text-slate-800 truncate">
            {user.displayName || (user.isAnonymous ? 'Guest Citizen' : 'Citizen')}
          </div>
          <div className="text-[10px] text-emerald-600 flex items-center gap-0.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>Cloud Synced</span>
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
      </button>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in-50">
          {/* User Details Header */}
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="w-10 h-10 rounded-full border border-slate-200"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                {(user.displayName || user.email || 'C')[0].toUpperCase()}
              </div>
            )}
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-slate-900 truncate">
                {user.displayName || (user.isAnonymous ? 'Guest Citizen Profile' : 'Citizen')}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                {user.email || 'guest@citizen.demo'}
              </div>
              <div className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-mono mt-0.5 inline-block border border-blue-100">
                Firestore UID: {user.uid.slice(0, 8)}...
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-2 space-y-1">
            <button
              onClick={() => {
                setMenuOpen(false);
                onNavigate('/vehicle-dashboard?tab=recent-activity');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors text-left cursor-pointer"
            >
              <History className="w-4 h-4 text-amber-600" />
              <span>Recent Activity History</span>
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                onNavigate('/women-bus-card');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors text-left cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-rose-600" />
              <span>Women Bus Card (MSRTC)</span>
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                onNavigate('/vehicle-search');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors text-left cursor-pointer"
            >
              <Search className="w-4 h-4 text-emerald-600" />
              <span>MH Vehicle Info Search</span>
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                onNavigate('/vehicle-dashboard');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors text-left cursor-pointer"
            >
              <Car className="w-4 h-4 text-blue-600" />
              <span>My Saved Vehicles & FASTag</span>
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                onNavigate('/tracker');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors text-left cursor-pointer"
            >
              <FileText className="w-4 h-4 text-purple-600" />
              <span>My Applications Tracker (Firestore)</span>
            </button>
          </div>

          {/* Bookmarked Services Section */}
          <div className="px-3 py-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1 mb-1.5">
              <span className="flex items-center gap-1">
                <Bookmark className="w-3 h-3 text-amber-500" />
                <span>Saved Services ({bookmarkedServices.length})</span>
              </span>
            </div>

            {bookmarkedServices.length > 0 ? (
              <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                {bookmarkedServices.map((svc) => (
                  <button
                    key={svc.id}
                    onClick={() => {
                      setMenuOpen(false);
                      onSelectService(svc.id);
                    }}
                    className="w-full text-left p-1.5 rounded-lg hover:bg-slate-50 flex items-center justify-between text-xs text-slate-800 transition-colors group cursor-pointer"
                  >
                    <span className="truncate group-hover:text-blue-600 font-medium">
                      {svc.title}
                    </span>
                    <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded shrink-0 ml-1">
                      {svc.category}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 px-1 py-1 italic">
                No starred services yet. Click the bookmark icon on any service card!
              </p>
            )}
          </div>

          {/* Sign Out Button */}
          <div className="p-2 border-t border-slate-100">
            <button
              id="btn-sign-out"
              onClick={() => {
                setMenuOpen(false);
                logoutUser();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
