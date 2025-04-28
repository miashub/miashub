'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ThemeToggleProps {
  onChange: (theme: 'nebula' | 'supernova') => void;
}

export default function ThemeToggle({ onChange }: ThemeToggleProps) {
  const [currentTheme, setCurrentTheme] = useState<'nebula' | 'supernova'>('nebula');

  const toggleTheme = () => {
    const newTheme = currentTheme === 'nebula' ? 'supernova' : 'nebula';
    setCurrentTheme(newTheme);
    onChange(newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === 'nebula' || savedTheme === 'supernova') {
      setCurrentTheme(savedTheme);
      onChange(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('portfolio-theme', currentTheme);
  }, [currentTheme]);

  return (
    <motion.button
      onClick={toggleTheme}
      className="w-10 h-10 rounded-full bg-gray-800/80 backdrop-blur-sm flex items-center justify-center border border-indigo-900/50 hover:bg-gray-700/80 transition-colors relative overflow-hidden"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      title={`Toggle theme (Current: ${currentTheme})`}
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          rotate: currentTheme === 'nebula' ? 0 : 180,
          scale: currentTheme === 'nebula' ? 1 : 0.8
        }}
        transition={{ duration: 0.5, type: 'spring' }}
      >
        {currentTheme === 'nebula' ? (
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 shadow-inner shadow-purple-300/30" />
        ) : (
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-red-500 shadow-inner shadow-orange-300/30" />
        )}
      </motion.div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: 2,
              height: 2,
              opacity: 0.3
            }}
            animate={{
              x: currentTheme === 'nebula' 
                ? Math.cos(i * Math.PI/2) * 10 
                : Math.cos(i * Math.PI/2 + Math.PI/4) * 12,
              y: currentTheme === 'nebula' 
                ? Math.sin(i * Math.PI/2) * 10 
                : Math.sin(i * Math.PI/2 + Math.PI/4) * 12
            }}
            transition={{ duration: 0.7 }}
          />
        ))}
      </div>
    </motion.button>
  );
}
