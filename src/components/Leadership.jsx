import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Crown, User, Sparkles } from 'lucide-react';
import { GithubIcon, LinkedinIcon, FacebookIcon } from './BrandIcons';
import { firebaseData } from '../services/firebaseService';
import { cyberAudio } from '../utils/audioSynth';

export default function Leadership() {
  const [team, setTeam] = useState([]);
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsub = firebaseData.subscribeTeam((data) => {
      setTeam(data || []);
    });
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  const getInitials = (name) => {
    if (!name) return 'CX';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const filteredTeam = team.filter((member) => {
    let matchesFilter = true;
    if (filterType === 'ADMIN') {
      matchesFilter = member.badge === 'ADMIN' || member.badge === 'GROUP CREATOR';
    } else if (filterType === 'MEMBER') {
      matchesFilter = member.badge === 'MEMBER' || (!member.badge?.includes('ADMIN') && member.badge !== 'GROUP CREATOR');
    }

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || 
      member.name?.toLowerCase().includes(query) ||
      member.role?.toLowerCase().includes(query) ||
      member.badge?.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  const adminCount = team.filter(m => m.badge === 'ADMIN' || m.badge === 'GROUP CREATOR').length;
  const memberCount = team.length - adminCount;

  return (
    <section id="council" className="relative py-16 sm:py-24 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-8 sm:mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#120726]/80 border border-[#FFD700]/30 text-[#FFD700] text-xs font-mono mb-3 shadow-[0_0_15px_rgba(255,215,0,0.12)]">
            <Users className="w-3.5 h-3.5 text-[#FFD700]" aria-hidden="true" />
            <span className="font-bold">CODX MEMBER DIRECTORY // ROSTER</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-['Space_Grotesk'] font-bold text-white mb-4">
            MEMBER DIRECTORY & <span className="text-[#FFD700]">LEADERSHIP</span>
          </h2>
          <p className="text-[#A1A1AA] text-sm sm:text-base leading-relaxed font-light max-w-2xl mx-auto">
            The collective roster of student creators, administrators, and members driving technology and open-source initiatives at FEU Diliman.
          </p>
        </motion.div>

        {/* Directory Controls: Compact Filter Tabs & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 sm:mb-8 max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter member directory">
            <button
              onClick={() => {
                cyberAudio.playClick();
                setFilterType('ALL');
              }}
              className={`min-h-[36px] px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                filterType === 'ALL'
                  ? 'bg-[#6D28D9] text-white font-bold shadow-[0_0_15px_rgba(109,40,217,0.4)] border border-white/20'
                  : 'bg-white/[0.03] text-[#A1A1AA] hover:text-white border border-white/10'
              }`}
            >
              ALL ROSTER ({team.length})
            </button>

            <button
              onClick={() => {
                cyberAudio.playClick();
                setFilterType('ADMIN');
              }}
              className={`min-h-[36px] px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                filterType === 'ADMIN'
                  ? 'bg-[#6D28D9] text-white font-bold shadow-[0_0_15px_rgba(109,40,217,0.4)] border border-white/20'
                  : 'bg-white/[0.03] text-[#A1A1AA] hover:text-white border border-white/10'
              }`}
            >
              <Crown className="w-3 h-3 text-[#FFD700]" aria-hidden="true" />
              <span>LEADERSHIP ({adminCount})</span>
            </button>

            <button
              onClick={() => {
                cyberAudio.playClick();
                setFilterType('MEMBER');
              }}
              className={`min-h-[36px] px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                filterType === 'MEMBER'
                  ? 'bg-[#6D28D9] text-white font-bold shadow-[0_0_15px_rgba(109,40,217,0.4)] border border-white/20'
                  : 'bg-white/[0.03] text-[#A1A1AA] hover:text-white border border-white/10'
              }`}
            >
              <User className="w-3 h-3 text-slate-400" aria-hidden="true" />
              <span>MEMBERS ({memberCount})</span>
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search members by name or role"
              placeholder="Search roster..."
              className="glass-input w-full pl-9 pr-3 py-1.5 rounded-xl text-xs font-mono placeholder-slate-500 min-h-[38px]"
            />
          </div>
        </div>

        {/* Compact, High-Density Member Roster Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-w-7xl mx-auto">
          {filteredTeam.map((member, idx) => {
            const isCreator = member.badge === 'GROUP CREATOR';
            const isAdmin = member.badge === 'ADMIN';

            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.35, delay: Math.min(idx * 0.02, 0.25), ease: [0.16, 1, 0.3, 1] }}
                className={`glass-card p-3 rounded-2xl border transition-all flex items-center gap-3 group relative overflow-hidden ${
                  isCreator 
                    ? 'border-[#FFD700]/40 hover:border-[#FFD700] hover:shadow-[0_0_20px_rgba(255,215,0,0.18)] bg-gradient-to-r from-[#FFD700]/[0.04] to-transparent'
                    : isAdmin
                    ? 'border-[#8B5CF6]/40 hover:border-[#8B5CF6] hover:shadow-[0_0_20px_rgba(139,92,246,0.18)] bg-gradient-to-r from-[#8B5CF6]/[0.04] to-transparent'
                    : 'border-white/[0.08] hover:border-[#FFD700]/35 hover:shadow-[0_0_15px_rgba(255,215,0,0.08)]'
                }`}
              >
                {/* Compact Avatar / Initial Monogram */}
                <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-gradient-to-br from-[#1c0c38] to-[#080312] flex items-center justify-center group-hover:border-[#FFD700]/50 transition-all shadow-inner">
                  {member.avatar ? (
                    <img 
                      src={member.avatar} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-['Space_Grotesk'] font-bold text-[#FFD700] tracking-wider group-hover:scale-110 transition-transform">
                      {getInitials(member.name)}
                    </span>
                  )}

                  {/* Corner indicator icon for leadership */}
                  {isCreator && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#FFD700] flex items-center justify-center text-[#0a0414] shadow-sm">
                      <Sparkles className="w-2 h-2" />
                    </span>
                  )}
                  {isAdmin && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white shadow-sm">
                      <Crown className="w-2 h-2" />
                    </span>
                  )}
                </div>

                {/* Member Info: Name, Badge, Role */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs sm:text-sm font-['Space_Grotesk'] font-bold text-white group-hover:text-[#FFD700] transition-colors truncate">
                      {member.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase tracking-wider shrink-0 ${
                      isCreator
                        ? 'bg-[#FF7A00]/20 text-[#FFD700] border border-[#FFD700]/40'
                        : isAdmin
                        ? 'bg-purple-600/25 text-purple-200 border border-purple-400/40'
                        : 'bg-white/[0.04] text-slate-300 border border-white/10'
                    }`}>
                      {member.badge || 'MEMBER'}
                    </span>
                    <span className="text-[11px] font-mono text-slate-300 truncate">
                      {member.role || 'Builder'}
                    </span>
                  </div>
                </div>

                {/* Social Quick Links */}
                {(member.github || member.linkedin || member.facebook) && (
                  <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                    {member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} GitHub`}
                        className="p-1 rounded-lg text-slate-400 hover:text-[#FFD700] transition-colors"
                      >
                        <GithubIcon className="w-3 h-3" />
                      </a>
                    )}
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} LinkedIn`}
                        className="p-1 rounded-lg text-slate-400 hover:text-[#FFD700] transition-colors"
                      >
                        <LinkedinIcon className="w-3 h-3" />
                      </a>
                    )}
                    {member.facebook && (
                      <a
                        href={member.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} Facebook`}
                        className="p-1 rounded-lg text-slate-400 hover:text-[#FFD700] transition-colors"
                      >
                        <FacebookIcon className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredTeam.length === 0 && (
          <div className="text-center py-12 px-4 rounded-2xl bg-white/[0.02] border border-white/10 max-w-md mx-auto">
            <Users className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <div className="text-sm font-mono text-slate-300 font-bold">No members found matching "{searchQuery}"</div>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterType('ALL');
              }}
              className="mt-3 text-xs font-mono text-[#FFD700] underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        )}

        {/* Roster Metadata Footer Banner */}
        <div className="mt-8 pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ROSTER SYNCHRONIZED</span>
            </span>
            <span>•</span>
            <span>TOTAL: {team.length} MEMBERS</span>
            <span>•</span>
            <span>FEU DILIMAN CCS</span>
          </div>
          <div className="text-slate-400">
            Admin Profile Photo & Bio updates enabled via <span className="text-[#FFD700]">/admin</span>
          </div>
        </div>

      </div>
    </section>
  );
}
