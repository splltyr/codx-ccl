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
  ARTICLES: 'codx_test_v5_articles',
  TEAM: 'codx_test_v5_team',
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
    nickname: 'Juan',
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

// official degree programs & academic specializations (FEU Diliman College of Computer Studies)
const INITIAL_ARTICLES = [
  {
    id: 'art-ccs-1',
    title: 'BS in Computer Science (BSCS)',
    programCode: 'BSCS',
    specialization: 'Software Engineering',
    category: 'Academic Program Spotlight',
    badge: 'SOFTWARE ENGINEERING',
    date: 'FEU DILIMAN CCS',
    author: 'College of Computer Studies',
    readTime: '4-Year Degree',
    focus: 'Algorithmic foundations, large-scale software design, application development, and mobile programming.',
    excerpt: 'Algorithmic foundations, large-scale software design, application development, and mobile programming.',
    content: 'The Bachelor of Science in Computer Science (BSCS) with specialization in Software Engineering at FEU Diliman equips students with rigorous algorithmic foundations, architectural patterns for large-scale software design, enterprise and cloud application development, and modern mobile programming frameworks. The program prepares graduates to become software architects, systems engineers, and technology leaders in global tech environments.',
    imageUrl: null,
    iconType: 'code',
    tags: ['SoftwareEngineering', 'Algorithms', 'ApplicationDesign', 'MobileDev'],
    linkUrl: '#contact',
    linkLabel: null,
    facebookUrl: ''
  },
  {
    id: 'art-ccs-2',
    title: 'BS in Information Technology (BSIT) - Cybersecurity Track',
    programCode: 'BSIT',
    specialization: 'Cybersecurity (New)',
    category: 'Academic Program Spotlight',
    badge: 'CYBER DEFENSE',
    date: 'FEU DILIMAN CCS',
    author: 'College of Computer Studies',
    readTime: '4-Year Degree',
    focus: 'Managing threat vulnerabilities, network security, and organization infrastructure defense.',
    excerpt: 'Managing threat vulnerabilities, network security, and organization infrastructure defense.',
    content: 'The BS in Information Technology (BSIT) Cybersecurity track is FEU Diliman\'s state-of-the-art specialization designed to confront modern threat landscapes. Students master proactive vulnerability assessment, penetration testing, defensive network operations, incident response, digital forensics, and zero-trust organizational infrastructure protection.',
    imageUrl: null,
    iconType: 'security',
    tags: ['Cybersecurity', 'NetworkSecurity', 'ThreatDefense', 'Infrastructure'],
    linkUrl: '#contact',
    linkLabel: null,
    facebookUrl: ''
  },
  {
    id: 'art-ccs-3',
    title: 'BS in Information Technology (BSIT) - Animation & Game Dev Track',
    programCode: 'BSIT',
    specialization: 'Animation and Game Development',
    category: 'Academic Program Spotlight',
    badge: 'CREATIVE TECH',
    date: 'FEU DILIMAN CCS',
    author: 'College of Computer Studies',
    readTime: '4-Year Degree',
    focus: 'Covers 3D animation environments and game design practices.',
    excerpt: 'Covers 3D animation environments and game design practices.',
    content: 'The Animation and Game Development specialization empowers students to design and build immersive interactive digital experiences. The curriculum covers 3D animation environments, character rigging, procedural rendering engines, physics simulations, sound design, and industry-standard game design practices across console, PC, and mobile platforms.',
    imageUrl: null,
    iconType: 'gaming',
    tags: ['Animation', 'GameDevelopment', '3DEnvironments', 'GameDesign'],
    linkUrl: '#contact',
    linkLabel: null,
    facebookUrl: ''
  },
  {
    id: 'art-ccs-4',
    title: 'BS in Information Technology (BSIT) - Web & Mobile Applications Track',
    programCode: 'BSIT',
    specialization: 'Web and Mobile Applications',
    category: 'Academic Program Spotlight',
    badge: 'COMMERCIAL TECH',
    date: 'FEU DILIMAN CCS',
    author: 'College of Computer Studies',
    readTime: '4-Year Degree',
    focus: 'Focuses on commercial tech deployment, software integration, and real-world system implementations.',
    excerpt: 'Focuses on commercial tech deployment, software integration, and real-world system implementations.',
    content: 'The Web and Mobile Applications track focuses on high-impact commercial tech deployment, cross-platform mobile engineering, cloud systems integration, full-stack microservice architectures, and real-world enterprise implementations. Students gain the agile engineering skills required to build, test, and ship mission-critical digital products.',
    imageUrl: null,
    iconType: 'web',
    tags: ['WebApps', 'MobileApps', 'SoftwareIntegration', 'CommercialTech'],
    linkUrl: '#contact',
    linkLabel: null,
    facebookUrl: ''
  }
];

// Complete Member Directory & Leadership Roster
const INITIAL_TEAM = [
  {
    id: 'member-1',
    name: 'John Paul',
    role: 'Group Creator & Founder',
    division: 'CODX Executive Leadership',
    badge: 'GROUP CREATOR',
    bio: 'Founder and group creator of CODX (2nd Generation of APD) at FEU Diliman.',
    github: '',
    linkedin: '',
    facebook: '',
    website: '',
    avatar: null,
    tags: ['Founder', 'Leadership', 'CODX']
  },
  {
    id: 'member-2',
    name: 'Falqueza Lindbergh',
    role: 'Council Administrator',
    division: 'CODX Executive Administration',
    badge: 'ADMIN',
    bio: 'Executive administrator guiding technical operations and student community governance at CODX.',
    github: '',
    linkedin: '',
    facebook: '',
    website: '',
    avatar: null,
    tags: ['Admin', 'Operations', 'CODX']
  },
  {
    id: 'member-3',
    name: 'Paul Ladera',
    role: 'Council Administrator',
    division: 'CODX Executive Administration',
    badge: 'ADMIN',
    bio: 'Executive administrator overseeing engineering standards, infrastructure, and member coordination.',
    github: '',
    linkedin: '',
    facebook: '',
    website: '',
    avatar: null,
    tags: ['Admin', 'Systems', 'CODX']
  },
  {
    id: 'member-4',
    name: 'Richmond Mones',
    role: 'Council Administrator',
    division: 'CODX Executive Administration',
    badge: 'ADMIN',
    bio: 'Executive administrator supporting organizational initiatives, technical tracks, and events.',
    github: '',
    linkedin: '',
    facebook: '',
    website: '',
    avatar: null,
    tags: ['Admin', 'Community', 'CODX']
  },
  {
    id: 'member-5',
    name: 'Aldous Ali',
    role: 'Member',
    division: 'College of Computer Studies',
    badge: 'MEMBER',
    bio: 'Student member of the CODX engineering and technology collective at FEU Diliman.',
    github: '',
    linkedin: '',
    facebook: '',
    website: '',
    avatar: null,
    tags: ['Member', 'CCS', 'CODX']
  },
  {
    id: 'member-6',
    name: 'Avery Tolentino',
    role: 'Member',
    division: 'College of Computer Studies',
    badge: 'MEMBER',
    bio: 'Student member of the CODX engineering and technology collective at FEU Diliman.',
    github: '',
    linkedin: '',
    facebook: '',
    website: '',
    avatar: null,
    tags: ['Member', 'CCS', 'CODX']
  },
  {
    id: 'member-7',
    name: 'Benedict Navarro',
    role: 'Member',
    division: 'College of Computer Studies',
    badge: 'MEMBER',
    bio: 'Student member of the CODX engineering and technology collective at FEU Diliman.',
    github: '',
    linkedin: '',
    facebook: '',
    website: '',
    avatar: null,
    tags: ['Member', 'CCS', 'CODX']
  },
  {
    id: 'member-8',
    name: 'Giulia Villanueva',
    role: 'Member',
    division: 'College of Computer Studies',
    badge: 'MEMBER',
    bio: 'Student member of the CODX engineering and technology collective at FEU Diliman.',
    github: '',
    linkedin: '',
    facebook: '',
    website: '',
    avatar: null,
    tags: ['Member', 'CCS', 'CODX']
  },
  {
    id: 'member-9',
    name: 'Jao Baria',
    role: 'Member',
    division: 'College of Computer Studies',
    badge: 'MEMBER',
    bio: 'Student member of the CODX engineering and technology collective at FEU Diliman.',
    github: '',
    linkedin: '',
    facebook: '',
    website: '',
    avatar: null,
    tags: ['Member', 'CCS', 'CODX']
  },
  {
    id: 'member-10',
    name: 'Joshua Cruz',
    role: 'Member',
    division: 'College of Computer Studies',
    badge: 'MEMBER',
    bio: 'Student member of the CODX engineering and technology collective at FEU Diliman.',
    github: '',
    linkedin: '',
    facebook: '',
    website: '',
    avatar: null,
    tags: ['Member', 'CCS', 'CODX']
  },
  {
    id: 'member-11',
    name: 'Karl Fernandez',
    role: 'Member',
    division: 'College of Computer Studies',
    badge: 'MEMBER',
    bio: 'Student member of the CODX engineering and technology collective at FEU Diliman.',
    github: '',
    linkedin: '',
    facebook: '',
    website: '',
    avatar: null,
    tags: ['Member', 'CCS', 'CODX']
  },
  {
    id: 'member-12',
    name: 'Ken Jay',
    role: 'Member',
    division: 'College of Computer Studies',
    badge: 'MEMBER',
    bio: 'Student member of the CODX engineering and technology collective at FEU Diliman.',
    github: '',
    linkedin: '',
    facebook: '',
    website: '',
    avatar: null,
    tags: ['Member', 'CCS', 'CODX']
  },
  {
    id: 'member-13',
    name: 'Lariza Chiles Mamon',
    role: 'Member',
    division: 'College of Computer Studies',
    badge: 'MEMBER',
    bio: 'Student member of the CODX engineering and technology collective at FEU Diliman.',
    github: '',
    linkedin: '',
    facebook: '',
    website: '',
    avatar: null,
    tags: ['Member', 'CCS', 'CODX']
  },
  {
    id: 'member-14',
    name: 'Lim Francisco',
    role: 'Member',
    division: 'College of Computer Studies',
    badge: 'MEMBER',
    bio: 'Student member of the CODX engineering and technology collective at FEU Diliman.',
    github: '',
    linkedin: '',
    facebook: '',
    website: '',
    avatar: null,
    tags: ['Member', 'CCS', 'CODX']
  },
  {
    id: 'member-15',
    name: 'Luigi Bautista',
    role: 'Member',
    division: 'College of Computer Studies',
    badge: 'MEMBER',
    bio: 'Student member of the CODX engineering and technology collective at FEU Diliman.',
    github: '',
    linkedin: '',
    facebook: '',
    website: '',
    avatar: null,
    tags: ['Member', 'CCS', 'CODX']
  },
  {
    id: 'member-16',
    name: 'Michael Angelo Tangle',
    role: 'Member',
    division: 'College of Computer Studies',
    badge: 'MEMBER',
    bio: 'Student member of the CODX engineering and technology collective at FEU Diliman.',
    github: '',
    linkedin: '',
    facebook: '',
    website: '',
    avatar: null,
    tags: ['Member', 'CCS', 'CODX']
  },
  {
    id: 'member-17',
    name: 'Mikaella Delos Santos',
    role: 'Member',
    division: 'College of Computer Studies',
    badge: 'MEMBER',
    bio: 'Student member of the CODX engineering and technology collective at FEU Diliman.',
    github: '',
    linkedin: '',
    facebook: '',
    website: '',
    avatar: null,
    tags: ['Member', 'CCS', 'CODX']
  },
  {
    id: 'member-18',
    name: 'Noni Mendoza',
    role: 'Member',
    division: 'College of Computer Studies',
    badge: 'MEMBER',
    bio: 'Student member of the CODX engineering and technology collective at FEU Diliman.',
    github: '',
    linkedin: '',
    facebook: '',
    website: '',
    avatar: null,
    tags: ['Member', 'CCS', 'CODX']
  },
  {
    id: 'member-19',
    name: 'Raphael Lysander Navarro',
    role: 'Member',
    division: 'College of Computer Studies',
    badge: 'MEMBER',
    bio: 'Student member of the CODX engineering and technology collective at FEU Diliman.',
    github: '',
    linkedin: '',
    facebook: '',
    website: '',
    avatar: null,
    tags: ['Member', 'CCS', 'CODX']
  },
  {
    id: 'member-20',
    name: 'Reneanne Guilas',
    role: 'Member',
    division: 'College of Computer Studies',
    badge: 'MEMBER',
    bio: 'Student member of the CODX engineering and technology collective at FEU Diliman.',
    github: '',
    linkedin: '',
    facebook: '',
    website: '',
    avatar: null,
    tags: ['Member', 'CCS', 'CODX']
  },
  {
    id: 'member-21',
    name: 'Samantha Nicole Banagan',
    role: 'Member',
    division: 'College of Computer Studies',
    badge: 'MEMBER',
    bio: 'Student member of the CODX engineering and technology collective at FEU Diliman.',
    github: '',
    linkedin: '',
    facebook: '',
    website: '',
    avatar: null,
    tags: ['Member', 'CCS', 'CODX']
  },
  {
    id: 'member-22',
    name: 'Shaun Tiria',
    role: 'Member',
    division: 'College of Computer Studies',
    badge: 'MEMBER',
    bio: 'Student member of the CODX engineering and technology collective at FEU Diliman.',
    github: '',
    linkedin: '',
    facebook: '',
    website: '',
    avatar: null,
    tags: ['Member', 'CCS', 'CODX']
  },
  {
    id: 'member-23',
    name: 'Stephanie Estal',
    role: 'Member',
    division: 'College of Computer Studies',
    badge: 'MEMBER',
    bio: 'Student member of the CODX engineering and technology collective at FEU Diliman.',
    github: '',
    linkedin: '',
    facebook: '',
    website: '',
    avatar: null,
    tags: ['Member', 'CCS', 'CODX']
  },
  {
    id: 'member-24',
    name: 'Tim Jamison',
    role: 'Member',
    division: 'College of Computer Studies',
    badge: 'MEMBER',
    bio: 'Student member of the CODX engineering and technology collective at FEU Diliman.',
    github: '',
    linkedin: '',
    facebook: '',
    website: '',
    avatar: null,
    tags: ['Member', 'CCS', 'CODX']
  },
  {
    id: 'member-25',
    name: 'Tyrone Saplala',
    role: 'Member',
    division: 'College of Computer Studies',
    badge: 'MEMBER',
    bio: 'Student member of the CODX engineering and technology collective at FEU Diliman.',
    github: '',
    linkedin: '',
    facebook: '',
    website: '',
    avatar: null,
    tags: ['Member', 'CCS', 'CODX']
  },
  {
    id: 'member-26',
    name: 'Zoe Joy Reloj',
    role: 'Member',
    division: 'College of Computer Studies',
    badge: 'MEMBER',
    bio: 'Student member of the CODX engineering and technology collective at FEU Diliman.',
    github: '',
    linkedin: '',
    facebook: '',
    website: '',
    avatar: null,
    tags: ['Member', 'CCS', 'CODX']
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
