import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FREELANCERS, SERVICES } from '../data/mockData';
import { useToast } from '../context/ToastContext';
import Card from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { ServiceCard } from '../components/marketplace/ServiceCard';
import { ReviewsList } from '../components/marketplace/ReviewsList';
import {
  Star,
  CheckCircle,
  MapPin,
  Clock,
  Briefcase,
  Share2,
  MessageSquare,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Calendar,
  Layers,
  Code2,
  Award
} from 'lucide-react';

export const FreelancerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const freelancer = FREELANCERS.find((f) => f.id === id) || FREELANCERS[0];
  const freelancerServices = SERVICES.filter((s) => s.freelancerId === freelancer.id);

  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState(null);
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [contractTitle, setContractTitle] = useState('');
  const [contractHours, setContractHours] = useState('20');
  const [contractNotes, setContractNotes] = useState('');
  const [isSubmittingContract, setIsSubmittingContract] = useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast('Profile link copied to clipboard!', 'info');
  };

  const handleHireSubmit = (e) => {
    e.preventDefault();
    if (!contractTitle.trim()) {
      addToast('Please provide a project title.', 'warning');
      return;
    }
    setIsSubmittingContract(true);
    const totalAmount = Number(contractHours) * freelancer.hourlyRate;
    setTimeout(() => {
      setIsSubmittingContract(false);
      setIsHireModalOpen(false);
      addToast(
        `Contract offer sent to ${freelancer.name}! $${totalAmount} secured in escrow.`,
        'success'
      );
      navigate('/dashboard/projects');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#f0f3f8] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation & Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-6">
          <Link to="/freelancers" className="flex items-center gap-1 hover:text-indigo-600 transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Freelancers
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-semibold truncate">{freelancer.name}</span>
        </div>

        {/* Hero Cover & Profile Summary Card */}
        <div className="neu-flat rounded-3xl overflow-hidden border border-white/80 mb-8 relative">
          {/* Cover Banner */}
          <div className="h-48 sm:h-64 w-full relative overflow-hidden bg-slate-800">
            <img
              src={freelancer.coverImage || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80'}
              alt={freelancer.name}
              className="w-full h-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="bg-white/90 backdrop-blur-md text-slate-800 border-none shadow-sm gap-1.5"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Header Info Details */}
          <div className="px-6 sm:px-10 pb-8 pt-0 -mt-16 sm:-mt-20 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              {/* Avatar + Main Identity */}
              <div className="flex flex-col sm:flex-row sm:items-end gap-5">
                <Avatar
                  src={freelancer.avatar}
                  name={freelancer.name}
                  size="2xl"
                  status={freelancer.availability === 'Available Now' ? 'online' : 'offline'}
                  className="ring-6 ring-[#f0f3f8] shadow-lg shrink-0"
                />
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      {freelancer.name}
                    </h1>
                    {freelancer.verified && (
                      <CheckCircle className="w-5 h-5 fill-indigo-600 text-white shrink-0" />
                    )}
                    <Badge variant="primary" size="sm">
                      Top Rated 1%
                    </Badge>
                  </div>
                  <p className="text-base font-semibold text-slate-700">{freelancer.title}</p>
                  <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {freelancer.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-slate-400" />
                      Responds in {freelancer.responseTime}
                    </span>
                    <span className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-4 h-4 fill-amber-400" />
                      {freelancer.rating}
                      <span className="text-slate-400 font-normal">({freelancer.reviewsCount} reviews)</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action CTAs */}
              <div className="flex items-center gap-3 shrink-0">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => navigate(`/dashboard/messages?to=${encodeURIComponent(freelancer.name)}`)}
                  className="gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-slate-600" />
                  Direct Message
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setIsHireModalOpen(true)}
                  className="gap-2 shadow-indigo-500/20"
                >
                  <Sparkles className="w-4 h-4" />
                  Hire Talent
                </Button>
              </div>
            </div>

            {/* Performance Stats Cards Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-200/70">
              <div className="neu-inset rounded-2xl p-4 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Hourly Rate
                </span>
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  ${freelancer.hourlyRate}
                  <span className="text-xs font-normal text-slate-500">/hr</span>
                </span>
              </div>
              <div className="neu-inset rounded-2xl p-4 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Job Success
                </span>
                <span className="text-2xl font-black text-emerald-600 tracking-tight">
                  {freelancer.jobSuccess}%
                </span>
              </div>
              <div className="neu-inset rounded-2xl p-4 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Completed Jobs
                </span>
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  {freelancer.stats?.completedProjects || 120}+
                </span>
              </div>
              <div className="neu-inset rounded-2xl p-4 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Repeat Clients
                </span>
                <span className="text-2xl font-black text-indigo-600 tracking-tight">
                  {freelancer.stats?.repeatClientsPct || 92}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Grid: Left (Bio, Portfolio, Reviews), Right (Sidebar Stats, Skills, Services) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Left Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About / Bio */}
            <Card variant="raised" padding="lg" className="border border-white/80">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-600" />
                About {freelancer.name.split(' ')[0]}
              </h2>
              <div className="prose text-sm text-slate-600 leading-relaxed space-y-3">
                <p>{freelancer.bio}</p>
                <p>{freelancer.about}</p>
              </div>

              {/* Languages */}
              <div className="mt-6 pt-6 border-t border-slate-200/70">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Languages Spoken
                </h3>
                <div className="flex flex-wrap gap-2">
                  {freelancer.languages?.map((lang, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl neu-sm text-xs font-medium text-slate-700"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </Card>

            {/* Featured Portfolio Showcase */}
            <Card variant="raised" padding="lg" className="border border-white/80">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-600" />
                  Featured Portfolio ({freelancer.portfolio?.length || 0})
                </h2>
                <span className="text-xs text-slate-500 font-medium">Click to inspect</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {freelancer.portfolio?.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedPortfolioItem(item)}
                    className="neu-flat-hover rounded-2xl overflow-hidden border border-white/80 cursor-pointer group transition-all duration-300"
                  >
                    <div className="h-44 overflow-hidden relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge variant="default" size="sm" className="bg-white/90 backdrop-blur-md">
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors flex items-center justify-between">
                        {item.title}
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Gigs & Services Offered */}
            {freelancerServices.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-indigo-600" />
                    Services Offered by {freelancer.name.split(' ')[0]}
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {freelancerServices.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              </div>
            )}

            {/* Client Reviews */}
            <Card variant="raised" padding="lg" className="border border-white/80">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                  Client Reviews & Endorsements
                </h2>
              </div>
              <ReviewsList
                reviews={freelancer.reviews || []}
                averageRating={freelancer.rating}
                totalReviews={freelancer.reviewsCount}
              />
            </Card>
          </div>

          {/* Right Sidebar Widget Column */}
          <div className="space-y-6">
            {/* Quick Hire CTA Card */}
            <Card variant="raised" padding="lg" className="border border-white/80 bg-linear-to-b from-indigo-50/50 to-transparent">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">Escrow Guarantee</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-5">
                Work directly with {freelancer.name.split(' ')[0]}. Funds remain locked in milestone escrow and are only released upon your final approval.
              </p>
              <div className="space-y-2 mb-5 text-xs text-slate-700">
                <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Hourly Rate</span>
                  <span className="font-bold text-slate-900">${freelancer.hourlyRate}/hr</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Availability</span>
                  <span className="font-bold text-emerald-600">{freelancer.availability}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Response Time</span>
                  <span className="font-bold text-slate-900">{freelancer.responseTime}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-500">FastLance Protection</span>
                  <span className="font-bold text-indigo-600">Included</span>
                </div>
              </div>
              <Button
                variant="primary"
                size="md"
                fullWidth={true}
                onClick={() => setIsHireModalOpen(true)}
                className="gap-2"
              >
                Hire {freelancer.name.split(' ')[0]} Now
              </Button>
            </Card>

            {/* Technical Skills & Expertise */}
            <Card variant="raised" padding="lg" className="border border-white/80">
              <h3 className="font-bold text-slate-900 text-sm mb-4">Skills & Specializations</h3>
              <div className="flex flex-wrap gap-2">
                {freelancer.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-xl neu-sm text-xs font-semibold text-slate-800 hover:text-indigo-600 hover:bg-slate-100 transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Card>

            {/* Platform Verification Card */}
            <Card variant="raised" padding="lg" className="border border-white/80">
              <h3 className="font-bold text-slate-900 text-sm mb-3">Verification Badges</h3>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Government ID Verified</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Senior Technical Assessment (99th percentile)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Payment & Escrow Verified</span>
                </li>
                <li className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-500" />
                  <span>Top Rated Plus Status</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>

      {/* Portfolio Item Preview Modal */}
      {selectedPortfolioItem && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedPortfolioItem(null)}
          title={selectedPortfolioItem.title}
          subtitle={`Category: ${selectedPortfolioItem.category}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden neu-inset p-1">
              <img
                src={selectedPortfolioItem.image}
                alt={selectedPortfolioItem.title}
                className="w-full h-72 object-cover rounded-xl"
              />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Project Overview</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedPortfolioItem.description}
              </p>
            </div>
            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPortfolioItem(null)}
              >
                Close Preview
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Direct Hire / Create Contract Modal */}
      <Modal
        isOpen={isHireModalOpen}
        onClose={() => setIsHireModalOpen(false)}
        title={`Hire ${freelancer.name}`}
        subtitle="Initiate an escrow-protected contract or sprint."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleHireSubmit} className="space-y-4">
          <Input
            label="Project Title"
            placeholder="e.g. Build MVP Frontend or AI Copilot"
            value={contractTitle}
            onChange={(e) => setContractTitle(e.target.value)}
            required={true}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Hourly Rate
              </label>
              <div className="neu-inset px-3 py-2 rounded-xl text-sm font-bold text-slate-800">
                ${freelancer.hourlyRate}/hr
              </div>
            </div>
            <div>
              <Input
                label="Estimated Hours"
                type="number"
                min="5"
                max="200"
                value={contractHours}
                onChange={(e) => setContractHours(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Deliverables & Requirements
            </label>
            <textarea
              rows={3}
              placeholder="Outline project milestones, expectations, or repo links..."
              value={contractNotes}
              onChange={(e) => setContractNotes(e.target.value)}
              className="w-full neu-inset rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none"
            />
          </div>

          <div className="neu-inset rounded-xl p-3.5 bg-indigo-50/40 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Estimated Escrow Deposit:</span>
            <span className="font-black text-indigo-600 text-base">
              ${Number(contractHours || 0) * freelancer.hourlyRate}
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsHireModalOpen(false)}
              disabled={isSubmittingContract}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={isSubmittingContract}
            >
              Fund Escrow & Send Contract
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FreelancerProfile;
