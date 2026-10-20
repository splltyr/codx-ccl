import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Terminal, 
  Layers, 
  Cpu, 
  Radio, 
  Database, 
  ExternalLink,
  Code2,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { cyberAudio } from '../utils/audioSynth';

export default function DocsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'frontend' | 'canvas' | 'audio' | 'backend'

  // esc closes modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="docs-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel w-full max-w-5xl h-[88vh] max-h-[820px] rounded-3xl border border-white/15 bg-[#090412]/95 shadow-2xl flex flex-col overflow-hidden text-slate-200"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#6D28D9]/20 border border-[#8B5CF6]/40 flex items-center justify-center text-[#FFD700]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="docs-modal-title" className="font-['Space_Grotesk'] font-bold text-base sm:text-lg text-white">
                  ENGINEERING SPECIFICATION & ARCHITECTURE
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] font-bold">
                  v2.0 PRODUCTION
                </span>
              </div>
              <p className="text-[11px] font-mono text-[#A1A1AA]">
                CODX // The 2nd Generation of APD — FEU Diliman
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/codx-blueprint.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-mono px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
              title="Open full page print-ready document"
            >
              <span>STANDALONE / PRINT</span>
              <ExternalLink className="w-3 h-3 text-[#FFD700]" />
            </a>
            <button
              onClick={() => {
                cyberAudio.playClick();
                onClose();
              }}
              aria-label="Close Documentation"
              className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-white/[0.06] bg-black/40 overflow-x-auto text-xs font-mono">
          {[
            { id: 'overview', label: '1. Executive Summary', icon: Terminal },
            { id: 'frontend', label: '2. Frontend & Styling', icon: Layers },
            { id: 'canvas', label: '3. Canvas 2D Systems', icon: Code2 },
            { id: 'audio', label: '4. Procedural Web Audio', icon: Radio },
            { id: 'backend', label: '5. Cloud & Firestore', icon: Database }
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  cyberAudio.playClick();
                  setActiveTab(tab.id);
                }}
                className={`px-3 py-2 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                  isCurrent 
                    ? 'bg-[#120726] border border-[#FFD700] text-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.15)] font-bold'
                    : 'bg-white/[0.02] border border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-sm leading-relaxed font-sans">
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div>
                <h3 className="text-xl font-['Space_Grotesk'] font-bold text-white mb-2">
                  Building the Digital Identity for FEU Diliman's Elite Student Collective
                </h3>
                <p className="text-slate-300 font-light leading-relaxed">
                  When we set out to build the official web application for CODX (the 2nd Generation of APD at FEU Diliman), our primary goal was to construct a digital home that matched the technical caliber of our students. We wanted zero template feel, zero dependency on external audio or asset bloat, and an unmistakable cybernetic aesthetic that reflects our student engineering departments: Systems & Cloud Infrastructure, Intelligent Systems & Neural AI, Creative Tech & Sensory UI/UX, and Cyber Defense.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
                  <div className="text-[11px] font-mono text-[#FFD700] font-bold">CORE RUNTIME</div>
                  <div className="text-white font-semibold">React 19 + Vite 8</div>
                  <p className="text-xs text-slate-400">Zero legacy polyfills, instant ESM cold starts, sub-100ms HMR.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
                  <div className="text-[11px] font-mono text-[#FFD700] font-bold">GRAPHICS & VISUALS</div>
                  <div className="text-white font-semibold">HTML5 Canvas 2D</div>
                  <p className="text-xs text-slate-400">Interactive starfield constellations and 1024×1024 PFP compositor.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
                  <div className="text-[11px] font-mono text-[#FFD700] font-bold">SOUND ARCHITECTURE</div>
                  <div className="text-white font-semibold">Native Web Audio API</div>
                  <p className="text-xs text-slate-400">100% procedural synthesis: lofi chord loops, clicks, and robot voice.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
                  <div className="text-[11px] font-mono text-[#FFD700] font-bold">CLOUD PERSISTENCE</div>
                  <div className="text-white font-semibold">Firebase Firestore</div>
                  <p className="text-xs text-slate-400">Real-time collections, admin portal, and applicant processing.</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#0e071c] border border-white/10 space-y-2 font-mono text-xs text-slate-300">
                <div className="text-[#FFD700] font-bold">» ARCHITECTURAL CORE PRINCIPLES:</div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Zero Fake Assets:</strong> No generic mockups or generated human photos. Real student officer bios, real campus events, and authentic FEU Diliman student history.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Deterministic Offline Capability:</strong> Robust reactive local storage fallbacks ensure the application functions offline or in disconnected lab environments.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Accessible Cyber Aesthetic:</strong> Solid obsidian backdrops (`#0a0414`), Tamaraw gold highlights (`#FFD700`), and royal purple glass exceeding WCAG AA contrast standards.</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'frontend' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div>
                <h3 className="text-xl font-['Space_Grotesk'] font-bold text-white mb-2">
                  Frontend Engineering & Custom Glassmorphism System
                </h3>
                <p className="text-slate-300 font-light leading-relaxed">
                  We engineered the frontend on top of <strong>React 19</strong>, bundled via <strong>Vite</strong> with <strong>Tailwind CSS v4</strong>. Instead of using generic UI component libraries, we crafted our own bespoke glassmorphic design system tailored specifically to the FEU Tamaraw IT identity.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <h4 className="font-['Space_Grotesk'] font-bold text-white text-base flex items-center gap-2">
                    <span className="text-[#FFD700]">01.</span> Layered Glassmorphism & Color Tokens
                  </h4>
                  <p className="text-slate-300 font-light text-xs sm:text-sm">
                    All surfaces use multi-tier backdrop blurs (`backdrop-filter: blur(24px)`) over translucent dark purple tints (`rgba(255, 255, 255, 0.025)`). Borders use razor-thin hairline boundaries (`rgba(255, 255, 255, 0.08)`) accented by solid FEU Gold (`#FFD700`) and Deep Violet (`#6D28D9`). This eliminates unwanted rainbow gradients, preserving a mature, high-tech terminal look.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <h4 className="font-['Space_Grotesk'] font-bold text-white text-base flex items-center gap-2">
                    <span className="text-[#FFD700]">02.</span> Motion Orchestration & Scroll-Driven Spring Physics
                  </h4>
                  <p className="text-slate-300 font-light text-xs sm:text-sm">
                    Using <strong>Framer Motion</strong> springs (`damping: 26, stiffness: 90, mass: 0.55`), the opening sequence seamlessly translates user scroll velocity into rocket camera ascent, transitioning through Earth orbit, celestial waypoints, and the Dextron mascot reveal with zero frame drops.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <h4 className="font-['Space_Grotesk'] font-bold text-white text-base flex items-center gap-2">
                    <span className="text-[#FFD700]">03.</span> Interactive "codx bash" Terminal CLI
                  </h4>
                  <p className="text-slate-300 font-light text-xs sm:text-sm">
                    We built a simulated Linux terminal emulator (`codx@feu-diliman:~`) that responds to real shell commands like <code className="text-[#FFD700] bg-black/50 px-1 py-0.5 rounded">help</code>, <code className="text-[#FFD700] bg-black/50 px-1 py-0.5 rounded">tracks</code>, <code className="text-[#FFD700] bg-black/50 px-1 py-0.5 rounded">pfp</code>, <code className="text-[#FFD700] bg-black/50 px-1 py-0.5 rounded">council</code>, and <code className="text-[#FFD700] bg-black/50 px-1 py-0.5 rounded">matrix</code>, complete with command history navigation and audio typewriter sound effects.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'canvas' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div>
                <h3 className="text-xl font-['Space_Grotesk'] font-bold text-white mb-2">
                  HTML5 Canvas 2D: Real-Time Rendering & Image Compositing
                </h3>
                <p className="text-slate-300 font-light leading-relaxed">
                  Rather than burdening the browser with heavy DOM elements or WebGL overhead, we wrote two dedicated 2D Canvas engines from scratch: the ambient warp constellation starfield and the real-time 1024×1024 PFP avatar generator.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <h4 className="font-['Space_Grotesk'] font-bold text-white text-base text-[#FFD700]">
                    A. Warp-Speed Constellation Starfield (`CyberBackground.jsx`)
                  </h4>
                  <ul className="text-xs sm:text-sm text-slate-300 space-y-2 list-disc list-inside font-light">
                    <li><strong>Proximity Mesh:</strong> Dynamically calculates distance vectors between stars within a 130px threshold to render delicate glowing constellation lines.</li>
                    <li><strong>Scroll Velocity Warp:</strong> Hooked into <code className="text-[#FFD700]">window.scrollY</code> and mouse wheel deltas. When user scrolls, vertical velocity spikes into warp streaks (<code className="text-[#FFD700]">ctx.moveTo(x, y - length); ctx.lineTo(x, y)</code>) that smoothly decay with exponential deceleration.</li>
                    <li><strong>Cursor Interaction:</strong> Detects pointer coordinates and draws direct magnetic energy beams from nearby stars to the cursor, triggering procedural micro-hum audio.</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <h4 className="font-['Space_Grotesk'] font-bold text-white text-base text-[#FFD700]">
                    B. 1024×1024 PFP Frame Generator (`PfpGenerator.jsx`)
                  </h4>
                  <ul className="text-xs sm:text-sm text-slate-300 space-y-2 list-disc list-inside font-light">
                    <li><strong>Interactive Pan & Zoom:</strong> Full pointer capture (`setPointerCapture`) allows mouse drag and mobile touch dragging with 1:1 screen-to-buffer coordinate scaling.</li>
                    <li><strong>Scroll-to-Zoom:</strong> Dedicated non-passive wheel handler intercepts scroll gestures over the canvas to smoothly scale avatar size between 0.5× and 3.0× without scrolling the document.</li>
                    <li><strong>Exact High-Res Export:</strong> The off-screen export canvas maps preview offsets directly to 1024×1024 pixels (<code className="text-[#FFD700]">exportScale = 1024 / 600</code>) underneath the transparent PNG frame overlay, guaranteeing pixel-perfect alignment.</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'audio' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div>
                <h3 className="text-xl font-['Space_Grotesk'] font-bold text-white mb-2">
                  Procedural Audio: Zero Audio Files, 100% Web Audio API Synthesis
                </h3>
                <p className="text-slate-300 font-light leading-relaxed">
                  Many modern websites rely on multi-megabyte MP3 files that slow down initial page loads and require external asset hosting. In CODX, <strong>every single sound is synthesized mathematically in real-time</strong> using the native browser <code>AudioContext</code>.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                  <div className="text-[11px] font-mono text-[#FFD700] font-bold">LOFI CHORD PROGRESSION</div>
                  <h4 className="text-white font-semibold text-sm">C#m7 – Amaj7 – F#m7 – G#7</h4>
                  <p className="text-xs text-slate-400 font-light">
                    Dual warm triangle oscillators routed through a resonant Biquad lowpass filter (620Hz, Q: 1.8) and gentle gain envelopes to produce a continuous, soothing cybernetic lounge loop.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                  <div className="text-[11px] font-mono text-[#FFD700] font-bold">TACTILE HAPTIC CLICKS</div>
                  <h4 className="text-white font-semibold text-sm">Micro-Envelope Transients</h4>
                  <p className="text-xs text-slate-400 font-light">
                    Instantaneous 18ms exponential frequency drops (880Hz down to 220Hz) producing subtle mechanical switch feedback on button interactions and frame selections.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                  <div className="text-[11px] font-mono text-[#FFD700] font-bold">DEXTRON ROBOT VOICE</div>
                  <h4 className="text-white font-semibold text-sm">Formant Frequency Chirps</h4>
                  <p className="text-xs text-slate-400 font-light">
                    High-pitch frequency-modulated square wave bursts with rapid vibrato mimicking retro robotic vocal synthesis when Dextron arrives during the intro sequence.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'backend' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div>
                <h3 className="text-xl font-['Space_Grotesk'] font-bold text-white mb-2">
                  Cloud Backend & Real-Time Firestore Architecture
                </h3>
                <p className="text-slate-300 font-light leading-relaxed">
                  The application connects directly to <strong>Google Firebase Firestore</strong> and <strong>Firebase Auth</strong> via <code className="text-[#FFD700]">src/services/firebaseService.js</code>, with full real-time snapshot listeners and offline synchronization.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <h4 className="font-['Space_Grotesk'] font-bold text-white text-base text-[#FFD700]">
                    Collections & Data Model
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                      <div className="text-[#FFD700] font-bold mb-1">» /articles</div>
                      <p className="text-slate-400 font-sans">Dynamic event announcements, HackDiliman 2026 bulletins, and campus workshops.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                      <div className="text-[#FFD700] font-bold mb-1">» /frames</div>
                      <p className="text-slate-400 font-sans">Official PNG frame overlays uploaded directly by administrators for the PFP generator.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                      <div className="text-[#FFD700] font-bold mb-1">» /tracks</div>
                      <p className="text-slate-400 font-sans">Dynamic student committees & technical tracks populating public application dropdowns.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                      <div className="text-[#FFD700] font-bold mb-1">» /applications</div>
                      <p className="text-slate-400 font-sans">Real-time student membership submissions with approval, archiving, and review workflows.</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <h4 className="font-['Space_Grotesk'] font-bold text-white text-base text-[#FFD700]">
                    Discreet Council Admin Portal (`[Ω-PORTAL]`)
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 font-light">
                    Protected by council authentication credentials and accessible via the global keyboard shortcut <code className="text-[#FFD700] bg-black/50 px-1 py-0.5 rounded">Ctrl + Shift + A</code>. Provides complete CRUD control over dispatches, leadership council members, custom PNG frame assets, committee tracks, and submitted student applications.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-white/[0.02] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#A1A1AA]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ARCHITECTURE SPECS // WRITTEN BY CODX ENGINEERING COUNCIL</span>
          </div>
          <button
            onClick={() => {
              cyberAudio.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl btn-primary-purple text-xs font-mono font-bold tracking-wider active:scale-[0.98] transition-all cursor-pointer"
          >
            RETURN TO SITE
          </button>
        </div>
      </motion.div>
    </div>
  );
}
