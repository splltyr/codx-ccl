import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  ExternalLink,
  Search, 
  Tag,
  X,
  FileText
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

  const categories = ['ALL', 'Notice', 'Changelog', 'General', 'Testing'];

  const filteredArticles = articles.filter(art => {
    const matchesCategory = selectedCategory === 'ALL' || 
      art.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchQuery || 
      art.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const openArticle = (article) => {
    cyberAudio.playClick();
    setActiveArticleModal(article);
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
            <Calendar className="w-3.5 h-3.5 text-[#FFD700]" />
            <span className="font-bold">DISPATCHES & BULLETIN</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-['Space_Grotesk'] font-bold text-white mb-6">
            EVENTS & <span className="text-[#FFD700]">COMMUNITY UPDATES</span>
          </h2>
          <p className="text-[#A1A1AA] text-base sm:text-lg leading-relaxed font-light">
            Latest announcements, upcoming campus workshops, hackathons, and technical dispatches from CODX.
          </p>
        </motion.div>

        {/* Filter & Search Bar (Solid buttons, no multi-color gradients) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter events by category">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  cyberAudio.playClick();
                  setSelectedCategory(cat);
                }}
                aria-pressed={selectedCategory === cat}
                className={`min-h-[40px] px-4 py-2 rounded-full text-xs font-mono transition-all active:scale-[0.98] ${
                  selectedCategory === cat
                    ? 'bg-[#6D28D9] text-white font-bold shadow-[0_0_15px_rgba(109,40,217,0.4)] border border-white/20'
                    : 'bg-white/[0.03] text-[#A1A1AA] hover:text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search test articles and entries"
              placeholder="Search test articles & entries..."
              className="glass-input w-full pl-9 pr-3 py-2 rounded-xl text-xs font-mono placeholder-slate-500 min-h-[44px]"
            />
          </div>
        </div>

        {/* Dynamic Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredArticles.map((article, idx) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between group"
            >
              <div>
                {/* thumbnail or icon fallback */}
                <div className="relative h-44 overflow-hidden bg-[#050508] border-b border-white/[0.08] flex items-center justify-center">
                  {article.imageUrl ? (
                    <img 
                      src={article.imageUrl} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                      <FileText className="w-8 h-8 text-[#FFD700] mb-2 opacity-80" />
                      <span className="text-[10px] font-mono text-[#A1A1AA] uppercase tracking-wider">
                        {article.category || 'ARTICLE'}
                      </span>
                    </div>
                  )}

                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-black/90 backdrop-blur-md border border-[#FFD700]/40 text-[#FFD700] font-bold">
                      {article.category || 'EVENT'}
                    </span>
                    <span className="text-slate-300 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md">
                      {article.date}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 
                    onClick={() => openArticle(article)}
                    className="text-lg font-['Space_Grotesk'] font-bold text-white mb-2 line-clamp-2 hover:text-[#FFD700] transition-colors cursor-pointer"
                  >
                    {article.title}
                  </h3>
                  
                  <p className="text-[#A1A1AA] text-xs font-light leading-relaxed mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(article.tags || []).slice(0, 3).map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-[9px] font-mono text-slate-300">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="px-6 pb-6 pt-2 border-t border-white/[0.06] flex items-center justify-between gap-3">
                <button
                  onClick={() => openArticle(article)}
                  className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-white flex items-center gap-1.5 transition-all active:scale-[0.98]"
                >
                  <span>Read Article</span>
                </button>

                {article.linkUrl && (
                  <a
                    href={article.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[40px] px-3.5 py-1.5 rounded-xl btn-glass-gold text-xs font-mono flex items-center gap-1.5 transition-all active:scale-[0.98]"
                  >
                    <span>{article.linkLabel || 'Link'}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#FFD700]" aria-hidden="true" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal: Full Article View */}
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
            <div className="glass-panel max-w-xl w-full p-6 sm:p-8 rounded-3xl border border-white/15 max-h-[85vh] overflow-y-auto bg-[#0c0618]/95 shadow-2xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#6D28D9]/40 text-[#FFD700] border border-[#FFD700]/30 uppercase font-bold">
                    {activeArticleModal.category}
                  </span>
                  <h3 id="article-modal-title" className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white mt-2">
                    {activeArticleModal.title}
                  </h3>
                  <div className="text-xs font-mono text-[#A1A1AA] mt-1">
                    {activeArticleModal.author} • {activeArticleModal.date}
                  </div>
                </div>
                <button
                  onClick={() => setActiveArticleModal(null)}
                  aria-label="Close article"
                  className="min-h-[40px] min-w-[40px] rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              {activeArticleModal.imageUrl ? (
                <div className="rounded-2xl overflow-hidden mb-5 border border-white/10">
                  <img src={activeArticleModal.imageUrl} alt={activeArticleModal.title} className="w-full h-56 object-cover" />
                </div>
              ) : (
                <div className="h-28 rounded-2xl bg-[#050508] border border-white/[0.08] mb-5 flex items-center justify-center text-[#FFD700]">
                  <FileText className="w-8 h-8 opacity-70" />
                </div>
              )}

              <div className="text-slate-200 text-sm leading-relaxed font-light mb-6 whitespace-pre-line">
                {activeArticleModal.content || activeArticleModal.excerpt}
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                {activeArticleModal.linkUrl ? (
                  <a
                    href={activeArticleModal.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] px-5 py-2 rounded-xl btn-glass-gold font-mono text-xs flex items-center gap-1.5 transition-all"
                  >
                    <span>{activeArticleModal.linkLabel || 'OPEN EVENT / FACEBOOK LINK'}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#FFD700]" aria-hidden="true" />
                  </a>
                ) : <div />}

                <button
                  onClick={() => setActiveArticleModal(null)}
                  className="min-h-[44px] px-6 py-2 rounded-xl btn-primary-purple text-xs font-mono font-bold tracking-wider active:scale-[0.98] transition-all"
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
