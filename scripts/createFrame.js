import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.resolve(__dirname, '../public/assets/frame.png');

// 1024x1024 High-Res PFP Frame Overlay
// Exact match with PfpGenerator circle:
// size = 1024, center = 512, radius = 1024 * 0.40 = 409.6
const svgFrame = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Gradients -->
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF0A0" />
      <stop offset="50%" stop-color="#FFD700" />
      <stop offset="100%" stop-color="#B8860B" />
    </linearGradient>
    <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#C084FC" />
      <stop offset="50%" stop-color="#8B5CF6" />
      <stop offset="100%" stop-color="#6D28D9" />
    </linearGradient>
    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Outer ambient ring glow -->
  <circle cx="512" cy="512" r="418" stroke="#8B5CF6" stroke-width="8" opacity="0.4" filter="url(#neonGlow)" />
  <circle cx="512" cy="512" r="412" stroke="#FFD700" stroke-width="4" opacity="0.6" filter="url(#neonGlow)" />

  <!-- Main Metallic Tamaraw Gold Inner Ring -->
  <circle cx="512" cy="512" r="411" stroke="url(#goldGrad)" stroke-width="5" />

  <!-- Concentric Cyber Violet Ring -->
  <circle cx="512" cy="512" r="421" stroke="url(#purpleGrad)" stroke-width="3" stroke-dasharray="24 12" />

  <!-- Fine Outer Coordinate Ring -->
  <circle cx="512" cy="512" r="432" stroke="rgba(255, 215, 0, 0.4)" stroke-width="1.5" stroke-dasharray="6 8" />

  <!-- 4 Cyber Corner Brackets in Tamaraw Gold -->
  <!-- Top Left -->
  <path d="M 64 160 L 64 64 L 160 64" stroke="url(#goldGrad)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
  <circle cx="64" cy="64" r="4" fill="#FFD700" />
  <rect x="76" y="76" width="12" height="12" fill="none" stroke="#8B5CF6" stroke-width="2" />

  <!-- Top Right -->
  <path d="M 960 160 L 960 64 L 864 64" stroke="url(#goldGrad)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
  <circle cx="960" cy="64" r="4" fill="#FFD700" />
  <rect x="936" y="76" width="12" height="12" fill="none" stroke="#8B5CF6" stroke-width="2" />

  <!-- Bottom Left -->
  <path d="M 64 864 L 64 960 L 160 960" stroke="url(#goldGrad)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
  <circle cx="64" cy="960" r="4" fill="#FFD700" />
  <rect x="76" y="936" width="12" height="12" fill="none" stroke="#8B5CF6" stroke-width="2" />

  <!-- Bottom Right -->
  <path d="M 960 864 L 960 960 L 864 960" stroke="url(#goldGrad)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
  <circle cx="960" cy="960" r="4" fill="#FFD700" />
  <rect x="936" y="936" width="12" height="12" fill="none" stroke="#8B5CF6" stroke-width="2" />

  <!-- Side Tech Tick Marks -->
  <!-- Left -->
  <line x1="72" y1="512" x2="94" y2="512" stroke="#FFD700" stroke-width="4" stroke-linecap="round" />
  <line x1="84" y1="500" x2="84" y2="524" stroke="rgba(255,215,0,0.5)" stroke-width="2" />

  <!-- Right -->
  <line x1="930" y1="512" x2="952" y2="512" stroke="#FFD700" stroke-width="4" stroke-linecap="round" />
  <line x1="940" y1="500" x2="940" y2="524" stroke="rgba(255,215,0,0.5)" stroke-width="2" />

  <!-- Top Badge Header: CODX // FEU DILIMAN -->
  <g transform="translate(512, 92)">
    <!-- Pill Base -->
    <rect x="-170" y="-18" width="340" height="36" rx="18" fill="#0C051A" stroke="url(#goldGrad)" stroke-width="2.5" />
    <circle cx="-144" cy="0" r="4" fill="#FFD700" />
    <circle cx="144" cy="0" r="4" fill="#FFD700" />
    <text x="0" y="5" text-anchor="middle" font-family="'Space Grotesk', 'Segoe UI', sans-serif" font-weight="700" font-size="14" fill="#FFFFFF" letter-spacing="3">CODX <tspan fill="#FFD700">//</tspan> FEU DILIMAN</text>
  </g>

  <!-- Bottom Badge: OFFICIAL MEMBER // 2026 -->
  <g transform="translate(512, 932)">
    <!-- Pill Base -->
    <rect x="-190" y="-20" width="380" height="40" rx="20" fill="#0C051A" stroke="url(#purpleGrad)" stroke-width="2.5" />
    <circle cx="-160" cy="0" r="5" fill="#C084FC" />
    <circle cx="160" cy="0" r="5" fill="#C084FC" />
    <text x="0" y="6" text-anchor="middle" font-family="'JetBrains Mono', 'Segoe UI', monospace" font-weight="700" font-size="13" fill="#FFD700" letter-spacing="2.5">OFFICIAL MEMBER • 2026</text>
  </g>

  <!-- Hexagonal Tech Nodes on Perimeters -->
  <!-- Top-left node -->
  <g transform="translate(224, 224)">
    <polygon points="0,-10 9,-5 9,5 0,10 -9,5 -9,-5" fill="#120726" stroke="#FFD700" stroke-width="2" />
    <circle cx="0" cy="0" r="3" fill="#FFD700" />
  </g>
  <!-- Top-right node -->
  <g transform="translate(800, 224)">
    <polygon points="0,-10 9,-5 9,5 0,10 -9,5 -9,-5" fill="#120726" stroke="#FFD700" stroke-width="2" />
    <circle cx="0" cy="0" r="3" fill="#FFD700" />
  </g>
  <!-- Bottom-left node -->
  <g transform="translate(224, 800)">
    <polygon points="0,-10 9,-5 9,5 0,10 -9,5 -9,-5" fill="#120726" stroke="#8B5CF6" stroke-width="2" />
    <circle cx="0" cy="0" r="3" fill="#C084FC" />
  </g>
  <!-- Bottom-right node -->
  <g transform="translate(800, 800)">
    <polygon points="0,-10 9,-5 9,5 0,10 -9,5 -9,-5" fill="#120726" stroke="#8B5CF6" stroke-width="2" />
    <circle cx="0" cy="0" r="3" fill="#C084FC" />
  </g>
</svg>
`;

async function generate() {
  await sharp(Buffer.from(svgFrame))
    .png({ compressionLevel: 9 })
    .toFile(outputPath);
  console.log(`Generated official transparent frame at ${outputPath}`);
}

generate().catch(console.error);
