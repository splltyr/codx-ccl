import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  X,
  Code2,
  ShieldCheck,
  Gamepad2,
  Smartphone,
  Sparkles,
  GraduationCap,
  BookOpen
} from 'lucide-react';
import { firebaseData } from '../services/firebaseService';
import { cyberAudio } from '../utils/audioSynth';

export default function CommunityEvents() {
  const [articles, setArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticleModal, setActiveArticleModal] = useState(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && activeArticleModal) {
        setActiveArticleModal(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [activeArticleModal]);

  useEffect(() => {
    const unsub = firebaseData.subscribeArticles((data) => {
      setArticles(data || []);
    });
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  const categories = [
    'ALL', 
    'Academic Program Spotlight', 
    'Computer Science', 
    'Information Technology'
  ];

  const filteredArticles = articles.filter(art => {
    let matchesCategory = true;
    if (selectedCategory === 'Computer Science') {
      matchesCategory = (art.programCode === 'BSCS' || art.title?.includes('Computer Science'));
    } else if (selectedCategory === 'Information Technology') {
      matchesCategory = (art.programCode === 'BSIT' || art.title?.includes('Information Technology'));
    } else if (selectedCategory !== 'ALL') {
      matchesCategory = art.category?.toLowerCase() === selectedCategory.toLowerCase();
    }

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      art.title?.toLowerCase().includes(q) ||
      art.specialization?.toLowerCase().includes(q) ||
      art.focus?.toLowerCase().includes(q) ||
      art.excerpt?.toLowerCase().includes(q) ||
      art.tags?.some(t => t.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  const openArticle = (article) => {
    cyberAudio.playClick();
    setActiveArticleModal(article);
  };


  const getProgramIcon = (art) => {
    const spec = (art.specialization || '').toLowerCase();
    const title = (art.title || '').toLowerCase();
    
    if (spec.includes('cyber') || title.includes('cyber')) {
      return <ShieldCheck className="w-8 h-8 text-[#FFD700]" aria-hidden="true" />;
    }
    if (spec.includes('game') || spec.includes('animation') || title.includes('animation')) {
      return <Gamepad2 className="w-8 h-8 text-[#FFD700]" aria-hidden="true" />;
    }
    if (spec.includes('mobile') || spec.includes('web') || title.includes('mobile')) {
      return <Smartphone className="w-8 h-8 text-[#FFD700]" aria-hidden="true" />;
    }
    return <Code2 className="w-8 h-8 text-[#FFD700]" aria-hidden="true" />;
  };

  return (
    <section id="events" className="relative py-28 z-10">
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
            <GraduationCap className="w-3.5 h-3.5 text-[#FFD700]" />
            <span className="font-bold">FEU DILIMAN CCS // ACADEMIC SPOTLIGHT</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-['Space_Grotesk'] font-bold text-white mb-6">
            DEGREE PROGRAMS & <span className="text-[#FFD700]">SPECIALIZATIONS</span>
          </h2>
          <p className="text-[#A1A1AA] text-base sm:text-lg leading-relaxed font-light">
            Official degree programs and academic specializations offered under the College of Computer Studies (CCS) at FEU Diliman.
          </p>
        </motion.div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter programs by category">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  cyberAudio.playClick();
                  setSelectedCategory(cat);
                }}
                aria-pressed={selectedCategory === cat}
                className={`min-h-[40px] px-4 py-2 rounded-full text-xs font-mono transition-all active:scale-[0.98] cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#6D28D9] text-white font-bold shadow-[0_0_15px_rgba(109,40,217,0.4)] border border-white/20'
                    : 'bg-white/[0.03] text-[#A1A1AA] hover:text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search degree programs and specializations"
              placeholder="Search programs or focus areas..."
              className="glass-input w-full pl-9 pr-3 py-2 rounded-xl text-xs font-mono placeholder-slate-500 min-h-[44px]"
            />
          </div>
        </div>

        {/* Dynamic Programs Grid: 2x2 Clean Responsive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 max-w-6xl mx-auto">
          {filteredArticles.map((article, idx) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-3xl overflow-hidden border border-white/10 hover:border-[#FFD700]/40 flex flex-col justify-between group transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_35px_rgba(255,215,0,0.14)]"
            >
              <div>
                {/* Visual Header Banner */}
                <div className="relative h-44 overflow-hidden bg-gradient-to-br from-[#1b0933]/90 via-[#0a0414] to-[#040108] border-b border-white/[0.08] flex items-center justify-center">
                  
                  {/* Subtle Grid Accent Pattern */}
                  <div 
                    className="absolute inset-0 opacity-15 pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,215,0,0.3) 1px, transparent 0)',
                      backgroundSize: '20px 20px'
                    }}
                  />

                  {article.imageUrl ? (
                    <img 
                      src={article.imageUrl} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="relative z-10 flex flex-col items-center justify-center p-4 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-black/60 border border-[#FFD700]/30 shadow-[0_0_20px_rgba(255,215,0,0.18)] flex items-center justify-center mb-2 group-hover:scale-110 group-hover:border-[#FFD700] transition-all duration-300">
                        {getProgramIcon(article)}
                      </div>
                      <span className="text-[10px] font-mono text-[#A1A1AA] uppercase tracking-wider font-semibold">
                        {article.badge || 'COLLEGE OF COMPUTER STUDIES'}
                      </span>
                    </div>
                  )}

                  {/* Top Floating Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono z-20">
                    <span className="px-2.5 py-1 rounded-full bg-black/90 backdrop-blur-md border border-[#FFD700]/40 text-[#FFD700] font-bold shadow-[0_0_12px_rgba(255,215,0,0.2)]">
                      {article.category || 'Academic Program Spotlight'}
                    </span>
                    <span className="text-slate-300 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/10 font-bold">
                      {article.programCode || article.date || 'CCS DEGREE'}
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 sm:p-7">
                  
                  {/* Program Title */}
                  <h3 
                    onClick={() => openArticle(article)}
                    className="text-xl sm:text-2xl font-['Space_Grotesk'] font-bold text-white mb-3 hover:text-[#FFD700] transition-colors cursor-pointer leading-snug"
                  >
                    {article.title}
                  </h3>
                  
                  {/* Specialization Callout */}
                  {article.specialization && (
                    <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] mb-4">
                      <span className="text-[10px] font-mono text-[#A1A1AA] uppercase tracking-wider">
                        SPECIALIZATION:
                      </span>
                      <span className="text-xs font-mono font-bold text-[#FFD700]">
                        {article.specialization}
                      </span>
                    </div>
                  )}

                  {/* Academic Focus Box */}
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] mb-4 space-y-1">
                    <div className="text-[10px] font-mono text-[#FF7A00] font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-[#FFD700]" aria-hidden="true" />
                      <span>ACADEMIC FOCUS</span>
                    </div>
                    <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed">
                      {article.focus || article.excerpt}
                    </p>
                  </div>

                  {/* Program Domain Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {(article.tags || []).slice(0, 4).map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-[10px] font-mono text-slate-300">
                        #{tag}
                      </span>
                    ))}
                  </div>

                </div>
              </div>

              {/* Bottom Actions */}
              <div className="px-6 sm:px-7 pb-6 pt-3 border-t border-white/[0.06] flex items-center">
                <button
                  onClick={() => openArticle(article)}
                  className="w-full min-h-[42px] px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#FFD700]/40 text-xs font-mono text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer group-hover:text-[#FFD700]"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#FFD700]" aria-hidden="true" />
                  <span>Program Details</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal: Full Degree Program Details */}
        {activeArticleModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="article-modal-title"
            onClick={(e) => {
              if (e.target === e.currentTarget) setActiveArticleModal(null);
            }}
          >
            <div className="glass-panel max-w-2xl w-full p-6 sm:p-8 rounded-3xl border border-white/15 max-h-[85vh] overflow-y-auto bg-[#0c0618]/95 shadow-2xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#6D28D9]/40 text-[#FFD700] border border-[#FFD700]/30 uppercase font-bold">
                      {activeArticleModal.category || 'Academic Program Spotlight'}
                    </span>
                    {activeArticleModal.programCode && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-white border border-white/10 font-bold">
                        {activeArticleModal.programCode}
                      </span>
                    )}
                  </div>
                  <h3 id="article-modal-title" className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white">
                    {activeArticleModal.title}
                  </h3>
                  <div className="text-xs font-mono text-[#A1A1AA] mt-1">
                    FEU Diliman • College of Computer Studies (CCS)
                  </div>
                </div>
                <button
                  onClick={() => setActiveArticleModal(null)}
                  aria-label="Close program details modal"
                  className="min-h-[40px] min-w-[40px] rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              {/* Specialization Callout in Modal */}
              {activeArticleModal.specialization && (
                <div className="p-3.5 rounded-2xl bg-[#1b0933]/60 border border-[#FFD700]/30 mb-5">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-0.5">
                    OFFICIAL SPECIALIZATION TRACK:
                  </div>
                  <div className="text-base font-mono font-bold text-[#FFD700]">
                    {activeArticleModal.specialization}
                  </div>
                </div>
              )}

              {/* Focus Summary */}
              {activeArticleModal.focus && (
                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 mb-5 space-y-1.5">
                  <div className="text-[11px] font-mono font-bold text-[#FF7A00] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" aria-hidden="true" />
                    <span>CURRICULUM FOCUS & COMPETENCIES</span>
                  </div>
                  <p className="text-slate-200 text-sm leading-relaxed font-light">
                    {activeArticleModal.focus}
                  </p>
                </div>
              )}

              {/* Comprehensive Description */}
              <div className="text-slate-300 text-sm leading-relaxed font-light mb-6 whitespace-pre-line font-sans">
                {activeArticleModal.content || activeArticleModal.excerpt}
              </div>

              {/* Tags */}
              {activeArticleModal.tags && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {activeArticleModal.tags.map((tag, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/10 text-xs font-mono text-slate-300">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end">
                <button
                  onClick={() => setActiveArticleModal(null)}
                  className="min-h-[44px] px-6 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
