import React, { useState } from 'react';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import { Star, ThumbsUp } from 'lucide-react';

export const ReviewsList = ({ reviews = [], averageRating = 4.9, totalReviews = 10 }) => {
  const [selectedStar, setSelectedStar] = useState('all');
  const [helpfulVotes, setHelpfulVotes] = useState({});

  const toggleHelpful = (id) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredReviews = selectedStar === 'all'
    ? reviews
    : reviews.filter((r) => Math.floor(r.rating) === Number(selectedStar));

  return (
    <div className="space-y-6">
      {/* Breakdown Header */}
      <Card variant="raised" padding="md" className="border border-white">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          <div className="text-center sm:text-left sm:border-r border-slate-200/80 pr-6">
            <h4 className="text-4xl font-black text-slate-900 tracking-tight">{averageRating}</h4>
            <div className="flex items-center justify-center sm:justify-start gap-1 my-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-500 font-medium">Based on {totalReviews} verified client reviews</p>
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const countPct = star === 5 ? 92 : star === 4 ? 8 : 0;
              return (
                <div key={star} className="flex items-center gap-3 text-xs">
                  <span className="w-12 text-slate-600 font-medium">{star} stars</span>
                  <div className="flex-1 h-2 rounded-full neu-inset overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${countPct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-slate-400 font-mono text-[11px]">{countPct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedStar('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
            selectedStar === 'all' ? 'neu-sm text-indigo-700 bg-white font-bold' : 'text-slate-600 hover:bg-slate-200/50'
          }`}
        >
          All Reviews ({reviews.length})
        </button>
        {[5, 4, 3].map((star) => (
          <button
            key={star}
            onClick={() => setSelectedStar(star.toString())}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              selectedStar === star.toString() ? 'neu-sm text-indigo-700 bg-white font-bold' : 'text-slate-600 hover:bg-slate-200/50'
            }`}
          >
            {star} Stars
          </button>
        ))}
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 rounded-xl neu-inset">
            No reviews matching this star filter.
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <Card key={rev.id} variant="raised" padding="md" className="border border-white/80">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <Avatar src={rev.clientAvatar} name={rev.clientName} size="sm" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{rev.clientName}</h5>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-400">• {rev.date}</span>
                    </div>
                  </div>
                </div>

                {rev.projectTitle && (
                  <span className="hidden sm:inline-block text-[11px] font-semibold text-indigo-600 bg-indigo-50/70 px-2.5 py-1 rounded-md border border-indigo-200/60">
                    {rev.projectTitle}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                "{rev.comment}"
              </p>

              <div className="flex items-center justify-end">
                <button
                  onClick={() => toggleHelpful(rev.id)}
                  className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    helpfulVotes[rev.id]
                      ? 'text-indigo-600 font-bold'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${helpfulVotes[rev.id] ? 'fill-indigo-600' : ''}`} />
                  <span>Helpful ({helpfulVotes[rev.id] ? 1 : 0})</span>
                </button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsList;
