import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

export function Navbar({ onLogin, onSignup }: { onLogin?: () => void, onSignup?: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  // ... rest of use effect ...

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled
          ? 'bg-pitch-dark/95 backdrop-blur-md border-pitch-darker py-4 shadow-sm'
          : 'bg-pitch-dark border-transparent py-4 text-white hover:border-pitch-darker'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer text-white">
            <div className="w-8 h-8 rounded-lg bg-pitch-lime flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-pitch-dark rounded-full"></div>
            </div>
            <span className="font-bold text-xl tracking-tight">
              Pitch<span className="text-pitch-lime">Flow</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-gray-300 hover:text-pitch-lime transition-colors">Features</a>
            <a href="#workflow" className="text-sm font-medium text-gray-300 hover:text-pitch-lime transition-colors">Workflow</a>
            <a href="#pricing" className="text-sm font-medium text-gray-300 hover:text-pitch-lime transition-colors">Pricing</a>
            <a href="#faq" className="text-sm font-medium text-gray-300 hover:text-pitch-lime transition-colors">FAQ</a>
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleTheme} 
                className="p-2 text-gray-300 hover:text-white transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <div className="w-px h-4 bg-gray-700"></div>
              <button onClick={onLogin} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Log In
              </button>
              <button onClick={onSignup} className="bg-pitch-lime text-pitch-dark px-5 py-2 rounded-full text-sm font-bold shadow-lg hover:bg-[#b0e600] transition-colors">
                Sign Up
              </button>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-pitch-dark border-b border-pitch-darker overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4 shadow-xl">
              <a onClick={() => setMobileMenuOpen(false)} href="#features" className="block text-base font-medium text-gray-300 py-2">Features</a>
              <a onClick={() => setMobileMenuOpen(false)} href="#workflow" className="block text-base font-medium text-gray-300 py-2">Workflow</a>
              <a onClick={() => setMobileMenuOpen(false)} href="#pricing" className="block text-base font-medium text-gray-300 py-2">Pricing</a>
              <a onClick={() => setMobileMenuOpen(false)} href="#faq" className="block text-base font-medium text-gray-300 py-2">FAQ</a>
              <button onClick={() => { setMobileMenuOpen(false); onLogin?.(); }} className="block text-left text-base font-medium text-gray-300 py-2">Log In</button>
              <div className="pt-4 flex flex-col gap-3">
                <button onClick={() => { setMobileMenuOpen(false); onSignup?.(); }} className="w-full bg-pitch-lime text-pitch-dark px-5 py-3 rounded-full text-base font-bold shadow-md">Sign Up Free</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
