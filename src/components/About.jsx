import React from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, 
  Binary, 
  GitBranch, 
  HeartHandshake, 
  MapPin, 
  Sparkles,
  Award
} from 'lucide-react';

export default function About() {
  const pillars = [
    {
      icon: Cpu,
      title: 'Engineering Rigor',
      desc: 'Building production-grade web systems, cloud infrastructure, and modern student toolkits.'
    },
    {
      icon: Binary,
      title: 'Intelligent AI',
      desc: 'Exploring machine learning, neural architectures, and student-built software agents.'
    },
    {
      icon: GitBranch,
      title: 'Creative Tech & UI/UX',
      desc: 'Crafting responsive glassmorphic experiences, audio engines, and interactive visual designs.'
    },
    {
      icon: HeartHandshake,
      title: 'Tamaraw Community',
      desc: 'Mentorship, collaborative open-source sprints, and peer-to-peer coding workshops.'
    }
  ];

  return (
    <section id="about" className="relative py-28 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#120726]/80 border border-[#FFD700]/30 text-[#FFD700] text-xs font-mono mb-4">
            <MapPin className="w-3.5 h-3.5 text-[#FFD700]" />
            <span className="font-bold">ABOUT // APD GENESIS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-['Space_Grotesk'] font-bold text-white mb-6">
            THE 2ND GENERATION OF APD. <span className="text-[#FFD700]">FEU DILIMAN.</span>
          </h2>
          <p className="text-[#A1A1AA] text-base sm:text-lg leading-relaxed font-light">
            Born from the legacy of APD, CODX is the flagship student technology collective at FEU Diliman, empowering Tamaraws across software engineering, AI, creative tech, and cyber defense.
          </p>
        </motion.div>

        {/* Highlight Feature Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 hover:border-[#FFD700]/30 transition-all max-w-5xl mx-auto mb-16 relative overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-white/[0.04] border border-[#FFD700]/30 text-[#FFD700] text-xs font-mono font-bold">
                APD HERITAGE
              </div>
              <h3 className="text-2xl sm:text-3xl font-['Space_Grotesk'] font-bold text-white">
                Pioneering Technical Excellence at FEU Diliman
              </h3>
              <p className="text-[#A1A1AA] text-sm sm:text-base leading-relaxed font-light">
                CODX unites ambitious student builders, designers, and engineers to collaborate on real-world projects, competitive hackathons, and industry-grade technology tracks.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#FFD700]" aria-hidden="true" />
                  <span>FEU Diliman Student Organization</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FFD700]" aria-hidden="true" />
                  <span>Open Source & Collaborative Tech</span>
                </div>
              </div>
            </div>

            {/* visual card */}
            <div className="md:col-span-5 h-64 rounded-2xl bg-[#050508] border border-white/[0.08] flex flex-col items-center justify-center p-6 text-center shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-4 text-[#FFD700]">
                <Cpu className="w-8 h-8" />
              </div>
              <span className="font-['Space_Grotesk'] font-bold text-white text-base">
                TEST FRAMEWORK
              </span>
              <span className="text-[11px] font-mono text-[#A1A1AA] mt-1">
                Mock Preview Platform
              </span>
            </div>
          </div>
        </motion.div>

        {/* pillars grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="glass-card p-6 rounded-2xl border border-white/10 hover:border-[#FFD700]/40 relative group transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-5 text-[#FFD700] group-hover:scale-105 group-hover:border-[#FFD700]/30 transition-all">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-base font-['Space_Grotesk'] font-bold text-white mb-2 group-hover:text-[#FFD700] transition-colors text-balance">
                  {pillar.title}
                </h3>
                <p className="text-[#A1A1AA] text-xs sm:text-sm leading-relaxed font-light">
                  {pillar.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
