import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Menu, 
  X, 
  Lock,
  Terminal
} from 'lucide-react';
import { cyberAudio } from '../utils/audioSynth';

export default function Navbar({ onOpenAdmin, onOpenTerminal, onOpenJoinModal }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAudioToggle = () => {
    const active = cyberAudio.toggleSound();
    setIsAudioActive(active);
  };

  const navLinks = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'tracks', label: 'Tracks' },
    { id: 'pfp-forge', label: 'PFP Generator', highlight: true },
    { id: 'events', label: 'Updates' },
    { id: 'council', label: 'Leadership' },
    { id: 'contact', label: 'Apply' },
  ];

  const scrollTo = (id) => {
    cyberAudio.playClick();
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-3 bg-[#08040d]/85 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.6)]' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div 
            onClick={() => scrollTo('hero')}
            className="flex items-center gap-3 cursor-pointer group min-h-[44px]"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') scrollTo('hero'); }}
            aria-label="CODX Home"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 bg-black/80 p-0.5 group-hover:border-[#FFD700]/50 transition-all flex items-center justify-center shrink-0 shadow-lg">
              <img 
                src="/assets/codx_logo_black.png" 
                alt="CODX Black Emblem" 
                className="w-full h-full object-cover rounded-[10px]"
              />
            </div>

            <div className="flex flex-col">
              <span className="font-['Space_Grotesk'] font-bold text-lg tracking-wider text-white leading-tight">
                CODX
              </span>
              <span className="text-[10px] font-mono text-slate-400 tracking-wider">
                FEU DILIMAN
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1 px-4 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`min-h-[36px] px-3.5 py-1.5 rounded-full text-xs font-mono transition-all ${
                  link.highlight 
                    ? 'text-[#FFD700] font-bold bg-[#FF7A00]/15 hover:bg-[#FF7A00]/25 border border-[#FFD700]/30' 
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Items */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* audio toggle */}
            <button
              onClick={handleAudioToggle}
              aria-label={isAudioActive ? 'Mute procedural ambient soundscape' : 'Activate procedural ambient soundscape'}
              className="min-h-[44px] min-w-[44px] px-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#FFD700]/40 text-slate-300 hover:text-white transition-all text-xs font-mono flex items-center justify-center gap-2"
            >
              {isAudioActive ? (
                <>
                  <Volume2 className="w-4 h-4 text-[#FFD700] animate-pulse" aria-hidden="true" />
                  <span className="text-[11px] text-[#FFD700] hidden lg:inline">SYNTH ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-400" aria-hidden="true" />
                  <span className="text-[11px] text-slate-400 hidden lg:inline">AUDIO OFF</span>
                </>
              )}
            </button>

            {/* terminal button */}
            <button
              onClick={() => {
                cyberAudio.playClick();
                if (onOpenTerminal) onOpenTerminal();
              }}
              aria-label="Toggle codx bash terminal"
              className="min-h-[44px] px-3 rounded-xl bg-white/[0.03] border border-[#FFD700]/30 hover:border-[#FFD700] text-slate-300 hover:text-white transition-all text-xs font-mono flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(255,215,0,0.1)]"
            >
              <Terminal className="w-3.5 h-3.5 text-[#FFD700]" aria-hidden="true" />
              <span className="inline text-[11px] text-[#FFD700] font-semibold">codx bash</span>
            </button>

            {/* admin lock button (shortcut: Ctrl+Shift+A) */}
            <button
              onClick={() => {
                cyberAudio.playClick();
                onOpenAdmin();
              }}
              aria-label="Open Council Admin Portal (HotKey: Ctrl+Shift+A)"
              className="min-h-[44px] min-w-[44px] rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#FFD700]/40 text-slate-400 hover:text-[#FFD700] transition-all flex items-center justify-center"
            >
              <Lock className="w-4 h-4" aria-hidden="true" />
            </button>

            {/* join button */}
            <button
              onClick={() => {
                cyberAudio.playClick();
                onOpenJoinModal();
              }}
              className="min-h-[44px] px-5 py-2.5 rounded-xl btn-primary-purple text-white font-mono text-xs font-bold tracking-wider transition-all active:scale-[0.98]"
            >
              JOIN CODX
            </button>
          </div>

          {/* mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => {
                cyberAudio.playClick();
                if (onOpenTerminal) onOpenTerminal();
              }}
              aria-label="Open codx bash terminal"
              className="w-11 h-11 rounded-xl bg-white/[0.03] border border-[#FFD700]/30 text-[#FFD700] flex items-center justify-center"
            >
              <Terminal className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              onClick={handleAudioToggle}
              aria-label={isAudioActive ? 'Mute ambient sound' : 'Turn on ambient sound'}
              className="w-11 h-11 rounded-xl bg-white/[0.03] border border-white/10 text-slate-300 flex items-center justify-center"
            >
              {isAudioActive ? <Volume2 className="w-4 h-4 text-[#FFD700]" aria-hidden="true" /> : <VolumeX className="w-4 h-4" aria-hidden="true" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              className="w-11 h-11 rounded-xl bg-white/[0.03] border border-white/10 text-slate-200 flex items-center justify-center"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-2 mx-4 p-4 rounded-2xl bg-[#0e071c]/95 border border-white/10 backdrop-blur-2xl flex flex-col gap-2 shadow-2xl">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="w-full min-h-[44px] py-2.5 px-4 rounded-xl text-left text-xs font-mono text-slate-200 hover:bg-white/[0.06] flex items-center justify-between"
            >
              <span>{link.label}</span>
              {link.highlight && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF7A00]/20 text-[#FFD700] border border-[#FFD700]/30">
                  NEW
                </span>
              )}
            </button>
          ))}
          <div className="pt-3 border-t border-white/[0.08] flex flex-col gap-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (onOpenTerminal) onOpenTerminal();
              }}
              className="w-full min-h-[44px] rounded-xl bg-white/[0.05] border border-[#FFD700]/30 font-mono text-xs font-bold text-[#FFD700] flex items-center justify-center gap-2"
            >
              <Terminal className="w-4 h-4" />
              <span>codx bash terminal</span>
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenJoinModal();
              }}
              className="w-full min-h-[44px] rounded-xl btn-primary-purple font-mono text-xs font-bold text-white shadow-lg"
            >
              JOIN CODX
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
