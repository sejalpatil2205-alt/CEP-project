import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  ArrowUpDown, 
  X, 
  Layers, 
  Car,
  Landmark,
  Building2,
  HeartPulse,
  GraduationCap,
  Plane,
  Zap,
  Sparkles,
  CheckCircle2,
  Globe,
  HeartHandshake
} from 'lucide-react';
import { EService, ServiceCategory } from '../types';
import { SERVICES_DATA, CATEGORIES, INDIAN_STATES } from '../data/servicesData';
import { ServiceCard } from '../components/ServiceCard';

interface ServicesPageProps {
  onSelectService: (slugOrId: string) => void;
  initialCategory?: ServiceCategory;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ 
  onSelectService,
  initialCategory = 'All'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>(initialCategory);
  const [selectedState, setSelectedState] = useState('All India');
  const [sortBy, setSortBy] = useState<'popular' | 'title' | 'category'>('popular');

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Women Welfare': return HeartHandshake;
      case 'Vehicle Services': return Car;
      case 'Government': return Landmark;
      case 'Banking': return Building2;
      case 'Health': return HeartPulse;
      case 'Education': return GraduationCap;
      case 'Travel': return Plane;
      case 'Utilities': return Zap;
      default: return Globe;
    }
  };

  const filteredServices = useMemo(() => {
    let list = SERVICES_DATA.filter((service) => {
      // Category match
      const matchesCategory =
        selectedCategory === 'All' || service.category === selectedCategory;

      // State match
      const matchesState =
        selectedState === 'All India' ||
        service.state === 'All India' ||
        service.state.toLowerCase() === selectedState.toLowerCase();

      // Search query
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        service.title.toLowerCase().includes(q) ||
        service.shortDescription.toLowerCase().includes(q) ||
        service.category.toLowerCase().includes(q) ||
        service.department?.toLowerCase().includes(q) ||
        service.documents.some((d) => d.toLowerCase().includes(q)) ||
        service.eligibility.some((e) => e.toLowerCase().includes(q));

      return matchesCategory && matchesState && matchesSearch;
    });

    // Sorting
    if (sortBy === 'popular') {
      list.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    } else if (sortBy === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'category') {
      list.sort((a, b) => a.category.localeCompare(b.category));
    }

    return list;
  }, [searchQuery, selectedCategory, selectedState, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedState('All India');
    setSortBy('popular');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All' ||
    selectedState !== 'All India';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 bg-[#FAF7F2]/40">
      {/* Header Banner with Warm Accents */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100/80 border border-amber-300/80 text-amber-900 text-xs font-bold shadow-2xs">
          <Layers className="w-3.5 h-3.5 text-amber-700" />
          <span>Full Public Directory Catalog</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Indian E-Services Directory
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
          Explore complete requirements, step-by-step application procedures, fee schedules, and direct links to authorized government, transport, banking, and utility portals.
        </p>
      </div>

      {/* Filter & Control Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              id="services-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, document, keyword..."
              className="w-full pl-10 pr-8 py-2.5 text-xs sm:text-sm text-stone-900 placeholder-stone-400 bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-3 text-xs text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <Filter className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <select
              id="services-category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as ServiceCategory)}
              className="w-full pl-10 pr-8 py-2.5 text-xs sm:text-sm font-medium text-stone-800 bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? '🌐 All Categories' : `${cat}`}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-3.5 pointer-events-none text-stone-400 text-xs">
              ▼
            </div>
          </div>

          {/* State Dropdown */}
          <div className="relative">
            <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <select
              id="services-state-select"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 text-xs sm:text-sm font-medium text-stone-800 bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none cursor-pointer"
            >
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-3.5 pointer-events-none text-stone-400 text-xs">
              ▼
            </div>
          </div>

          {/* Sort By Dropdown */}
          <div className="relative">
            <ArrowUpDown className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <select
              id="services-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'popular' | 'title' | 'category')}
              className="w-full pl-10 pr-8 py-2.5 text-xs sm:text-sm font-medium text-stone-800 bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none cursor-pointer"
            >
              <option value="popular">Sort: Most Popular</option>
              <option value="title">Sort: Alphabetical (A-Z)</option>
              <option value="category">Sort: Category Group</option>
            </select>
            <div className="absolute right-3.5 top-3.5 pointer-events-none text-stone-400 text-xs">
              ▼
            </div>
          </div>
        </div>

        {/* Category Tab Symbols for fast toggle with Icons */}
        <div className="pt-3 border-t border-stone-100 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Browse by Category Tab
            </span>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-amber-700 hover:text-amber-900 text-xs font-bold underline cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {CATEGORIES.map((cat) => {
              const Icon = getCategoryIcon(cat);
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-xs'
                      : 'bg-stone-100/80 text-stone-700 hover:bg-stone-200/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-stone-500'}`} />
                  <span>{cat}</span>
                  {cat === 'Vehicle Services' && (
                    <span className={`text-[9px] px-1 py-0.2 rounded-full font-bold uppercase ${
                      isSelected ? 'bg-amber-800/80 text-amber-100' : 'bg-amber-100 text-amber-900'
                    }`}>
                      10
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onViewDetails={onSelectService}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-xs max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-stone-900 text-base">No services match your filters</h3>
            <p className="text-xs sm:text-sm text-stone-500">
              Try removing some search filters or select &quot;All Categories&quot; to see available options.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
