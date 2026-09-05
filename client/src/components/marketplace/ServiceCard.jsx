import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { Star, Clock, CheckCircle2 } from 'lucide-react';

export const ServiceCard = ({ service }) => {
  if (!service) return null;

  return (
    <Link to={`/services/${service.id}`} className="block group">
      <Card
        variant="raised"
        padding="none"
        hoverLift={true}
        className="overflow-hidden flex flex-col h-full border border-white/80 transition-all duration-300 group-hover:border-indigo-200/80"
      >
        {/* Cover Image */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-200">
          <img
            src={service.coverImage}
            alt={service.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3">
            <Badge variant="default" size="sm" className="backdrop-blur-md bg-white/90 text-slate-800 font-bold shadow-xs">
              <Clock className="w-3 h-3 text-indigo-500 mr-1 inline" />
              {service.deliveryTime}
            </Badge>
          </div>
          {service.categoryName && (
            <div className="absolute bottom-3 left-3">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-900/75 backdrop-blur-md text-white">
                {service.categoryName}
              </span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-5 flex flex-col flex-1 justify-between gap-4">
          <div>
            {/* Freelancer snippet */}
            <div className="flex items-center gap-2.5 mb-2.5">
              <Avatar
                src={service.freelancerAvatar}
                name={service.freelancerName}
                size="xs"
              />
              <span className="text-xs font-semibold text-slate-700 hover:text-indigo-600 transition-colors">
                {service.freelancerName}
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 ml-auto" />
            </div>

            {/* Service Title */}
            <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
              {service.title}
            </h3>
          </div>

          {/* Rating and Price row */}
          <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{service.rating}</span>
              <span className="text-slate-400 font-normal">({service.reviewsCount})</span>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Starting at</span>
              <span className="text-base font-black text-slate-900 tracking-tight">
                ${service.startingPrice}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ServiceCard;
