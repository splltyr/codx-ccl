import React, { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { Bot, Zap } from 'lucide-react';
import { cyberAudio } from '../utils/audioSynth';

const DEXTRON_QUIPS = [
  "Welcome to CODX // FEU Diliman's student technology collective! 🚀",
  "Four departments active: Systems, AI, Creative UI/UX, and Cyber Defense. ⚡",
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
  const [currentQuipIndex, setCurrentQuipIndex] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [isWaving, setIsWaving] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const [showSpeech, setShowSpeech] = useState(true);
  const containerRef = useRef(null);
  const waveTimeoutRef = useRef(null);
  const bounceTimeoutRef = useRef(null);

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
  const leftArmRotate = useTransform(smoothX, [-300, 300], [-10, 15]);
  const rightArmRotate = useTransform(smoothX, [-300, 300], [-15, 12]);

  // Mouse move listener across window to drive organic skeletal reaction
  useEffect(() => {
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
  }, [mouseX, mouseY]);

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

  const activeMessage = DEXTRON_QUIPS[currentQuipIndex];

  return (
    <div 
      ref={containerRef} 
      className="relative flex flex-col items-end select-none"
      style={{ filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.8))' }}
    >
      {/* Floating Speech Bubble anchored above Dextron */}
      {showSpeech && (
        <motion.div
          key={`bubble-${currentQuipIndex}-${clickCount}`}
          initial={{ opacity: 0, y: 10, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          onClick={handleMascotClick}
          className="cursor-pointer w-64 sm:w-72 p-3 rounded-2xl bg-[#0e071c]/95 border border-[#FFD700]/40 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] text-left mb-2 transition-all group relative z-20"
        >
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#FFD700]">
              <Bot className="w-3.5 h-3.5 text-[#FFD700]" />
              <span>DEXTRON // COMPANION</span>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              ACTIVE
            </span>
          </div>
          <p className="text-xs font-mono text-slate-200 leading-snug">
            "{activeMessage}"
          </p>
          <div className="text-[9px] font-mono text-[#FFD700]/80 mt-1 flex items-center justify-between group-hover:text-[#FFD700] transition-colors">
            <span>Click to chat ({clickCount > 0 ? `#${clickCount}` : 'tap'})</span>
            <span className="text-[#FFD700]">›</span>
          </div>
          {/* Arrow pointing down to mascot */}
          <div className="absolute -bottom-1.5 right-10 w-3 h-3 bg-[#0e071c] border-r border-b border-[#FFD700]/40 rotate-45" />
        </motion.div>
      )}

      {/* Cutout Skeletal Rig Container (Compact Fixed Size) */}
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
  );
}
