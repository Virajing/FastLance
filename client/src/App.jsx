import Jobs from './pages/dashboard/Jobs';
import Proposals from './pages/dashboard/Proposals';
import Notifications from './pages/dashboard/Notifications';
import Saved from './pages/dashboard/Saved';
import Earnings from './pages/dashboard/Earnings';
import Reviews from './pages/dashboard/Reviews';
import ManageServices from './pages/dashboard/ManageServices';
import Portfolio from './pages/dashboard/Portfolio';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';
import Onboarding from './pages/dashboard/Onboarding';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Freelancers from './pages/Freelancers';
import FreelancerProfile from './pages/FreelancerProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Dashboard Pages
import DashboardOverview from './pages/dashboard/DashboardOverview';
import Projects from './pages/dashboard/Projects';
import Messages from './pages/dashboard/Messages';
import ProfileSettings from './pages/dashboard/ProfileSettings';

// Helper: Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <SocketProvider>
          <ScrollToTop />
          <Routes>
            {/* Public Layout Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:id" element={<ServiceDetail />} />
              <Route path="/freelancers" element={<Freelancers />} />
              <Route path="/freelancers/:id" element={<FreelancerProfile />} />
            </Route>

            {/* Auth Routes (Standalone) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Dashboard Layout Routes */}
            <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route path="onboarding" element={<Onboarding />} />
              <Route index element={<DashboardOverview />} />
              <Route path="projects" element={<Projects />} />
              <Route path="projects/:id" element={<Projects />} />
              <Route path="jobs" element={<Jobs />} />
              <Route path="jobs/:id" element={<Jobs />} />
              <Route path="proposals" element={<Proposals />} />
              <Route path="notifications" element={<Notifications />} />
              <Route element={<ProtectedRoute role="client" />}><Route path="saved" element={<Saved />} /></Route>
              <Route element={<ProtectedRoute role="freelancer" />}>
                <Route path="services" element={<ManageServices />} />
                <Route path="portfolio" element={<Portfolio />} />
                <Route path="earnings" element={<Earnings />} />
                <Route path="reviews" element={<Reviews />} />
              </Route>
              <Route path="messages" element={<Messages />} />
              <Route path="profile" element={<ProfileSettings />} />
            </Route>
            </Route>

            {/* 404 Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </SocketProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

