import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { GithubIcon, LinkedinIcon, FacebookIcon } from './BrandIcons';
import { firebaseData } from '../services/firebaseService';

export default function Leadership() {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    const unsub = firebaseData.subscribeTeam((data) => {
      setTeam(data || []);
    });
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  return (
    <section id="council" className="relative py-28 z-10">
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
            <Users className="w-3.5 h-3.5 text-[#FFD700]" />
            <span className="font-bold">EXECUTIVE COUNCIL DIRECTORY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-['Space_Grotesk'] font-bold text-white mb-6">
            THE COUNCIL // <span className="text-[#FFD700]">STUDENT LEADERSHIP</span>
          </h2>
          <p className="text-[#A1A1AA] text-base sm:text-lg leading-relaxed font-light">
            Meet the student officers and technical leads guiding CODX and the Tamaraw engineering collective at FEU Diliman.
          </p>
        </motion.div>

        {/* Officers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {team.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card p-6 rounded-3xl border border-white/10 hover:border-[#FFD700]/30 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* avatar or initials fallback */}
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="w-full h-full rounded-2xl overflow-hidden border border-white/[0.08] bg-[#050508] flex items-center justify-center text-slate-300 font-mono font-bold text-lg shadow-inner">
                    {member.avatar ? (
                      <img 
                        src={member.avatar} 
                        alt={member.name}
                        className="w-full h-full object-cover rounded-[14px]"
                      />
                    ) : (
                      <span className="text-[#FFD700] tracking-wider">
                        {member.name ? member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'TST'}
                      </span>
                    )}
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded bg-black/90 border border-[#FFD700]/40 text-[9px] font-mono text-[#FFD700] whitespace-nowrap">
                    {member.badge || 'MOCK COUNCIL'}
                  </div>
                </div>

                <div className="text-center mb-3">
                  <h3 className="text-lg font-['Space_Grotesk'] font-bold text-white group-hover:text-[#FFD700] transition-colors">
                    {member.name}
                  </h3>
                  <div className="text-xs font-mono text-[#FFD700] font-semibold">
                    {member.role}
                  </div>
                  <div className="text-[11px] font-mono text-[#A1A1AA]">
                    {member.division}
                  </div>
                </div>

                <p className="text-[#A1A1AA] text-xs font-light leading-relaxed text-center mb-4 line-clamp-3">
                  {member.bio}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap justify-center gap-1.5 pt-3 border-t border-white/[0.06] mb-4">
                  {(member.tags || []).slice(0, 3).map((t, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-[9px] font-mono text-slate-400">
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-2.5">
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} GitHub profile`}
                      className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-[#FFD700]/40 text-slate-300 hover:text-[#FFD700] transition-colors"
                    >
                      <GithubIcon className="w-4 h-4" aria-hidden="true" />
                    </a>
                  )}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} LinkedIn profile`}
                      className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-[#FFD700]/40 text-slate-300 hover:text-[#FFD700] transition-colors"
                    >
                      <LinkedinIcon className="w-4 h-4" aria-hidden="true" />
                    </a>
                  )}
                  {member.facebook && (
                    <a
                      href={member.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} Facebook profile`}
                      className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-[#FFD700]/40 text-slate-300 hover:text-[#FFD700] transition-colors"
                    >
                      <FacebookIcon className="w-4 h-4" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
