import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon } from 'lucide-react';
import CyberBackground from './components/CyberBackground';
import TerminalIntro from './components/TerminalIntro';
import RocketIntroSequence from './components/RocketIntroSequence';
import SkeletalMascot from './components/SkeletalMascot';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import WhatWeDo from './components/WhatWeDo';
import CommunityEvents from './components/CommunityEvents';
import PfpGenerator from './components/PfpGenerator';
import Leadership from './components/Leadership';
import ContactSection from './components/ContactSection';
import AdminPortal from './components/AdminPortal';
import DocsModal from './components/DocsModal';
import { cyberAudio } from './utils/audioSynth';

export default function App() {
  const [showRocketIntro, setShowRocketIntro] = useState(true);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  // hidden shortcut to open the council admin portal: ctrl+shift+a
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        cyberAudio.playClick();
        setIsAdminOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 3500);
  };

  const handleOpenJoinModal = () => {
    cyberAudio.playClick();
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0414] text-slate-100 font-['Outfit',sans-serif] selection:bg-[#6D28D9] selection:text-white">
      
      {/* rocket launch intro animation */}
      <AnimatePresence>
        {showRocketIntro && (
          <RocketIntroSequence onComplete={() => setShowRocketIntro(false)} />
        )}
      </AnimatePresence>

      {/* interactive terminal popup */}
      <AnimatePresence>
        {isTerminalOpen && (
          <TerminalIntro 
            isOpen={isTerminalOpen}
            onClose={() => setIsTerminalOpen(false)} 
          />
        )}
      </AnimatePresence>

      {/* starfield canvas in background */}
      <CyberBackground />

      {/* navbar */}
      <Navbar 
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenTerminal={() => setIsTerminalOpen(true)}
        onOpenJoinModal={handleOpenJoinModal}
      />

      {/* floating terminal button in bottom left */}
      <button
        onClick={() => {
          cyberAudio.playClick();
          setIsTerminalOpen((prev) => !prev);
        }}
        aria-label="Toggle CODX Bash CLI Terminal"
        className="fixed bottom-6 left-6 z-50 group flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#0e071c]/90 border border-[#FFD700]/30 hover:border-[#FFD700] shadow-[0_4px_25px_rgba(0,0,0,0.65)] backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 text-xs font-mono"
        title="Toggle CODX Bash Terminal [CLI]"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
        <TerminalIcon className="w-3.5 h-3.5 text-[#FFD700]" aria-hidden="true" />
        <span className="text-slate-300 group-hover:text-white font-medium">codx bash</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-[#FFD700] border border-white/10 font-bold">
          CLI
        </span>
      </button>

      {/* dextron mascot fixed in bottom right */}
      <div className="fixed bottom-6 right-6 z-40 pointer-events-auto">
        <SkeletalMascot />
      </div>

      {/* page sections */}
      <main id="main-content" className="relative z-10 flex flex-col">
        <Hero onOpenJoinModal={handleOpenJoinModal} />
        <About />
        <WhatWeDo />
        <PfpGenerator onShowToast={showToast} />
        <CommunityEvents />
        <Leadership />
        <ContactSection 
          onOpenAdmin={() => setIsAdminOpen(true)}
          onShowToast={showToast}
          onOpenDocs={() => setIsDocsOpen(true)}
        />
      </main>

      {/* project architecture & docs modal */}
      <DocsModal 
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />

      {/* admin dashboard modal */}
      <AdminPortal 
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onShowToast={showToast}
      />

      {/* feedback toast */}
      {toastVisible && (
        <div 
          role="status" 
          aria-live="polite"
          className="fixed bottom-28 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#0e071c]/95 border border-[#8B5CF6]/50 shadow-[0_0_30px_rgba(139,92,246,0.3)] backdrop-blur-xl animate-bounce-subtle"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" aria-hidden="true" />
          <span className="text-xs font-mono font-semibold text-slate-200">
            {toastMessage}
          </span>
        </div>
      )}

    </div>
  );
}
