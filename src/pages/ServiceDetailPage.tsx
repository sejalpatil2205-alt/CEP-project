import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Banknote, 
  FileCheck, 
  FileText, 
  HelpCircle, 
  Share2, 
  ShieldCheck, 
  Smartphone,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Building,
  Bookmark,
  PlusCircle,
  Lock
} from 'lucide-react';
import { EService } from '../types';
import { SERVICES_DATA } from '../data/servicesData';
import { ServiceCard } from '../components/ServiceCard';
import { useAuth } from '../context/AuthContext';
import { 
  getServiceChecklist, 
  saveServiceChecklist,
  saveUserApplication 
} from '../lib/firebase';
import { recordServiceAccess } from '../lib/activityService';

interface ServiceDetailPageProps {
  serviceIdOrSlug: string;
  onNavigate: (path: string) => void;
  onSelectService: (slugOrId: string) => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({
  serviceIdOrSlug,
  onNavigate,
  onSelectService
}) => {
  const { user, isBookmarked, toggleBookmark, setAuthModalOpen } = useAuth();
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [copiedLink, setCopiedLink] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [appNumberInput, setAppNumberInput] = useState('');
  const [appTrackSuccess, setAppTrackSuccess] = useState(false);

  // Find the target service
  const service = SERVICES_DATA.find(
    (s) => s.id === serviceIdOrSlug || s.slug === serviceIdOrSlug
  ) || SERVICES_DATA[0];

  // Automatically record this service in citizen's Recent Activity
  useEffect(() => {
    if (service) {
      recordServiceAccess({
        id: service.id,
        title: service.title,
        category: service.category,
        shortDescription: service.shortDescription,
        department: service.department,
        officialUrl: service.officialUrl
      }, user?.uid, 'view_details');
    }
  }, [service?.id, user?.uid]);

  // Recently viewed / recommended (3 related items)
  const recentlyViewed = SERVICES_DATA
    .filter((s) => s.id !== service.id)
    .slice(0, 3);

  const bookmarked = isBookmarked(service.id);

  // Load checklist state from Firestore on mount or user change
  useEffect(() => {
    let active = true;
    const loadChecklist = async () => {
      if (user) {
        const savedList = await getServiceChecklist(user.uid, service.id);
        if (active) {
          const map: Record<string, boolean> = {};
          savedList.forEach((docName) => {
            map[docName] = true;
          });
          setCheckedDocs(map);
        }
      } else {
        const localKey = `esh_chk_${service.id}`;
        const localData = localStorage.getItem(localKey);
        if (localData && active) {
          try {
            setCheckedDocs(JSON.parse(localData));
          } catch {
            setCheckedDocs({});
          }
        } else if (active) {
          setCheckedDocs({});
        }
      }
    };

    loadChecklist();
    setOpenFaqIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      active = false;
    };
  }, [service.id, user]);

  // Toggle document checklist with auto-save to Firestore
  const toggleDoc = async (docName: string) => {
    const updated = {
      ...checkedDocs,
      [docName]: !checkedDocs[docName]
    };
    setCheckedDocs(updated);

    const checkedArray = Object.keys(updated).filter((k) => updated[k]);

    if (user) {
      await saveServiceChecklist(user.uid, service.id, checkedArray);
    } else {
      localStorage.setItem(`esh_chk_${service.id}`, JSON.stringify(updated));
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleSaveToTracker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    await saveUserApplication(user.uid, {
      serviceId: service.id,
      serviceTitle: service.title,
      applicationNumber: appNumberInput.trim() || `ARN-${Math.floor(100000 + Math.random() * 900000)}`,
      portalName: service.department || service.title,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Submitted',
      notes: `Applied on official portal: ${service.officialUrl}`
    });

    setAppTrackSuccess(true);
    setTimeout(() => {
      setAppTrackSuccess(false);
      setTrackModalOpen(false);
      setAppNumberInput('');
      onNavigate('/tracker');
    }, 1200);
  };

  const docsCheckedCount = Object.values(checkedDocs).filter(Boolean).length;
  const totalDocs = service.documents.length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between gap-4">
        <button
          id="btn-back-to-services"
          onClick={() => onNavigate('/services')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-blue-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Services Catalog</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Bookmark Button */}
          <button
            onClick={() => toggleBookmark(service.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
              bookmarked
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span>{bookmarked ? 'Saved in Bookmarks' : 'Bookmark'}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-medium cursor-pointer transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-400" />
            <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main Service Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            {service.category}
          </span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            Jurisdiction: {service.state}
          </span>
          {service.department && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <Building className="w-3 h-3" /> {service.department}
            </span>
          )}
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {service.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            {service.shortDescription}
          </p>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Processing Time</div>
              <div className="font-bold text-slate-900">{service.processingTime}</div>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Banknote className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Government Fees</div>
              <div className="font-bold text-slate-900 truncate">{service.fees.split(';')[0]}</div>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Official Mobile App</div>
              <div className="font-bold text-slate-900">{service.officialAppName || 'Web Direct'}</div>
            </div>
          </div>
        </div>

        {/* Direct Action Portal & Tracker CTAs */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 border border-blue-200">
          <div className="space-y-0.5 text-center sm:text-left">
            <div className="text-xs font-bold text-blue-900 flex items-center justify-center sm:justify-start gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Direct Link to Verified Government Portal</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Opens the authentic public service endpoint in a secure new tab.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setTrackModalOpen(true)}
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Track My Application</span>
            </button>

            <a
              id="btn-go-to-official-portal"
              href={service.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <span>Go to Official Portal</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Grid of Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: Overview */}
          <section className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>What is this service?</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {service.overview}
            </p>
          </section>

          {/* Section 2: Eligibility Criteria */}
          <section className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Eligibility Criteria</span>
            </h2>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
              {service.eligibility.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-2" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 3: Step by Step Application Guide */}
          <section className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>How to Apply (Step by Step)</span>
              </h2>
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
                {service.steps.length} Steps
              </span>
            </div>

            <div className="space-y-4 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-slate-200/80">
              {service.steps.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 z-10 shadow-xs ring-4 ring-white">
                    {idx + 1}
                  </div>
                  <div className="bg-slate-50/90 p-3.5 rounded-2xl border border-slate-200/80 flex-1 text-xs sm:text-sm text-slate-800 leading-relaxed">
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: FAQs */}
          {service.faqs && service.faqs.length > 0 && (
            <section className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                <span>Frequently Asked Questions (FAQs)</span>
              </h2>

              <div className="space-y-3">
                {service.faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-slate-200 rounded-2xl overflow-hidden transition-colors"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full text-left p-4 bg-slate-50/70 hover:bg-slate-100/70 flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-900 cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="p-4 bg-white text-xs sm:text-sm text-slate-700 border-t border-slate-200 leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* Right Col: Interactive Checklist & Fees & Official Card */}
        <div className="space-y-6">
          {/* Required Documents Interactive Checklist (Firestore Synced) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-600" />
                <span>Required Documents</span>
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {docsCheckedCount}/{totalDocs} Ready
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Interactive Checklist</span>
              {user ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                  Synced to Cloud
                </span>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Sign In to Sync
                </button>
              )}
            </div>

            <div className="space-y-2">
              {service.documents.map((doc, idx) => {
                const isChecked = !!checkedDocs[doc];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleDoc(doc)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start gap-2.5 cursor-pointer ${
                      isChecked
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-medium'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 mt-0.5 pointer-events-none"
                    />
                    <span className="leading-snug">{doc}</span>
                  </button>
                );
              })}
            </div>

            {/* Fees Breakdown Box */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Banknote className="w-4 h-4 text-emerald-600" />
                <span>Fees & Government Rates</span>
              </h4>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
                {service.fees}
              </div>
            </div>

            {/* Official Button */}
            <div className="pt-2">
              <a
                href={service.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm text-center flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <span>Go to Official Portal</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Track Application Modal */}
      {trackModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <span>Track {service.title}</span>
              </h3>
              <button
                onClick={() => setTrackModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {appTrackSuccess ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Application Saved in Cloud!</h4>
                <p className="text-xs text-slate-600">
                  Redirecting to your Applications Tracker...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSaveToTracker} className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Enter your acknowledgment receipt or reference number generated after applying on the official portal.
                </p>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Application / ACK / ARN Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={appNumberInput}
                    onChange={(e) => setAppNumberInput(e.target.value)}
                    placeholder="e.g. DL-142021001239 or ARN-9812401"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-xs text-purple-900">
                  <strong>Service:</strong> {service.title} ({service.department || 'National Portal'})
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setTrackModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Save to Firestore Tracker
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Recently Viewed / Related Services Section */}
      <section className="pt-8 border-t border-slate-200 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            Recently Viewed & Related Services
          </h3>
          <button
            onClick={() => onNavigate('/services')}
            className="text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
          >
            Browse All Services →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recentlyViewed.map((svc) => (
            <ServiceCard
              key={svc.id}
              service={svc}
              onViewDetails={onSelectService}
              compact={true}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
