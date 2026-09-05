import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Home, Compass, Users, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#f0f3f8] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <Card variant="raised" padding="lg" className="max-w-md w-full text-center border border-white/80 space-y-6 relative z-10 py-12">
        <div className="w-20 h-20 mx-auto rounded-3xl neu-inset flex items-center justify-center text-indigo-600 font-black text-3xl">
          404
        </div>

        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Lost in Cyberspace?
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            The page you're searching for doesn't exist, has been moved to another escrow sprint, or is undergoing security maintenance.
          </p>
        </div>

        <div className="flex flex-col gap-2.5 pt-2">
          <Link to="/">
            <Button variant="primary" size="md" fullWidth={true} className="gap-2 shadow-indigo-500/20">
              <Home className="w-4 h-4" />
              Return to Homepage
            </Button>
          </Link>

          <div className="grid grid-cols-2 gap-2.5">
            <Link to="/services">
              <Button variant="outline" size="sm" fullWidth={true} className="gap-1.5 text-xs">
                <Compass className="w-3.5 h-3.5" />
                Services
              </Button>
            </Link>
            <Link to="/freelancers">
              <Button variant="outline" size="sm" fullWidth={true} className="gap-1.5 text-xs">
                <Users className="w-3.5 h-3.5" />
                Talent
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;
