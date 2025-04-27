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
      transition={{ duration: 0.5 }}
      style={{ pointerEvents: isLoading ? 'auto' : 'none' }}
    >
      <div className="relative w-64 h-64">
        {/* Spinning Galaxy Rings */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border-2 border-purple-500 opacity-20"
            style={{
              width: `${100 - i * 15}%`,
              height: `${100 - i * 15}%`,
              top: `${i * 7.5}%`,
              left: `${i * 7.5}%`,
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 8 + i,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}

        {/* Shooting Star */}
        <motion.div
          className="absolute w-1 h-1 bg-white rounded-full"
          initial={{
            top: '10%',
            left: '-10%',
            opacity: 0,
            scale: 0.5,
          }}
          animate={{
            top: '90%',
            left: '110%',
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.8],
          }}
          transition={{
            duration: 2.5,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatDelay: 6,
          }}
          style={{
            boxShadow: '0 0 6px 3px rgba(255,255,255,0.6)',
            filter: 'blur(1px)',
          }}
        />

        {/* Loader Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-purple-400 text-xl font-bold"
          >
            ENTERING MIA'S PORTFOLIO...
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
