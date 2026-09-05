import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CATEGORIES, SERVICES, FREELANCERS, TESTIMONIALS } from '../data/mockData';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { ServiceCard } from '../components/marketplace/ServiceCard';
import { FreelancerCard } from '../components/marketplace/FreelancerCard';
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Code,
  Palette,
  Cpu,
  TrendingUp,
  PenTool,
  Video,
  Shield,
  Star,
  Users,
  Search,
  Lock,
  Layers,
  ChevronRight
} from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState('');

  const categoryIcons = {
    'Code': <Code className="w-5 h-5 text-indigo-600" />,
    'Palette': <Palette className="w-5 h-5 text-purple-600" />,
    'Cpu': <Cpu className="w-5 h-5 text-cyan-600" />,
    'TrendingUp': <TrendingUp className="w-5 h-5 text-emerald-600" />,
    'PenTool': <PenTool className="w-5 h-5 text-amber-600" />,
    'Video': <Video className="w-5 h-5 text-rose-600" />,
    'ShieldCheck': <Shield className="w-5 h-5 text-blue-600" />
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/services?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/services');
    }
  };

  return (
    <div className="flex flex-col gap-24 pb-20 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 lg:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Soft background ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-200/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline and CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full neu-sm bg-white/70 border border-white text-xs font-bold text-indigo-700 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Verified Top 1% Engineering & Design Talent</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              The Next-Gen Freelance Platform{' '}
              <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-600 via-indigo-700 to-purple-600">
                Engineered for Velocity.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Hire vetted senior developers, neomorphic UI designers, and AI specialists. Protected by automated milestone escrow, zero-friction agreements, and real-time sprint tracking.
            </p>

            {/* Hero search bar */}
            <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto lg:mx-0 pt-2">
              <div className="p-2 rounded-2xl neu-flat bg-white/80 border border-white flex flex-col sm:flex-row items-center gap-2 shadow-md">
                <div className="flex items-center gap-3 px-3 w-full">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    placeholder="Try 'React Next.js', 'Figma UI/UX', 'LangChain AI'..."
                    className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none font-medium py-1"
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full sm:w-auto shrink-0 shadow-indigo-600/30"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Search
                </Button>
              </div>
            </form>

            {/* CTAs and quick pill metrics */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link to="/register">
                <Button variant="primary" size="lg" className="font-bold">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="raised" size="lg">
                  Explore Marketplace
                </Button>
              </Link>
            </div>

            {/* Social Proof metrics */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <p className="text-2xl font-black text-slate-900 tracking-tight">15K+</p>
                <p className="text-xs text-slate-500 font-medium">Vetted Talent</p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 tracking-tight">99.4%</p>
                <p className="text-xs text-slate-500 font-medium">Escrow Success</p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 tracking-tight">&lt; 15m</p>
                <p className="text-xs text-slate-500 font-medium">Match Velocity</p>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Neomorphic Interactive Showcase */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Main Soft Card */}
            <Card
              variant="raised"
              padding="lg"
              className="w-full max-w-md border border-white relative z-10 bg-white/80 backdrop-blur-xs"
            >
              {/* Card Top Pill */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-xs font-bold text-slate-900">Live Escrow Contract</span>
                </div>
                <Badge variant="success" size="sm">Active Sprint</Badge>
              </div>

              {/* Freelancer Mini Profile */}
              <div className="flex items-center gap-3.5 p-3 rounded-xl neu-inset mb-5">
                <Avatar
                  src={FREELANCERS[0].avatar}
                  name={FREELANCERS[0].name}
                  size="md"
                  status="online"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{FREELANCERS[0].name}</h4>
                  <p className="text-[11px] text-slate-500">{FREELANCERS[0].title}</p>
                </div>
                <div className="ml-auto text-right">
                  <span className="text-xs font-black text-slate-900">$85/hr</span>
                  <span className="text-[10px] text-emerald-600 block font-bold">★ 4.98</span>
                </div>
              </div>

              {/* Milestone Progress widget */}
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Milestone 3: AI Document Vector RAG</span>
                  <span>75%</span>
                </div>
                <div className="w-full h-3 neu-inset rounded-full overflow-hidden p-0.5">
                  <div className="h-full bg-linear-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500 w-3/4" />
                </div>
              </div>

              {/* Secure Escrow Release Indicator */}
              <div className="p-3 rounded-xl neu-sm bg-indigo-50/70 border border-indigo-200/60 flex items-center justify-between text-xs mb-5">
                <div className="flex items-center gap-2 text-indigo-900 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Escrow Locked</span>
                </div>
                <span className="font-black text-slate-900">$1,400.00 USD</span>
              </div>

              <Link to="/dashboard">
                <Button variant="primary" size="sm" fullWidth className="font-bold">
                  Simulate Client Workspace
                </Button>
              </Link>
            </Card>

            {/* Floating Mini Badge 1 */}
            <div className="hidden sm:flex absolute -bottom-6 -left-6 z-20 p-3 rounded-2xl neu-flat bg-white/95 border border-white items-center gap-3 shadow-lg">
              <div className="w-9 h-9 rounded-xl neu-inset flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-900">$450 Released</p>
                <p className="text-[10px] text-slate-400">Milestone 2 Verified</p>
              </div>
            </div>

            {/* Floating Mini Badge 2 */}
            <div className="hidden sm:flex absolute -top-4 -right-4 z-20 p-3 rounded-2xl neu-flat bg-white/95 border border-white items-center gap-2 shadow-lg">
              <div className="flex items-center -space-x-2">
                <Avatar src={FREELANCERS[1].avatar} size="xs" />
                <Avatar src={FREELANCERS[2].avatar} size="xs" />
              </div>
              <span className="text-[11px] font-bold text-slate-800">+25 Available Now</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES BROWSER */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
              Skill Taxonomy
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Explore High-Impact Disciplines
            </h2>
          </div>
          <Link to="/services" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
            Browse all categories <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/services?cat=${cat.slug}`}
              className="group block"
            >
              <Card
                variant="raised"
                padding="md"
                hoverLift={true}
                className="border border-white/80 h-full flex flex-col justify-between group-hover:border-indigo-200/80 transition-all"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl neu-sm bg-white/80 flex items-center justify-center mb-3.5">
                    {categoryIcons[cat.icon] || <Code className="w-5 h-5 text-indigo-600" />}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                  <span>{cat.count} Active Gigs</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-indigo-500" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section id="how-it-works" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
            Frictionless Process
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            How FastLance Protects Every Dollar
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Engineered from ground up to prevent ghosting, scope creep, and payment disputes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <Card variant="raised" padding="lg" className="border border-white relative flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl neu-inset flex items-center justify-center font-black text-indigo-600 text-lg mb-4">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Scope & Match Talent</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Explore verified portfolios or post your requirements. Filter by stack, hourly rates, and timezone availability.
            </p>
          </Card>

          {/* Step 2 */}
          <Card variant="raised" padding="lg" className="border border-white relative flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl neu-inset flex items-center justify-center font-black text-indigo-600 text-lg mb-4">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Fund Protected Escrow</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Lock contract funds in our automated escrow vault. The freelancer starts work knowing funds are guaranteed.
            </p>
          </Card>

          {/* Step 3 */}
          <Card variant="raised" padding="lg" className="border border-white relative flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl neu-inset flex items-center justify-center font-black text-indigo-600 text-lg mb-4">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Inspect & Disburse</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Review code, Figma files, or video renders. Approve the milestone with 1 click to release payment instantly.
            </p>
          </Card>
        </div>
      </section>

      {/* 4. FEATURED SERVICES */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
              Marketplace Highlights
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Popular Pre-Packaged Services
            </h2>
          </div>
          <Link to="/services">
            <Button variant="raised" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Explore All Services
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.slice(0, 4).map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* 5. FEATURED TALENT SHOWCASE */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
              Elite Network
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Top Rated Freelancers Ready to Build
            </h2>
          </div>
          <Link to="/freelancers">
            <Button variant="raised" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Discover Freelancers
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FREELANCERS.slice(0, 4).map((freelancer) => (
            <FreelancerCard key={freelancer.id} freelancer={freelancer} />
          ))}
        </div>
      </section>

      {/* 6. PLATFORM BENEFITS */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <Card variant="raised" padding="lg" className="border border-white overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
                Why High-Growth Startups Choose Us
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Built for Technical Founders Who Don't Have Time to Manage Agonizing Hiring Processes
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Legacy gig platforms are flooded with spam proposals and unverified claims. FastLance enforces rigorous skills vetting, identity validation, and code sample reviews.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-lg bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">100% Milestone Escrow Security</h4>
                    <p className="text-[11px] text-slate-500">Your capital remains protected until you inspect and accept finished code.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-lg bg-indigo-100 text-indigo-800 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Zero Technical Debt Guarantee</h4>
                    <p className="text-[11px] text-slate-500">Every engineer agrees to write modular, type-safe, and documented source code.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-lg bg-purple-100 text-purple-800 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Direct Founder Communication</h4>
                    <p className="text-[11px] text-slate-500">No middlemen agency managers. Speak directly to the person executing your vision.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Tactile Breakdown */}
            <div className="p-6 rounded-2xl neu-inset space-y-4">
              <div className="p-4 rounded-xl neu-flat bg-white/90 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Senior Engineers Acceptance Rate</p>
                  <p className="text-[11px] text-slate-500">Strict portfolio code audit</p>
                </div>
                <span className="text-lg font-black text-indigo-600">3.2%</span>
              </div>

              <div className="p-4 rounded-xl neu-flat bg-white/90 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Average Time to First Delivery</p>
                  <p className="text-[11px] text-slate-500">From project scope sign-off</p>
                </div>
                <span className="text-lg font-black text-emerald-600">48 Hours</span>
              </div>

              <div className="p-4 rounded-xl neu-flat bg-white/90 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Dispute Rate on Escrow</p>
                  <p className="text-[11px] text-slate-500">Across 98,000+ completed milestones</p>
                </div>
                <span className="text-lg font-black text-slate-900">&lt; 0.2%</span>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* 7. TESTIMONIALS */}
      <section id="testimonials" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
            Endorsements
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            Loved by Venture-Backed Founders
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <Card key={t.id} variant="raised" padding="md" className="border border-white/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic mb-6">
                  "{t.content}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-200/60">
                <Avatar src={t.avatar} name={t.name} size="md" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                  <p className="text-[11px] text-slate-500">{t.role}, {t.company}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 8. FINAL CTA BANNER */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <Card
          variant="raised"
          padding="lg"
          className="border border-white text-center py-16 relative overflow-hidden bg-linear-to-b from-[#f0f3f8] to-indigo-50/40"
        >
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Launch Your Next Sprint
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Ready to Work With Top 1% Remote Specialists?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              Create an account in 60 seconds. Post a project, hire verified talent, or browse pre-packaged services with zero upfront commitment.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link to="/register">
                <Button variant="primary" size="lg" className="font-bold">
                  Create Free Account
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="raised" size="lg">
                  Explore Services
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default Home;

