import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, 
  ShieldCheck, 
  Gamepad2, 
  Smartphone, 
  ChevronRight, 
  CheckCircle,
  GraduationCap,
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';
import { cyberAudio } from '../utils/audioSynth';

export default function WhatWeDo() {
  const [selectedProgram, setSelectedProgram] = useState(null);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && selectedProgram) {
        setSelectedProgram(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [selectedProgram]);

  const degreePrograms = [
    {
      id: 'bscs-se',
      code: 'BSCS',
      badge: 'DEGREE PROGRAM',
      badgeColor: 'border-[#FFD700]/40 text-[#FFD700] bg-[#FFD700]/10',
      icon: Code2,
      name: 'BS in Computer Science (BSCS)',
      specialization: 'Software Engineering',
      tagline: 'Algorithmic Foundations & Scalable Systems',
      focus: 'Algorithmic foundations, large-scale software design, application development, and mobile programming.',
      skills: ['Data Structures & Algorithms', 'System Architecture', 'Mobile Programming', 'Application Dev', 'Cloud Backends'],
      deliverables: [
        'Enterprise-grade distributed software architecture',
        'High-performance algorithmic optimization engines',
        'Cross-platform mobile and web applications'
      ],
      careerPathways: [
        'Software Engineer',
        'Full-Stack Developer',
        'Mobile App Specialist',
        'Algorithm & Systems Architect'
      ],
      overview: 'The BSCS program with specialization in Software Engineering grounds students in computational theory, algorithmic complexity, and rigorous software development lifecycles. Students engineer fault-tolerant, scalable software solutions capable of processing intensive real-world workloads.'
    },
    {
      id: 'bsit-cybersec',
      code: 'BSIT',
      badge: 'NEW SPECIALIZATION',
      badgeColor: 'border-red-400/40 text-red-300 bg-red-500/10',
      icon: ShieldCheck,
      name: 'BS in Information Technology (BSIT) - Cybersecurity Track',
      specialization: 'Cybersecurity (New)',
      tagline: 'Defense, Threat Mitigation & Infrastructure',
      focus: 'Managing threat vulnerabilities, network security, and organization infrastructure defense.',
      skills: ['Threat Analysis', 'Network Security', 'Vulnerability Assessment', 'Ethical Defense', 'Zero Trust Architecture'],
      deliverables: [
        'Defensive campus infrastructure and threat monitoring',
        'Vulnerability assessments and penetration audit reports',
        'Zero-trust network security configurations and incident protocols'
      ],
      careerPathways: [
        'Cybersecurity Analyst',
        'Information Security Specialist',
        'Penetration Tester / Security Auditor',
        'Network Defense Engineer'
      ],
      overview: 'The BSIT Cybersecurity Track equips students to manage and mitigate modern digital threats. Students acquire hands-on proficiency in network surveillance, infrastructure hardening, organizational risk defense, and ethical penetration testing.'
    },
    {
      id: 'bsit-game-dev',
      code: 'BSIT',
      badge: 'CREATIVE TECH',
      badgeColor: 'border-purple-400/40 text-purple-300 bg-purple-500/10',
      icon: Gamepad2,
      name: 'BS in Information Technology (BSIT) - Animation & Game Dev Track',
      specialization: 'Animation and Game Development',
      tagline: 'Interactive Mechanics & 3D Environments',
      focus: 'Covers 3D animation environments and game design practices.',
      skills: ['3D Animation Pipelines', 'Game Engine Architecture', 'Physics & Mechanics', 'Interactive Storytelling', 'Spatial Computing'],
      deliverables: [
        'Interactive 3D real-time gaming environments',
        'Procedural animation and character rigging pipelines',
        'Multi-platform game mechanics and gameplay architecture'
      ],
      careerPathways: [
        'Game Developer / Gameplay Programmer',
        '3D Technical Animator',
        'Interactive Media Producer',
        'Game Engine Specialist'
      ],
      overview: 'The Animation and Game Development specialization bridges creative artistry with computer technology. Students master 3D spatial environments, shader creation, physics engines, and game development lifecycles from concept to interactive execution.'
    },
    {
      id: 'bsit-web-mobile',
      code: 'BSIT',
      badge: 'ENTERPRISE TRACK',
      badgeColor: 'border-emerald-400/40 text-emerald-300 bg-emerald-500/10',
      icon: Smartphone,
      name: 'BS in Information Technology (BSIT) - Web & Mobile Applications Track',
      specialization: 'Web and Mobile Applications',
      tagline: 'Commercial Deployment & Software Integration',
      focus: 'Commercial tech deployment, software integration, and real-world system implementations.',
      skills: ['Modern Web Architecture', 'Hybrid Mobile Apps', 'REST/GraphQL APIs', 'DevOps & CI/CD', 'Enterprise Systems'],
      deliverables: [
        'Commercial-grade enterprise web portals',
        'Native and cross-platform mobile ecosystem deployments',
        'Real-world system integrations and cloud API pipelines'
      ],
      careerPathways: [
        'Web Application Engineer',
        'Mobile App Architect',
        'Enterprise Systems Integrator',
        'Cloud Solutions Specialist'
      ],
      overview: 'The Web and Mobile Applications specialization trains students for high-demand technology ecosystems. Focusing on enterprise architectures, cloud deployments, and frictionless cross-device interfaces, students deliver real-world systems ready for market deployment.'
    }
  ];

  const handleApplyClick = () => {
    cyberAudio.playClick();
    if (selectedProgram) setSelectedProgram(null);
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="tracks" className="relative py-20 sm:py-28 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#120726]/80 border border-[#FFD700]/30 text-[#FFD700] text-xs font-mono mb-4 shadow-[0_0_15px_rgba(255,215,0,0.12)]">
            <GraduationCap className="w-3.5 h-3.5 text-[#FFD700]" aria-hidden="true" />
            <span className="font-bold">COLLEGE OF COMPUTER STUDIES (CCS) // FEU DILIMAN</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-['Space_Grotesk'] font-bold text-white mb-6">
            DEGREE PROGRAMS & <span className="text-[#FFD700]">SPECIALIZATIONS</span>
          </h2>
          <p className="text-[#A1A1AA] text-base sm:text-lg leading-relaxed font-light">
            Official degree offerings and technical tracks under the College of Computer Studies at FEU Diliman, powering next-generation innovators in software, cybersecurity, game development, and web engineering.
          </p>
        </motion.div>

        {/* Degree Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {degreePrograms.map((program, idx) => {
            const Icon = program.icon;
            return (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-[#FFD700]/40 transition-all flex flex-col justify-between group shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
              >
                <div>
                  {/* Top Bar: Icon + Badges */}
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#FFD700] group-hover:border-[#FFD700]/50 group-hover:scale-105 transition-all shadow-md">
                      <Icon className="w-6 h-6" aria-hidden="true" />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${program.badgeColor}`}>
                        {program.badge}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-slate-300 font-bold">
                        {program.code}
                      </span>
                    </div>
                  </div>

                  {/* Program Title */}
                  <h3 className="text-xl sm:text-2xl font-['Space_Grotesk'] font-bold text-white mb-1 group-hover:text-[#FFD700] transition-colors leading-snug">
                    {program.name}
                  </h3>

                  {/* Specialization Highlight */}
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#FFD700] mb-3">
                    <Sparkles className="w-3 h-3 text-[#FFD700]" aria-hidden="true" />
                    <span>Specialization: {program.specialization}</span>
                  </div>

                  {/* Focus Description */}
                  <div className="p-3.5 rounded-2xl bg-[#090314]/70 border border-white/[0.06] mb-5">
                    <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1 font-semibold">
                      Core Academic Focus:
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
                      {program.focus}
                    </p>
                  </div>

                  {/* Deliverables / Outcomes */}
                  <div className="space-y-2 mb-6">
                    {program.deliverables.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="font-light">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  {/* Skill Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/[0.06] mb-4">
                    {program.skills.map((skill, i) => (
                      <span 
                        key={i} 
                        className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[10px] font-mono text-slate-300 hover:text-[#FFD700] hover:border-[#FFD700]/30 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => {
                      cyberAudio.playClick();
                      setSelectedProgram(program);
                    }}
                    className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-[#FFD700]/40 text-xs font-mono font-semibold text-slate-200 hover:text-[#FFD700] flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <span>EXPLORE SPECIALIZATION</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#FFD700]" aria-hidden="true" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Program Details Modal */}
        <AnimatePresence>
          {selectedProgram && (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl"
              role="dialog"
              aria-modal="true"
              aria-labelledby="program-modal-title"
              onClick={(e) => {
                if (e.target === e.currentTarget) setSelectedProgram(null);
              }}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/15 max-w-xl w-full max-h-[88vh] overflow-y-auto bg-[#0c0618]/95 shadow-2xl"
              >
                {/* Modal Header */}
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10 mb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${selectedProgram.badgeColor}`}>
                        {selectedProgram.badge}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-slate-300 font-bold">
                        FEU DILIMAN CCS
                      </span>
                    </div>
                    <h3 id="program-modal-title" className="font-['Space_Grotesk'] font-bold text-lg sm:text-xl text-white">
                      {selectedProgram.name}
                    </h3>
                    <div className="text-xs font-mono text-[#FFD700] mt-1 font-semibold">
                      Specialization: {selectedProgram.specialization}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      cyberAudio.playClick();
                      setSelectedProgram(null);
                    }}
                    aria-label="Close details"
                    className="min-h-[40px] min-w-[40px] rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="space-y-4 text-xs font-mono text-slate-300">
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                    <div className="text-[11px] text-[#FFD700] font-bold uppercase tracking-wider mb-1">
                      Academic Overview:
                    </div>
                    <p className="font-sans text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                      {selectedProgram.overview}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#050508] border border-white/10 space-y-2.5">
                    <div className="text-[#FFD700] font-bold text-xs uppercase tracking-wider">
                      » INDUSTRY CAREER PATHWAYS:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedProgram.careerPathways.map((career, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700]" />
                          <span>{career}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0e071c] border border-purple-500/20 space-y-2">
                    <div className="text-purple-300 font-bold text-xs uppercase tracking-wider">
                      » PROGRAM FOCUS & PRACTICUM:
                    </div>
                    <p className="font-sans text-xs text-slate-300 leading-relaxed font-light">
                      {selectedProgram.focus}
                    </p>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-[11px] font-mono text-slate-400">
                    FEU Diliman College of Computer Studies
                  </span>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setSelectedProgram(null)}
                      className="flex-1 sm:flex-initial min-h-[44px] px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono text-slate-300 cursor-pointer"
                    >
                      CLOSE
                    </button>
                    <button
                      onClick={handleApplyClick}
                      className="flex-1 sm:flex-initial min-h-[44px] px-5 py-2 rounded-xl btn-primary-purple text-xs font-mono font-bold tracking-wider active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
                    >
                      <span>JOIN CODX COHORT</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
