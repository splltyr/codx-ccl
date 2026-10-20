import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, 
  Upload, 
  Download, 
  Check, 
  Layers,
  RotateCcw,
  ZoomIn,
  Move
} from 'lucide-react';
import { firebaseData } from '../services/firebaseService';
import { cyberAudio } from '../utils/audioSynth';

export default function PfpGenerator({ onShowToast }) {
  const [frames, setFrames] = useState([]);
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [overlayImage, setOverlayImage] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const isDraggingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });

  // Subscribe to frames from Firebase
  useEffect(() => {
    const unsub = firebaseData.subscribeFrames((items) => {
      setFrames(items || []);
      if (items && items.length > 0 && !selectedFrame) {
        setSelectedFrame(items[0]);
      }
    });
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, [selectedFrame]);

  // Load custom PNG overlay if present on selected frame
  useEffect(() => {
    const overlaySrc = selectedFrame?.overlayUrl || selectedFrame?.customPng;
    if (overlaySrc) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => setOverlayImage(img);
      img.onerror = () => setOverlayImage(null);
      img.src = overlaySrc;
    } else {
      setOverlayImage(null);
    }
  }, [selectedFrame]);

  // Scroll-to-zoom directly over the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e) => {
      if (!userImage) return;
      e.preventDefault();

      const zoomStep = 0.08;
      const delta = e.deltaY < 0 ? zoomStep : -zoomStep;

      setZoom((prev) => {
        const next = Math.min(3.0, Math.max(0.5, prev + delta));
        return parseFloat(next.toFixed(2));
      });
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [userImage]);

  // start with black placeholder until someone uploads an image
  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    cyberAudio.playClick();
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        setUserImage(img);
        setPan({ x: 0, y: 0 });
        setZoom(1);
        if (onShowToast) onShowToast('Photo framed successfully!');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // pan / drag handler for mouse & touch
  const handlePointerDown = (e) => {
    if (!userImage) return;
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    isDraggingRef.current = true;
    setIsDragging(true);
    lastPointerRef.current = { x: e.clientX, y: e.clientY };

    try {
      e.target.setPointerCapture(e.pointerId);
    } catch {
      // safe fallback
    }
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || !userImage) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const deltaX = (e.clientX - lastPointerRef.current.x) * scaleX;
    const deltaY = (e.clientY - lastPointerRef.current.y) * scaleY;

    lastPointerRef.current = { x: e.clientX, y: e.clientY };

    setPan((prev) => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY,
    }));
  };

  const handlePointerUp = (e) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
      try {
        if (e.target.hasPointerCapture(e.pointerId)) {
          e.target.releasePointerCapture(e.pointerId);
        }
      } catch {
        // safe fallback
      }
    }
  };

  const handleCanvasClick = () => {
    if (!userImage) {
      fileInputRef.current?.click();
    }
  };

  const handleResetPosition = () => {
    cyberAudio.playClick();
    setPan({ x: 0, y: 0 });
    setZoom(1);
    if (onShowToast) onShowToast('Photo position & zoom reset');
  };

  // Render Canvas Preview
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const center = size / 2;
    const radius = size * 0.40; // 240px circle radius

    // 1. Clear
    ctx.clearRect(0, 0, size, size);

    // 2. Clip User Photo in Circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Solid matte black background container (#050508)
    ctx.fillStyle = '#050508';
    ctx.fillRect(0, 0, size, size);

    if (userImage) {
      const imgAspect = userImage.width / userImage.height;
      let baseW, baseH;
      if (imgAspect > 1) {
        baseH = radius * 2.15;
        baseW = baseH * imgAspect;
      } else {
        baseW = radius * 2.15;
        baseH = baseW / imgAspect;
      }
      const drawW = baseW * zoom;
      const drawH = baseH * zoom;
      const drawX = center - drawW / 2 + pan.x;
      const drawY = center - drawH / 2 + pan.y;

      ctx.drawImage(userImage, drawX, drawY, drawW, drawH);
    } else {
      // Solid matte black placeholder state with subtle upload guide
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 13px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('[UPLOAD PHOTO]', center, center - 8);

      ctx.fillStyle = '#A1A1AA';
      ctx.font = '11px Outfit, sans-serif';
      ctx.fillText('Click below to select your avatar', center, center + 14);
    }
    ctx.restore();

    // 3. Draw Frame Overlay
    if (selectedFrame) {
      ctx.save();
      const accent = selectedFrame.accentColor || '#FFD700';
      const styleType = selectedFrame.styleType || 'neon-apex';

      if (overlayImage) {
        // custom png frame overlay
        ctx.drawImage(overlayImage, 0, 0, size, size);
      } else if (styleType === 'neon-apex') {
        // CODX Gen-2 Apex ring
        ctx.beginPath();
        ctx.arc(center, center, radius + 8, 0, Math.PI * 2);
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(center, center, radius + 2, 0, Math.PI * 2);
        ctx.strokeStyle = '#6D28D9';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 4 corner brackets
        const bOff = radius + 24;
        const bLen = 14;
        const corners = [
          { x: center - bOff, y: center - bOff, dx: 1, dy: 1 },
          { x: center + bOff, y: center - bOff, dx: -1, dy: 1 },
          { x: center - bOff, y: center + bOff, dx: 1, dy: -1 },
          { x: center + bOff, y: center + bOff, dx: -1, dy: -1 }
        ];
        corners.forEach(c => {
          ctx.beginPath();
          ctx.strokeStyle = '#FFD700';
          ctx.lineWidth = 2;
          ctx.moveTo(c.x, c.y + c.dy * bLen);
          ctx.lineTo(c.x, c.y);
          ctx.lineTo(c.x + c.dx * bLen, c.y);
          ctx.stroke();
        });

      } else if (styleType === 'feu-gold') {
        // Tamaraw Tech (Gold & Green)
        ctx.beginPath();
        ctx.arc(center, center, radius + 10, 0, Math.PI * 2);
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(center, center, radius + 4, 0, Math.PI * 2);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 11px Space Grotesk, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('FEU DILIMAN // TAMARAW TECH', center, center - radius - 18);

      } else if (styleType === 'dextron-visor') {
        // Dextron Visor Frame
        ctx.beginPath();
        ctx.arc(center, center, radius + 8, 0, Math.PI * 2);
        ctx.strokeStyle = '#6D28D9';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(center - radius - 8, center, 5, 0, Math.PI * 2);
        ctx.arc(center + radius + 8, center, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('CODX DEXTRON EDITION', center, center - radius - 16);

      } else if (styleType === 'hack-vanguard') {
        // Hackathon Vanguard Frame
        ctx.beginPath();
        ctx.arc(center, center, radius + 8, 0, Math.PI * 2);
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(center, center, radius + 2, 0, Math.PI * 2);
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#ec4899';
        ctx.font = 'bold 10px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('HACKDILIMAN 2026 // VANGUARD', center, center - radius - 16);

      } else if (styleType === 'aurora-minimal') {
        // Member Pass Minimal Frame
        ctx.beginPath();
        ctx.arc(center, center, radius + 7, 0, Math.PI * 2);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 10px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('CODX GENERAL ASSEMBLY', center, center - radius - 16);

      } else {
        // default ring
        ctx.beginPath();
        ctx.arc(center, center, radius + 8, 0, Math.PI * 2);
        ctx.strokeStyle = accent;
        ctx.lineWidth = 3.5;
        ctx.stroke();
      }

      ctx.restore();
    }
  }, [userImage, selectedFrame, overlayImage, pan, zoom]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // export as png so browsers don't save weird extensionless files
  const handleDownloadPfp = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    cyberAudio.playClick();
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = dataUrl;
    link.setAttribute('download', 'codx-pfp.png');
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);
    cyberAudio.playChime(880, 0.4);
    if (onShowToast) onShowToast('Avatar downloaded as codx-pfp.png!');
  };

  return (
    <section id="pfp-forge" className="relative py-28 z-10 border-t border-white/[0.06]">
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
            <Camera className="w-3.5 h-3.5 text-[#FFD700]" />
            <span className="font-bold">FEU DILIMAN PROFILE GENERATOR</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-['Space_Grotesk'] font-bold text-white mb-6">
            PFP FRAME <span className="text-[#FFD700]">GENERATOR</span>
          </h2>
          <p className="text-[#A1A1AA] text-base sm:text-lg leading-relaxed font-light">
            Upload your photo, select an official CODX frame, and download your 
            customized avatar for Discord, GitHub, and social profiles.
          </p>
        </motion.div>

        {/* Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          
          {/* preview canvas & upload controls */}
          <motion.div 
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col items-center"
          >
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 w-full flex flex-col items-center">
              
              {/* canvas container */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl bg-[#050508] border border-white/[0.08] p-2 flex items-center justify-center shadow-2xl overflow-hidden mb-6 group select-none">
                <canvas 
                  ref={canvasRef} 
                  width={600} 
                  height={600} 
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  onClick={handleCanvasClick}
                  style={{ touchAction: 'none' }}
                  className={`w-full h-full object-contain touch-none ${
                    userImage 
                      ? isDragging 
                        ? 'cursor-grabbing' 
                        : 'cursor-grab' 
                      : 'cursor-pointer'
                  }`}
                  title={userImage ? 'Drag to reposition • Scroll to zoom' : 'Click to upload photo'}
                  aria-label={userImage ? 'Avatar preview - click and drag to pan, scroll to zoom' : 'Avatar preview placeholder'}
                />

                {/* hint overlay */}
                {userImage && (
                  <div className="absolute bottom-3 inset-x-0 flex justify-center pointer-events-none transition-opacity duration-300 opacity-60 group-hover:opacity-100">
                    <span className="text-[10px] font-mono tracking-wider text-[#A1A1AA] bg-[#050508]/85 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10 flex items-center gap-1.5 shadow-lg">
                      <Move className="w-2.5 h-2.5 text-[#FFD700]" aria-hidden="true" />
                      <span>DRAG TO PAN • SCROLL TO ZOOM</span>
                    </span>
                  </div>
                )}
              </div>

              {/* controls */}
              <div className="w-full space-y-3">
                {/* scale slider and reset */}
                {userImage && (
                  <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md transition-all">
                    <div className="flex items-center gap-1.5 text-xs font-mono shrink-0">
                      <ZoomIn className="w-3.5 h-3.5 text-[#FFD700]" aria-hidden="true" />
                      <span className="text-[11px] font-bold text-white tracking-wider">SCALE</span>
                      <span className="text-[11px] text-[#FFD700] tabular-numbers w-9 text-right font-bold">
                        {zoom.toFixed(2)}x
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.05"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      aria-label="Zoom / Scale"
                      className="flex-1 h-1.5 bg-white/15 rounded-lg appearance-none cursor-pointer accent-[#FFD700] focus:outline-none transition-all"
                    />

                    <button
                      type="button"
                      onClick={handleResetPosition}
                      title="Reset Position"
                      aria-label="Reset Position"
                      className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-[#6D28D9]/40 border border-white/10 hover:border-[#FFD700]/50 text-[#A1A1AA] hover:text-[#FFD700] transition-all flex items-center justify-center shrink-0 active:scale-95 group"
                    >
                      <RotateCcw className="w-3.5 h-3.5 group-hover:rotate-[-45deg] transition-transform" aria-hidden="true" />
                    </button>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full min-h-[48px] py-3 rounded-xl btn-primary-purple text-white font-mono text-xs font-bold tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Upload className="w-4 h-4 text-white" aria-hidden="true" />
                  <span>UPLOAD YOUR PHOTO</span>
                </button>
              </div>

            </div>
          </motion.div>

          {/* frame picker & download button */}
          <motion.div 
            initial={{ opacity: 0, x: 15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col justify-between h-full space-y-6"
          >
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="font-['Space_Grotesk'] font-bold text-base text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#FFD700]" aria-hidden="true" />
                  <span>OFFICIAL EVENT & ORG FRAMES</span>
                </div>
                <span className="text-[11px] font-mono text-[#A1A1AA]">
                  {frames.length} AVAILABLE
                </span>
              </div>

              {/* Frames List */}
              <div 
                className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1"
                role="radiogroup"
                aria-label="Official Event Frames"
              >
                {frames.map((frame) => {
                  const isSelected = selectedFrame?.id === frame.id;
                  return (
                    <button
                      key={frame.id}
                      onClick={() => {
                        cyberAudio.playClick();
                        setSelectedFrame(frame);
                      }}
                      role="radio"
                      aria-checked={isSelected}
                      className={`w-full min-h-[52px] p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between group active:scale-[0.99] ${
                        isSelected
                          ? 'bg-[#120726] border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.15)]'
                          : 'bg-white/[0.02] border-white/10 hover:border-[#FFD700]/30 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-mono font-bold ${isSelected ? 'text-[#FFD700]' : 'text-white'}`}>
                            {frame.title}
                          </span>
                          <span 
                            className="w-2.5 h-2.5 rounded-full" 
                            style={{ backgroundColor: frame.accentColor || '#FFD700' }}
                            aria-hidden="true"
                          />
                        </div>
                        <div className="text-[11px] text-[#A1A1AA] font-mono">
                          {frame.event} • <span className="text-[#FFD700] font-semibold">{frame.badge}</span>
                        </div>
                      </div>

                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        isSelected 
                          ? 'bg-[#FFD700] text-black font-bold' 
                          : 'border border-white/20 text-transparent'
                      }`}>
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Download HD PFP Button */}
              <div className="pt-4 border-t border-white/[0.06]">
                <button
                  onClick={handleDownloadPfp}
                  className="w-full min-h-[48px] py-3.5 rounded-xl btn-primary-purple text-white font-mono text-xs font-bold tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Download className="w-4 h-4 text-white" aria-hidden="true" />
                  <span>DOWNLOAD HD PFP</span>
                </button>
                <p className="text-[11px] font-mono text-[#A1A1AA] text-center mt-2.5">
                  Exports a high-resolution PNG with transparent frame.
                </p>
              </div>

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
