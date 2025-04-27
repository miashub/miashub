'use client';

import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ 
  onResumeClick, 
  onThemeChange, 
  theme, 
  setTab 
}: { 
  onResumeClick: () => void, 
  onThemeChange: (theme: 'nebula' | 'supernova') => void, 
  theme: 'nebula' | 'supernova',
  setTab: (tab: 'work' | 'education') => void
}) {
  const handleNavClick = (id: string, tab?: 'work' | 'education') => {
    if (tab) setTab(tab);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'work-education', label: 'Work', tab: 'work' as const },
    { id: 'work-education', label: 'Education', tab: 'education' as const },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#0a0a1a]/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.a
            href="#home"
            aria-label="Home"
            className={`text-2xl font-bold ${theme === 'nebula' ? 'text-purple-400' : 'text-yellow-300'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Mia's Portfolio
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <motion.button
                key={link.label}
                onClick={() => handleNavClick(link.id, link.tab)}
                className={`text-base font-medium ${
                  theme === 'nebula' 
                    ? 'text-gray-300 hover:text-purple-400'  // Neutral color, purple hover for nebula
                    : 'text-gray-200 hover:text-yellow-300'  // Neutral color, yellow hover for supernova
                } transition-colors px-3 py-2`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Scroll to ${link.label}`}
              >
                {link.label}
              </motion.button>
            ))}

            {/* Resume Button */}
            <motion.button 
              onClick={onResumeClick}
              className={`px-4 py-2 rounded-md font-semibold transition-all ${
                theme === 'nebula' 
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white'
                  : 'bg-gradient-to-r from-yellow-400 to-red-400 hover:from-yellow-500 hover:to-red-500 text-black'
              }`}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
              aria-label="View Resume"
            >
              Resume
            </motion.button>

            {/* Theme Toggle */}
            <ThemeToggle onChange={onThemeChange} />
          </div>

          {/* Mobile menu button would go here */}
        </div>
      </div>
    </nav>
  );
}
