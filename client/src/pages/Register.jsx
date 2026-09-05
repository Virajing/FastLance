import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Mail, Lock, User, Briefcase, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const Register = () => {
  const [role, setRole] = useState('client'); // 'client' or 'freelancer'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      addToast('Please fill out all required fields.', 'warning');
      return;
    }

    if (!agreedToTerms) {
      addToast('Please agree to the Terms of Service to continue.', 'warning');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      register({
        name,
        email,
        role,
      });
      setIsLoading(false);
      addToast(`Welcome to FastLance, ${name}! Your account is ready.`, 'success');
      navigate('/dashboard');
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#f0f3f8] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background radial blurs */}
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

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
            Join the elite freelance marketplace
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 underline">
              Sign in here
            </Link>
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="neu-flat rounded-2xl p-2 border border-white/80 mb-6 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setRole('client')}
            className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
              role === 'client'
                ? 'neu-pressed bg-[#e4e9f2] text-indigo-600 border border-indigo-200/60 shadow-inner'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>I want to Hire Talent</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('freelancer')}
            className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
              role === 'freelancer'
                ? 'neu-pressed bg-[#e4e9f2] text-emerald-600 border border-emerald-200/60 shadow-inner'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>I want to Work as Talent</span>
          </button>
        </div>

        {/* Main Register Card */}
        <Card variant="raised" padding="lg" className="border border-white/80">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder={role === 'client' ? 'e.g. Alex Morgan' : 'e.g. Elena Rostova'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="w-4 h-4 text-slate-400" />}
              required={true}
            />

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
              label="Create Password"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
              required={true}
            />

            {/* Checklist highlights */}
            <div className="neu-inset rounded-xl p-3 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zero platform fee for your first 30 days</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Instant milestone escrow contract creation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Direct 1-on-1 messaging & encrypted file sharing</span>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="rounded text-indigo-600 accent-indigo-600 cursor-pointer mt-0.5"
                />
                <span>
                  I agree to the FastLance{' '}
                  <a href="#terms" className="text-indigo-600 underline font-semibold">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#privacy" className="text-indigo-600 underline font-semibold">
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth={true}
              loading={isLoading}
              className="mt-2 gap-2 shadow-indigo-500/20"
            >
              <span>Complete Free Registration</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        </Card>

        {/* Security badge note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500 text-center">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Strict privacy standards & non-disclosure protection</span>
        </div>
      </div>
    </div>
  );
};

export default Register;
