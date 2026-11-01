import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { Bot, Zap, Minus, X, ChevronUp } from 'lucide-react';
import { cyberAudio } from '../utils/audioSynth';

const DEXTRON_QUIPS = [
  "Welcome to CODX // FEU Diliman's student technology collective! 🚀",
  "FEU Diliman CCS degree programs: BSCS (Software Eng) & BSIT (Cybersecurity, Game Dev, Web/Mobile)! ⚡",
  "Try out our custom PFP Generator to forge your official community avatar! 📸",
  "Tip: Press Ctrl+Shift+A anywhere on the page for Council Admin access. 🤫",
  "Tamaraw engineering at its finest! Pure Web Audio & React 19. ✨",
  "Building open-source projects for the campus and beyond. 💻",
  "Click 'codx bash' in the bottom-left to launch the interactive Linux CLI! 💻",
  "Submit your application in the membership form below to join our next cohort! 📝",
  "Dextron mascot online and monitoring campus telemetry! 🌿"
];

// notes for click sounds
const CHIME_FREQUENCIES = [523.25, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51];

export default function SkeletalMascot() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentQuipIndex, setCurrentQuipIndex] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [isWaving, setIsWaving] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const [showSpeech, setShowSpeech] = useState(true);
  const containerRef = useRef(null);
  const waveTimeoutRef = useRef(null);
  const bounceTimeoutRef = useRef(null);

  // Auto-collapse on small mobile screens to prevent screen clutter
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsCollapsed(true);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (waveTimeoutRef.current) clearTimeout(waveTimeoutRef.current);
      if (bounceTimeoutRef.current) clearTimeout(bounceTimeoutRef.current);
    };
  }, []);

  // mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // spring physics for mascot movement
  const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // head tilt
  const headRotate = useTransform(smoothX, [-300, 300], [-8, 8]);
  const headTranslateX = useTransform(smoothX, [-300, 300], [-8, 8]);
  const headTranslateY = useTransform(smoothY, [-300, 300], [-5, 5]);

  // body tilt
  const bodyRotate = useTransform(smoothX, [-300, 300], [-3, 3]);
  const bodyTranslateX = useTransform(smoothX, [-300, 300], [-3, 3]);

  // arm sways
  const rightArmRotate = useTransform(smoothX, [-300, 300], [-15, 12]);

  // Mouse move listener across window to drive organic skeletal reaction
  useEffect(() => {
    if (isCollapsed) return;

    const handleGlobalMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const dx = Math.max(-300, Math.min(300, e.clientX - centerX));
      const dy = Math.max(-300, Math.min(300, e.clientY - centerY));

      mouseX.set(dx);
      mouseY.set(dy);
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, [isCollapsed, mouseX, mouseY]);

  const handleMascotClick = (e) => {
    if (e) e.stopPropagation();
    
    // Clear any pending timeout so rapid clicks never freeze
    if (waveTimeoutRef.current) clearTimeout(waveTimeoutRef.current);
    if (bounceTimeoutRef.current) clearTimeout(bounceTimeoutRef.current);

    const nextCount = clickCount + 1;
    setClickCount(nextCount);
    setShowSpeech(true);

    // Play chime on pentatonic scale based on click count
    const chimeFreq = CHIME_FREQUENCIES[nextCount % CHIME_FREQUENCIES.length];
    cyberAudio.playClick();
    cyberAudio.playChime(chimeFreq, 0.22);

    setCurrentQuipIndex((prev) => (prev + 1) % DEXTRON_QUIPS.length);

    // Trigger reactive bounce and waving
    setIsBouncing(true);
    setIsWaving(true);

    bounceTimeoutRef.current = setTimeout(() => setIsBouncing(false), 450);
    waveTimeoutRef.current = setTimeout(() => setIsWaving(false), 900);
  };

  const handleToggleCollapse = (e) => {
    if (e) e.stopPropagation();
    cyberAudio.playClick();
    setIsCollapsed(prev => !prev);
  };

  const activeMessage = DEXTRON_QUIPS[currentQuipIndex];

  return (
    <div 
      ref={containerRef} 
      className="relative flex flex-col items-end select-none pointer-events-auto"
      style={{ filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.8))' }}
    >
      <AnimatePresence mode="wait">
        {isCollapsed ? (
          /* Slim Floating Button when collapsed */
          <motion.button
            key="collapsed-pill"
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            onClick={handleToggleCollapse}
            aria-label="Expand Dextron AI Companion"
            className="group flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0e071c]/90 border border-[#FFD700]/30 hover:border-[#FFD700] shadow-[0_4px_25px_rgba(0,0,0,0.65)] backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 text-xs font-mono cursor-pointer"
            title="Expand Dextron AI Companion"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
            <Bot className="w-3.5 h-3.5 text-[#FFD700]" aria-hidden="true" />
            <span className="text-slate-200 group-hover:text-white font-medium">dextron</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-[#FFD700] border border-purple-500/30 font-bold">
              AI
            </span>
            <ChevronUp className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FFD700] transition-colors ml-0.5" aria-hidden="true" />
          </motion.button>
        ) : (
          /* Expanded Interactive Mascot & Speech */
          <motion.div
            key="expanded-mascot"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="flex flex-col items-end"
          >
            {/* Floating Speech Bubble anchored above Dextron */}
            {showSpeech && (
              <motion.div
                key={`bubble-${currentQuipIndex}-${clickCount}`}
                initial={{ opacity: 0, y: 10, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="w-64 sm:w-72 p-3 rounded-2xl bg-[#0e071c]/95 border border-[#FFD700]/40 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] text-left mb-2 transition-all group relative z-20 max-w-[calc(100vw-2.5rem)]"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#FFD700]">
                    <Bot className="w-3.5 h-3.5 text-[#FFD700]" aria-hidden="true" />
                    <span>DEXTRON // COMPANION</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      ACTIVE
                    </span>
                    {/* Minimize toggle button */}
                    <button
                      onClick={handleToggleCollapse}
                      title="Collapse Dextron to floating button"
                      aria-label="Collapse Dextron to floating button"
                      className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    {/* Dismiss speech */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSpeech(false);
                      }}
                      title="Close message"
                      aria-label="Close message"
                      className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div 
                  onClick={handleMascotClick}
                  className="cursor-pointer"
                >
                  <p className="text-xs font-mono text-slate-200 leading-snug">
                    "{activeMessage}"
                  </p>
                  <div className="text-[9px] font-mono text-[#FFD700]/80 mt-1 flex items-center justify-between group-hover:text-[#FFD700] transition-colors">
                    <span>Click to chat ({clickCount > 0 ? `#${clickCount}` : 'tap'})</span>
                    <span className="text-[#FFD700]">›</span>
                  </div>
                </div>

                {/* Arrow pointing down to mascot */}
                <div className="absolute -bottom-1.5 right-10 w-3 h-3 bg-[#0e071c] border-r border-b border-[#FFD700]/40 rotate-45" />
              </motion.div>
            )}

            {/* Mascot Rig Container with Quick Collapse Tooltip */}
            <div className="relative group/mascot flex items-end">
              {/* Mascot Floating Minimize Button on Hover */}
              <button
                onClick={handleToggleCollapse}
                title="Collapse Dextron"
                aria-label="Collapse Dextron"
                className="absolute -top-2 left-0 z-30 px-2 py-0.5 rounded-full bg-[#0a0414]/90 border border-white/20 text-[10px] font-mono text-slate-300 hover:text-[#FFD700] hover:border-[#FFD700]/50 shadow-md backdrop-blur-md opacity-70 group-hover/mascot:opacity-100 transition-opacity flex items-center gap-1 cursor-pointer"
              >
                <Minus className="w-2.5 h-2.5" />
                <span>hide</span>
              </button>

              <motion.div 
                onClick={handleMascotClick}
                animate={isBouncing ? {
                  scale: [1, 1.1, 0.94, 1.03, 1],
                  y: [0, -16, 3, -4, 0]
                } : {
                  scale: 1,
                  y: 0
                }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-28 h-36 sm:w-36 sm:h-44 cursor-pointer flex items-center justify-center"
                title="Click Dextron to chat!"
              >
                {/* Layer 1: Base Torso & Body with gentle breathing physics */}
                <motion.div
                  style={{
                    rotate: bodyRotate,
                    x: bodyTranslateX
                  }}
                  animate={{
                    y: [0, -6, 0]
                  }}
                  transition={{
                    duration: 4.0,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <img 
                    src="/assets/mascot-default.png?v=cutout2" 
                    alt="CODX Dextron Mascot"
                    className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(109,40,217,0.4)] select-none"
                    draggable="false"
                  />
                </motion.div>

                {/* Layer 2: Head Layer with reactive cursor leaning */}
                <motion.div
                  style={{
                    rotate: headRotate,
                    x: headTranslateX,
                    y: headTranslateY
                  }}
                  animate={{
                    y: [0, -8, 0]
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="absolute top-0 inset-x-0 h-[52%] flex items-start justify-center pointer-events-none"
                />

                {/* Layer 3: Arm Joint Waving */}
                <motion.div
                  style={{
                    rotate: isWaving ? 20 : rightArmRotate,
                    transformOrigin: '65% 45%'
                  }}
                  animate={{
                    rotate: isWaving ? [20, -20, 20, -20, 0] : [3, -3, 3]
                  }}
                  transition={{
                    duration: isWaving ? 0.8 : 4.0,
                    repeat: isWaving ? 0 : Infinity,
                    ease: 'easeInOut'
                  }}
                  className="absolute inset-0 pointer-events-none"
                />

                {/* Small floating energy spark */}
                <motion.div
                  animate={{
                    y: [0, -8, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                  className="absolute -top-1 right-2 w-5 h-5 rounded-full bg-purple-900/60 border border-[#FFD700]/70 flex items-center justify-center shadow-[0_0_10px_rgba(255,215,0,0.4)] pointer-events-none"
                >
                  <Zap className="w-2.5 h-2.5 text-[#FFD700]" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
