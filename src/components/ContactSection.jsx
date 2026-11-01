import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  MapPin, 
  Terminal, 
  MessageSquare, 
  Mail, 
  ShieldCheck, 
  Copy,
  Check
} from 'lucide-react';
import { cyberAudio } from '../utils/audioSynth';
import { firebaseData } from '../services/firebaseService';

export default function ContactSection({ onOpenAdmin, onShowToast, onOpenDocs }) {
  const [tracks, setTracks] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    nickname: '',
    discord: '',
    year: 'Freshman (1st Year)',
    track: 'Systems & Cloud Infrastructure',
    interest: '',
    emailPermission: false
  });

  const [submittedPass, setSubmittedPass] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // get tracks from firebase
  useEffect(() => {
    const unsub = firebaseData.subscribeTracks((items) => {
      setTracks(items || []);
      if (items && items.length > 0 && !formData.track) {
        setFormData((prev) => ({ ...prev, track: items[0].name }));
      }
    });
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, [formData.track]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    cyberAudio.playClick();
    setIsSubmitting(true);

    const userNickname = formData.nickname.trim() || formData.discord.trim();

    try {
      // save application
      await firebaseData.submitApplication({
        fullName: formData.name,
        email: formData.email,
        nickname: userNickname,
        discord: userNickname,
        year: formData.year,
        track: formData.track,
        interest: formData.interest,
        emailPermission: formData.emailPermission,
        sentToEmail: 'codx@feudiliman.edu.ph',
        status: 'pending'
      });
    } catch (err) {
      console.warn('Firebase application submission error:', err);
    }

    const subject = encodeURIComponent(`[CODX Membership Application] - ${formData.name} (${formData.track})`);
    const emailBody = encodeURIComponent(
`Dear CODX Council,

I am submitting my student membership application to CODX FEU Diliman.

Applicant Information:
----------------------
Full Name: ${formData.name}
Nickname: ${userNickname}
Email: ${formData.email}
Year Level: ${formData.year}
Preferred Track: ${formData.track}

Statement of Interest / Goals:
${formData.interest || 'N/A'}

Access Pass ID: ${'CODX-' + Math.floor(100000 + Math.random() * 900000)}
Application Date: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}

I consent and grant permission for my application details to be processed by CODX.`
    );
    const mailtoUrl = `mailto:codx@feudiliman.edu.ph?subject=${subject}&body=${emailBody}`;

    const generatedPass = {
      id: 'CODX-' + Math.floor(100000 + Math.random() * 900000),
      name: formData.name,
      email: formData.email,
      track: formData.track,
      year: formData.year,
      nickname: userNickname,
      discord: userNickname,
      mailtoUrl: mailtoUrl,
      timestamp: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    };

    setSubmittedPass(generatedPass);
    setIsSubmitting(false);
    cyberAudio.playChime(880, 0.4);
    if (onShowToast) onShowToast('Membership application submitted & opening mail composer!');

    // Trigger user mail client with prefilled details to codx@feudiliman.edu.ph
    try {
      window.location.href = mailtoUrl;
    } catch (e) {
      console.warn('Mailto redirect suppressed:', e);
    }
  };

  const handleCopyPassId = () => {
    if (!submittedPass) return;
    cyberAudio.playClick();
    navigator.clipboard.writeText(submittedPass.id);
    setIsCopied(true);
    if (onShowToast) onShowToast('Access Pass ID copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <section id="contact" className="relative py-28 z-10 border-t border-white/[0.06]" aria-labelledby="contact-heading">
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
            <Terminal className="w-3.5 h-3.5 text-[#FFD700]" aria-hidden="true" />
            <span className="font-bold">STUDENT APPLICATION PORTAL</span>
          </div>
          <h2 id="contact-heading" className="text-3xl sm:text-5xl font-['Space_Grotesk'] font-bold text-white mb-6 text-balance">
            JOIN THE COLLECTIVE. <span className="text-[#FFD700]">STUDENT APPLICATION.</span>
          </h2>
          <p className="text-[#A1A1AA] text-base sm:text-lg leading-relaxed font-light text-balance">
            Apply to become a member of CODX at FEU Diliman. Collaborate on real-world engineering projects, workshops, and student tech tracks.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
          
          {/* Form or Digital Pass */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            {!submittedPass ? (
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-[#FFD700]/30 transition-all">
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/[0.06]">
                  <h3 className="font-['Space_Grotesk'] font-bold text-white text-base">
                    STUDENT MEMBERSHIP APPLICATION
                  </h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="member-fullname" className="text-slate-300 block mb-1 font-medium">
                        FULL NAME <span className="text-rose-400">*</span>
                      </label>
                      <input
                        id="member-fullname"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Juan dela Cruz"
                        className="glass-input w-full px-3 py-2 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label htmlFor="member-email" className="text-slate-300 block mb-1 font-medium">
                        EMAIL ADDRESS <span className="text-rose-400">*</span>
                      </label>
                      <input
                        id="member-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="juan.delacruz@feudiliman.edu.ph"
                        className="glass-input w-full px-3 py-2 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="member-nickname" className="text-slate-300 block mb-1 font-medium">
                        NICKNAME <span className="text-rose-400">*</span>
                      </label>
                      <input
                        id="member-nickname"
                        type="text"
                        required
                        value={formData.nickname || formData.discord}
                        onChange={(e) => setFormData({ ...formData, nickname: e.target.value, discord: e.target.value })}
                        placeholder="e.g. Juan / Johnny"
                        className="glass-input w-full px-3 py-2 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label htmlFor="member-year" className="text-slate-300 block mb-1 font-medium">
                        YEAR LEVEL
                      </label>
                      <select
                        id="member-year"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        className="glass-input w-full px-3 py-2 rounded-xl text-xs bg-[#120a22]"
                      >
                        <option value="Freshman (1st Year)">Freshman (1st Year)</option>
                        <option value="Sophomore (2nd Year)">Sophomore (2nd Year)</option>
                        <option value="Junior (3rd Year)">Junior (3rd Year)</option>
                        <option value="Senior (4th Year)">Senior (4th Year)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="member-track" className="text-slate-300 block mb-1 font-medium">
                      PREFERRED COMMITTEE / TRACK
                    </label>
                    <select
                      id="member-track"
                      value={formData.track}
                      onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                      className="glass-input w-full px-3 py-2 rounded-xl text-xs bg-[#120a22]"
                    >
                      {tracks.length > 0 ? (
                        tracks.map((t) => (
                          <option key={t.id} value={t.name}>{t.name}</option>
                        ))
                      ) : (
                        <>
                          <option value="Systems & Cloud Infrastructure">Systems & Cloud Infrastructure</option>
                          <option value="Intelligent Systems & Neural AI">Intelligent Systems & Neural AI</option>
                          <option value="Creative Tech & Sensory UI/UX">Creative Tech & Sensory UI/UX</option>
                          <option value="Cyber Defense & Security">Cyber Defense & Security</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="member-interest" className="text-slate-300 block mb-1 font-medium">
                      STATEMENT OF INTEREST / GOALS
                    </label>
                    <textarea
                      id="member-interest"
                      rows={3}
                      value={formData.interest}
                      onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                      placeholder="Tell us about your interests, technical projects, or what you hope to build with CODX..."
                      className="glass-input w-full px-3 py-2 rounded-xl text-xs"
                    />
                  </div>

                  {/* Permission to forward application to official CODX email */}
                  <div className="flex items-start gap-2.5 pt-1 text-[11px] text-slate-300">
                    <input
                      id="member-email-permission"
                      type="checkbox"
                      required
                      checked={formData.emailPermission}
                      onChange={(e) => setFormData({ ...formData, emailPermission: e.target.checked })}
                      className="mt-0.5 rounded border-white/20 bg-white/5 text-[#FFD700] focus:ring-[#8B5CF6] accent-[#FFD700] cursor-pointer"
                    />
                    <label htmlFor="member-email-permission" className="leading-snug cursor-pointer select-none">
                      I grant permission for my student application details to be forwarded to the official CODX email (<span className="text-[#FFD700]">codx@feudiliman.edu.ph</span>). <span className="text-rose-400">*</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                    className="w-full min-h-[46px] py-3 rounded-xl btn-primary-purple font-mono text-xs font-bold tracking-wider transition-all disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-white" aria-hidden="true" />
                    <span>{isSubmitting ? 'SUBMITTING APPLICATION...' : 'SUBMIT APPLICATION'}</span>
                  </button>
                </form>
              </div>
            ) : (
              /* Holographic Pass */
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#FFD700]/40 shadow-[0_0_35px_rgba(255,215,0,0.15)] relative">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" aria-hidden="true" />
                    <span className="font-['Space_Grotesk'] font-bold text-white text-sm">
                      CODX DIGITAL ACCESS PASS
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#FFD700] font-bold">
                    ACTIVE PASS
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-3 font-mono text-xs mb-4">
                  <div className="text-[10px] text-[#FF7A00] font-bold">PASS CODE:</div>
                  <div className="text-2xl font-bold text-[#FFD700] tracking-widest tabular-numbers">
                    {submittedPass.id}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                    <div>
                      <span className="text-slate-400 block font-light">APPLICANT:</span>
                      <span className="text-slate-100 font-bold">{submittedPass.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-light">NICKNAME:</span>
                      <span className="text-slate-100 font-bold">{submittedPass.nickname || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-light">TRACK:</span>
                      <span className="text-[#FFD700] font-bold truncate block">{submittedPass.track}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-light">EMAIL:</span>
                      <span className="text-slate-200 truncate block">{submittedPass.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-light">DATE ISSUED:</span>
                      <span className="text-slate-300 block">{submittedPass.timestamp}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-light">FORWARD DESTINATION:</span>
                      <span className="text-emerald-400 font-bold block truncate" title="codx@feudiliman.edu.ph">codx@feudiliman.edu.ph</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleCopyPassId}
                    className="flex-1 min-h-[44px] py-2.5 px-3 rounded-xl btn-glass-gold font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-[#FFD700]" aria-hidden="true" /> : <Copy className="w-4 h-4 text-[#FFD700]" aria-hidden="true" />}
                    <span>{isCopied ? 'COPIED TO CLIPBOARD' : 'COPY PASS ID'}</span>
                  </button>
                  {submittedPass.mailtoUrl && (
                    <a
                      href={submittedPass.mailtoUrl}
                      className="min-h-[44px] px-3.5 rounded-xl bg-[#6D28D9]/25 hover:bg-[#6D28D9]/40 border border-[#8B5CF6]/40 text-purple-200 hover:text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
                      title="Open application draft in your email client to codx@feudiliman.edu.ph"
                    >
                      <Mail className="w-4 h-4 text-[#FFD700]" aria-hidden="true" />
                      <span>OPEN EMAIL CLIENT</span>
                    </a>
                  )}
                  <button
                    onClick={() => setSubmittedPass(null)}
                    className="min-h-[44px] px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-slate-300 hover:text-white active:scale-[0.98] cursor-pointer"
                  >
                    NEW APPLICATION
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Right Column: Satellites */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-4 font-mono text-xs"
          >
            <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
              <span className="font-['Space_Grotesk'] font-bold text-white text-sm block">
                CAMPUS & CONTACT INFO
              </span>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
                <div>
                  <div className="text-white font-bold text-xs">FEU Diliman Campus</div>
                  <div className="text-[11px] text-slate-400">Don Fabian St, Commonwealth, Quezon City</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-purple-400 shrink-0" aria-hidden="true" />
                <div>
                  <div className="text-white font-bold text-xs">CODX Student Discord</div>
                  <div className="text-[11px] text-slate-400">Connect with fellow student developers & officers</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-3">
                <Mail className="w-4 h-4 text-rose-400 shrink-0" aria-hidden="true" />
                <div>
                  <div className="text-white font-bold text-xs">Official Email</div>
                  <div className="text-[11px] text-slate-400">codx@feudiliman.edu.ph</div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

      </div>

      {/* Minimalist Footer */}
      <footer className="mt-24 pt-8 border-t border-white/[0.04] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 flex items-center justify-center shrink-0">
              <img 
                src="/images/CODX.png" 
                alt="CODX Official Emblem" 
                className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(109,40,217,0.35)]"
              />
            </div>
            <span>CODX // THE 2ND GENERATION OF APD — FEU DILIMAN</span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 text-[11px]">
            <button 
              type="button"
              onClick={() => {
                cyberAudio.playClick();
                if (onOpenDocs) onOpenDocs();
              }}
              className="text-slate-400 hover:text-[#FF7A00] transition-colors inline-flex items-center gap-1 cursor-pointer"
              title="Open Technical Architecture Documentation"
            >
              <span>[VIEW DOCS]</span>
            </button>
            <span>v2.0 PRODUCTION</span>
            {/* hidden admin button (Ctrl+Shift+A) */}
            <button
              onClick={() => {
                cyberAudio.playClick();
                onOpenAdmin();
              }}
              title="Discreet Council Admin Portal (Ctrl+Shift+A)"
              aria-label="Discreet Council Admin Portal"
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-slate-400 hover:text-[#FFD700] transition-colors p-1"
            >
              [Ω-PORTAL]
            </button>
          </div>
        </div>
      </footer>
    </section>
  );
}
