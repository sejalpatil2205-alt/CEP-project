import React from 'react';
import { 
  CreditCard, 
  Tag, 
  Wallet, 
  AlertCircle, 
  FileBadge, 
  FileText, 
  ShieldCheck, 
  Gauge, 
  Landmark, 
  Car, 
  Vote, 
  Globe, 
  Fingerprint, 
  FolderLock, 
  HeartPulse, 
  Coins, 
  Train, 
  Zap, 
  GraduationCap, 
  ArrowRight,
  ExternalLink,
  Clock,
  Banknote,
  Bookmark
} from 'lucide-react';
import { EService } from '../types';
import { useAuth } from '../context/AuthContext';

interface ServiceCardProps {
  service: EService;
  onViewDetails: (slugOrId: string) => void;
  compact?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ 
  service, 
  onViewDetails,
  compact = false 
}) => {
  const { isBookmarked, toggleBookmark } = useAuth();
  const bookmarked = isBookmarked(service.id);

  // Dynamic icon selector based on service iconName
  const renderIcon = () => {
    const iconClass = "w-5 h-5";
    switch (service.iconName) {
      case 'CreditCard': return <CreditCard className={iconClass} />;
      case 'Tag': return <Tag className={iconClass} />;
      case 'Wallet': return <Wallet className={iconClass} />;
      case 'AlertCircle': return <AlertCircle className={iconClass} />;
      case 'FileBadge': return <FileBadge className={iconClass} />;
      case 'FileText': return <FileText className={iconClass} />;
      case 'ShieldCheck': return <ShieldCheck className={iconClass} />;
      case 'Gauge': return <Gauge className={iconClass} />;
      case 'Landmark': return <Landmark className={iconClass} />;
      case 'Car': return <Car className={iconClass} />;
      case 'Vote': return <Vote className={iconClass} />;
      case 'Globe': return <Globe className={iconClass} />;
      case 'Fingerprint': return <Fingerprint className={iconClass} />;
      case 'FolderLock': return <FolderLock className={iconClass} />;
      case 'HeartPulse': return <HeartPulse className={iconClass} />;
      case 'Coins': return <Coins className={iconClass} />;
      case 'Train': return <Train className={iconClass} />;
      case 'Zap': return <Zap className={iconClass} />;
      case 'GraduationCap': return <GraduationCap className={iconClass} />;
      default: return <FileText className={iconClass} />;
    }
  };

  // Warm tone badge styles based on category
  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'Vehicle Services':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Government':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Banking':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'Health':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'Education':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Travel':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Utilities':
        return 'bg-stone-100 text-stone-800 border-stone-300';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmark(service.id);
  };

  return (
    <div 
      id={`service-card-${service.id}`}
      className="group bg-white rounded-2xl border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all duration-200 flex flex-col justify-between overflow-hidden"
    >
      <div className="p-5 sm:p-6 space-y-4">
        {/* Top bar with Icon, Badges, and Bookmark */}
        <div className="flex items-start justify-between gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs transition-transform group-hover:scale-105 ${
            service.category === 'Vehicle Services' 
              ? 'bg-gradient-to-br from-amber-600 to-orange-600 text-white' 
              : 'bg-stone-900 text-white'
          }`}>
            {renderIcon()}
          </div>

          <div className="flex items-center gap-1.5">
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${getCategoryStyles(service.category)}`}>
              {service.category}
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200">
              {service.state}
            </span>
            <button
              onClick={handleBookmarkClick}
              title={bookmarked ? "Saved in Bookmarks" : "Save service"}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                bookmarked
                  ? 'bg-amber-100 border-amber-300 text-amber-700 hover:bg-amber-200'
                  : 'bg-stone-50 border-stone-200 text-stone-400 hover:text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-amber-600 text-amber-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title and Short Description */}
        <div>
          <h3 className="font-bold text-stone-900 text-base sm:text-lg group-hover:text-amber-700 transition-colors leading-snug">
            {service.title}
          </h3>
          {service.department && (
            <p className="text-[11px] font-medium text-stone-500 mt-0.5">
              {service.department}
            </p>
          )}
          <p className="text-xs sm:text-sm text-stone-600 mt-2 line-clamp-2 leading-relaxed">
            {service.shortDescription}
          </p>
        </div>

        {/* Quick Meta Info */}
        {!compact && (
          <div className="pt-2 border-t border-stone-100 grid grid-cols-2 gap-2 text-xs text-stone-500">
            <div className="flex items-center gap-1.5 truncate">
              <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span className="truncate">{service.processingTime}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Banknote className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span className="truncate">{service.fees.includes('Free') ? 'Free Service' : 'Govt Fees Apply'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Card Action Footer */}
      <div className="px-5 py-3.5 sm:px-6 bg-stone-50/80 border-t border-stone-100 flex items-center justify-between gap-3">
        <button
          id={`btn-view-${service.id}`}
          onClick={() => onViewDetails(service.slug || service.id)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-amber-800 hover:text-amber-950 group-hover:translate-x-0.5 transition-all cursor-pointer py-1"
        >
          <span>View Details & Guide</span>
          <ArrowRight className="w-4 h-4 text-amber-600 group-hover:text-amber-800" />
        </button>

        <a
          href={service.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Open official portal in new tab"
          className="hidden sm:inline-flex items-center gap-1 text-stone-400 hover:text-stone-700 text-xs transition-colors"
        >
          <span>Portal</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
