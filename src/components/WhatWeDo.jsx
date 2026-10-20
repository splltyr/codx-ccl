import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Server, 
  BrainCircuit, 
  Palette, 
  ShieldAlert, 
  ChevronRight, 
  CheckCircle,
  Activity,
  X
} from 'lucide-react';
import { cyberAudio } from '../utils/audioSynth';

export default function WhatWeDo() {
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && selectedDepartment) {
        setSelectedDepartment(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [selectedDepartment]);

  const departments = [
    {
      id: 'systems',
      icon: Server,
      name: 'Systems & Cloud Infrastructure',
      tagline: 'Department 01 // Systems & Cloud',
      description: 'Architecting distributed backends, microservices, container orchestration, and high-throughput databases.',
      tech: ['Go', 'Node.js', 'PostgreSQL', 'Docker', 'Firebase'],
      deliverables: [
        'High-throughput student services & APIs',
        'Distributed systems & database schemas',
        'Automated CI/CD pipelines & cloud setups'
      ]
    },
    {
      id: 'ai',
      icon: BrainCircuit,
      name: 'Intelligent Systems & Neural AI',
      tagline: 'Department 02 // Neural AI',
      description: 'Building machine learning workflows, localized language models, autonomous agents, and campus data pipelines.',
      tech: ['Python', 'PyTorch', 'FastAPI', 'LangChain', 'Ollama'],
      deliverables: [
        'Campus AI assistant agents',
        'Predictive analytics & ML models',
        'Autonomous agent orchestration'
      ]
    },
    {
      id: 'creative',
      icon: Palette,
      name: 'Creative Tech & Sensory UI/UX',
      tagline: 'Department 03 // Sensory UI',
      description: 'Crafting responsive glassmorphic interfaces, procedural Web Audio synthesizers, and real-time Canvas 2D compositors.',
      tech: ['React 19', 'Tailwind v4', 'Canvas 2D', 'Web Audio API', 'Framer Motion'],
      deliverables: [
        'Bespoke cybernetic web interfaces',
        'Real-time Canvas 2D image compositor',
        'Procedural audio & tactile micro-interactions'
      ]
    },
    {
      id: 'cybersec',
      icon: ShieldAlert,
      name: 'Cyber Defense & Security',
      tagline: 'Department 04 // Cyber Defense',
      description: 'Conducting web security audits, vulnerability assessments, network traffic analysis, and ethical defense operations.',
      tech: ['Wireshark', 'Burp Suite', 'Linux CLI', 'Zero Trust', 'Cryptography'],
      deliverables: [
        'Web security penetration audit reports',
        'Campus CTF competition challenges',
        'Zero-trust security protocol verification'
      ]
    }
  ];

  return (
    <section id="tracks" className="relative py-28 z-10">
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
            <Activity className="w-3.5 h-3.5 text-[#FFD700]" />
            <span className="font-bold">TECHNICAL DEPARTMENTS // TRACKS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-['Space_Grotesk'] font-bold text-white mb-6">
            SPECIALIZED TRACKS. <span className="text-[#FFD700]">WHAT WE BUILD.</span>
          </h2>
          <p className="text-[#A1A1AA] text-base sm:text-lg leading-relaxed font-light">
            Four focused engineering divisions collaborating on open-source software, intelligent agents, tactile interfaces, and defense.
          </p>
        </motion.div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {departments.map((dept, idx) => {
            const Icon = dept.icon;
            return (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="glass-card p-8 rounded-3xl border border-white/10 hover:border-[#FFD700]/30 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#FFD700] group-hover:border-[#FFD700]/40 transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-slate-300">
                      {dept.tagline}
                    </span>
                  </div>

                  <h3 className="text-xl font-['Space_Grotesk'] font-bold text-white mb-2 group-hover:text-[#FFD700] transition-colors">
                    {dept.name}
                  </h3>
                  <p className="text-[#A1A1AA] text-xs sm:text-sm leading-relaxed mb-6 font-light">
                    {dept.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {dept.deliverables.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="font-light">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-white/[0.06] mb-4">
                    {dept.tech.map((t, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.08] text-[10px] font-mono text-[#FFD700]">
                        {t}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      cyberAudio.playClick();
                      setSelectedDepartment(dept);
                    }}
                    className="w-full min-h-[44px] py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-xs font-mono text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                  >
                    <span>VIEW DETAILS</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#FFD700]" aria-hidden="true" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Department Details Modal */}
        {selectedDepartment && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="department-modal-title"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedDepartment(null);
            }}
          >
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/15 max-w-lg w-full bg-[#0c0618]/95 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                <h3 id="department-modal-title" className="font-['Space_Grotesk'] font-bold text-lg text-white">
                  {selectedDepartment.name}
                </h3>
                <button
                  onClick={() => setSelectedDepartment(null)}
                  aria-label="Close details"
                  className="min-h-[40px] min-w-[40px] rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <div className="space-y-4 text-xs font-mono text-slate-300">
                <p className="font-sans text-sm text-[#A1A1AA] font-light leading-relaxed">
                  {selectedDepartment.description}
                </p>
                <div className="p-4 rounded-xl bg-[#050508] border border-white/10 space-y-2">
                  <div className="text-[#FFD700] font-bold">» TRACK ROADMAP & OBJECTIVES:</div>
                  <div>1. Foundations: Technical stack orientation & open-source setup</div>
                  <div>2. Implementation: Build sprints, API architecture & testing</div>
                  <div>3. Deployment: Production launch, code reviews & campus showcase</div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => setSelectedDepartment(null)}
                  className="min-h-[44px] px-6 py-2.5 rounded-xl btn-primary-purple text-xs font-mono font-bold tracking-wider active:scale-[0.98] transition-all"
                >
                  CLOSE DETAILS
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
