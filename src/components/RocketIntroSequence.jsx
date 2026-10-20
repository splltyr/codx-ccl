import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cyberAudio } from '../utils/audioSynth';

export default function RocketIntroSequence({ onComplete }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const isCompletedRef = useRef(false);
  const boostPlayedRef = useRef(false);
  const dextronVoicePlayedRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  const [hasScrolled, setHasScrolled] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isActivelyScrolling, setIsActivelyScrolling] = useState(false);

  // scroll progress between 0 and 1
  const targetProgress = useMotionValue(0);

  // spring smoothing for camera scroll
  const smoothProgress = useSpring(targetProgress, {
    damping: 26,
    stiffness: 90,
    mass: 0.55
  });

  const registerScrollActivity = useCallback(() => {
    setIsActivelyScrolling(true);
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsActivelyScrolling(false);
    }, 320);
  }, []);

  // track progress for audio cues, rocket boost, and completion
  useEffect(() => {
    const unsub = smoothProgress.on('change', (latest) => {
      const clamped = Math.max(0, Math.min(1, latest));
      setDisplayProgress(Math.round(clamped * 100));

      if (clamped > 0.03 && !hasScrolled) {
        setHasScrolled(true);
      }

      // unlock web audio on first scroll gesture
      cyberAudio.unlockAudio();

      // chord swells per milestone
      if (clamped > 0.04 && clamped < 0.35) {
        cyberAudio.playIntroChordSwell(0);
      } else if (clamped >= 0.35 && clamped < 0.65) {
        cyberAudio.playIntroChordSwell(1);
      } else if (clamped >= 0.65 && clamped < 0.88) {
        cyberAudio.playIntroChordSwell(2);
      }

      // rocket engine whoosh
      if (clamped > 0.05 && !boostPlayedRef.current) {
        boostPlayedRef.current = true;
        cyberAudio.playRocketBoost(1.8);
      } else if (clamped < 0.02) {
        boostPlayedRef.current = false;
      }

      // dextron robot chirp when he appears
      if (clamped >= 0.70 && !dextronVoicePlayedRef.current) {
        dextronVoicePlayedRef.current = true;
        cyberAudio.playDextronRobotVoice();
      } else if (clamped < 0.58) {
        dextronVoicePlayedRef.current = false;
      }

      // trigger site entry once scrolled to the end
      if (clamped >= 0.97 && !isCompletedRef.current) {
        isCompletedRef.current = true;
        if (onComplete) {
          setTimeout(() => {
            onComplete();
          }, 350);
        }
      }
    });

    return () => unsub();
  }, [smoothProgress, hasScrolled, onComplete]);

  // Lock body scroll while cinematic intro is active
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // 3. Pure Scroll Physics: Wheel, Touch, and Keyboard listeners (Zero buttons)
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    cyberAudio.unlockAudio();
    registerScrollActivity();
    const delta = e.deltaY;
    const current = targetProgress.get();
    const next = Math.max(0, Math.min(1, current + delta / 1150));
    targetProgress.set(next);
  }, [targetProgress, registerScrollActivity]);

  useEffect(() => {
    // Unlock AudioContext on very first user gesture during intro
    const handleInitialUnlock = () => {
      cyberAudio.unlockAudio();
    };
    window.addEventListener('wheel', handleInitialUnlock, { passive: true, once: true });
    window.addEventListener('touchstart', handleInitialUnlock, { passive: true, once: true });
    window.addEventListener('pointerdown', handleInitialUnlock, { passive: true, once: true });
    window.addEventListener('click', handleInitialUnlock, { once: true });
    window.addEventListener('keydown', handleInitialUnlock, { once: true });

    let touchStartY = 0;
    const handleTouchStart = (e) => {
      cyberAudio.unlockAudio();
      if (e.touches && e.touches[0]) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        cyberAudio.unlockAudio();
        registerScrollActivity();
        const currentY = e.touches[0].clientY;
        const deltaY = touchStartY - currentY;
        touchStartY = currentY;
        const current = targetProgress.get();
        const next = Math.max(0, Math.min(1, current + deltaY / 420));
        targetProgress.set(next);
      }
    };

    const handleKeyDown = (e) => {
      cyberAudio.unlockAudio();
      const current = targetProgress.get();
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        registerScrollActivity();
        targetProgress.set(Math.min(1, current + 0.12));
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        registerScrollActivity();
        targetProgress.set(Math.max(0, current - 0.12));
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleInitialUnlock);
      window.removeEventListener('touchstart', handleInitialUnlock);
      window.removeEventListener('pointerdown', handleInitialUnlock);
      window.removeEventListener('click', handleInitialUnlock);
      window.removeEventListener('keydown', handleInitialUnlock);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleWheel, targetProgress, registerScrollActivity]);

  // 4. Background Canvas: Starfield responding at smooth, moderate pace (not blinding warp-speed)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 2.2 + 0.6,
      radius: Math.random() * 1.4 + 0.4,
      alpha: Math.random() * 0.6 + 0.35,
      isGold: Math.random() > 0.65
    }));

    let lastProgress = targetProgress.get();
    let driftVelocity = 0;

    const handleWheelVelocity = (e) => {
      // Smooth, moderate acceleration
      driftVelocity += Math.min(Math.abs(e.deltaY) * 0.02, 2.5);
    };
    window.addEventListener('wheel', handleWheelVelocity, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const currentP = targetProgress.get();
      const progressDelta = Math.abs(currentP - lastProgress);
      lastProgress = currentP;

      // Moderate acceleration from progress change
      driftVelocity += progressDelta * 18;
      driftVelocity *= 0.92; // smooth exponential decay
      if (driftVelocity < 0.01) driftVelocity = 0;

      // Base gentle drift + smooth, moderate downward speed cap
      const baseSpeed = 0.6;
      const effectiveSpeed = baseSpeed + Math.min(driftVelocity, 3.2);

      stars.forEach((star) => {
        const fallDist = star.z * effectiveSpeed;
        star.y += fallDist;

        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }

        ctx.save();
        const starColor = star.isGold
          ? `rgba(255, 215, 0, ${Math.min(1, star.alpha + 0.25)})`
          : `rgba(255, 255, 255, ${Math.min(1, star.alpha + 0.2)})`;

        // At moderate scroll speed, draw an elegant subtle elongated drift trail (not blinding warp-speed)
        if (driftVelocity > 0.6) {
          const trailLength = Math.min(fallDist * 1.6, 18);
          ctx.beginPath();
          ctx.strokeStyle = starColor;
          ctx.lineWidth = star.radius * 1.15;
          ctx.lineCap = 'round';
          ctx.shadowColor = star.isGold ? '#FFD700' : '#ffffff';
          ctx.shadowBlur = 6;
          ctx.moveTo(star.x, star.y - trailLength);
          ctx.lineTo(star.x, star.y);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fillStyle = starColor;
          ctx.shadowColor = star.isGold ? '#FFD700' : '#ffffff';
          ctx.shadowBlur = 4;
          ctx.fill();
        }
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('wheel', handleWheelVelocity);
    };
  }, [targetProgress]);

  // scene animations: earth recedes, rocket ascends, planet zooms past, dextron appears
  const earthScale = useTransform(smoothProgress, [0, 0.42], [1, 0.36]);
  const earthY = useTransform(smoothProgress, [0, 0.42], [0, 240]);
  const earthOpacity = useTransform(smoothProgress, [0, 0.3, 0.44], [1, 0.85, 0]);

  // rocket ascends
  const rocketScale = useTransform(smoothProgress, [0, 0.32, 0.72], [0.85, 1.25, 0.4]);
  const rocketY = useTransform(smoothProgress, [0, 0.32, 0.72], [40, -90, -360]);
  const rocketOpacity = useTransform(smoothProgress, [0, 0.08, 0.60, 0.72], [0.95, 1, 1, 0]);

  // 2nd planet passes by
  const planetScale = useTransform(smoothProgress, [0.35, 0.52, 0.64, 0.74], [0.5, 1.0, 2.5, 5.0]);
  const planetY = useTransform(smoothProgress, [0.35, 0.52, 0.64, 0.74], [120, 0, -30, -80]);
  const planetOpacity = useTransform(smoothProgress, [0.35, 0.48, 0.62, 0.72], [0, 1, 0.8, 0]);

  // dextron reveal
  const dextronScale = useTransform(smoothProgress, [0.62, 0.72, 0.92], [0.65, 1.0, 1.04]);
  const dextronOpacity = useTransform(smoothProgress, [0.62, 0.70, 0.92, 0.96], [0, 1, 1, 0]);

  // scroll prompt
  const scrollPromptOpacity = useTransform(smoothProgress, [0, 0.06], [1, 0]);
  const scrollPromptY = useTransform(smoothProgress, [0, 0.06], [0, 15]);

  // fade out into main site
  const masterOpacity = useTransform(smoothProgress, [0.93, 0.99], [1, 0]);

  // only show rocket flame when actively scrolling
  const shouldShowFlame = isActivelyScrolling && displayProgress > 3 && displayProgress < 95;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
      style={{ opacity: masterOpacity }}
      className="fixed inset-0 z-50 bg-[#0a0414] text-white flex items-center justify-center overflow-hidden select-none"
    >
      {/* Background Starfield Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 block pointer-events-none" />

      {/* Skip Intro button */}
      <button
        onClick={() => {
          cyberAudio.playClick();
          onComplete();
        }}
        className="absolute top-6 right-6 z-50 px-3.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-400 hover:text-white font-mono text-xs transition-all cursor-pointer"
      >
        SKIP INTRO &gt;&gt;
      </button>

      {/* Clean Ambient Purple Cosmos Nebula */}
      <div className="absolute -top-[10%] left-[20%] w-[55vw] h-[55vw] rounded-full bg-[#6D28D9]/15 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[15%] w-[45vw] h-[45vw] rounded-full bg-purple-950/20 blur-[180px] pointer-events-none" />

      {/* ========================================================================= */}
      {/* STAGE 1: Clean Minimalist Earth (Zero Status Badges / Zero Text Clutter)  */}
      {/* ========================================================================= */}
      <motion.div
        style={{
          scale: earthScale,
          y: earthY,
          opacity: earthOpacity,
        }}
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
      >
        <div className="relative flex flex-col items-center">
          {/* Aesthetic Minimalist Earth Sphere */}
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#0d061c] border-2 border-[#FFD700]/70 shadow-[0_0_90px_rgba(255,215,0,0.4),inset_0_0_70px_rgba(109,40,217,0.55)] flex items-center justify-center overflow-hidden">
            {/* Atmospheric Starlight Gradient */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0414] via-[#1a0c36] to-[#6D28D9]/40" />

            {/* Organic Starlight Glow in Gold & Violet */}
            <div className="absolute top-12 left-16 w-28 h-20 rounded-full bg-[#FFD700]/18 blur-2xl" />
            <div className="absolute bottom-16 right-16 w-32 h-24 rounded-full bg-[#FFD700]/14 blur-2xl" />
            <div className="absolute top-24 right-20 w-20 h-16 rounded-full bg-[#8B5CF6]/25 blur-xl" />

            {/* Subtle Rim Lighting */}
            <div className="absolute inset-0 rounded-full border border-white/10" />
            <div className="absolute top-2 left-8 right-8 h-14 rounded-full bg-white/[0.05] blur-md" />
          </div>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* STAGE 2 & 3: Ultra-Minimalist Vector Line Gold Rocket (#FFD700)           */}
      {/* Booster fire ONLY animates when actively scrolling (Zero fire at rest)    */}
      {/* ========================================================================= */}
      <motion.div
        style={{
          scale: rocketScale,
          y: rocketY,
          opacity: rocketOpacity,
        }}
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20"
      >
        <div className="relative flex flex-col items-center">
          {/* Sleek Vector Line Gold Rocket */}
          <svg
            width="78"
            height="150"
            viewBox="0 0 78 150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_0_18px_rgba(255,215,0,0.45)]"
          >
            {/* Aerodynamic Fuselage Contour (Crisp 1.5px Solid Gold vector lines, obsidian glass fill) */}
            <path
              d="M39 6 C31 26 24 58 24 108 C24 118 29 124 39 124 C49 124 54 118 54 108 C54 58 47 26 39 6 Z"
              stroke="#FFD700"
              strokeWidth="1.5"
              fill="rgba(10, 4, 20, 0.6)"
            />

            {/* Razor-Thin Swept Stabilizer Fins (Gold vector lines with subtle translucent purple insets) */}
            <path
              d="M24 94 L8 124 L24 118 Z"
              stroke="#FFD700"
              strokeWidth="1.3"
              fill="rgba(109, 40, 217, 0.16)"
            />
            <path
              d="M54 94 L70 124 L54 118 Z"
              stroke="#FFD700"
              strokeWidth="1.3"
              fill="rgba(109, 40, 217, 0.16)"
            />

            {/* Thin Purple Details (#8B5CF6) */}
            {/* Inner Fin Accent Inset Lines */}
            <line x1="19" y1="106" x2="11" y2="121" stroke="#8B5CF6" strokeWidth="1" />
            <line x1="59" y1="106" x2="67" y2="121" stroke="#8B5CF6" strokeWidth="1" />

            {/* Nosecone Vector Inset Chevron */}
            <path d="M34 32 L39 24 L44 32" stroke="#8B5CF6" strokeWidth="1" fill="none" opacity="0.85" />

            {/* Centerline Guideline */}
            <line x1="39" y1="36" x2="39" y2="120" stroke="#FFD700" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.5" />

            {/* Minimalist Viewport Porthole (Outer Gold ring + Inner Purple ring + Micro white reflection dot) */}
            <circle cx="39" cy="62" r="6.5" stroke="#FFD700" strokeWidth="1.4" fill="#0a0414" />
            <circle cx="39" cy="62" r="3.8" stroke="#8B5CF6" strokeWidth="1" fill="none" opacity="0.9" />
            <circle cx="40.2" cy="60.5" r="1.1" fill="#ffffff" opacity="0.95" />

            {/* Thin Aerospace Vector Accent Bands */}
            <path d="M26 86 C31 89 47 89 52 86" stroke="#8B5CF6" strokeWidth="1" fill="none" />
            <path d="M25 94 C31 97 47 97 53 94" stroke="#FFD700" strokeWidth="0.8" fill="none" opacity="0.75" />

            {/* Minimalist Thruster Nozzle */}
            <path d="M33 124 L30 133 L48 133 L45 124 Z" stroke="#FFD700" strokeWidth="1.2" fill="none" />
            <line x1="32" y1="131" x2="46" y2="131" stroke="#8B5CF6" strokeWidth="0.9" />
          </svg>

          {/* Active Animated Fiery Flame & Exhaust Particles (Rendered ONLY when actively scrolling) */}
          <AnimatePresence>
            {shouldShowFlame && (
              <motion.div
                key="rocket-booster-flame"
                initial={{ opacity: 0, scaleY: 0.2 }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0, scaleY: 0.2, transition: { duration: 0.18 } }}
                className="relative -mt-2.5 flex flex-col items-center"
              >
                {/* Outer Plasma Flame (Solid Gold -> Violet Taper) */}
                <motion.div
                  animate={{
                    scaleY: [1, 1.35, 0.9, 1.4],
                    scaleX: [1, 0.88, 1.12, 0.9],
                    opacity: [0.85, 1, 0.75, 1]
                  }}
                  transition={{ duration: 0.18, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-6 h-18 rounded-b-full bg-gradient-to-b from-[#FFD700] via-[#FF7A00] to-[#6D28D9]/0 blur-[1px] shadow-[0_0_24px_#FFD700]"
                />

                {/* Inner White-Hot Starlight Core Stream */}
                <motion.div
                  animate={{
                    scaleY: [1, 1.4, 0.9, 1.3],
                    scaleX: [1, 0.9, 1.1, 0.95]
                  }}
                  transition={{ duration: 0.14, repeat: Infinity, ease: 'linear' }}
                  className="absolute top-0 w-2.5 h-11 rounded-b-full bg-gradient-to-b from-white via-[#FFF5A5] to-transparent shadow-[0_0_12px_#FFF5A5]"
                />

                {/* Fiery Exhaust Spark Particles */}
                <div className="absolute top-8 flex gap-2.5 pointer-events-none">
                  <motion.div
                    animate={{ y: [0, 40], opacity: [1, 0], scale: [1, 0.2] }}
                    transition={{ duration: 0.28, repeat: Infinity, ease: 'easeOut' }}
                    className="w-1.5 h-1.5 rounded-full bg-[#FFD700]"
                  />
                  <motion.div
                    animate={{ y: [0, 50], opacity: [1, 0], scale: [1, 0.15] }}
                    transition={{ duration: 0.34, repeat: Infinity, delay: 0.06, ease: 'easeOut' }}
                    className="w-1 h-1 rounded-full bg-[#FFF5A5]"
                  />
                  <motion.div
                    animate={{ y: [0, 36], opacity: [1, 0], scale: [1, 0.3] }}
                    transition={{ duration: 0.24, repeat: Infinity, delay: 0.12, ease: 'easeOut' }}
                    className="w-1 h-1 rounded-full bg-[#FF7A00]"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* STAGE 4: 2nd Planet Zooms Near Screen & Dissolves Away -> Dextron Appears */}
      {/* Robotic voice chirps when "Welcome, Tamaraw!" pops up                     */}
      {/* ========================================================================= */}
      <motion.div
        style={{
          scale: planetScale,
          y: planetY,
          opacity: planetOpacity,
        }}
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30"
      >
        {/* Minimalist Celestial Campus Planet Zooming Near Screen */}
        <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-[#0e071c] border-2 border-[#FFD700]/80 shadow-[0_0_100px_rgba(109,40,217,0.7)] relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0414] via-[#1e0e3b] to-[#6D28D9]/30" />
          <div className="w-48 h-32 rounded-full bg-[#FFD700]/15 blur-2xl" />

          {/* Orbiting Golden Ring */}
          <div className="absolute w-[440px] h-20 rounded-full border-2 border-[#FFD700]/60 rotate-[-22deg] shadow-[0_0_30px_rgba(255,215,0,0.35)]" />
        </div>
      </motion.div>

      {/* Dextron Greeting Layer (Revealed as Planet Zooms Past Screen) */}
      <motion.div
        style={{
          scale: dextronScale,
          opacity: dextronOpacity,
        }}
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-40"
      >
        <div className="relative flex flex-col items-center">
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [-2, 3, -2]
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="w-36 sm:w-48 mb-2"
          >
            <img
              src="/assets/mascot-default.png"
              alt="Dextron welcoming Tamaraw"
              className="w-full h-auto object-contain filter drop-shadow-[0_0_30px_rgba(255,215,0,0.6)]"
            />
          </motion.div>

          {/* Speech Bubble popping up with Robotic Chirp Voice */}
          <AnimatePresence>
            {displayProgress >= 70 && displayProgress <= 96 && (
              <motion.div
                key="dextron-speech-bubble"
                initial={{ scale: 0.3, opacity: 0, y: 12 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.7, opacity: 0, y: 8 }}
                transition={{ type: 'spring', damping: 14, stiffness: 220 }}
                className="relative mt-2 px-5 py-2.5 rounded-2xl bg-[#0a0414]/95 border-2 border-[#FFD700] shadow-[0_0_35px_rgba(255,215,0,0.5)] flex items-center gap-2.5"
              >
                {/* Speech bubble pointer notch pointing up to Dextron */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-[7px] border-x-transparent border-b-[8px] border-b-[#FFD700]" />
                <span className="w-2 h-2 rounded-full bg-[#FFD700] animate-ping" />
                <span className="text-sm sm:text-base font-mono text-[#FFD700] font-bold tracking-wide">
                  "Welcome, Tamaraw!"
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* Minimalist Scroll Hint at Scroll = 0 (Disappears instantly on scroll)     */}
      {/* ========================================================================= */}
      <motion.div
        style={{
          opacity: scrollPromptOpacity,
          y: scrollPromptY,
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-40"
      >
        <div className="w-5 h-8 rounded-full border-2 border-[#FFD700]/70 flex items-start justify-center p-1 shadow-[0_0_15px_rgba(255,215,0,0.3)]">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-2 rounded-full bg-[#FFD700]"
          />
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#A1A1AA] tracking-widest font-semibold uppercase">
          <span>Scroll to explore</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#FFD700] animate-bounce" />
        </div>
      </motion.div>
    </motion.div>
  );
}
