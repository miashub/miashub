'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function GalaxyLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: isLoading ? 1 : 0 }}
      transition={{ duration: 0.6 }}
      style={{ pointerEvents: isLoading ? 'auto' : 'none' }}
    >
      {/* GalaxyLoader Main Container */}
      <div className="relative w-64 h-64 flex items-center justify-center">

        {/* Rotating Galaxy Rings */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border-2 border-purple-500 opacity-20"
            style={{
              width: `${100 - i * 18}%`,
              height: `${100 - i * 18}%`,
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 8 + i * 2, 
              ease: 'linear',
              repeat: Infinity,
            }}
          />
        ))}

        {/* Purple Shooting Star */}
        <motion.div
          className="absolute w-2 h-2 bg-purple-400 rounded-full"
          initial={{
            top: '-10%',
            left: '-10%',
            opacity: 0,
            scale: 0.7,
          }}
          animate={{
            top: '110%',
            left: '110%',
            opacity: [0, 1, 0],
            scale: [0.7, 1.2, 0.8],
          }}
          transition={{
            duration: 2.8,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatDelay: 5,
          }}
          style={{
            boxShadow: '0 0 12px 4px rgba(192,132,252,0.7)', 
            filter: 'blur(2px)',
          }}
        />

        {/* Centered Loader Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-purple-300 text-2xl tracking-widest font-semibold text-center"
          >
            ENTERING MIA'S PORTFOLIO...
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}
