import React from 'react';
import { 
  ShieldAlert, 
  ExternalLink, 
  Heart, 
  HelpCircle, 
  Car, 
  FileText, 
  Building, 
  Phone,
  Compass
} from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = 2026;

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      {/* Disclaimer Banner Box */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="bg-amber-950/40 border border-amber-500/30 rounded-2xl p-4 sm:p-5 text-amber-200/90 text-xs sm:text-sm flex items-start gap-3.5 shadow-inner">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-amber-300">
              Important Citizen Notice & Non-Affiliation Disclaimer
            </p>
            <p className="text-amber-200/80 leading-relaxed">
              <strong>E-Services</strong> is purely an independent informational directory and reference guide. 
              This website is <strong>NOT an official government website</strong> and is not affiliated with the Government of India or any State Ministry. 
              We do not collect government fees, process applications, or ask for login passwords. All official applications, payments, and verifications must be completed directly on authentic official government portals (such as <code>.gov.in</code>, <code>.nic.in</code>) or verified bank portals.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-800">
          {/* Col 1: About Hub */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center text-white shadow-md">
                <Compass className="w-5 h-5 text-orange-400" />
              </div>
              <span className="font-bold text-lg text-white">
                E-Services
              </span>
              <span className="text-xs text-orange-400 font-semibold px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                Directory
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pr-4">
              Your unified informational gateway for Indian public e-services. Find accurate document checklists, eligibility criteria, step-by-step application flows, and direct links to official government and utility portals.
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                🇮🇳 Made for Indian Citizens
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-emerald-400 border border-slate-700">
                ✓ 100% Free Information
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-blue-400 border border-slate-700">
                🔒 Zero Data Harvesting
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <button
                  onClick={() => { onNavigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('/services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  All E-Services Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('/women-services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors text-rose-400 font-medium cursor-pointer flex items-center gap-1"
                >
                  Women & Child Welfare Hub
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('/tracker'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors text-amber-400 font-medium cursor-pointer flex items-center gap-1"
                >
                  Process Tracking & ARN Lookup
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('/vehicle-dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors text-orange-400 font-medium cursor-pointer flex items-center gap-1"
                >
                  <Car className="w-3.5 h-3.5" /> Vehicle & FASTag Hub
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('/about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About This Initiative
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('/contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact & Feedback
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Vehicle & Gov Hubs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Featured Official Portals
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <a
                  href="https://parivahan.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  Parivahan Sewa (MoRTH) <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://ihmcl.co.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  NHAI FASTag Portal <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://myaadhaar.uidai.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  myAadhaar (UIDAI) <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.incometax.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  e-Filing (Income Tax) <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://voters.eci.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  Election Commission (ECI) <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.passportindia.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  Passport Seva Kendra <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: National Citizen Helplines */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              National Helplines
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/60">
                <div className="text-[11px] text-rose-300">National Women Helpline (NCW)</div>
                <div className="font-bold text-rose-400 text-sm">7827170170 / 181</div>
              </div>
              <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/60">
                <div className="text-[11px] text-slate-400">NHAI FASTag Highway Support</div>
                <div className="font-bold text-emerald-400 text-sm">1033 (Toll Free)</div>
              </div>
              <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/60">
                <div className="text-[11px] text-slate-400">National Cyber Crime Helpline</div>
                <div className="font-bold text-amber-400 text-sm">1930</div>
              </div>
              <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/60">
                <div className="text-[11px] text-slate-400">National Emergency Response</div>
                <div className="font-bold text-white text-sm">112</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {currentYear} E-Services. Non-commercial public information portal.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>Public Data Sources: india.gov.in & parivahan.gov.in</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
