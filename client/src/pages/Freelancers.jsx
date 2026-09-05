import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FREELANCERS, CATEGORIES } from '../data/mockData';
import { FreelancerCard } from '../components/marketplace/FreelancerCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Search, Sparkles, Filter, SlidersHorizontal, ChevronLeft, ChevronRight, Award, CheckCircle } from 'lucide-react';

export const Freelancers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const querySearch = searchParams.get('q') || '';
  const querySkill = searchParams.get('skill') || '';

  const [searchQuery, setSearchQuery] = useState(querySearch || querySkill);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxRate, setMaxRate] = useState(150);
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const ITEMS_PER_PAGE = 8;

  const handleFilterChange = (setter, val) => {
    setIsLoading(true);
    setter(val);
    setCurrentPage(1);
    setTimeout(() => setIsLoading(false), 200);
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setMaxRate(150);
    setAvailabilityFilter('all');
    setSortBy('rating');
    setCurrentPage(1);
  };

  // Filter & Sort
  const filteredFreelancers = useMemo(() => {
    return FREELANCERS.filter((f) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = f.name.toLowerCase().includes(q);
        const matchTitle = f.title.toLowerCase().includes(q);
        const matchBio = f.bio.toLowerCase().includes(q);
        const matchSkill = f.skills.some((s) => s.toLowerCase().includes(q));
        if (!matchName && !matchTitle && !matchBio && !matchSkill) return false;
      }
      // Rate
      if (f.hourlyRate > maxRate) return false;
      // Availability
      if (availabilityFilter === 'available' && f.availability !== 'Available Now') return false;
      // Category / Skill match
      if (selectedCategory !== 'all') {
        const catObj = CATEGORIES.find((c) => c.id === selectedCategory);
        if (catObj) {
          const catNameLower = catObj.name.toLowerCase();
          const matchTitleOrSkill =
            f.title.toLowerCase().includes(catNameLower.slice(0, 4)) ||
            f.skills.some((s) => s.toLowerCase().includes(catNameLower.slice(0, 4)));
          if (!matchTitleOrSkill) return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'rate-low') return a.hourlyRate - b.hourlyRate;
      if (sortBy === 'rate-high') return b.hourlyRate - a.hourlyRate;
      if (sortBy === 'reviews') return b.reviewsCount - a.reviewsCount;
      if (sortBy === 'success') return b.jobSuccess - a.jobSuccess;
      return b.rating - a.rating; // default: top rated
    });
  }, [searchQuery, selectedCategory, maxRate, availabilityFilter, sortBy]);

  const totalPages = Math.ceil(filteredFreelancers.length / ITEMS_PER_PAGE) || 1;
  const paginatedFreelancers = filteredFreelancers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-[#f0f3f8] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Banner */}
        <div className="mb-8 neu-flat rounded-3xl p-8 sm:p-10 border border-white/80 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full neu-sm text-xs font-semibold text-indigo-700 mb-4 border border-indigo-100/50">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Verified Top 1% Global Talent</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
              Hire Elite Freelancers & Engineers
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Explore meticulously vetted full-stack engineers, AI architects, UI/UX designers, and growth experts ready to scale your product on demand.
            </p>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-slate-200/60 text-xs sm:text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="font-semibold text-slate-800">100% ID & Skill Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-500" />
                <span className="font-semibold text-slate-800">Milestone Escrow Protection</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-slate-800">Instant Direct Messaging</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="neu-flat rounded-2xl p-5 border border-white/80 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-4">
              <Input
                placeholder="Search by name, skill (e.g. React, AI, Figma)..."
                value={searchQuery}
                onChange={(e) => handleFilterChange(setSearchQuery, e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-slate-400" />}
                clearable={true}
                onClear={() => handleFilterChange(setSearchQuery, '')}
              />
            </div>

            {/* Category Filter */}
            <div className="md:col-span-3">
              <Select
                value={selectedCategory}
                onChange={(e) => handleFilterChange(setSelectedCategory, e.target.value)}
                options={[
                  { value: 'all', label: 'All Specializations' },
                  ...CATEGORIES.map((c) => ({ value: c.id, label: c.name })),
                ]}
              />
            </div>

            {/* Availability Toggle */}
            <div className="md:col-span-2">
              <Select
                value={availabilityFilter}
                onChange={(e) => handleFilterChange(setAvailabilityFilter, e.target.value)}
                options={[
                  { value: 'all', label: 'Any Availability' },
                  { value: 'available', label: '🟢 Available Now' },
                ]}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-3">
              <Select
                value={sortBy}
                onChange={(e) => handleFilterChange(setSortBy, e.target.value)}
                options={[
                  { value: 'rating', label: '⭐ Highest Rated' },
                  { value: 'success', label: '🏆 Job Success Rate' },
                  { value: 'rate-low', label: '💵 Rate: Low to High' },
                  { value: 'rate-high', label: '💎 Rate: High to Low' },
                  { value: 'reviews', label: '💬 Most Reviews' },
                ]}
              />
            </div>
          </div>

          {/* Rate Range Slider & Quick Skills Bar */}
          <div className="pt-3 border-t border-slate-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-xs font-semibold text-slate-600 shrink-0">Max Rate:</span>
              <input
                type="range"
                min="30"
                max="150"
                step="5"
                value={maxRate}
                onChange={(e) => handleFilterChange(setMaxRate, Number(e.target.value))}
                className="w-32 sm:w-44 accent-indigo-600 cursor-pointer"
              />
              <Badge variant="primary" size="sm">
                Up to ${maxRate}/hr
              </Badge>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <span className="text-xs font-semibold text-slate-500 shrink-0">Popular:</span>
              {['React', 'Python', 'UI/UX', 'AI Agents', 'DevOps'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleFilterChange(setSearchQuery, tag)}
                  className={`text-xs px-2.5 py-1 rounded-full transition-all cursor-pointer shrink-0 ${
                    searchQuery.toLowerCase() === tag.toLowerCase()
                      ? 'bg-indigo-600 text-white font-medium shadow-sm'
                      : 'neu-sm text-slate-600 hover:text-indigo-600 hover:bg-slate-100'
                  }`}
                >
                  {tag}
                </button>
              ))}
              {(searchQuery || selectedCategory !== 'all' || maxRate < 150 || availabilityFilter !== 'all') && (
                <button
                  onClick={handleReset}
                  className="text-xs text-rose-500 hover:text-rose-600 font-medium ml-2 shrink-0 cursor-pointer underline"
                >
                  Reset all
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Metadata */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-medium text-slate-600">
            Showing <span className="font-bold text-slate-900">{filteredFreelancers.length}</span> top-tier professionals
          </p>
        </div>

        {/* Loading Skeleton or Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="neu-flat rounded-2xl p-6 border border-white/80 space-y-4">
                <div className="flex items-center gap-4">
                  <Skeleton variant="avatar" className="w-14 h-14" />
                  <div className="space-y-2 flex-1">
                    <Skeleton variant="title" className="w-3/4 h-4" />
                    <Skeleton variant="text" className="w-1/2 h-3" />
                  </div>
                </div>
                <Skeleton variant="rect" className="w-full h-16 rounded-xl" />
                <Skeleton variant="text" className="w-full h-8" />
              </div>
            ))}
          </div>
        ) : filteredFreelancers.length === 0 ? (
          <EmptyState
            icon={Filter}
            title="No talent matches your filters"
            description="Try loosening your search keywords, adjusting the hourly rate range, or resetting filters."
            actionLabel="Reset All Filters"
            onAction={handleReset}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedFreelancers.map((freelancer) => (
              <FreelancerCard key={freelancer.id} freelancer={freelancer} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex items-center gap-1.5 px-3">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    currentPage === i + 1
                      ? 'neu-pressed bg-[#e4e9f2] text-indigo-600 font-bold border border-indigo-200/60'
                      : 'neu-sm text-slate-600 hover:text-indigo-600 hover:bg-slate-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="gap-1"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Freelancers;