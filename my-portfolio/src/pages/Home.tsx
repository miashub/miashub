'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaMapMarkerAlt, FaGithub, FaLinkedin, FaEnvelope, FaChevronDown } from 'react-icons/fa';

export default function Home({ theme }: { theme: 'nebula' | 'supernova' }) {
  const borderColor = theme === 'nebula' ? 'border-purple-500' : 'border-yellow-400';
  const textGradient = theme === 'nebula'
    ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400'
    : 'bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400';

  const [displayedText, setDisplayedText] = useState("Hey, I'm Mia");
  const [isHovering, setIsHovering] = useState(false);

  const originalText = "Hey, I'm Mia";
  const targetText = "Hey, I'm Fathima";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
  const scrambleFrames = 10;

  useEffect(() => {
    let frame: number;
    let progress = 0;
    const maxLength = Math.max(originalText.length, targetText.length);

    const scrambleToTarget = () => {
      setDisplayedText(() => {
        const next = Array.from({ length: maxLength }).map((_, i) => {
          if (i < progress) {
            return targetText[i] || '';
          }
          if (i < targetText.length) {
            return characters[Math.floor(Math.random() * characters.length)];
          }
          return '';
        }).join('');
        return next;
      });

      progress += 1;
      if (progress <= maxLength) frame = requestAnimationFrame(scrambleToTarget);
    };

    const randomGibberishThenShrinkThenUnscramble = () => {
      let shrinkLength = targetText.length;
      let unscrambleProgress = 0;

      const scrambleShrinkPhase = () => {
        setDisplayedText(() => {
          const randomString = Array.from({ length: shrinkLength }).map(() =>
            characters[Math.floor(Math.random() * characters.length)]
          ).join('');
          return randomString;
        });

        shrinkLength -= Math.ceil((targetText.length - originalText.length) / scrambleFrames);

        if (shrinkLength > originalText.length) {
          frame = requestAnimationFrame(scrambleShrinkPhase);
        } else {
          frame = requestAnimationFrame(unscramblePhase);
        }
      };

      const unscramblePhase = () => {
        setDisplayedText((prev) => {
          const next = Array.from({ length: originalText.length }).map((_, i) => {
            if (i >= originalText.length - unscrambleProgress) {
              return originalText[i];
            }
            return characters[Math.floor(Math.random() * characters.length)];
          }).join('');
          return next;
        });

        unscrambleProgress += 1;
        if (unscrambleProgress <= originalText.length) {
          frame = requestAnimationFrame(unscramblePhase);
        }
      };

      frame = requestAnimationFrame(scrambleShrinkPhase);
    };

    if (isHovering) {
      frame = requestAnimationFrame(scrambleToTarget);
    } else {
      frame = requestAnimationFrame(randomGibberishThenShrinkThenUnscramble);
    }

    return () => cancelAnimationFrame(frame);
  }, [isHovering]);

  const iconColor = theme === 'nebula' ? 'text-purple-400' : 'text-yellow-400';

  return (
    <section id="home" className="flex flex-col items-center justify-center min-h-screen px-6 relative overflow-hidden text-center space-y-1">
      <motion.div
        className="relative group"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        whileHover={{ rotate: 3, scale: 1.05 }}
      >
        <div className={`w-[150px] h-[150px] rounded-full overflow-hidden border-4 ${borderColor} relative z-10 transition duration-500`}>
          <Image
            src="/profile.jpg"
            alt="Mia's Photo"
            width={150}
            height={150}
            className="object-cover w-full h-full"
            priority
          />
        </div>
      </motion.div>

      <motion.h2 
        className={`text-2xl md:text-4xl font-bold ${textGradient} bg-clip-text text-transparent cursor-pointer`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        whileHover={{ scale: 1.05 }}
      >
        {displayedText}
      </motion.h2>

      <motion.p
        className="text-sm flex items-center justify-center gap-1 mt-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <FaMapMarkerAlt className={theme === 'nebula' ? 'text-purple-400' : 'text-yellow-400'} />
        <span className={theme === 'nebula' ? 'text-gray-400' : 'text-gray-200'}>
          Toronto, Canada
        </span>
      </motion.p>

      <motion.p 
        className={`text-sm ${theme === 'nebula' ? 'text-gray-300' : 'text-gray-100'} max-w-sm mt-2`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        Full-stack developer working with React, Next.js, and Django.
      </motion.p>

      <motion.div 
        className="flex gap-8 text-2xl mt-1 justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {[
          { href: "mailto:fathimas0207@gmail.com", icon: <FaEnvelope /> },
          { href: "https://github.com/miashub", icon: <FaGithub /> },
          { href: "https://linkedin.com/in/mia-shajahan", icon: <FaLinkedin /> }
        ].map(({ href, icon }, idx) => (
          <motion.a
            key={idx}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -5, scale: 1.2 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className={`${iconColor} transition-colors`}
          >
            {icon}
          </motion.a>
        ))}
      </motion.div>

      <motion.div
        className="absolute bottom-6 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: 'easeInOut',
          }}
          whileHover={{ scale: 1.2 }}
        >
          <FaChevronDown
            className={`${theme === 'nebula' ? 'text-purple-400' : 'text-yellow-400'} text-4xl scale-x-150 scale-y-80 opacity-40`}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
