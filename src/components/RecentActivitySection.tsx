import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  ArrowRight, 
  ExternalLink, 
  Trash2, 
  History, 
  Sparkles, 
  ShieldCheck, 
  Car, 
  HeartHandshake, 
  Building2, 
  CheckCircle2, 
  RefreshCw,
  Zap,
  Tag
} from 'lucide-react';
import { UserActivityItem } from '../types';
import { 
  subscribeRecentActivities, 
  clearUserRecentActivity, 
  seedSampleActivities,
  recordServiceAccess
} from '../lib/activityService';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface RecentActivitySectionProps {
  onSelectService: (serviceId: string) => void;
  onNavigate?: (path: string) => void;
  compact?: boolean;
}

export const RecentActivitySection: React.FC<RecentActivitySectionProps> = ({
  onSelectService,
  onNavigate,
  compact = false
}) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [activities, setActivities] = useState<UserActivityItem[]>([]);
  const [clearing, setClearing] = useState(false);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeRecentActivities(user?.uid, (items) => {
      setActivities(items);
    });

    return () => {
      unsubscribe();
    };
  }, [user?.uid]);

  const handleClear = async () => {
    if (window.confirm(language === 'hi' ? 'क्या आप हाल की गतिविधियों का इतिहास हटाना चाहते हैं?' : 'Clear your recent service access history?')) {
      setClearing(true);
      await clearUserRecentActivity(user?.uid);
      setClearing(false);
    }
  };

  const handleSeedDemo = async () => {
    setSeeding(true);
    await seedSampleActivities(user?.uid);
    setSeeding(false);
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const now = new Date();
      const date = new Date(isoString);
      const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diffSeconds < 60) {
        return language === 'hi' ? 'अभी-अभी' : 'Just now';
      }
      const diffMinutes = Math.floor(diffSeconds / 60);
      if (diffMinutes < 60) {
        return language === 'hi' ? `${diffMinutes} मिनट पहले` : `${diffMinutes}m ago`;
      }
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) {
        return language === 'hi' ? `${diffHours} घंटे पहले` : `${diffHours}h ago`;
      }
      return date.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
        day: 'numeric',
        month: 'short'
      });
    } catch {
      return language === 'hi' ? 'हाल ही में' : 'Recently';
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Vehicle Services':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Women Welfare':
        return 'bg-pink-50 text-pink-800 border-pink-200';
      case 'Banking':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-blue-50 text-blue-800 border-blue-200';
    }
  };

  const getActionLabel = (item: UserActivityItem) => {
    switch (item.actionType) {
      case 'recharge':
        return language === 'hi' ? 'फास्टैग रिचार्ज खोला' : 'Recharge Portal Accessed';
      case 'challan_check':
        return language === 'hi' ? 'ई-चालान जांच खोला' : 'Challan Lookup Checked';
      case 'scheme_apply':
        return language === 'hi' ? 'योजना विवरण देखा' : 'Welfare Scheme Accessed';
      default:
        return language === 'hi' ? 'सेवा विवरण देखा' : 'Service Details Viewed';
    }
  };

  return (
    <section 
      id="dashboard-recent-activity-section"
      className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden"
    >
      {/* Section Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-900 via-slate-900 to-amber-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0">
            <History className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {language === 'hi' ? 'हाल की गतिविधियां (अंतिम 5 सेवाएं)' : 'Recent Activity'}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                {language === 'hi' ? 'ऑटो-रिकॉर्डेड' : 'Live Recorded'}
              </span>
            </div>
            <p className="text-xs text-stone-300">
              {language === 'hi' 
                ? 'आपके द्वारा हाल ही में उपयोग की गई अंतिम 5 ऑनलाइन सेवाओं का रिकॉर्ड' 
                : 'Automatically records and displays the last five services you have accessed.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          {activities.length > 0 && (
            <button
              onClick={handleClear}
              disabled={clearing}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Clear recent activity history"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'इतिहास साफ़ करें' : 'Clear History'}</span>
            </button>
          )}

          {activities.length === 0 && (
            <button
              onClick={handleSeedDemo}
              disabled={seeding}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'डेमो लोड करें' : 'Load Demo Activity'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Content Area: Last Five Services */}
      <div className="p-4 sm:p-5">
        {activities.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-500 px-1 font-medium">
              <span>{language === 'hi' ? 'अंतिम 5 एक्सेस की गई सेवाएं' : 'Last 5 Services Accessed'}</span>
              <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-bold">
                {activities.length} / 5 {language === 'hi' ? 'दर्ज' : 'Stored'}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {activities.slice(0, 5).map((item, index) => (
                <div
                  key={item.id || index}
                  className="p-3 sm:p-4 rounded-xl border border-stone-200/90 hover:border-amber-400 bg-stone-50/60 hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group shadow-2xs hover:shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-stone-200 text-stone-700 font-extrabold text-xs flex items-center justify-center shrink-0 shadow-2xs group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-500 transition-colors">
                      #{index + 1}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 
                          onClick={() => onSelectService(item.serviceId)}
                          className="font-bold text-sm text-stone-900 group-hover:text-amber-800 transition-colors cursor-pointer hover:underline"
                        >
                          {item.serviceTitle}
                        </h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryColor(item.category)}`}>
                          {item.category}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                        <span className="flex items-center gap-1 font-medium text-amber-900/80">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>{formatRelativeTime(item.accessedAt)}</span>
                        </span>

                        <span className="text-stone-300">•</span>

                        <span className="text-stone-600 font-medium text-[11px]">
                          {getActionLabel(item)}
                        </span>

                        {item.department && (
                          <>
                            <span className="text-stone-300">•</span>
                            <span className="text-stone-400 text-[11px] truncate max-w-[200px]">
                              {item.department}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {item.officialUrl && (
                      <a
                        href={item.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1"
                        title="Open Official Portal"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="hidden md:inline text-[11px] font-medium">Portal</span>
                      </a>
                    )}

                    <button
                      onClick={() => onSelectService(item.serviceId)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer group-hover:translate-x-0.5"
                    >
                      <span>{language === 'hi' ? 'दोबारा खोलें' : 'Access Service'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-8 px-4 rounded-xl border border-dashed border-stone-300 bg-stone-50/50">
            <div className="w-12 h-12 mx-auto rounded-full bg-stone-200/80 flex items-center justify-center text-stone-500 mb-3">
              <Clock className="w-6 h-6 text-stone-400" />
            </div>
            <h4 className="text-sm font-bold text-stone-800">
              {language === 'hi' ? 'कोई हाल की गतिविधि दर्ज नहीं है' : 'No Recent Service Activity Yet'}
            </h4>
            <p className="text-xs text-stone-500 max-w-md mx-auto mt-1 mb-4 leading-relaxed">
              {language === 'hi'
                ? 'पोर्टल पर किसी भी सेवा (जैसे फास्टैग, ई-चालान, महिला योजनाएं) को खोलें। वह स्वतः यहां आपकी हाल की गतिविधियों में जुड़ जाएगी।'
                : 'Access any service on the portal (such as FASTag, e-Challan, or Women Welfare schemes), and it will automatically appear here.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => onSelectService('fastag-recharge')}
                className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:border-amber-400 text-stone-700 text-xs font-semibold shadow-2xs hover:bg-amber-50 cursor-pointer"
              >
                + FASTag Recharge
              </button>
              <button
                onClick={() => onSelectService('echallan-payment')}
                className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:border-amber-400 text-stone-700 text-xs font-semibold shadow-2xs hover:bg-amber-50 cursor-pointer"
              >
                + Check e-Challan
              </button>
              <button
                onClick={() => onSelectService('pmmvy-maternity-benefit')}
                className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:border-amber-400 text-stone-700 text-xs font-semibold shadow-2xs hover:bg-amber-50 cursor-pointer"
              >
                + PMMVY Maternity
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
