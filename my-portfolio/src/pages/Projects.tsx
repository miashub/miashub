'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { PROJECTS } from '../utils/constants';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};

type Project = {
  title: string;
  description: string;
  icons: string[];
  live: string;
  github: string;
  details: {
    features: string[];
    challenges: string[];
  };
};

const ProjectCard = React.memo(({ 
  project, index, flippedIndex, setFlippedIndex, theme, isMobile 
}: { 
  project: Project;
  index: number;
  flippedIndex: number | null;
  setFlippedIndex: (index: number | null) => void;
  theme: 'nebula' | 'supernova';
  isMobile: boolean;
}) => {
  const [hovering, setHovering] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [hoverCount, setHoverCount] = useState(0);
  const hoverTimer = useRef<NodeJS.Timeout | null>(null);
  const backTimer = useRef<NodeJS.Timeout | null>(null);

  const toggleFlip = () => {
    setFlippedIndex(flippedIndex === index ? null : index);
  };

  const handleMouseEnter = () => {
    setHovering(true);
    setHoverCount((prev) => prev + 1);
    hoverTimer.current = setTimeout(() => {
      setFlippedIndex(index);
    }, 5000);
  };

  const handleMouseLeave = () => {
    setHovering(false);
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    if (backTimer.current) clearTimeout(backTimer.current);
    if (flippedIndex === index) setFlippedIndex(null);
    setHoveredSkill(null);
  };

  useEffect(() => {
    if (flippedIndex === index && hovering) {
      backTimer.current = setTimeout(() => {
        setFlippedIndex(null);
      }, 5000);
    }
    return () => {
      if (backTimer.current) clearTimeout(backTimer.current);
    };
  }, [flippedIndex, hovering]);

  return (
    <motion.div
      key={index}
      className="h-[500px] perspective-1000"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: isMobile ? 0.95 : 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: isMobile ? 0.3 : 0.6, delay: isMobile ? 0 : index * 0.12 }}
      viewport={{ once: false, amount: 0.1 }}
      style={{ willChange: 'transform, opacity' }}
    >
      {/* Front Side */}
      <div
        className={`relative w-full h-full flip-card transition-transform duration-300 ${
          flippedIndex === index
            ? 'rotate-y-180'
            : hovering && hoverCount % 10 === 1
            ? 'hover-tilt'
            : ''
        }`}
      >
        {/* Front Card */}
        <div
          className={`absolute inset-0 bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-md flex flex-col ${
            theme === 'nebula' ? 'hover:shadow-purple-500/50' : 'hover:shadow-yellow-500/50'
          }`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Flip Button */}
          <button
            onClick={toggleFlip}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="View project details"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              <polyline points="22 2 22 8 16 8" />
            </svg>
          </button>

          {/* Project Image */}
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="relative h-40 mt-8 mb-5 rounded-lg overflow-hidden block group"
          >
            <Image
              src={`/project-${index + 1}.jpg`}
              alt={project.title}
              fill
              loading="lazy"
              className="object-cover transform transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:bg-black/40 transition-all" />
            <h4
              className={`absolute bottom-3 left-4 text-lg font-bold text-white transition-colors ${
                theme === 'nebula' ? 'group-hover:text-purple-400' : 'group-hover:text-yellow-300'
              }`}
            >
              {project.title}
            </h4>
          </a>

          {/* Project Description */}
          <p className="text-gray-300 text-sm mb-5 flex-grow">{project.description}</p>

          {/* Icons */}
          <div className="flex flex-wrap gap-3 mb-6">
            {project.icons.map((icon: string) => (
              <motion.div
                key={icon}
                className="relative"
                onMouseEnter={() => setHoveredSkill(icon)}
                onMouseLeave={() => setHoveredSkill(null)}
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
              >
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                  <Image
                    src={`/icons/${icon}.png`}
                    alt={icon}
                    width={20}
                    height={20}
                    className="transition-transform"
                  />
                </div>

                {/* Tooltip */}
                <AnimatePresence>
                  {hoveredSkill === icon && (
                    <motion.div
                      className="absolute bottom-full left-1/2 transform -translate-x-1/2 z-10 mb-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap shadow-lg ${
                          theme === 'nebula' ? 'bg-purple-500/90 text-white' : 'bg-yellow-500/90 text-gray-900'
                        }`}
                      >
                        {icon.charAt(0).toUpperCase() + icon.slice(1)}
                      </div>
                      <div
                        className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent ${
                          theme === 'nebula' ? 'border-b-purple-500/90' : 'border-b-yellow-500/90'
                        }`}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 text-center py-2 rounded-lg font-semibold text-sm transition-all transform hover:scale-105 ${
                theme === 'nebula'
                  ? 'bg-violet-500/50 text-white-300 hover:bg-violet-500/60'
                  : 'bg-yellow-500/50 text-yellow-300 hover:bg-yellow-500/30'
              }`}
            >
              Live Demo
            </a>
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 text-center py-2 rounded-lg font-semibold text-sm transition-all transform hover:scale-105 ${
                theme === 'nebula'
                  ? 'bg-purple-500/50 text-white-500 hover:bg-purple-500/60'
                  : 'bg-orange-500/20 text-orange-300 hover:bg-orange-500/30'
              }`}
            >
              GitHub
            </a>
          </div>
        </div>

        {/* Back Card */}
        <div
          className={`absolute inset-0 bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-md flex flex-col ${
            theme === 'nebula' ? 'shadow-purple-500/20' : 'shadow-yellow-500/20'
          }`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <button
            onClick={toggleFlip}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Back to project"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              <polyline points="22 2 22 8 16 8" />
            </svg>
          </button>

          <h4 className="text-lg font-bold text-white mb-6">{project.title}</h4>

          <div className="mb-6">
            <h5 className="text-sm font-semibold text-gray-300 mb-2">Key Features</h5>
            <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
              {project.details.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-semibold text-gray-300 mb-2">Challenges and Learnings</h5>
            <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
              {project.details.challenges.map((challenge, i) => (
                <li key={i}>{challenge}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default function Projects({ theme }: { theme: 'nebula' | 'supernova' }) {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const isMobile = useIsMobile();

  return (
    <section id="projects" className="min-h-screen flex flex-col items-center px-6 gap-5 pt-25 pb-5 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.h3
          className={`text-4xl md:text-5xl font-bold mb-16 text-center bg-clip-text text-transparent ${
            theme === 'nebula'
              ? 'bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500'
              : 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500'
          }`}
          initial={{ y: -50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: isMobile ? 0.5 : 0.8 }}
          viewport={{ once: false, amount: 0.1 }}
        >
          My Projects
        </motion.h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {PROJECTS.map((project, index) => (
            <ProjectCard
              key={index}
              project={project}
              index={index}
              flippedIndex={flippedIndex}
              setFlippedIndex={setFlippedIndex}
              theme={theme}
              isMobile={isMobile}
            />
          ))}

          {/* Coming Soon Box */}
          <motion.div
            className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-md shadow-white/5 flex flex-col justify-center items-center text-center min-h-[500px]"
            initial={{ opacity: 0, scale: isMobile ? 0.95 : 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: isMobile ? 0.3 : 0.6, delay: isMobile ? 0 : PROJECTS.length * 0.12 }}
            viewport={{ once: false, amount: 0.1 }}
          >
            <h4 className="text-2xl font-bold mb-4">Coming Soon...</h4>
            <p className="text-gray-400 text-sm">
              More exciting projects are in progress. Stay tuned!
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
