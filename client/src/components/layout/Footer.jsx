import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const { addToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    addToast('Thank you for subscribing to FastLance Dispatch!', 'success');
    setEmail('');
  };

  return (
    <footer className="w-full bg-[#e8edf4] border-t border-slate-300/60 pt-16 pb-12 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl neu-flat flex items-center justify-center text-indigo-600 border border-white">
                <Zap className="w-5 h-5 fill-indigo-500 text-indigo-600" />
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tight">FastLance</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              The premium freelancing network for high-growth tech teams, AI builders, and elite remote talent. Escrow protected, verified portfolios, zero friction.
            </p>

            {/* Newsletter form */}
            <form onSubmit={handleSubscribe} className="pt-2 max-w-md">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Subscribe to Platform Insights
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full neu-inset rounded-xl py-2.5 px-4 text-xs text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/30"
                  required
                />
                <Button type="submit" variant="primary" size="sm" rightIcon={<Send className="w-3.5 h-3.5" />}>
                  Join
                </Button>
              </div>
            </form>
          </div>

          {/* Column 1: Marketplace */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Marketplace</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link to="/services?cat=development" className="hover:text-indigo-600 transition-colors">Web & Fullstack</Link></li>
              <li><Link to="/services?cat=design" className="hover:text-indigo-600 transition-colors">UI/UX & Neomorphism</Link></li>
              <li><Link to="/services?cat=ai" className="hover:text-indigo-600 transition-colors">AI & LLM Systems</Link></li>
              <li><Link to="/services?cat=marketing" className="hover:text-indigo-600 transition-colors">Growth & SEO</Link></li>
              <li><Link to="/services?cat=devops" className="hover:text-indigo-600 transition-colors">Cloud & DevOps</Link></li>
              <li><Link to="/services" className="text-indigo-600 hover:underline">View All Services →</Link></li>
            </ul>
          </div>

          {/* Column 2: Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link to="/freelancers" className="hover:text-indigo-600 transition-colors">Find Talent</Link></li>
              <li><Link to="/#how-it-works" className="hover:text-indigo-600 transition-colors">How It Works</Link></li>
              <li><Link to="/dashboard" className="hover:text-indigo-600 transition-colors">Client Portal</Link></li>
              <li><Link to="/register" className="hover:text-indigo-600 transition-colors">Apply as Freelancer</Link></li>
              <li><Link to="/#testimonials" className="hover:text-indigo-600 transition-colors">Success Stories</Link></li>
              <li><Link to="/services" className="hover:text-indigo-600 transition-colors">Pricing & Escrow</Link></li>
            </ul>
          </div>

          {/* Column 3: Trust & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Trust & Security</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li className="flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" /> Escrow Protection
              </li>
              <li><span className="hover:text-slate-800 cursor-pointer">Quality Guarantee</span></li>
              <li><span className="hover:text-slate-800 cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-slate-800 cursor-pointer">Terms of Service</span></li>
              <li><span className="hover:text-slate-800 cursor-pointer">Security Standards</span></li>
              <li><span className="hover:text-slate-800 cursor-pointer">Cookie Settings</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-300/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FastLance Inc. All rights reserved. Crafted with Neomorphic Soft UI.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              All Systems Operational
            </span>
            <div className="flex items-center gap-2">
              <button aria-label="Twitter" className="p-2 rounded-xl neu-btn hover:text-indigo-600 text-slate-600 cursor-pointer">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>
              <button aria-label="GitHub" className="p-2 rounded-xl neu-btn hover:text-indigo-600 text-slate-600 cursor-pointer">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </button>
              <button aria-label="LinkedIn" className="p-2 rounded-xl neu-btn hover:text-indigo-600 text-slate-600 cursor-pointer">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.39 9.74v-8.37H5.07v8.37z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
