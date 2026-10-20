import React from 'react';
import { motion } from 'framer-motion';
import { Camera, ArrowRight, Star } from 'lucide-react';
import { cyberAudio } from '../utils/audioSynth';

export default function Hero({ onOpenJoinModal }) {
  const scrollToSection = (id) => {
    cyberAudio.playClick();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-[82vh] pt-36 pb-20 flex items-center justify-center">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 text-center">
        
        {/* Top Tagline Pill */}
        <motion.div 
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#120726]/80 border border-[#FFD700]/30 shadow-[0_0_20px_rgba(255,215,0,0.1)] backdrop-blur-xl">
            <span className="w-2 h-2 rounded-full bg-[#FFD700]" aria-hidden="true" />
            <span className="text-xs font-mono tracking-wider text-[#FFD700] font-semibold">
              FEU DILIMAN STUDENT COLLECTIVE
            </span>
            <div className="flex items-center gap-1 text-[#FFD700] text-xs font-mono font-bold">
              <Star className="w-3 h-3 fill-[#FFD700] text-[#FFD700]" aria-hidden="true" />
              <span>CODX</span>
            </div>
          </div>
        </motion.div>

        {/* hero title */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto mb-10"
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-['Space_Grotesk'] font-extrabold tracking-tight leading-[1.08] mb-6 text-balance text-white">
            FEU DILIMAN{' '}
            <span className="text-[#FFD700]">
              CODX TEST.
            </span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-[#A1A1AA] max-w-2xl mx-auto font-light leading-relaxed text-balance">
            The student engineering and technology collective at FEU Diliman. Building systems, creative tech, intelligent AI, and cyber defense.
          </p>

          {/* cta buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => scrollToSection('pfp-forge')}
              className="min-h-[48px] px-7 py-3 rounded-xl btn-primary-purple text-white font-mono text-xs font-bold tracking-wider flex items-center gap-2 transition-all active:scale-[0.98]"
            >
              <Camera className="w-4 h-4 text-white" aria-hidden="true" />
              <span>PFP GENERATOR</span>
            </button>

            <button
              onClick={() => {
                cyberAudio.playClick();
                onOpenJoinModal();
              }}
              className="min-h-[48px] px-7 py-3 rounded-xl btn-glass-gold font-mono text-xs font-medium tracking-wide flex items-center gap-2 transition-all active:scale-[0.98]"
            >
              <span>JOIN THE COLLECTIVE</span>
              <ArrowRight className="w-4 h-4 text-[#FFD700]" aria-hidden="true" />
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
