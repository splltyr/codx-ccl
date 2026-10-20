// firebase service + localstorage fallback so the site still works offline
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';

const STORAGE_KEYS = {
  ARTICLES: 'codx_test_v4_articles',
  TEAM: 'codx_test_v4_team',
  FRAMES: 'codx_test_v4_frames',
  TRACKS: 'codx_test_v4_tracks',
  APPLICATIONS: 'codx_test_v4_applications',
  CONFIG: 'codx_firebase_config_v2',
  ADMIN_SESSION: 'codx_admin_session_v2'
};

// default cloud config for CODX Firebase project
const DEFAULT_FIREBASE_CONFIG = {
  projectId: "codx-fb513",
  appId: "1:275514758589:web:6769112d89941d02a46ed4",
  storageBucket: "codx-fb513.firebasestorage.app",
  apiKey: "AIzaSyDX8qX0VdT1U8Y0fUgCy4kQDJ1npsvUYa8",
  authDomain: "codx-fb513.firebaseapp.com",
  messagingSenderId: "275514758589",
  measurementId: "G-1B9Y3597F6"
};

// committees / tracks for the join form
const INITIAL_TRACKS = [
  {
    id: 'track-1',
    name: 'Systems & Cloud Infrastructure',
    description: 'Backend microservices, distributed architectures, APIs, and cloud deployments'
  },
  {
    id: 'track-2',
    name: 'Intelligent Systems & Neural AI',
    description: 'Autonomous software agents, machine learning pipelines, and local AI'
  },
  {
    id: 'track-3',
    name: 'Creative Tech & Sensory UI/UX',
    description: 'Interactive web apps, Web Audio procedural engines, and Canvas 2D graphics'
  },
  {
    id: 'track-4',
    name: 'Cyber Defense & Security',
    description: 'Web security auditing, vulnerability assessments, and defense protocols'
  }
];

// applicant data
const INITIAL_APPLICATIONS = [
  {
    id: 'app-1',
    fullName: 'Juan dela Cruz',
    email: 'juan.delacruz@feudiliman.edu.ph',
    discord: '@juandc',
    year: 'Sophomore (2nd Year)',
    track: 'Systems & Cloud Infrastructure',
    interest: 'Excited to build full-stack web applications and cloud microservices with CODX fellow Tamaraws.',
    status: 'pending',
    createdAt: new Date().toISOString()
  }
];

// preset frames for the avatar generator
const INITIAL_FRAMES = [
  {
    id: 'frame-1',
    title: 'CODX Gen-2 Official Apex',
    event: 'FEU Diliman Org Official',
    badge: 'SIGNATURE 2026',
    accentColor: '#a855f7',
    styleType: 'neon-apex',
    description: 'Minimalist neon violet edge with FEU Diliman CODX insignia'
  },
  {
    id: 'frame-2',
    title: 'FEU Tamaraw Tech Week 2026',
    event: 'Campus Tech Festival',
    badge: 'FEU DILIMAN',
    accentColor: '#fbbf24',
    styleType: 'feu-gold',
    description: 'Gold & green ambient neon ring celebrating FEU Diliman innovation'
  },
  {
    id: 'frame-3',
    title: 'Dextron Cybernetic Visor',
    event: 'Mascot Edition',
    badge: 'DEXTRON // IT',
    accentColor: '#818cf8',
    styleType: 'dextron-visor',
    description: 'Futuristic frosted cybernetic ring modeled after Dextron’s visor'
  },
  {
    id: 'frame-4',
    title: 'HackDiliman 2026 Vanguard',
    event: 'Flagship Hackathon',
    badge: 'HACKER ELITE',
    accentColor: '#ec4899',
    styleType: 'hack-vanguard',
    description: 'Geometric faceted frosted bevel for registered hackathon contenders'
  },
  {
    id: 'frame-5',
    title: 'General Assembly // Member Pass',
    event: 'Semester Induction',
    badge: 'MEMBER PASS',
    accentColor: '#38bdf8',
    styleType: 'aurora-minimal',
    description: 'Ultra-thin frosted glass rim with holographic member stamp'
  },
  {
    id: 'frame-6',
    title: 'CODX Official Member Frame',
    event: 'FEU Diliman Edition',
    badge: 'MEMBER PASS',
    accentColor: '#FFD700',
    styleType: 'custom-png',
    overlayUrl: '/assets/frame.png',
    description: 'Official transparent cybernetic member frame with gold & purple accents'
  }
];

// announcements & event posts
const INITIAL_ARTICLES = [
  {
    id: 'art-1',
    title: 'HackDiliman 2026: Campus Software & AI Sprint',
    category: 'Hackathon',
    badge: 'FLAGSHIP EVENT',
    date: 'NOV 14-16, 2026',
    author: 'CODX Engineering Council',
    readTime: '3 min read',
    excerpt: 'Join FEU Diliman Tamaraw developers for an intensive 48-hour build sprint across cloud, AI, and creative web technology.',
    content: 'HackDiliman brings together the brightest student developers and designers across FEU Diliman to collaborate on practical open-source tools, campus solutions, and cutting-edge software experiments.',
    imageUrl: null,
    tags: ['Hackathon', 'FEUDiliman', 'AI', 'Fullstack'],
    linkUrl: '',
    linkLabel: 'LEARN MORE',
    facebookUrl: ''
  },
  {
    id: 'art-2',
    title: 'CODX v2.0 Architecture: Zero-Asset Procedural Audio & Canvas',
    category: 'Engineering',
    badge: 'TECH DISPATCH',
    date: 'OCT 20, 2026',
    author: 'Systems & Creative Tech',
    readTime: '4 min read',
    excerpt: 'How we built the official CODX digital home with pure Web Audio API synthesis and real-time HTML5 Canvas 2D graphics.',
    content: 'By replacing bloated external media files with procedural oscillator loops and math-driven Canvas rendering, CODX loads instantly on campus networks with zero lag.',
    imageUrl: null,
    tags: ['WebAudio', 'Canvas2D', 'React19', 'Performance'],
    linkUrl: '',
    linkLabel: 'READ SPECS',
    facebookUrl: ''
  },
  {
    id: 'art-3',
    title: 'Call for Apprentices: General Assembly & Committee Selection',
    category: 'Notice',
    badge: 'MEMBERSHIP',
    date: 'NOV 28, 2026',
    author: 'Executive Council',
    readTime: '2 min read',
    excerpt: 'Applications are now open for the 2026-2027 student cohorts across Systems, AI, Creative Tech, and Cyber Defense.',
    content: 'All FEU Diliman students passionate about software, cybersecurity, artificial intelligence, or sensory UI design are invited to apply.',
    imageUrl: null,
    tags: ['Assembly', 'Membership', 'Recruitment'],
    linkUrl: '',
    linkLabel: 'APPLY NOW',
    facebookUrl: ''
  }
];

// Student Leadership Roster
const INITIAL_TEAM = [
  {
    id: 'team-1',
    name: 'Alex J. Mercer',
    role: 'Executive Lead',
    division: 'Systems & Cloud Infrastructure',
    badge: 'COUNCIL PRESIDENT',
    bio: 'Lead software engineer guiding distributed architectures, cloud deployments, and student infrastructure at FEU Diliman.',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    facebook: '',
    website: '',
    avatar: null,
    tags: ['Go', 'Node.js', 'Docker', 'Firebase']
  },
  {
    id: 'team-2',
    name: 'Samantha Vance',
    role: 'Creative Interface Director',
    division: 'Creative Tech & Sensory UI/UX',
    badge: 'CREATIVE LEAD',
    bio: 'Directing sensory UI/UX, procedural audio engineering, and interactive Canvas 2D experiences for the collective.',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    facebook: '',
    website: '',
    avatar: null,
    tags: ['React 19', 'Tailwind', 'Canvas', 'Framer']
  },
  {
    id: 'team-3',
    name: 'Marcus Chen',
    role: 'AI & Neural Systems Lead',
    division: 'Intelligent Systems & Neural AI',
    badge: 'AI LEAD',
    bio: 'Researching local LLMs, neural model fine-tuning, and autonomous agent orchestration pipelines for student projects.',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    facebook: '',
    website: '',
    avatar: null,
    tags: ['Python', 'PyTorch', 'FastAPI', 'LangChain']
  },
  {
    id: 'team-4',
    name: 'Elijah Torres',
    role: 'Cyber Defense & Security Officer',
    division: 'Cyber Defense & Security',
    badge: 'SECURITY LEAD',
    bio: 'Ethical hacker and security researcher overseeing penetration testing, network audits, and student CTF training.',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    facebook: '',
    website: '',
    avatar: null,
    tags: ['Linux', 'Wireshark', 'Burp Suite', 'Zero Trust']
  }
];

class FirebaseDataService {
  constructor() {
    this.app = null;
    this.db = null;
    this.auth = null;
    this.isFirebaseReady = false;
    this.listeners = {
      articles: [],
      team: [],
      frames: [],
      tracks: [],
      applications: []
    };
    this.init();
  }

  init() {
    const savedConfig = this.getFirebaseConfig();
    if (savedConfig && savedConfig.apiKey && savedConfig.projectId) {
      try {
        if (!getApps().length) {
          this.app = initializeApp(savedConfig);
        } else {
          this.app = getApp();
        }
        this.db = getFirestore(this.app);
        this.auth = getAuth(this.app);
        this.isFirebaseReady = true;
      } catch (err) {
        console.warn('[CODX Firebase] Cloud initialization fallback:', err);
        this.isFirebaseReady = false;
      }
    }

    // seed localstorage with defaults so dev mode works right away
    try {
      const storedArticles = localStorage.getItem(STORAGE_KEYS.ARTICLES);
      if (!storedArticles) {
        localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(INITIAL_ARTICLES));
      } else {
        const parsed = JSON.parse(storedArticles);
        const cleaned = parsed.map(a => {
          if (a.imageUrl && a.imageUrl.includes('/assets/')) {
            return { ...a, imageUrl: null };
          }
          return a;
        });
        localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(cleaned));
      }

      const storedTeam = localStorage.getItem(STORAGE_KEYS.TEAM);
      if (!storedTeam) {
        localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(INITIAL_TEAM));
      } else {
        const parsedTeam = JSON.parse(storedTeam);
        const cleanedTeam = parsedTeam.map(m => {
          if (m.avatar && m.avatar.includes('/assets/')) {
            return { ...m, avatar: null };
          }
          return m;
        });
        localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(cleanedTeam));
      }

      const storedFrames = localStorage.getItem(STORAGE_KEYS.FRAMES);
      if (!storedFrames) {
        localStorage.setItem(STORAGE_KEYS.FRAMES, JSON.stringify(INITIAL_FRAMES));
      } else {
        const parsedFrames = JSON.parse(storedFrames);
        const cleanedFrames = parsedFrames.map(f => {
          if (f.overlayUrl && f.overlayUrl.includes('logo pin.png')) {
            return { ...f, overlayUrl: '/assets/frame.png', title: 'CODX Official Member Frame' };
          }
          return f;
        });
        localStorage.setItem(STORAGE_KEYS.FRAMES, JSON.stringify(cleanedFrames));
      }

      if (!localStorage.getItem(STORAGE_KEYS.TRACKS)) {
        localStorage.setItem(STORAGE_KEYS.TRACKS, JSON.stringify(INITIAL_TRACKS));
      }

      if (!localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
      }
    } catch (e) {
      console.warn('Storage sync issue:', e);
    }
  }

  getFirebaseConfig() {
    try {
      const cfg = localStorage.getItem(STORAGE_KEYS.CONFIG);
      return cfg ? JSON.parse(cfg) : null;
    } catch {
      return null;
    }
  }

  saveFirebaseConfig(config) {
    if (config) {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CONFIG);
    }
    this.init();
  }

  // frames
  subscribeFrames(callback) {
    this.listeners.frames.push(callback);

    if (this.isFirebaseReady && this.db) {
      try {
        const colRef = collection(this.db, 'frames');
        const unsub = onSnapshot(colRef, (snap) => {
          if (!snap.empty) {
            const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            callback(items);
          } else {
            callback(this.getLocalFrames());
          }
        }, () => callback(this.getLocalFrames()));
        return unsub;
      } catch (e) {
        console.warn('Frames snapshot fallback:', e);
      }
    }

    callback(this.getLocalFrames());

    const handleStorage = (e) => {
      if (e.key === STORAGE_KEYS.FRAMES) {
        callback(this.getLocalFrames());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      this.listeners.frames = this.listeners.frames.filter(cb => cb !== callback);
      window.removeEventListener('storage', handleStorage);
    };
  }

  getLocalFrames() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FRAMES);
      return data ? JSON.parse(data) : INITIAL_FRAMES;
    } catch {
      return INITIAL_FRAMES;
    }
  }

  async addFrame(frameData) {
    const newFrame = {
      ...frameData,
      id: 'frame-' + Date.now()
    };

    if (this.isFirebaseReady && this.db) {
      try {
        const colRef = collection(this.db, 'frames');
        const docRef = await addDoc(colRef, frameData);
        newFrame.id = docRef.id;
      } catch (err) {
        console.warn('Add frame Firestore fallback:', err);
      }
    }

    const current = this.getLocalFrames();
    const updated = [newFrame, ...current];
    localStorage.setItem(STORAGE_KEYS.FRAMES, JSON.stringify(updated));
    this.listeners.frames.forEach(cb => cb(updated));
    return newFrame;
  }

  async deleteFrame(id) {
    if (this.isFirebaseReady && this.db) {
      try {
        await deleteDoc(doc(this.db, 'frames', id));
      } catch (err) {
        console.warn('Delete frame Firestore fallback:', err);
      }
    }

    const current = this.getLocalFrames();
    const updated = current.filter(f => f.id !== id);
    localStorage.setItem(STORAGE_KEYS.FRAMES, JSON.stringify(updated));
    this.listeners.frames.forEach(cb => cb(updated));
    return true;
  }

  // articles & announcements
  subscribeArticles(callback) {
    this.listeners.articles.push(callback);

    if (this.isFirebaseReady && this.db) {
      try {
        const colRef = collection(this.db, 'articles');
        const unsub = onSnapshot(colRef, (snap) => {
          if (!snap.empty) {
            const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            callback(items);
          } else {
            callback(this.getLocalArticles());
          }
        }, () => callback(this.getLocalArticles()));
        return unsub;
      } catch (e) {
        console.warn('Articles snapshot fallback:', e);
      }
    }

    callback(this.getLocalArticles());

    const handleStorage = (e) => {
      if (e.key === STORAGE_KEYS.ARTICLES) {
        callback(this.getLocalArticles());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      this.listeners.articles = this.listeners.articles.filter(cb => cb !== callback);
      window.removeEventListener('storage', handleStorage);
    };
  }

  getLocalArticles() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ARTICLES);
      return data ? JSON.parse(data) : INITIAL_ARTICLES;
    } catch {
      return INITIAL_ARTICLES;
    }
  }

  async addArticle(data) {
    const newArt = { ...data, id: 'art-' + Date.now() };
    if (this.isFirebaseReady && this.db) {
      try {
        const docRef = await addDoc(collection(this.db, 'articles'), {
          ...data,
          createdAt: serverTimestamp()
        });
        newArt.id = docRef.id;
      } catch (err) {
        console.warn('Add article Firestore fallback:', err);
      }
    }
    const current = this.getLocalArticles();
    const updated = [newArt, ...current];
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(updated));
    this.listeners.articles.forEach(cb => cb(updated));
    return newArt;
  }

  async updateArticle(id, data) {
    if (this.isFirebaseReady && this.db) {
      try {
        await updateDoc(doc(this.db, 'articles', id), data);
      } catch (err) {
        console.warn('Update article Firestore fallback:', err);
      }
    }
    const current = this.getLocalArticles();
    const updated = current.map(a => a.id === id ? { ...a, ...data } : a);
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(updated));
    this.listeners.articles.forEach(cb => cb(updated));
    return true;
  }

  async deleteArticle(id) {
    if (this.isFirebaseReady && this.db) {
      try {
        await deleteDoc(doc(this.db, 'articles', id));
      } catch (err) {
        console.warn('Delete article Firestore fallback:', err);
      }
    }
    const current = this.getLocalArticles();
    const updated = current.filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(updated));
    this.listeners.articles.forEach(cb => cb(updated));
    return true;
  }

  // team / officers
  subscribeTeam(callback) {
    this.listeners.team.push(callback);

    if (this.isFirebaseReady && this.db) {
      try {
        const colRef = collection(this.db, 'team');
        const unsub = onSnapshot(colRef, (snap) => {
          if (!snap.empty) {
            const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            callback(items);
          } else {
            callback(this.getLocalTeam());
          }
        }, () => callback(this.getLocalTeam()));
        return unsub;
      } catch (e) {
        console.warn('Team snapshot fallback:', e);
      }
    }

    callback(this.getLocalTeam());

    const handleStorage = (e) => {
      if (e.key === STORAGE_KEYS.TEAM) {
        callback(this.getLocalTeam());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      this.listeners.team = this.listeners.team.filter(cb => cb !== callback);
      window.removeEventListener('storage', handleStorage);
    };
  }

  getLocalTeam() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TEAM);
      return data ? JSON.parse(data) : INITIAL_TEAM;
    } catch {
      return INITIAL_TEAM;
    }
  }

  async addTeamMember(data) {
    const newMember = { ...data, id: 'team-' + Date.now() };
    if (this.isFirebaseReady && this.db) {
      try {
        const docRef = await addDoc(collection(this.db, 'team'), data);
        newMember.id = docRef.id;
      } catch (err) {
        console.warn('Add team member Firestore fallback:', err);
      }
    }
    const current = this.getLocalTeam();
    const updated = [...current, newMember];
    localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(updated));
    this.listeners.team.forEach(cb => cb(updated));
    return newMember;
  }

  async updateTeamMember(id, data) {
    if (this.isFirebaseReady && this.db) {
      try {
        await updateDoc(doc(this.db, 'team', id), data);
      } catch (err) {
        console.warn('Update team member Firestore fallback:', err);
      }
    }
    const current = this.getLocalTeam();
    const updated = current.map(m => m.id === id ? { ...m, ...data } : m);
    localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(updated));
    this.listeners.team.forEach(cb => cb(updated));
    return true;
  }

  async deleteTeamMember(id) {
    if (this.isFirebaseReady && this.db) {
      try {
        await deleteDoc(doc(this.db, 'team', id));
      } catch (err) {
        console.warn('Delete team member Firestore fallback:', err);
      }
    }
    const current = this.getLocalTeam();
    const updated = current.filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(updated));
    this.listeners.team.forEach(cb => cb(updated));
    return true;
  }

  // student tracks
  subscribeTracks(callback) {
    this.listeners.tracks.push(callback);

    if (this.isFirebaseReady && this.db) {
      try {
        const colRef = collection(this.db, 'tracks');
        const unsub = onSnapshot(colRef, (snap) => {
          if (!snap.empty) {
            const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            callback(items);
          } else {
            callback(this.getLocalTracks());
          }
        }, () => callback(this.getLocalTracks()));
        return unsub;
      } catch (e) {
        console.warn('Tracks snapshot fallback:', e);
      }
    }

    callback(this.getLocalTracks());

    const handleStorage = (e) => {
      if (e.key === STORAGE_KEYS.TRACKS) {
        callback(this.getLocalTracks());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      this.listeners.tracks = this.listeners.tracks.filter(cb => cb !== callback);
      window.removeEventListener('storage', handleStorage);
    };
  }

  getLocalTracks() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRACKS);
      return data ? JSON.parse(data) : INITIAL_TRACKS;
    } catch {
      return INITIAL_TRACKS;
    }
  }

  async addTrack(trackData) {
    const newTrack = { ...trackData, id: 'track-' + Date.now() };
    if (this.isFirebaseReady && this.db) {
      try {
        const colRef = collection(this.db, 'tracks');
        const docRef = await addDoc(colRef, trackData);
        newTrack.id = docRef.id;
      } catch (err) {
        console.warn('Add track Firestore fallback:', err);
      }
    }
    const current = this.getLocalTracks();
    const updated = [...current, newTrack];
    localStorage.setItem(STORAGE_KEYS.TRACKS, JSON.stringify(updated));
    this.listeners.tracks.forEach(cb => cb(updated));
    return newTrack;
  }

  async updateTrack(id, data) {
    if (this.isFirebaseReady && this.db) {
      try {
        await updateDoc(doc(this.db, 'tracks', id), data);
      } catch (err) {
        console.warn('Update track Firestore fallback:', err);
      }
    }
    const current = this.getLocalTracks();
    const updated = current.map(t => t.id === id ? { ...t, ...data } : t);
    localStorage.setItem(STORAGE_KEYS.TRACKS, JSON.stringify(updated));
    this.listeners.tracks.forEach(cb => cb(updated));
    return true;
  }

  async deleteTrack(id) {
    if (this.isFirebaseReady && this.db) {
      try {
        await deleteDoc(doc(this.db, 'tracks', id));
      } catch (err) {
        console.warn('Delete track Firestore fallback:', err);
      }
    }
    const current = this.getLocalTracks();
    const updated = current.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TRACKS, JSON.stringify(updated));
    this.listeners.tracks.forEach(cb => cb(updated));
    return true;
  }

  // membership applications
  subscribeApplications(callback) {
    this.listeners.applications.push(callback);

    if (this.isFirebaseReady && this.db) {
      try {
        const colRef = collection(this.db, 'applications');
        const unsub = onSnapshot(colRef, (snap) => {
          if (!snap.empty) {
            const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            callback(items);
          } else {
            callback(this.getLocalApplications());
          }
        }, () => callback(this.getLocalApplications()));
        return unsub;
      } catch (e) {
        console.warn('Applications snapshot fallback:', e);
      }
    }

    callback(this.getLocalApplications());

    const handleStorage = (e) => {
      if (e.key === STORAGE_KEYS.APPLICATIONS) {
        callback(this.getLocalApplications());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      this.listeners.applications = this.listeners.applications.filter(cb => cb !== callback);
      window.removeEventListener('storage', handleStorage);
    };
  }

  getLocalApplications() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      return data ? JSON.parse(data) : INITIAL_APPLICATIONS;
    } catch {
      return INITIAL_APPLICATIONS;
    }
  }

  async submitApplication(appData) {
    const newApp = {
      ...appData,
      id: 'app-' + Date.now(),
      status: appData.status || 'pending',
      createdAt: appData.createdAt || new Date().toISOString()
    };

    if (this.isFirebaseReady && this.db) {
      try {
        const docRef = await addDoc(collection(this.db, 'applications'), {
          ...appData,
          status: newApp.status,
          createdAt: serverTimestamp()
        });
        newApp.id = docRef.id;
      } catch (err) {
        console.warn('Submit application Firestore fallback:', err);
      }
    }

    const current = this.getLocalApplications();
    const updated = [newApp, ...current];
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));
    this.listeners.applications.forEach(cb => cb(updated));
    return newApp;
  }

  async updateApplicationStatus(id, status) {
    if (this.isFirebaseReady && this.db) {
      try {
        await updateDoc(doc(this.db, 'applications', id), { status });
      } catch (err) {
        console.warn('Update application status Firestore fallback:', err);
      }
    }
    const current = this.getLocalApplications();
    const updated = current.map(a => a.id === id ? { ...a, status } : a);
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));
    this.listeners.applications.forEach(cb => cb(updated));
    return true;
  }

  async deleteApplication(id) {
    if (this.isFirebaseReady && this.db) {
      try {
        await deleteDoc(doc(this.db, 'applications', id));
      } catch (err) {
        console.warn('Delete application Firestore fallback:', err);
      }
    }
    const current = this.getLocalApplications();
    const updated = current.filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));
    this.listeners.applications.forEach(cb => cb(updated));
    return true;
  }

  // admin auth
  async loginAdmin(email, password) {
    if (this.isFirebaseReady && this.auth) {
      try {
        const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
        const adminUser = {
          email: userCredential.user.email,
          uid: userCredential.user.uid,
          provider: 'firebase'
        };
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(adminUser));
        return { success: true, user: adminUser };
      } catch (err) {
        console.warn('Firebase Auth fallback attempt:', err.message);
      }
    }

    if ((email === 'admin@codx.dev' && password === 'codx2026!') || 
        (email === 'feu@codx.dev' && password === 'codx2026!') ||
        (password === 'codx2026!')) {
      const adminUser = {
        email: email || 'admin@codx.dev',
        uid: 'codx-feu-' + Math.random().toString(36).substring(2, 7),
        provider: 'feu-council-key'
      };
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(adminUser));
      return { success: true, user: adminUser };
    }

    return { 
      success: false, 
      error: 'Invalid credentials. Demo Key: admin@codx.dev / codx2026!' 
    };
  }

  logoutAdmin() {
    if (this.isFirebaseReady && this.auth) {
      try { signOut(this.auth); } catch {}
    }
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  }

  getAdminSession() {
    try {
      const data = sessionStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  getFirebaseConfig() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONFIG);
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_FIREBASE_CONFIG;
  }

  saveFirebaseConfig(config) {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
      this.init();
    } catch {}
  }

  resetFactoryData() {
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(INITIAL_ARTICLES));
    localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(INITIAL_TEAM));
    localStorage.setItem(STORAGE_KEYS.FRAMES, JSON.stringify(INITIAL_FRAMES));
    localStorage.setItem(STORAGE_KEYS.TRACKS, JSON.stringify(INITIAL_TRACKS));
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
    this.listeners.articles.forEach(cb => cb(INITIAL_ARTICLES));
    this.listeners.team.forEach(cb => cb(INITIAL_TEAM));
    this.listeners.frames.forEach(cb => cb(INITIAL_FRAMES));
    this.listeners.tracks.forEach(cb => cb(INITIAL_TRACKS));
    this.listeners.applications.forEach(cb => cb(INITIAL_APPLICATIONS));
  }
}

export const firebaseData = new FirebaseDataService();
