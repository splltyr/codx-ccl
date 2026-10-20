# CODX // FEU Diliman

> Web platform and member portal for **CODX** (the 2nd generation of **APD** - Association of Programmers & Developers) at FEU Diliman.

Built this as a cybernetic single-page app with interactive canvas tools, procedural web audio, and Firebase integration.

---

##  What's in here

- **Interactive Bash Terminal (`codx bash`)**: Built-in CLI in the hero section that responds to commands like `help`, `tracks`, `pfp`, `events`, `join`, and `clear`.
- **Rocket Intro Sequence**: Scroll-driven launch sequence with particle starfield and Dextron mascot greeting.
- **PFP Frame Generator (`#pfp-forge`)**: Canvas-based avatar maker where members can upload their photo, pan/zoom, select an official CODX frame, and download an HD `.png` avatar.
- **Procedural Audio Synth (`audioSynth.js`)**: Procedural Web Audio API synth that plays a chill lofi chord progression in C# minor and click sound effects (0 audio files needed!).
- **Student Tracks & Application Form**: Application submission flow where students can register for technical committees.
- **Council Admin Portal**: Discreet dashboard (`Ctrl + Shift + A` or via footer link) to manage frames, dispatches, and member roster.
- **Firebase Sync + Offline Fallback**: Real-time Firestore sync with an automatic `localStorage` fallback so the app works during local testing or offline.

---

##  Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Graphics**: HTML5 Canvas 2D
- **Sound**: Web Audio API
- **Backend / Database**: Google Firebase (Firestore & Auth)

---

##  Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production
```bash
npm run build
npm run preview
```

---

##  Project Structure

```
├── public/
│   └── assets/           # Logos, mascots, transparent frame overlays
├── src/
│   ├── components/       # Main UI sections and modals
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── TerminalIntro.jsx
│   │   ├── RocketIntroSequence.jsx
│   │   ├── PfpGenerator.jsx
│   │   ├── AdminPortal.jsx
│   │   └── ...
│   ├── services/
│   │   └── firebaseService.js   # Firestore / Auth client & local cache
│   ├── utils/
│   │   └── audioSynth.js        # Web Audio API lofi synth loop
│   ├── App.jsx
│   └── main.jsx
├── scripts/              # Utility scripts for asset processing
└── package.json
```

---

Made for FEU Diliman students.
