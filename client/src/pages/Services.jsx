import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SERVICES, CATEGORIES } from '../data/mockData';
import { ServiceCard } from '../components/marketplace/ServiceCard';
import { FilterBar } from '../components/marketplace/FilterBar';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

export const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryCategory = searchParams.get('cat') || 'all';
  const querySearch = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(querySearch);
  const [category, setCategory] = useState(queryCategory);
  const [sortBy, setSortBy] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(2000);
  const [minRating, setMinRating] = useState('0');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const ITEMS_PER_PAGE = 8;

  // Sync URL params
  useEffect(() => {
    if (queryCategory) setCategory(queryCategory);
    if (querySearch) setSearchQuery(querySearch);
  }, [queryCategory, querySearch]);

  // Simulate quick filtering transition
  const handleFilterChange = (setter, val) => {
    setIsLoading(true);
    setter(val);
    setCurrentPage(1);
    setTimeout(() => setIsLoading(false), 200);
  };

  const filteredServices = useMemo(() => {
    return SERVICES.filter((s) => {
      // Category match
      if (category !== 'all' && s.category !== category) return false;
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = s.title.toLowerCase().includes(q);
        const matchDesc = s.description.toLowerCase().includes(q);
        const matchFreelancer = s.freelancerName.toLowerCase().includes(q);
        const matchTag = s.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchFreelancer && !matchTag) return false;
      }
      // Max price match
      if (s.startingPrice > maxPrice) return false;
      // Min rating match
      if (Number(minRating) > 0 && s.rating < Number(minRating)) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.startingPrice - b.startingPrice;
      if (sortBy === 'price-high') return b.startingPrice - a.startingPrice;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured default
    });
  }, [category, searchQuery, sortBy, maxPrice, minRating]);

  // Pagination slice
  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE) || 1;
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategory('all');
    setSortBy('featured');
    setMaxPrice(2000);
    setMinRating('0');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full neu-sm bg-white/70 text-xs font-bold text-indigo-700 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Curated Services Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Services Marketplace
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Purchase pre-scoped deliverables with upfront milestones, delivery timetables, and escrow guarantees.
        </p>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={(val) => handleFilterChange(setSearchQuery, val)}
        category={category}
        onCategoryChange={(val) => {
          handleFilterChange(setCategory, val);
          setSearchParams(val === 'all' ? {} : { cat: val });
        }}
        categories={CATEGORIES}
        sortBy={sortBy}
        onSortChange={(val) => handleFilterChange(setSortBy, val)}
        maxPrice={maxPrice}
        onMaxPriceChange={(val) => handleFilterChange(setMaxPrice, val)}
        minRating={minRating}
        onMinRatingChange={(val) => handleFilterChange(setMinRating, val)}
        totalResults={filteredServices.length}
        onReset={handleResetFilters}
      />

      {/* Services Grid or Loading / Empty states */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="neu-flat rounded-2xl p-4 space-y-3">
              <Skeleton variant="rect" height="150px" />
              <div className="flex items-center gap-2">
                <Skeleton variant="circle" width="28px" height="28px" />
                <Skeleton variant="text" width="60%" />
              </div>
              <Skeleton variant="text" />
              <Skeleton variant="text" width="40%" />
            </div>
          ))}
        </div>
      ) : paginatedServices.length === 0 ? (
        <EmptyState
          title="No services match your criteria"
          description="Try broadening your keyword search, removing category constraints, or resetting the price filter."
          actionText="Reset All Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 pt-6 border-t border-slate-200/70 flex items-center justify-center gap-2">
              <Button
                variant="raised"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
              >
                Previous
              </Button>

              {[...Array(totalPages)].map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currentPage === pageNum
                        ? 'neu-inset text-indigo-600 bg-white font-black'
                        : 'neu-btn text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <Button
                variant="raised"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Services;
