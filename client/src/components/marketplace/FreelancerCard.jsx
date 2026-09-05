import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Star, CheckCircle, MapPin, Award, ArrowUpRight } from 'lucide-react';

export const FreelancerCard = ({ freelancer }) => {
  if (!freelancer) return null;

  return (
    <Card
      variant="raised"
      padding="none"
      hoverLift={true}
      className="overflow-hidden flex flex-col justify-between border border-white/80 transition-all duration-300 group"
    >
      {/* Top Banner snippet */}
      <div className="relative h-20 bg-linear-to-r from-slate-200 via-indigo-100/50 to-slate-200">
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <Badge
            variant={freelancer.availability === 'Available Now' ? 'success' : 'default'}
            size="sm"
            dot={true}
          >
            {freelancer.availability}
          </Badge>
        </div>
      </div>

      {/* Main info container */}
      <div className="px-6 pb-6 pt-0 -mt-10 flex flex-col flex-1 justify-between">
        <div>
          {/* Avatar and name */}
          <div className="flex items-end justify-between mb-3">
            <Avatar
              src={freelancer.avatar}
              name={freelancer.name}
              size="lg"
              status={freelancer.availability === 'Available Now' ? 'online' : 'offline'}
              className="ring-4 ring-[#f0f3f8]"
            />
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Hourly Rate</span>
              <span className="text-xl font-black text-slate-900 tracking-tight">
                ${freelancer.hourlyRate}<span className="text-xs font-normal text-slate-500">/hr</span>
              </span>
            </div>
          </div>

          {/* Name & verification */}
          <div className="mb-2">
            <div className="flex items-center gap-1.5">
              <Link to={`/freelancers/${freelancer.id}`} className="hover:text-indigo-600 transition-colors">
                <h3 className="text-base font-bold text-slate-900">{freelancer.name}</h3>
              </Link>
              {freelancer.verified && (
                <CheckCircle className="w-4 h-4 fill-indigo-600 text-white shrink-0" />
              )}
            </div>
            <p className="text-xs font-medium text-slate-600 line-clamp-1">{freelancer.title}</p>
          </div>

          {/* Location & stats badges */}
          <div className="flex items-center gap-3 text-xs text-slate-500 mb-3 flex-wrap">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {freelancer.location}
            </span>
            <span className="flex items-center gap-1 font-semibold text-slate-700">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {freelancer.rating} ({freelancer.reviewsCount})
            </span>
            <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded text-[11px] border border-emerald-200/60">
              <Award className="w-3 h-3" />
              {freelancer.jobSuccess}% Success
            </span>
          </div>

          {/* Bio snippet */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
            {freelancer.bio}
          </p>

          {/* Skills pills */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {freelancer.skills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="neutral" size="sm" className="bg-slate-200/70 text-slate-700">
                {skill}
              </Badge>
            ))}
            {freelancer.skills.length > 4 && (
              <span className="text-[10px] text-slate-400 font-semibold self-center">
                +{freelancer.skills.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Action row */}
        <div className="pt-3 border-t border-slate-200/70 grid grid-cols-2 gap-2">
          <Link to={`/freelancers/${freelancer.id}`}>
            <Button variant="raised" size="sm" fullWidth className="text-xs">
              View Profile
            </Button>
          </Link>
          <Link to={`/dashboard/messages?to=${freelancer.id}`}>
            <Button
              variant="primary"
              size="sm"
              fullWidth
              className="text-xs"
              rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
            >
              Contact
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default FreelancerCard;
