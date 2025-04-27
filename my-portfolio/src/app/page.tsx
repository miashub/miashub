'use client';

import { useState } from 'react';
import Navbar from './Navbar';
import Home from './Home';
import Projects from './Projects';
import Skills from './Skills';
import Contact from './Contact';
import Footer from './Footer';
import GalaxyLoader from './GalaxyLoader';
import ResumeModal from './ResumeModal';
import CosmicParticles from './CosmicParticles';
import GalaxyCursor from './GalaxyCursor';
import WorkEducation from './WorkEducation';

export default function Portfolio() {
  const [showResume, setShowResume] = useState(false);
  const [theme, setTheme] = useState<'nebula' | 'supernova'>('nebula');
  const [activeTab, setActiveTab] = useState<'work' | 'education'>('work'); // 🆕 added for flip!

  const backgroundGradient = theme === 'nebula'
    ? 'linear-gradient(to right, black 0%, black 35%, rgba(88, 28, 135, 0.2) 50%, black 65%, black 100%)'
    : 'linear-gradient(to right, black 0%, black 35%, rgba(164, 123, 0, 0.2) 50%, black 65%, black 100%)';

  return (
    <div className="relative min-h-screen overflow-hidden font-sans text-white transition-colors duration-700">

  {/* Stars Background FIRST (slightly stronger opacity) */}
  <div 
    className="absolute inset-0 bg-[url('/stars-bg.jpg')] bg-no-repeat bg-top bg-cover bg-fixed opacity-30 z-0 pointer-events-none"
  />

  {/* Gradient Layer ABOVE stars */}
  <div 
    className="absolute inset-0 bg-gradient-to-r from-black via-purple-900/30 to-black opacity-80 z-10 pointer-events-none"
    style={{ backgroundImage: backgroundGradient, backgroundSize: 'cover', backgroundPosition: 'center' }}
  />

  {/* Cosmic Particles ABOVE gradient */}
  <CosmicParticles className="absolute inset-0 z-20 opacity-60 pointer-events-none" theme={theme} />

  {/* Galaxy Loader + Cursor */}
  <GalaxyLoader />
  <GalaxyCursor theme={theme} />

  {/* Main Content ABOVE everything */}
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

  {/* Resume Modal */}
  <ResumeModal open={showResume} onClose={() => setShowResume(false)} />
</div>

  );
}
