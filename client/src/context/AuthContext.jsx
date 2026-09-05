import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEFAULT_USER = {
  id: 'usr-client-1',
  name: 'Julian Thorne',
  email: 'julian@hyperscale.ai',
  role: 'client', // 'client' or 'freelancer'
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  headline: 'Founder & CEO at HyperScale AI',
  company: 'HyperScale AI',
  location: 'San Francisco, CA',
  bio: 'Building enterprise autonomous agent infrastructure. Looking for senior fullstack engineers and product designers.',
  website: 'https://hyperscale.ai',
  skills: ['Product Strategy', 'AI Agents', 'Venture Capital', 'Fullstack Hiring'],
  balance: 14250,
  notificationsEnabled: true,
  emailUpdates: true
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('fastlance_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  useEffect(() => {
    localStorage.setItem('fastlance_user', JSON.stringify(user));
  }, [user]);

  const login = (email, password) => {
    // Mock login
    const newUser = {
      ...DEFAULT_USER,
      email: email || DEFAULT_USER.email,
      name: email ? email.split('@')[0] : DEFAULT_USER.name
    };
    setUser(newUser);
    return newUser;
  };

  const register = ({ name, email, role }) => {
    const newUser = {
      ...DEFAULT_USER,
      id: 'usr-' + Date.now(),
      name,
      email,
      role: role || 'client'
    };
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    // Reset to demo client or null
    setUser(null);
  };

  const switchRole = () => {
    setUser((prev) => {
      if (!prev) return DEFAULT_USER;
      const nextRole = prev.role === 'client' ? 'freelancer' : 'client';
      return {
        ...prev,
        role: nextRole,
        name: nextRole === 'freelancer' ? 'Elena Rostova' : 'Julian Thorne',
        headline: nextRole === 'freelancer' ? 'Senior Fullstack & AI Engineer' : 'Founder & CEO at HyperScale AI',
        avatar: nextRole === 'freelancer'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
      };
    });
  };

  const updateProfile = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        switchRole,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
