'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
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
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = (id: string, tab?: 'work' | 'education') => {
    if (tab) setTab(tab);
    setMenuOpen(false);
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
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
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between h-16">
        <motion.a
          href="#home"
          aria-label="Home"
          className={`text-2xl font-bold ${theme === 'nebula' ? 'text-purple-400' : 'text-yellow-300'}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Mia's Portfolio
        </motion.a>

        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <motion.button
              key={link.label}
              onClick={() => handleNavClick(link.id, link.tab)}
              className={`text-base font-medium ${
                theme === 'nebula' 
                  ? 'text-gray-300 hover:text-purple-400'  
                  : 'text-gray-200 hover:text-yellow-300'  
              } transition-colors px-3 py-2`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Scroll to ${link.label}`}
            >
              {link.label}
            </motion.button>
          ))}

          <motion.button 
            onClick={onResumeClick}
            className={`px-4 py-2 rounded-md font-semibold transition-all ${
              theme === 'nebula' 
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white'
                : 'bg-gradient-to-r from-yellow-400 to-red-400 hover:from-yellow-500 hover:to-red-500 text-black'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="View Resume"
          >
            Resume
          </motion.button>

          <ThemeToggle onChange={onThemeChange} />
        </div>

        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
            className={`text-2xl ${theme === 'nebula' ? 'text-purple-400' : 'text-yellow-300'} focus:outline-none`}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#0a0a1a]/90 backdrop-blur-md border-t border-gray-800 overflow-hidden"
          >
            <div className="flex flex-col items-center space-y-4 py-4">
              {navLinks.map((link) => (
                <motion.button
                  key={link.label}
                  onClick={() => handleNavClick(link.id, link.tab)}
                  className={`text-lg font-medium ${
                    theme === 'nebula'
                      ? 'text-gray-300 hover:text-purple-400'
                      : 'text-gray-200 hover:text-yellow-300'
                  } transition-colors`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Scroll to ${link.label}`}
                >
                  {link.label}
                </motion.button>
              ))}

              <motion.button
                onClick={onResumeClick}
                className={`px-5 py-2 rounded-md font-semibold transition-all ${
                  theme === 'nebula' 
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white'
                    : 'bg-gradient-to-r from-yellow-400 to-red-400 hover:from-yellow-500 hover:to-red-500 text-black'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Resume
              </motion.button>

              <ThemeToggle onChange={onThemeChange} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
