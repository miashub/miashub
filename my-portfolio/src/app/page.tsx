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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); 
    };

    checkMobile(); 

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const backgroundGradient = theme === 'nebula'
    ? 'linear-gradient(to right, black 0%, black 35%, rgba(88, 28, 135, 0.2) 50%, black 65%, black 100%)'
    : 'linear-gradient(to right, black 0%, black 35%, rgba(164, 123, 0, 0.2) 50%, black 65%, black 100%)';

  return (
    <div className="relative min-h-screen overflow-hidden font-sans text-white transition-colors duration-700">
      <div 
        className="absolute inset-0 bg-[url('/stars-bg.jpg')] bg-no-repeat bg-top bg-cover bg-fixed opacity-30 z-0 pointer-events-none"
      />
      <div 
        className="absolute inset-0 bg-gradient-to-r from-black via-purple-900/30 to-black opacity-80 z-10 pointer-events-none"
        style={{ backgroundImage: backgroundGradient, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <CosmicParticles className="absolute inset-0 z-20 opacity-60 pointer-events-none" theme={theme} />
      <GalaxyLoader />
      {!isMobile && <GalaxyCursor theme={theme} />} 

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

      <ResumeModal open={showResume} onClose={() => setShowResume(false)} />
    </div>
  );
}
