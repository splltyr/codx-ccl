import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal as TerminalIcon, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Bot, 
  FastForward,
  Cpu,
  ShieldAlert,
  X
} from 'lucide-react';
import { cyberAudio } from '../utils/audioSynth';

export default function TerminalIntro({ isOpen = true, onClose, onComplete }) {
  const [history, setHistory] = useState([
    { type: 'header', text: 'CODX BASH ENVIRONMENT // FEU DILIMAN IT COLLECTIVE [v2.4.0]' },
    { type: 'sys', text: 'Architecture: x86_64-feudiliman-linux-gnu | Kernel: APD-GEN2' },
    { type: 'sys', text: 'Mounted Firestore cloud endpoints... [OK]' },
    { type: 'sys', text: 'Active Departments: Systems, AI, Creative UI, Cyber Defense' },
    { type: 'hint', text: 'Commands: "help", "status", "dextron", "tracks", "clear", or "exit".' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isLaunching, setIsLaunching] = useState(false);
  const [progress, setProgress] = useState(0);
  const terminalBottomRef = useRef(null);
  const inputRef = useRef(null);

  const handleClose = () => {
    cyberAudio.playClick();
    if (onClose) onClose();
    if (onComplete) onComplete();
  };

  // close on esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // auto scroll to bottom
  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleLaunch = () => {
    if (isLaunching) return;
    setIsLaunching(true);
    cyberAudio.playClick();
    cyberAudio.playChime(660, 0.3);

    setHistory((prev) => [
      ...prev,
      { type: 'cmd', text: '$ codx launch' },
      { type: 'launch', text: 'Initiating CODX student collective interface...' }
    ]);

    // progress bar animation
    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => {
          cyberAudio.playChime(880, 0.4);
          if (onComplete) onComplete();
        }, 350);
      }
      setProgress(current);
    }, 90);
  };

  const handleCommand = (e) => {
    e.preventDefault();
    if (!inputVal.trim() || isLaunching) return;

    cyberAudio.playClick();
    const cmd = inputVal.trim().toLowerCase();
    const entered = inputVal;
    setInputVal('');

    const newEntries = [{ type: 'cmd', text: `$ ${entered}` }];

    if (cmd === 'codx launch' || cmd === 'launch' || cmd === 'start' || cmd === 'run' || cmd === 'enter') {
      setHistory((prev) => [...prev, ...newEntries]);
      handleLaunch();
      return;
    }

    switch (cmd) {
      case 'help':
        newEntries.push({
          type: 'res',
          text: 'AVAILABLE COMMANDS:\n  codx launch   - Initialize and enter the main CODX experience\n  status        - Inspect FEU Diliman campus cluster health\n  dextron       - Query the official Dextron IT mascot\n  tracks        - List the 4 technical departments\n  clear         - Clear the terminal screen\n  skip          - Bypass intro immediately'
        });
        break;

      case 'status':
        newEntries.push({
          type: 'res',
          text: 'CODX SYSTEM STATUS:\n  Status: OPERATIONAL\n  Campus: Far Eastern University Diliman\n  Lineage: Association of Programmers & Developers (Gen 2)\n  Database: Firestore Live Sync [Connected]'
        });
        break;

      case 'dextron':
        newEntries.push({
          type: 'res',
          text: '[DEXTRON]: "Beep boop Tamaraw! Ready to engineer the future at FEU Diliman. Type \'codx launch\' to proceed!"'
        });
        break;

      case 'tracks':
        newEntries.push({
          type: 'res',
          text: 'CODX DEPARTMENTS:\n  1. Systems & Cloud Infrastructure\n  2. Intelligent Systems & Neural AI\n  3. Creative Tech & Sensory UI/UX\n  4. Cyber Defense & Zero-Trust'
        });
        break;

      case 'exit':
      case 'quit':
      case 'close':
        handleClose();
        return;

      case 'skip':
        handleLaunch();
        return;

      case 'clear':
        setHistory([]);
        return;

      default:
        newEntries.push({
          type: 'err',
          text: `bash: command not found: ${entered}. Type "help" or "exit".`
        });
        break;
    }

    setHistory((prev) => [...prev, ...newEntries]);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
      onClick={handleClose}
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-purple-900/20 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-[#FF7A00]/15 blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-[#FFD700]/10 blur-[160px] pointer-events-none" />

      {/* Terminal Modal Window */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="w-full max-w-3xl glass-panel rounded-3xl border border-[#FFD700]/30 shadow-[0_20px_70px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col max-h-[85vh] bg-[#0c0618]/95 relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Header Bar */}
        <div className="px-5 py-3.5 bg-black/60 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" aria-hidden="true" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" aria-hidden="true" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" aria-hidden="true" />
            <div className="ml-3 flex items-center gap-2 text-xs font-mono text-slate-300">
              <TerminalIcon className="w-3.5 h-3.5 text-[#FFD700]" aria-hidden="true" />
              <span className="font-semibold text-white">codx bash</span>
              <span className="text-slate-400 hidden sm:inline">— CLI v2.4 (FEU Diliman)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-[#FFD700] border border-[#FFD700]/30">
              CLI READY
            </span>
            <button
              onClick={handleClose}
              aria-label="Close terminal window"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div 
          className="p-5 sm:p-6 overflow-y-auto font-mono text-xs sm:text-[13px] space-y-2.5 flex-1 bg-black/40 min-h-[280px]"
          role="region"
          aria-label="CODX Terminal Output"
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((line, idx) => (
            <div key={idx} className="leading-relaxed">
              {line.type === 'header' && (
                <div className="text-purple-300 font-bold border-b border-purple-500/20 pb-1 mb-2">
                  {line.text}
                </div>
              )}
              {line.type === 'sys' && (
                <div className="text-slate-300 flex items-center gap-2">
                  <span className="text-[#FF7A00]">›</span>
                  <span>{line.text}</span>
                </div>
              )}
              {line.type === 'hint' && (
                <div className="text-[#FFD700]/90 italic pt-1">
                  💡 {line.text}
                </div>
              )}
              {line.type === 'cmd' && (
                <div className="text-[#FFD700] font-bold">
                  {line.text}
                </div>
              )}
              {line.type === 'res' && (
                <div className="text-purple-200 pl-3 border-l-2 border-purple-500/40 whitespace-pre-wrap py-0.5">
                  {line.text}
                </div>
              )}
              {line.type === 'err' && (
                <div className="text-rose-400 pl-3 border-l-2 border-rose-500/40 py-0.5">
                  {line.text}
                </div>
              )}
              {line.type === 'launch' && (
                <div className="text-emerald-400 font-semibold flex items-center gap-2 pt-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                  <span>{line.text}</span>
                </div>
              )}
            </div>
          ))}

          {/* Interactive Input Line */}
          {!isLaunching ? (
            <form onSubmit={handleCommand} className="flex items-center gap-2 pt-2">
              <span className="text-[#FFD700] font-bold shrink-0">codx@feu-diliman:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="type 'help', 'status', 'dextron', or 'exit'..."
                className="w-full bg-transparent text-[#FFF5A5] placeholder-slate-500 focus:outline-none font-mono text-xs sm:text-[13px]"
                autoFocus
              />
            </form>
          ) : (
            <div className="pt-4 space-y-2">
              <div className="flex justify-between text-[11px] font-mono text-[#FFD700]">
                <span>MOUNTING SPATIAL INTERFACE...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/[0.08] overflow-hidden">
                <motion.div 
                  className="h-full bg-[#6D28D9]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'linear' }}
                />
              </div>
            </div>
          )}

          <div ref={terminalBottomRef} />
        </div>

        {/* Action Toolbar */}
        <div className="px-5 py-3.5 bg-black/60 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse" aria-hidden="true" />
            <span className="text-[#FFD700] font-semibold">Tamaraw IT Collective Ready</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleClose}
              className="min-h-[38px] px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition-all active:scale-[0.98]"
            >
              Close [Esc]
            </button>
            <button
              onClick={handleLaunch}
              disabled={isLaunching}
              className="min-h-[38px] px-5 rounded-xl btn-primary-purple text-white text-xs font-mono font-bold tracking-wider transition-all flex items-center gap-2 active:scale-[0.98] disabled:opacity-50"
            >
              <span>{isLaunching ? 'EXECUTING...' : 'RUN CODX EXEC'}</span>
              <ArrowRight className="w-4 h-4 text-white" aria-hidden="true" />
            </button>
          </div>
        </div>

      </motion.div>
    </motion.div>
  );
}
