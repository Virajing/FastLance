import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { SERVICES, FREELANCERS } from '../data/mockData';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { PackagePricing } from '../components/marketplace/PackagePricing';
import { ReviewsList } from '../components/marketplace/ReviewsList';
import { HireModal } from '../components/marketplace/HireModal';
import { ServiceCard } from '../components/marketplace/ServiceCard';
import {
  Star,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Heart,
  MessageSquare,
  ChevronRight,
  HelpCircle,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [selectedTierKey, setSelectedTierKey] = useState('standard');
  const [selectedPackageData, setSelectedPackageData] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  const service = SERVICES.find((s) => s.id === id) || SERVICES[0];
  const freelancer = FREELANCERS.find((f) => f.id === service.freelancerId) || FREELANCERS[0];
  const similarServices = SERVICES.filter((s) => s.id !== service.id && s.category === service.category).slice(0, 3);

  const handleOpenHireModal = (tierKey, pkgData) => {
    setSelectedTierKey(tierKey);
    setSelectedPackageData(pkgData || service.packages[tierKey]);
    setIsHireModalOpen(true);
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
    addToast(!isSaved ? 'Saved to your favorites collection' : 'Removed from favorites', 'info');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Link copied to clipboard!', 'success');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6 flex-wrap">
        <Link to="/" className="hover:text-slate-800">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/services" className="hover:text-slate-800">Services</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to={`/services?cat=${service.category}`} className="capitalize hover:text-slate-800">
          {service.categoryName}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800 font-bold line-clamp-1">{service.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Details, Image, Description, Reviews */}
        <div className="lg:col-span-8 space-y-10">
          {/* Header Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="primary" size="sm">
                {service.categoryName}
              </Badge>
              <Badge variant="default" size="sm" dot={true}>
                {service.ordersInQueue} orders in queue
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-4">
              {service.title}
            </h1>

            {/* Freelancer & Ratings strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-slate-200/70">
              <div className="flex items-center gap-3">
                <Avatar
                  src={service.freelancerAvatar}
                  name={service.freelancerName}
                  size="md"
                  status="online"
                />
                <div>
                  <Link
                    to={`/freelancers/${service.freelancerId}`}
                    className="text-xs font-bold text-slate-900 hover:text-indigo-600 transition-colors block"
                  >
                    {service.freelancerName}
                  </Link>
                  <p className="text-[11px] text-slate-500">{freelancer.title}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1 text-slate-800">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <strong>{service.rating}</strong>
                  <span className="text-slate-400 font-normal">({service.reviewsCount} reviews)</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleSave}
                    className={`p-2 rounded-xl neu-btn transition-colors cursor-pointer ${isSaved ? 'text-rose-600' : 'text-slate-500'}`}
                    aria-label="Save service"
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-xl neu-btn text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    aria-label="Share service"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Large Hero Image Showcase */}
          <Card variant="raised" padding="none" className="overflow-hidden border border-white">
            <div className="aspect-video w-full overflow-hidden bg-slate-100">
              <img
                src={service.coverImage}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>
          </Card>

          {/* Description Section */}
          <Card variant="raised" padding="lg" className="border border-white/80 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Service Overview</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {service.description}
            </p>

            {/* Tags */}
            <div className="pt-4 border-t border-slate-200/60">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Target Technologies & Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <Badge key={tag} variant="neutral" size="md">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>

          {/* Freelancer Bio Card */}
          <Card variant="raised" padding="lg" className="border border-white/80">
            <h2 className="text-lg font-bold text-slate-900 mb-4">About the Specialist</h2>
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <Avatar
                src={freelancer.avatar}
                name={freelancer.name}
                size="xl"
                status="online"
                className="shrink-0 ring-4 ring-[#f0f3f8]"
              />
              <div className="space-y-2.5 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{freelancer.name}</h3>
                    <p className="text-xs text-slate-500">{freelancer.title}</p>
                  </div>
                  <Badge variant="success" size="sm">
                    {freelancer.jobSuccess}% Job Success
                  </Badge>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {freelancer.about || freelancer.bio}
                </p>

                <div className="pt-3 flex items-center gap-3">
                  <Link to={`/freelancers/${freelancer.id}`}>
                    <Button variant="raised" size="sm">
                      View Full Profile
                    </Button>
                  </Link>
                  <Link to={`/dashboard/messages?to=${freelancer.id}`}>
                    <Button variant="ghost" size="sm" leftIcon={<MessageSquare className="w-3.5 h-3.5" />}>
                      Contact Specialist
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>

          {/* Frequently Asked Questions */}
          {service.faqs && service.faqs.length > 0 && (
            <Card variant="raised" padding="lg" className="border border-white/80 space-y-4">
              <h2 className="text-lg font-bold text-slate-900 mb-2">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {service.faqs.map((faq, idx) => (
                  <div key={idx} className="p-4 rounded-xl neu-inset">
                    <h4 className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                      {faq.q}
                    </h4>
                    <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Reviews List */}
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight mb-4">
              Verified Client Reviews
            </h2>
            <ReviewsList
              reviews={service.reviews}
              averageRating={service.rating}
              totalReviews={service.reviewsCount}
            />
          </div>
        </div>

        {/* Right Column: Sticky Tier Package Selector */}
        <div className="lg:col-span-4">
          <PackagePricing
            packages={service.packages}
            onSelectTier={handleOpenHireModal}
          />
        </div>
      </div>

      {/* Similar Services Carousel / Grid */}
      {similarServices.length > 0 && (
        <div className="mt-20 pt-10 border-t border-slate-200/80">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Related Options
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                More in {service.categoryName}
              </h3>
            </div>
            <Link to={`/services?cat=${service.category}`}>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarServices.map((sim) => (
              <ServiceCard key={sim.id} service={sim} />
            ))}
          </div>
        </div>
      )}

      {/* Hire Checkout Modal */}
      <HireModal
        isOpen={isHireModalOpen}
        onClose={() => setIsHireModalOpen(false)}
        service={service}
        tierKey={selectedTierKey}
        packageData={selectedPackageData || service.packages[selectedTierKey]}
      />
    </div>
  );
};

export default ServiceDetail;
