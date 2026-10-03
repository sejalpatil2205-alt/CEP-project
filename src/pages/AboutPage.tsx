import React from 'react';
import { 
  ShieldCheck, 
  Info, 
  Database, 
  Lock, 
  Globe2, 
  CheckCircle2, 
  AlertTriangle,
  Compass,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold border border-blue-200">
          <Info className="w-3.5 h-3.5 text-blue-700" />
          <span>About E-Services</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Simplifying Digital India for Citizens
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          An open, citizen-first informational guide mapping out government, banking, travel, utility, and transport e-services in one structured portal.
        </p>
      </div>

      {/* Purpose Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
          <Compass className="w-6 h-6 text-blue-600" />
          <span>Our Mission & Purpose</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          <strong>This site helps citizens find all online services in one place with clear steps and direct links to official portals.</strong>
        </p>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          With thousands of central and state digital services available across different portals (Parivahan, UIDAI, Income Tax, DigiLocker, NVSP, PM-JAY, State Discoms), navigating requirements, eligibility criteria, and fee structures can often be confusing. E-Services organizes these services into simple, structured, and easily searchable checklists.
        </p>
      </div>

      {/* Non-Affiliation Disclaimer Box */}
      <div className="bg-amber-50/90 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 space-y-4 text-amber-950">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-amber-800" />
          </div>
          <div>
            <h3 className="text-lg font-black text-amber-950">
              Important Legal & Non-Affiliation Disclaimer
            </h3>
            <p className="text-xs text-amber-800 font-medium">
              Mandatory citizen advisory
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-amber-900/90 leading-relaxed">
          <p>
            <strong>E-Services is strictly NOT an official government website</strong> and is not associated, affiliated, endorsed, or authorized by the Government of India, any State Government, or any Government Department.
          </p>
          <p>
            This portal does NOT process applications, does NOT issue government documents, does NOT store Aadhaar credentials, and does NOT collect government fees. All official applications and payments must be completed exclusively on official portals (e.g. <code>.gov.in</code>, <code>.nic.in</code>, or certified banking domains).
          </p>
        </div>
      </div>

      {/* How Data is Collected */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            <span>How Data is Collected & Maintained</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            All informational data, document checklists, fees, and procedures published on this website are gathered from verified public domain repositories, including:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
          <a
            href="https://india.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-colors flex items-center justify-between"
          >
            <span className="font-semibold text-slate-800">National Portal of India (india.gov.in)</span>
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </a>
          <a
            href="https://services.india.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-colors flex items-center justify-between"
          >
            <span className="font-semibold text-slate-800">National Services Portal (services.india.gov.in)</span>
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </a>
          <a
            href="https://parivahan.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-colors flex items-center justify-between"
          >
            <span className="font-semibold text-slate-800">Ministry of Road Transport (parivahan.gov.in)</span>
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </a>
          <a
            href="https://uidai.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-colors flex items-center justify-between"
          >
            <span className="font-semibold text-slate-800">Unique Identification Authority (uidai.gov.in)</span>
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">100% Free & Open</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            No premium paywalls or subscription gates. All citizen information is completely open and free.
          </p>
        </div>

        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Privacy by Design</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            We never store personal data, passwords, biometric details, or payment card numbers.
          </p>
        </div>

        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Globe2 className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Direct Redirects</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            All portal links point straight to authorized .gov.in and certified financial domains.
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-4">
        <button
          onClick={() => onNavigate('/services')}
          className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer inline-flex items-center gap-2"
        >
          <span>Explore All 20+ E-Services</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
