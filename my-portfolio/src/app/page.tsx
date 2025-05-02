'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Home from '../pages/Home';
import Projects from '../pages/Projects';
import Skills from '../pages/Skills';
import Contact from '../pages/Contact';
import Footer from '../components/Footer';
import GalaxyLoader from '../components/GalaxyLoader';
import ResumeModal from '../pages/ResumeModal';
import CosmicParticles from '../components/CosmicParticles';
import GalaxyCursor from '../components/GalaxyCursor';
import WorkEducation from '../pages/WorkEducation';

export default function Portfolio() {
  const [showResume, setShowResume] = useState(false);
  const [theme, setTheme] = useState<'nebula' | 'supernova'>('nebula');
  const [activeTab, setActiveTab] = useState<'work' | 'education'>('work');
  const [isMobile, setIsMobile] = useState(false);

  const backgroundGradient = theme === 'nebula'
    ? 'linear-gradient(to right, black 0%, black 35%, rgba(88, 28, 135, 0.6) 50%, black 65%, black 100%)'
    : 'linear-gradient(to right, black 0%, black 35%, rgba(164, 123, 0, 0.6) 50%, black 65%, black 100%)';

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden font-sans text-white transition-colors duration-700 bg-black">
      {/* Background image layer */}
      <div 
        className="absolute inset-0 z-0 bg-[url('/stars-bg.jpg')] bg-no-repeat bg-top bg-cover bg-fixed opacity-30 pointer-events-none"
      />

      {/* Gradient overlay layer */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: 'black', // solid base fallback
          backgroundImage: backgroundGradient,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.8
        }}
      />

      {/* Cosmic particles canvas */}
      <CosmicParticles className="absolute inset-0 z-20 opacity-60 pointer-events-none" theme={theme} />

      {/* Galaxy loading animation */}
      <GalaxyLoader />

      {/* Cursor for desktop only */}
      {!isMobile && <GalaxyCursor theme={theme} />}

      {/* Main content */}
      <div className="relative z-30">
        <Navbar 
          onResumeClick={() => setShowResume(true)}
          onThemeChange={setTheme}
          theme={theme}
          setTab={setActiveTab}
        />
        <main>
          <Home theme={theme} />
          <WorkEducation theme={theme} activeTab={activeTab} setTab={setActiveTab} />
          <Projects theme={theme} />
          <Skills theme={theme} />
          <Contact theme={theme} />
        </main>
        <Footer />
      </div>

      {/* Resume modal */}
      <ResumeModal open={showResume} onClose={() => setShowResume(false)} theme={theme} />
    </div>
  );
}
