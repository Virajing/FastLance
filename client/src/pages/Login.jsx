import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Mail, Lock, Sparkles, ArrowRight, ShieldCheck, UserCheck, Briefcase } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { login, updateProfile } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please enter both email and password.', 'warning');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      login(email, password);
      setIsLoading(false);
      addToast('Welcome back! Successfully authenticated.', 'success');
      navigate('/dashboard');
    }, 800);
  };

  const handleQuickDemo = (role) => {
    setIsLoading(true);
    setTimeout(() => {
      if (role === 'client') {
        login('julian@hyperscale.ai', 'password123');
        updateProfile({
          role: 'client',
          name: 'Julian Thorne',
          headline: 'Founder & CEO at HyperScale AI',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
        });
        addToast('Signed in as Demo Client (Julian Thorne)', 'info');
      } else {
        login('elena@fastlance.dev', 'password123');
        updateProfile({
          role: 'freelancer',
          name: 'Elena Rostova',
          headline: 'Senior Fullstack & AI Engineer',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
        });
        addToast('Signed in as Demo Freelancer (Elena Rostova)', 'info');
      }
      setIsLoading(false);
      navigate('/dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#f0f3f8] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background subtle radial blurs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Brand Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl neu-flat flex items-center justify-center text-indigo-600 font-black text-xl tracking-tighter group-hover:scale-105 transition-transform border border-white/80">
              ⚡
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              Fast<span className="text-indigo-600">Lance</span>
            </span>
          </Link>
          <h2 className="mt-4 text-2xl font-black text-slate-900 tracking-tight">
            Sign in to your account
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600">
            Or{' '}
            <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700 underline">
              create a new account with 0% platform fee for 30 days
            </Link>
          </p>
        </div>

        {/* 1-Click Demo Logins */}
        <div className="neu-flat rounded-2xl p-4 border border-white/80 mb-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5 text-center">
            🚀 Quick 1-Click Demo Logins
          </span>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleQuickDemo('client')}
              className="neu-sm hover:neu-flat-hover px-3 py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-slate-800 transition-all cursor-pointer border border-white/60 active:scale-95"
            >
              <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
              <span>Demo Client</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('freelancer')}
              className="neu-sm hover:neu-flat-hover px-3 py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-slate-800 transition-all cursor-pointer border border-white/60 active:scale-95"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Demo Talent</span>
            </button>
          </div>
        </div>

        {/* Main Form Card */}
        <Card variant="raised" padding="lg" className="border border-white/80">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Work Email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
              required={true}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
              required={true}
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-indigo-600 accent-indigo-600 cursor-pointer"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => addToast('Password reset instructions sent to your email.', 'info')}
                className="font-medium text-indigo-600 hover:text-indigo-700 cursor-pointer hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth={true}
              loading={isLoading}
              className="mt-2 gap-2 shadow-indigo-500/20"
            >
              <span>Sign In to FastLance</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200/80" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-[#f0f3f8] text-slate-400 font-medium rounded-full">
                or authenticate with
              </span>
            </div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleQuickDemo('client')}
              className="neu-sm hover:neu-flat-hover py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 transition-all cursor-pointer border border-white/60 active:scale-95"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('freelancer')}
              className="neu-sm hover:neu-flat-hover py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 transition-all cursor-pointer border border-white/60 active:scale-95"
            >
              <svg className="w-4 h-4 fill-slate-900" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub</span>
            </button>
          </div>
        </Card>

        {/* Security badge note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500 text-center">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>256-bit SSL encrypted & biometric 2FA ready</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
