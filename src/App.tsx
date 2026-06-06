/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Problem } from './components/Problem';
import { Solution } from './components/Solution';
import { Features } from './components/Features';
import { Workflow } from './components/Workflow';
import { RoleValue } from './components/RoleValue';
import { Pricing } from './components/Pricing';
import { Testimonials } from './components/Testimonials';
import { MarketTrust } from './components/MarketTrust';
import { FAQ } from './components/FAQ';
import { FooterCTA } from './components/FooterCTA';
import { Footer } from './components/Footer';
import Dashboard from './app/Dashboard';
import { AuthModal } from './components/AuthModal';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useTheme } from './context/ThemeContext';
import { useToast } from './context/ToastContext';

export default function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [userRole, setUserRole] = useState<'owner' | 'admin' | 'coach' | 'parent' | 'school'>('coach');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const storedRole = localStorage.getItem('pitchflow_role') as 'owner' | 'admin' | 'coach' | 'parent' | 'school';
        if (storedRole) {
          setUserRole(storedRole);
        }
        setShowDashboard(true);
      } else {
        setShowDashboard(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = (role: 'owner' | 'admin' | 'coach' | 'parent' | 'school') => {
    localStorage.setItem('pitchflow_role', role);
    setUserRole(role);
    setIsAuthModalOpen(false);
    setShowDashboard(true);
    showToast(`Logged in successfully as ${role}`, 'success');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('pitchflow_role');
      setShowDashboard(false);
      showToast('Logged out successfully', 'info');
    } catch (error) {
      console.error('Logout error', error);
      showToast('Failed to log out', 'error');
    }
  };

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  if (showDashboard) {
    return <Dashboard role={userRole} onLogout={handleLogout} />;
  }

  return (
    <div className={`min-h-screen bg-pitch-light dark:bg-gray-900 font-sans text-pitch-text dark:text-gray-100`}>
      <Navbar onLogin={() => openAuth('login')} onSignup={() => openAuth('signup')} />
      <main>
        <Hero onSignup={() => openAuth('signup')} />
        <Problem />
        <Solution />
        <Features />
        <Workflow />
        <RoleValue />
        <MarketTrust />
        <Pricing onSignup={() => openAuth('signup')} />
        <Testimonials />
        <FAQ />
        <FooterCTA onSignup={() => openAuth('signup')} />
      </main>
      <Footer />
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={handleLoginSuccess}
        initialMode={authMode} 
      />
    </div>
  );
}
