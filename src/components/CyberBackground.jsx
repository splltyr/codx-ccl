import React, { useEffect, useRef } from 'react';
import { cyberAudio } from '../utils/audioSynth';

export default function CyberBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const mouse = { x: -1000, y: -1000, radius: 190 };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // star colors
    const count = Math.min(Math.floor((width * height) / 13000), 95);
    const starColors = ['#c084fc', '#FFD700', '#FF7A00', '#a855f7', '#ffffff'];
    const CHIME_PENTATONIC = [1046.50, 1174.66, 1318.51, 1567.98, 1760.00, 2093.00, 2349.32];
    const stars = [];

    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: Math.random() * 0.25 + 0.15, // base gentle downward drift
        speedMultiplier: Math.random() * 1.2 + 0.6,
        baseRadius: Math.random() * 1.6 + 0.6,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        alpha: Math.random() * 0.5 + 0.25,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        chimeFreq: CHIME_PENTATONIC[i % CHIME_PENTATONIC.length],
        isCursorConnected: false
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // connect nearby stars with lines
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const lineOpacity = (1 - dist / 130) * 0.18;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 215, 0, ${lineOpacity * 0.7})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.stroke();
          }
        }

        // line to cursor when nearby
        const mdx = stars[i].x - mouse.x;
        const mdy = stars[i].y - mouse.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < mouse.radius) {
          if (!stars[i].isCursorConnected) {
            stars[i].isCursorConnected = true;
            cyberAudio.playConstellationCrackleHum();
          }
          const mOpacity = (1 - mDist / mouse.radius) * 0.35;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 215, 0, ${mOpacity})`;
          ctx.lineWidth = 0.9;
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        } else {
          stars[i].isCursorConnected = false;
        }
      }

      // update star positions
      stars.forEach((s) => {
        s.y += s.vy;
        s.x += s.vx;

        // Wrap around seamlessly
        if (s.y > height) {
          s.y = 0;
          s.x = Math.random() * width;
        } else if (s.y < 0) {
          s.y = height;
          s.x = Math.random() * width;
        }
        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;

        // Subtle twinkling
        s.alpha += s.twinkleSpeed;
        if (s.alpha > 0.85 || s.alpha < 0.2) s.twinkleSpeed = -s.twinkleSpeed;

        // Mouse pull effect
        const dx = mouse.x - s.x;
        const dy = mouse.y - s.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (1 - dist / mouse.radius);
          s.x += (dx / dist) * force * 0.85;
          s.y += (dy / dist) * force * 0.85;
        }

        ctx.save();
        // Gentle floating star point
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.baseRadius, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = Math.max(0.12, s.alpha);
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#0a0414]">
      {/* Clean Rich Deep Purple Ambient Glow (No bottom-left yellow artifacts) */}
      <div className="absolute -top-[15%] left-[20%] w-[55vw] h-[55vw] rounded-full bg-purple-900/18 blur-[160px] pointer-events-none" />
      <div className="absolute top-[35%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-purple-950/20 blur-[170px] pointer-events-none" />
      
      {/* Starfield & Constellation Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 block" />
    </div>
  );
}
