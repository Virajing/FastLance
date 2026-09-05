import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

export const FilterBar = ({
  searchQuery,
  onSearchChange,
  category,
  onCategoryChange,
  categories = [],
  sortBy,
  onSortChange,
  maxPrice,
  onMaxPriceChange,
  minRating,
  onMinRatingChange,
  totalResults = 0,
  onReset
}) => {
  const sortOptions = [
    { value: 'featured', label: 'Featured & Best Match' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' }
  ];

  const ratingOptions = [
    { value: '0', label: 'All Ratings (4.0+)' },
    { value: '4.8', label: '4.8 ★ & higher' },
    { value: '4.9', label: '4.9 ★ & higher' },
    { value: '4.95', label: 'Top Tier (4.95 ★+)' }
  ];

  return (
    <Card variant="raised" padding="md" className="mb-8 border border-white/90">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Search input */}
        <div className="lg:col-span-2">
          <Input
            label="Search keyword"
            placeholder="Search React, Figma, AI agents, DevOps..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            rightIcon={
              searchQuery ? (
                <button
                  onClick={() => onSearchChange('')}
                  className="hover:text-slate-700"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : null
            }
          />
        </div>

        {/* Category filter */}
        <div>
          <Select
            label="Category"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            options={[
              { value: 'all', label: 'All Categories' },
              ...categories.map((c) => ({ value: c.slug, label: c.name }))
            ]}
          />
        </div>

        {/* Sort filter */}
        <div>
          <Select
            label="Sort By"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            options={sortOptions}
          />
        </div>
      </div>

      {/* Secondary filter strip */}
      <div className="mt-4 pt-4 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700">
          {/* Price Range */}
          {onMaxPriceChange && (
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Max Price:</span>
              <div className="flex items-center gap-1">
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="50"
                  value={maxPrice || 2000}
                  onChange={(e) => onMaxPriceChange(Number(e.target.value))}
                  className="w-24 accent-indigo-600 cursor-pointer"
                />
                <span className="font-bold text-slate-900">${maxPrice || 2000}</span>
              </div>
            </div>
          )}

          {/* Rating filter */}
          {onMinRatingChange && (
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Rating:</span>
              <select
                value={minRating || '0'}
                onChange={(e) => onMinRatingChange(e.target.value)}
                className="bg-transparent font-bold text-slate-900 outline-none cursor-pointer"
              >
                {ratingOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">
            Showing <strong className="text-slate-800 font-bold">{totalResults}</strong> results
          </span>

          {(searchQuery || (category && category !== 'all') || (sortBy && sortBy !== 'featured') || (maxPrice && maxPrice < 2000)) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-xs text-indigo-600 hover:text-indigo-800"
            >
              Reset Filters
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default FilterBar;
