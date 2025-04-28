'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { SKILL_CATEGORIES } from '../utils/constants';

export default function Skills({ theme }: { theme: 'nebula' | 'supernova' }) {
  const [activeTab, setActiveTab] = useState('Frontend');
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [floatKey, setFloatKey] = useState(0);
  const [reachedSkills, setReachedSkills] = useState<number[]>([]);
  const [isSwitchingTab, setIsSwitchingTab] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const skillsRef = useRef(null);
  const isInView = useInView(skillsRef, { once: true, margin: '-100px' });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getSkillsForTab = () => {
    const category = SKILL_CATEGORIES.find(cat => cat.title === activeTab);
    return category ? category.skills : [];
  };

  const activeSkills = getSkillsForTab();

  const SKILL_POSITIONS: { [key: string]: { x: number; y: number }[] } = {
    'Frontend': [
      { x: 200, y: 25 },
      { x: 360, y: 90 },
      { x: 480, y: 220 },
      { x: 630, y: 60 },
      { x: 830, y: 160 },
    ],
    'Backend & Databases': [
      { x: 300, y: 160 },
      { x: 540, y: 58 },
      { x: 440, y: 230 },
      { x: 690, y: 140 },
    ],
    'Languages & Core': [
      { x: 270, y: 90 },
      { x: 480, y: 40 },
      { x: 730, y: 130 },
      { x: 520, y: 240 },
    ],
    'DevOps & Tools': [
      { x: 380, y: 200 },
      { x: 700, y: 170 },
      { x: 520, y: 20 },
    ],
  };

  const floatAnimation = {
    animate: { y: [0, -10, 0, 10, 0] },
    transition: { duration: 10, repeat: Infinity, ease: "easeInOut" },
  };

  const FIRST_PILL_DELAY = 0.3;
  const LINE_START_DELAY = 0.5;
  const LINE_DURATION = 0.6;

  useEffect(() => {
    setFloatKey(prev => prev + 1);
    setReachedSkills([0]);
  }, [activeTab]);

  const handleTabSwitch = (newTab: string) => {
    if (newTab !== activeTab && !isSwitchingTab) {
      setIsSwitchingTab(true);
      setReachedSkills([]);
      setTimeout(() => {
        setActiveTab(newTab);
        setIsSwitchingTab(false);
      }, 350);
    }
  };

  return (
    <section id="skills" ref={skillsRef} className="min-h-[70vh] flex flex-col items-center px-6 gap-5 pt-27 relative overflow-hidden">

      {/* Section Title */}
      <motion.h3
        initial={{ y: -50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ amount: 0.2 }}
        className={`text-4xl md:text-5xl font-bold mb-10 text-center bg-clip-text text-transparent ${
          theme === 'nebula'
            ? 'bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500'
            : 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500'
        }`}
      >
        My Skills
      </motion.h3>

      {/* Tabs */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ amount: 0.5 }}
        className="relative flex justify-center gap-6 mb-8 flex-wrap"
      >
        <div className="absolute inset-0 flex justify-center gap-6">
          <AnimatePresence>
            {SKILL_CATEGORIES.map((category) =>
              activeTab === category.title && (
                <motion.div
                  key="highlight"
                  layoutId="highlightBackground"
                  className="absolute rounded-full"
                  style={{
                    width: 'auto',
                    height: 'auto',
                    padding: '12px 24px',
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )
            )}
          </AnimatePresence>
        </div>

        {SKILL_CATEGORIES.map(category => (
          <button
            key={category.title}
            onClick={() => handleTabSwitch(category.title)}
            className={`relative px-6 py-2 rounded-full font-semibold transition-all backdrop-blur-md ${
              activeTab === category.title
                ? (theme === 'nebula'
                    ? 'bg-purple-500/50 text-white shadow-lg'
                    : 'bg-orange-500 text-white shadow-lg')
                : 'bg-white/10 hover:bg-white/20 text-gray-300'
            }`}
          >
            {category.title}
          </button>
        ))}
      </motion.div>

      {/* Skills Area */}
      <div className="relative w-full max-w-6xl mx-auto min-h-[400px] mt-4">

        {isMobile ? (
          // 📱 Mobile view: Grid layout
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 gap-6"
          >
            {activeSkills.map(skill => (
              <div
                key={skill.name}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition"
              >
                <Image
                  src={`/icons/${skill.icon}.png`}
                  alt={skill.name}
                  width={40}
                  height={40}
                  className="filter brightness-0 invert"
                />
                <span className="text-sm font-medium text-center text-gray-300">{skill.name}</span>
              </div>
            ))}
          </motion.div>
        ) : (
          // 🖥️ Desktop view: your original full floating layout
          <AnimatePresence mode="wait">
            {isInView && !isSwitchingTab && (
              <motion.div
                key={activeTab + floatKey}
                className="absolute inset-0"
                {...floatAnimation}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* SVG Lines */}
                <svg className="w-full h-full pointer-events-none" viewBox="0 0 1000 450">
                  <defs>
                    <linearGradient id="nebulaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7C3AED" />
                      <stop offset="50%" stopColor="#A855F7" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                    <linearGradient id="supernovaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FACC15" />
                      <stop offset="50%" stopColor="#F97316" />
                      <stop offset="100%" stopColor="#EF4444" />
                    </linearGradient>
                  </defs>

                  {activeSkills.map((skill, index) => {
                    if (index === activeSkills.length - 1) return null;
                    const pos1 = SKILL_POSITIONS[activeTab]?.[index];
                    const pos2 = SKILL_POSITIONS[activeTab]?.[index + 1];
                    if (!pos1 || !pos2) return null;

                    return (
                      <motion.line
                        key={`${skill.name}-line`}
                        x1={pos1.x}
                        y1={pos1.y}
                        x2={pos2.x}
                        y2={pos2.y}
                        stroke={theme === 'nebula' ? 'url(#nebulaGradient)' : 'url(#supernovaGradient)'}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{
                          duration: LINE_DURATION,
                          delay: LINE_START_DELAY + index * LINE_DURATION,
                          ease: "easeInOut",
                        }}
                        onUpdate={(latest: { pathLength: number }) => {
                          if (latest.pathLength >= 1) {
                            setReachedSkills(prev => {
                              if (!prev.includes(index + 1)) {
                                return [...prev, index + 1];
                              }
                              return prev;
                            });
                          }
                        }}
                        style={{
                          filter: theme === 'nebula'
                            ? 'drop-shadow(0 0 6px rgba(168,85,247,0.2))'
                            : 'drop-shadow(0 0 6px rgba(251,191,36,0.2))',
                        }}
                      />
                    );
                  })}
                </svg>

                {/* Skill Pills */}
                {activeSkills.map((skill, index) => {
                  const pos = SKILL_POSITIONS[activeTab]?.[index];
                  if (!pos) return null;
                  const isReached = reachedSkills.includes(index);

                  return (
                    <motion.div
                      key={skill.name}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{
                        scale: hoveredSkill === skill.name ? 1.08 : isReached ? 1.05 : 1,
                        opacity: isReached ? 1 : 0,
                      }}
                      transition={{
                        delay: index === 0 ? FIRST_PILL_DELAY : 0,
                        type: 'spring',
                        stiffness: 300,
                        damping: 20,
                      }}
                      className={`absolute flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium cursor-default
                        ${isReached
                          ? 'border-2 border-white shadow-[0_0_7px_1px_rgba(255,255,255,0.6)]'
                          : 'border border-white/10'}
                        ${
                          hoveredSkill === skill.name
                            ? (theme === 'nebula'
                                ? 'bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white'
                                : 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white')
                            : (theme === 'nebula'
                                ? 'bg-white/10 backdrop-blur-sm text-purple-300'
                                : 'bg-white/10 backdrop-blur-sm text-yellow-300')
                        }`}
                      style={{
                        top: `${pos.y - 30}px`,
                        left: `${pos.x + 9}px`,
                        zIndex: 10,
                      }}
                      onMouseEnter={() => setHoveredSkill(skill.name)}
                      onMouseLeave={() => setHoveredSkill(null)}
                    >
                      <Image
                        src={`/icons/${skill.icon}.png`}
                        alt={skill.name}
                        width={20}
                        height={20}
                        className="filter brightness-0 invert"
                      />
                      <span>{skill.name}</span>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
