import React, { useState, useEffect, useRef } from 'react';
import { 
  Lock, 
  Trash2, 
  Edit3, 
  X, 
  Database, 
  Users, 
  FileText, 
  Layers, 
  RefreshCw, 
  AlertCircle, 
  KeyRound,
  Plus,
  Upload,
  Image as ImageIcon,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Globe,
  UserCheck,
  Archive,
  Inbox,
  Mail,
  MessageSquare,
  Search,
  Check
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, FacebookIcon } from './BrandIcons';
import { firebaseData } from '../services/firebaseService';
import { cyberAudio } from '../utils/audioSynth';

export default function AdminPortal({ isOpen, onClose, onShowToast }) {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('admin@codx.dev');
  const [password, setPassword] = useState('codx2026!');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('articles'); // 'articles' | 'team' | 'frames' | 'applications' | 'tracks'
  const [isSyncing, setIsSyncing] = useState(false);

  // Data collections
  const [frames, setFrames] = useState([]);
  const [articles, setArticles] = useState([]);
  const [team, setTeam] = useState([]);
  const [applications, setApplications] = useState([]);
  const [tracks, setTracks] = useState([]);

  // Applications Filter & Search
  const [appFilter, setAppFilter] = useState('all'); // 'all' | 'pending' | 'approved' | 'archived'
  const [appSearch, setAppSearch] = useState('');

  // Committee / Track Form State
  const [editingTrack, setEditingTrack] = useState(null);
  const [trackForm, setTrackForm] = useState({
    name: '',
    description: ''
  });

  // File input refs
  const frameFileInputRef = useRef(null);
  const articleFileInputRef = useRef(null);
  const memberFileInputRef = useRef(null);

  // Tab 1: Event Frame Form State
  const [frameForm, setFrameForm] = useState({
    title: '',
    event: 'FEU Diliman Tech Fest',
    badge: 'EVENT 2026',
    accentColor: '#8B5CF6',
    styleType: 'custom-png',
    overlayUrl: '',
    description: ''
  });

  // Tab 2: Article Form State
  const [editingArticle, setEditingArticle] = useState(null);
  const [articleForm, setArticleForm] = useState({
    title: '',
    category: 'Hackathon',
    badge: 'FEU DILIMAN',
    date: 'NOV 2026',
    author: 'CODX Dev Team',
    readTime: '3 min read',
    excerpt: '',
    content: '',
    imageUrl: '',
    tags: 'FEU, Hackathon',
    linkUrl: '',
    linkLabel: 'VIEW DETAILS',
    facebookUrl: ''
  });

  // Tab 3: Officer / Team Form State
  const [editingMember, setEditingMember] = useState(null);
  const [memberForm, setMemberForm] = useState({
    name: '',
    role: '',
    division: 'Systems & Cloud Infrastructure',
    badge: 'COUNCIL OFFICER',
    bio: '',
    github: '',
    linkedin: '',
    facebook: '',
    website: '',
    avatar: '',
    tags: 'Systems, Fullstack'
  });

  // close on escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // live data subscriptions
  useEffect(() => {
    const currentSession = firebaseData.getAdminSession();
    setSession(currentSession);

    const unsubFrames = firebaseData.subscribeFrames(setFrames);
    const unsubArticles = firebaseData.subscribeArticles(setArticles);
    const unsubTeam = firebaseData.subscribeTeam(setTeam);
    const unsubApps = firebaseData.subscribeApplications(setApplications);
    const unsubTracks = firebaseData.subscribeTracks(setTracks);

    return () => {
      if (typeof unsubFrames === 'function') unsubFrames();
      if (typeof unsubArticles === 'function') unsubArticles();
      if (typeof unsubTeam === 'function') unsubTeam();
      if (typeof unsubApps === 'function') unsubApps();
      if (typeof unsubTracks === 'function') unsubTracks();
    };
  }, [isOpen]);

  // auth
  const handleLogin = async (e) => {
    e.preventDefault();
    cyberAudio.playClick();
    setLoginError('');

    const res = await firebaseData.loginAdmin(email, password);
    if (res.success) {
      setSession(res.user);
      cyberAudio.playChime(659, 0.3);
      if (onShowToast) onShowToast('Admin authorized. Welcome, FEU Diliman Officer.');
    } else {
      setLoginError(res.error || 'Authentication denied. Verify executive credentials.');
    }
  };

  const handleLogout = () => {
    cyberAudio.playClick();
    firebaseData.logoutAdmin();
    setSession(null);
    if (onShowToast) onShowToast('Officer logged out successfully.');
  };

  // frame upload & crud
  const handleFrameFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    cyberAudio.playClick();
    const reader = new FileReader();
    reader.onload = (event) => {
      setFrameForm((prev) => ({
        ...prev,
        overlayUrl: event.target.result,
        styleType: 'custom-png'
      }));
      if (onShowToast) onShowToast('Custom PNG overlay file loaded into preview!');
    };
    reader.readAsDataURL(file);
  };

  const handleAddFrame = async (e) => {
    e.preventDefault();
    cyberAudio.playClick();

    if (!frameForm.title.trim()) {
      alert('Please enter a frame title.');
      return;
    }

    await firebaseData.addFrame(frameForm);
    if (onShowToast) onShowToast('Official event frame overlay published to PFP Generator!');

    setFrameForm({
      title: '',
      event: 'FEU Diliman Tech Fest',
      badge: 'EVENT 2026',
      accentColor: '#a855f7',
      styleType: 'custom-png',
      overlayUrl: '',
      description: ''
    });
  };

  const handleDeleteFrame = async (id, title) => {
    if (window.confirm(`Delete official frame "${title}"?`)) {
      cyberAudio.playClick();
      await firebaseData.deleteFrame(id);
      if (onShowToast) onShowToast('Frame removed from active pool.');
    }
  };

  // articles & dispatches
  const handleArticleImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    cyberAudio.playClick();
    const reader = new FileReader();
    reader.onload = (event) => {
      setArticleForm((prev) => ({
        ...prev,
        imageUrl: event.target.result
      }));
      if (onShowToast) onShowToast('Article image uploaded!');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveArticle = async (e) => {
    e.preventDefault();
    cyberAudio.playClick();

    const payload = {
      ...articleForm,
      tags: typeof articleForm.tags === 'string'
        ? articleForm.tags.split(',').map(t => t.trim()).filter(Boolean)
        : articleForm.tags
    };

    if (editingArticle) {
      await firebaseData.updateArticle(editingArticle.id, payload);
      if (onShowToast) onShowToast('Article updated in Firestore.');
    } else {
      await firebaseData.addArticle(payload);
      if (onShowToast) onShowToast('New article published to community feed!');
    }

    setEditingArticle(null);
    setArticleForm({
      title: '',
      category: 'Hackathon',
      badge: 'FEU DILIMAN',
      date: 'NOV 2026',
      author: 'CODX Dev Team',
      readTime: '3 min read',
      excerpt: '',
      content: '',
      imageUrl: '',
      tags: 'FEU, Hackathon',
      linkUrl: '',
      linkLabel: 'VIEW DETAILS',
      facebookUrl: ''
    });
  };

  const handleDeleteArticle = async (id, title) => {
    if (window.confirm(`Delete article "${title}"?`)) {
      cyberAudio.playClick();
      await firebaseData.deleteArticle(id);
      if (onShowToast) onShowToast('Article deleted.');
    }
  };

  // team roster
  const handleMemberAvatarUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    cyberAudio.playClick();
    const reader = new FileReader();
    reader.onload = (event) => {
      setMemberForm((prev) => ({
        ...prev,
        avatar: event.target.result
      }));
      if (onShowToast) onShowToast('Officer avatar loaded!');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveMember = async (e) => {
    e.preventDefault();
    cyberAudio.playClick();

    const payload = {
      ...memberForm,
      tags: typeof memberForm.tags === 'string'
        ? memberForm.tags.split(',').map(t => t.trim()).filter(Boolean)
        : memberForm.tags
    };

    if (editingMember) {
      await firebaseData.updateTeamMember(editingMember.id, payload);
      if (onShowToast) onShowToast('Officer profile updated.');
    } else {
      await firebaseData.addTeamMember(payload);
      if (onShowToast) onShowToast('New officer added to FEU Diliman roster.');
    }

    setEditingMember(null);
    setMemberForm({
      name: '',
      role: '',
      division: 'Systems & Cloud Architecture',
      badge: 'FEU DILIMAN EXEC',
      bio: '',
      github: '',
      linkedin: '',
      facebook: '',
      website: '',
      avatar: '',
      tags: 'Fullstack, FEU'
    });
  };

  const handleDeleteMember = async (id, name) => {
    if (window.confirm(`Remove officer "${name}" from directory?`)) {
      cyberAudio.playClick();
      await firebaseData.deleteTeamMember(id);
      if (onShowToast) onShowToast('Officer removed.');
    }
  };

  // applications
  const handleApproveApp = async (id) => {
    cyberAudio.playClick();
    await firebaseData.updateApplicationStatus(id, 'approved');
    if (onShowToast) onShowToast('Application approved.');
  };

  const handleArchiveApp = async (id) => {
    cyberAudio.playClick();
    await firebaseData.updateApplicationStatus(id, 'archived');
    if (onShowToast) onShowToast('Application archived.');
  };

  const handleDeleteApp = async (id, name) => {
    if (window.confirm(`Delete membership application for "${name}"?`)) {
      cyberAudio.playClick();
      await firebaseData.deleteApplication(id);
      if (onShowToast) onShowToast('Application deleted.');
    }
  };

  // committee tracks
  const handleSaveTrack = async (e) => {
    e.preventDefault();
    if (!trackForm.name.trim()) return;
    cyberAudio.playClick();

    if (editingTrack) {
      await firebaseData.updateTrack(editingTrack.id, trackForm);
      setEditingTrack(null);
      if (onShowToast) onShowToast('Committee track updated!');
    } else {
      await firebaseData.addTrack(trackForm);
      if (onShowToast) onShowToast('New committee track added!');
    }
    setTrackForm({ name: '', description: '' });
  };

  const handleDeleteTrack = async (id, name) => {
    if (window.confirm(`Delete committee track "${name}"?`)) {
      cyberAudio.playClick();
      await firebaseData.deleteTrack(id);
      if (onShowToast) onShowToast('Committee track deleted.');
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all frames, articles, officers, tracks, and applications back to FEU Diliman factory defaults?')) {
      cyberAudio.playClick();
      firebaseData.resetFactoryData();
      if (onShowToast) onShowToast('Factory defaults restored.');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="glass-panel max-w-5xl w-full max-h-[92vh] flex flex-col rounded-3xl border border-white/15 overflow-hidden shadow-2xl">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-white/[0.02] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#120726]/80 border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.2)]">
              <KeyRound className="w-5 h-5 text-[#FFD700]" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="admin-modal-title" className="font-['Space_Grotesk'] font-bold text-white text-base">
                  CODX ADMIN DASHBOARD
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF7A00]/15 text-[#FFD700] border border-[#FFD700]/30 font-semibold">
                  FEU DILIMAN
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                {session ? `Authenticated as: ${session.email}` : 'Executive Officer Clearance Required'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {session && (
              <button
                onClick={handleLogout}
                className="min-h-[38px] px-4 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:text-white text-xs font-mono hover:bg-rose-500/25 transition-colors"
              >
                LOGOUT
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close Admin Portal"
              className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {!session ? (
            /* Secure Firebase Auth Login Screen */
            <div className="max-w-md mx-auto py-10 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#120726]/80 border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.25)]">
                <Lock className="w-6 h-6 text-[#FFD700]" aria-hidden="true" />
              </div>
              <h4 className="text-xl font-bold font-['Space_Grotesk'] text-white mb-2">
                OFFICER CLEARANCE GATEWAY
              </h4>
              <p className="text-xs text-slate-300 font-mono mb-6">
                Protected by Firebase Authentication. Authenticate with your FEU Council account.
              </p>

              {loginError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2 text-left" role="alert">
                  <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4 text-left">
                <div>
                  <label htmlFor="admin-email" className="text-xs font-mono text-slate-300 block mb-1 font-medium">
                    OFFICER EMAIL
                  </label>
                  <input
                    id="admin-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@codx.dev"
                    className="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs font-mono min-h-[44px]"
                  />
                </div>
                <div>
                  <label htmlFor="admin-password" className="text-xs font-mono text-slate-300 block mb-1 font-medium">
                    ACCESS KEY
                  </label>
                  <input
                    id="admin-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs font-mono min-h-[44px]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[46px] py-2.5 rounded-xl btn-primary-purple font-mono text-xs font-bold transition-all active:scale-[0.98]"
                >
                  AUTHENTICATE CLEARANCE
                </button>
              </form>

              <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/10 text-left text-xs font-mono text-slate-400">
                <span className="text-[#FFD700] font-bold block mb-1">DEMO EXECUTIVE CLEARANCE:</span>
                <div>Email: <span className="text-white">admin@codx.dev</span></div>
                <div>Access Key: <span className="text-white">codx2026!</span></div>
                <button
                  type="button"
                  onClick={(e) => {
                    setEmail('admin@codx.dev');
                    setPassword('codx2026!');
                    handleLogin(e);
                  }}
                  className="mt-3 w-full min-h-[36px] py-1.5 px-3 rounded-lg btn-glass-gold text-xs transition-colors cursor-pointer font-bold"
                >
                  ⚡ One-Click Executive Demo Access
                </button>
              </div>
            </div>
          ) : (
            /* Logged In Admin Dashboard */
            <div>
              {/* Navigation Tabs (Accessible, min 44px tap target) */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-white/10">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => { cyberAudio.playClick(); setActiveTab('articles'); }}
                    className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 cursor-pointer ${
                      activeTab === 'articles'
                        ? 'bg-[#6D28D9] text-white font-bold shadow-[0_0_15px_rgba(109,40,217,0.4)]'
                        : 'bg-white/[0.03] text-slate-300 hover:text-white border border-white/10'
                    }`}
                  >
                    <FileText className="w-4 h-4" aria-hidden="true" />
                    <span>Articles & Events ({articles.length})</span>
                  </button>

                  <button
                    onClick={() => { cyberAudio.playClick(); setActiveTab('team'); }}
                    className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 cursor-pointer ${
                      activeTab === 'team'
                        ? 'bg-[#6D28D9] text-white font-bold shadow-[0_0_15px_rgba(109,40,217,0.4)]'
                        : 'bg-white/[0.03] text-slate-300 hover:text-white border border-white/10'
                    }`}
                  >
                    <Users className="w-4 h-4" aria-hidden="true" />
                    <span>FEU Team Roster ({team.length})</span>
                  </button>

                  <button
                    onClick={() => { cyberAudio.playClick(); setActiveTab('frames'); }}
                    className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 cursor-pointer ${
                      activeTab === 'frames'
                        ? 'bg-[#6D28D9] text-white font-bold shadow-[0_0_15px_rgba(109,40,217,0.4)]'
                        : 'bg-white/[0.03] text-slate-300 hover:text-white border border-white/10'
                    }`}
                  >
                    <Layers className="w-4 h-4" aria-hidden="true" />
                    <span>Event Frames ({frames.length})</span>
                  </button>

                  <button
                    onClick={() => { cyberAudio.playClick(); setActiveTab('applications'); }}
                    className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 cursor-pointer ${
                      activeTab === 'applications'
                        ? 'bg-[#6D28D9] text-white font-bold shadow-[0_0_15px_rgba(109,40,217,0.4)]'
                        : 'bg-white/[0.03] text-slate-300 hover:text-white border border-white/10'
                    }`}
                  >
                    <Inbox className="w-4 h-4 text-[#FFD700]" aria-hidden="true" />
                    <span>Applications ({applications.length})</span>
                    {applications.filter(a => a.status === 'pending').length > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-[#FFD700] text-black font-bold text-[10px] leading-none">
                        {applications.filter(a => a.status === 'pending').length}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => { cyberAudio.playClick(); setActiveTab('tracks'); }}
                    className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 cursor-pointer ${
                      activeTab === 'tracks'
                        ? 'bg-[#6D28D9] text-white font-bold shadow-[0_0_15px_rgba(109,40,217,0.4)]'
                        : 'bg-white/[0.03] text-slate-300 hover:text-white border border-white/10'
                    }`}
                  >
                    <Database className="w-4 h-4" aria-hidden="true" />
                    <span>Committees & Tracks ({tracks.length})</span>
                  </button>
                </div>

                <button
                  onClick={handleResetDefaults}
                  className="min-h-[38px] px-3 py-1.5 rounded-xl bg-white/[0.02] hover:bg-rose-500/15 border border-white/10 hover:border-rose-500/30 text-slate-400 hover:text-rose-300 text-xs font-mono transition-all"
                  title="Restore factory default articles, team, and frames"
                >
                  Reset Factory Data
                </button>
              </div>

              {/* TAB 1: EVENT FRAMES TAB (Upload custom PNG frame overlay files directly) */}
              {activeTab === 'frames' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Upload Form */}
                  <div className="lg:col-span-5 glass-card p-5 sm:p-6 rounded-2xl border border-white/10">
                    <h4 className="font-mono text-xs font-bold text-white mb-4 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-purple-400" aria-hidden="true" />
                      UPLOAD CUSTOM EVENT FRAME OVERLAY
                    </h4>

                    <form onSubmit={handleAddFrame} className="space-y-4 text-xs font-mono">
                      
                      {/* Direct PNG File Upload Input */}
                      <div>
                        <label className="text-slate-300 block mb-1.5 font-medium">
                          CUSTOM PNG FRAME OVERLAY FILE:
                        </label>
                        <input
                          ref={frameFileInputRef}
                          type="file"
                          accept="image/png, image/webp"
                          onChange={handleFrameFileUpload}
                          className="hidden"
                          id="frame-file-upload"
                        />
                        <button
                          type="button"
                          onClick={() => frameFileInputRef.current?.click()}
                          className="w-full min-h-[44px] py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-200 hover:text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                        >
                          <Upload className="w-4 h-4 text-purple-400" aria-hidden="true" />
                          <span>{frameForm.overlayUrl ? 'CHANGE PNG OVERLAY' : 'CHOOSE PNG FILE (TRANSPARENT)'}</span>
                        </button>

                        {/* Live Overlay Thumbnail Preview */}
                        {frameForm.overlayUrl && (
                          <div className="mt-2.5 p-2 rounded-xl bg-black/60 border border-white/10 flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-black/80 p-1 border border-purple-500/30 flex items-center justify-center overflow-hidden shrink-0">
                              <img src={frameForm.overlayUrl} alt="Overlay preview" className="w-full h-full object-contain" />
                            </div>
                            <div className="text-[11px] text-emerald-400 font-mono truncate">
                              ✓ PNG Overlay Loaded Successfully
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Frame Title */}
                      <div>
                        <label htmlFor="frame-title" className="text-slate-300 block mb-1">FRAME TITLE:</label>
                        <input
                          id="frame-title"
                          type="text"
                          required
                          value={frameForm.title}
                          onChange={(e) => setFrameForm({ ...frameForm, title: e.target.value })}
                          placeholder="e.g. FEU Diliman Cyber Vanguard 2026"
                          className="glass-input w-full px-3 py-2 rounded-xl min-h-[44px]"
                        />
                      </div>

                      {/* Event / Theme */}
                      <div>
                        <label htmlFor="frame-event" className="text-slate-300 block mb-1">EVENT / THEME:</label>
                        <input
                          id="frame-event"
                          type="text"
                          required
                          value={frameForm.event}
                          onChange={(e) => setFrameForm({ ...frameForm, event: e.target.value })}
                          placeholder="e.g. Tamaraw Tech Week"
                          className="glass-input w-full px-3 py-2 rounded-xl min-h-[44px]"
                        />
                      </div>

                      {/* Badge Text & Accent Color */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="frame-badge" className="text-slate-300 block mb-1">BADGE TEXT:</label>
                          <input
                            id="frame-badge"
                            type="text"
                            required
                            value={frameForm.badge}
                            onChange={(e) => setFrameForm({ ...frameForm, badge: e.target.value })}
                            placeholder="MEMBER PASS"
                            className="glass-input w-full px-3 py-2 rounded-xl min-h-[44px]"
                          />
                        </div>
                        <div>
                          <label htmlFor="frame-color" className="text-slate-300 block mb-1">ACCENT COLOR:</label>
                          <div className="flex items-center gap-2">
                            <input
                              id="frame-color"
                              type="text"
                              value={frameForm.accentColor}
                              onChange={(e) => setFrameForm({ ...frameForm, accentColor: e.target.value })}
                              placeholder="#a855f7"
                              className="glass-input w-full px-3 py-2 rounded-xl min-h-[44px]"
                            />
                            <input 
                              type="color" 
                              value={frameForm.accentColor || '#a855f7'}
                              onChange={(e) => setFrameForm({ ...frameForm, accentColor: e.target.value })}
                              className="w-10 h-10 rounded-xl bg-transparent border border-white/20 cursor-pointer"
                              aria-label="Color Picker"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full min-h-[44px] py-3 rounded-xl btn-primary-purple font-mono text-xs font-bold tracking-wider transition-all mt-2 active:scale-[0.98]"
                      >
                        PUBLISH TO ACTIVE FRAME SELECTOR
                      </button>
                    </form>
                  </div>

                  {/* List of Active Frames */}
                  <div className="lg:col-span-7 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-mono text-xs font-bold text-slate-300">
                        ACTIVE FRAMES IN SELECTOR POOL ({frames.length})
                      </h4>
                      <span className="text-[11px] font-mono text-slate-500">Live Synced with PFP Generator</span>
                    </div>

                    <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                      {frames.map((f) => (
                        <div
                          key={f.id}
                          className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-12 h-12 rounded-xl bg-black/60 border border-white/10 p-1 flex items-center justify-center shrink-0">
                              {f.overlayUrl ? (
                                <img src={f.overlayUrl} alt={f.title} className="w-full h-full object-contain" />
                              ) : (
                                <div 
                                  className="w-7 h-7 rounded-full border-2" 
                                  style={{ borderColor: f.accentColor || '#8B5CF6' }}
                                />
                              )}
                            </div>
                            <div className="overflow-hidden">
                              <div className="text-xs font-bold text-white font-mono truncate">{f.title}</div>
                              <div className="text-[11px] font-mono text-slate-400">
                                {f.event} • <span className="text-purple-300 font-semibold">{f.badge}</span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteFrame(f.id, f.title)}
                            aria-label={`Delete ${f.title} frame`}
                            className="min-h-[44px] min-w-[44px] p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 flex items-center justify-center transition-colors shrink-0"
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: ARTICLES & EVENTS TAB */}
              {activeTab === 'articles' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Article Form */}
                  <div className="lg:col-span-5 glass-card p-5 sm:p-6 rounded-2xl border border-white/10">
                    <h4 className="font-mono text-xs font-bold text-white mb-4 flex items-center justify-between">
                      <span>{editingArticle ? 'EDIT ARTICLE & EVENT' : 'PUBLISH NEW ARTICLE / EVENT'}</span>
                      {editingArticle && (
                        <button
                          onClick={() => {
                            setEditingArticle(null);
                            setArticleForm({
                              title: '',
                              category: 'Hackathon',
                              badge: 'FEU DILIMAN',
                              date: 'NOV 2026',
                              author: 'CODX Dev Team',
                              readTime: '3 min read',
                              excerpt: '',
                              content: '',
                              imageUrl: '',
                              tags: 'FEU, Hackathon',
                              linkUrl: '',
                              linkLabel: 'VIEW DETAILS',
                              facebookUrl: ''
                            });
                          }}
                          className="text-[11px] text-amber-300 hover:underline font-mono"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </h4>

                    <form onSubmit={handleSaveArticle} className="space-y-3.5 text-xs font-mono">
                      
                      {/* Image Upload or URL */}
                      <div>
                        <label className="text-slate-300 block mb-1 font-medium">ARTICLE COVER IMAGE:</label>
                        <input
                          ref={articleFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleArticleImageUpload}
                          className="hidden"
                          id="art-file-upload"
                        />
                        <div className="flex gap-2 mb-2">
                          <button
                            type="button"
                            onClick={() => articleFileInputRef.current?.click()}
                            className="flex-1 min-h-[44px] py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                          >
                            <Upload className="w-4 h-4 text-purple-400" aria-hidden="true" />
                            <span>UPLOAD IMAGE FILE</span>
                          </button>
                        </div>
                        <input
                          type="text"
                          value={articleForm.imageUrl}
                          onChange={(e) => setArticleForm({ ...articleForm, imageUrl: e.target.value })}
                          placeholder="or paste image URL / asset path (leave blank for solid matte)"
                          className="glass-input w-full px-3 py-2 rounded-xl min-h-[40px] text-[11px]"
                        />
                      </div>

                      {/* Title */}
                      <div>
                        <label htmlFor="art-title" className="text-slate-300 block mb-1">TITLE:</label>
                        <input
                          id="art-title"
                          type="text"
                          required
                          value={articleForm.title}
                          onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                          placeholder="e.g. Tamaraw Hackathon 2026"
                          className="glass-input w-full px-3 py-2 rounded-xl min-h-[44px]"
                        />
                      </div>

                      {/* Category & Date */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="art-cat" className="text-slate-300 block mb-1">CATEGORY:</label>
                          <select
                            id="art-cat"
                            value={articleForm.category}
                            onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })}
                            className="glass-input w-full px-3 py-2 rounded-xl bg-[#120a22] min-h-[44px]"
                          >
                            <option value="Hackathon">Hackathon</option>
                            <option value="Workshop">Workshop</option>
                            <option value="Keynote">Keynote</option>
                            <option value="Community">Community</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="art-date" className="text-slate-300 block mb-1">DATE / TIMEFRAME:</label>
                          <input
                            id="art-date"
                            type="text"
                            required
                            value={articleForm.date}
                            onChange={(e) => setArticleForm({ ...articleForm, date: e.target.value })}
                            placeholder="NOV 14-16, 2026"
                            className="glass-input w-full px-3 py-2 rounded-xl min-h-[44px]"
                          />
                        </div>
                      </div>

                      {/* Facebook Link & External Link Inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="art-fb-url" className="text-slate-300 block mb-1">FACEBOOK POST / LINK URL:</label>
                          <input
                            id="art-fb-url"
                            type="url"
                            value={articleForm.facebookUrl || ''}
                            onChange={(e) => setArticleForm({ ...articleForm, facebookUrl: e.target.value })}
                            placeholder="https://facebook.com/..."
                            className="glass-input w-full px-3 py-2 rounded-xl min-h-[44px] text-[11px]"
                          />
                        </div>
                        <div>
                          <label htmlFor="art-link-url" className="text-slate-300 block mb-1">EXTERNAL / REPO LINK URL:</label>
                          <input
                            id="art-link-url"
                            type="url"
                            value={articleForm.linkUrl}
                            onChange={(e) => setArticleForm({ ...articleForm, linkUrl: e.target.value })}
                            placeholder="https://github.com/..."
                            className="glass-input w-full px-3 py-2 rounded-xl min-h-[44px] text-[11px]"
                          />
                        </div>
                      </div>

                      {/* Excerpt */}
                      <div>
                        <label htmlFor="art-excerpt" className="text-slate-300 block mb-1">EXCERPT (SHORT DESCRIPTION):</label>
                        <textarea
                          id="art-excerpt"
                          rows={2}
                          required
                          value={articleForm.excerpt}
                          onChange={(e) => setArticleForm({ ...articleForm, excerpt: e.target.value })}
                          placeholder="Brief summary shown on the card..."
                          className="glass-input w-full px-3 py-2 rounded-xl"
                        />
                      </div>

                      {/* Full Scrollable Content */}
                      <div>
                        <label htmlFor="art-content" className="text-slate-300 block mb-1">FULL ARTICLE CONTENT (SCROLLABLE):</label>
                        <textarea
                          id="art-content"
                          rows={4}
                          value={articleForm.content}
                          onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                          placeholder="Comprehensive article details shown in the full reading modal..."
                          className="glass-input w-full px-3 py-2 rounded-xl"
                        />
                      </div>

                      {/* Tags */}
                      <div>
                        <label htmlFor="art-tags" className="text-slate-300 block mb-1">TAGS (COMMA-SEPARATED):</label>
                        <input
                          id="art-tags"
                          type="text"
                          value={articleForm.tags}
                          onChange={(e) => setArticleForm({ ...articleForm, tags: e.target.value })}
                          placeholder="FEU Diliman, AI, WebDev"
                          className="glass-input w-full px-3 py-2 rounded-xl min-h-[44px]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full min-h-[44px] py-2.5 rounded-xl btn-primary-purple font-mono text-xs font-bold tracking-wider transition-all mt-2 active:scale-[0.98]"
                      >
                        {editingArticle ? 'UPDATE ARTICLE IN FIRESTORE' : 'PUBLISH ARTICLE'}
                      </button>
                    </form>
                  </div>

                  {/* Articles Feed */}
                  <div className="lg:col-span-7 space-y-3">
                    <h4 className="font-mono text-xs font-bold text-slate-300 mb-2">
                      PUBLISHED ARTICLES & EVENTS ({articles.length})
                    </h4>

                    <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
                      {articles.map((art) => (
                        <div key={art.id} className="glass-panel p-4 rounded-2xl border border-white/10 flex items-start justify-between gap-4">
                          <div className="flex gap-3 overflow-hidden">
                            {art.imageUrl ? (
                              <img 
                                src={art.imageUrl} 
                                alt={art.title} 
                                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-xl bg-[#050508] border border-white/[0.08] flex items-center justify-center shrink-0 text-slate-500">
                                <FileText className="w-6 h-6 text-slate-500" />
                              </div>
                            )}
                            <div className="overflow-hidden space-y-1">
                              <div className="text-xs font-bold text-white font-mono leading-tight">{art.title}</div>
                              <div className="text-[11px] font-mono text-purple-300">
                                {art.category} • {art.date}
                              </div>
                              <div className="flex items-center gap-3 pt-0.5">
                                {art.facebookUrl && (
                                  <a 
                                    href={art.facebookUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-[10px] font-mono text-[#8B5CF6] hover:text-white flex items-center gap-1"
                                  >
                                    <FacebookIcon className="w-3 h-3 text-[#8B5CF6]" />
                                    <span>Facebook Post</span>
                                  </a>
                                )}
                                {art.linkUrl && (
                                  <a 
                                    href={art.linkUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-[10px] font-mono text-slate-400 hover:text-white flex items-center gap-1 truncate"
                                  >
                                    <ExternalLink className="w-3 h-3 text-slate-400" />
                                    <span className="truncate">{art.linkLabel || 'Link'}</span>
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => {
                                cyberAudio.playClick();
                                setEditingArticle(art);
                                setArticleForm({
                                  ...art,
                                  tags: Array.isArray(art.tags) ? art.tags.join(', ') : art.tags,
                                  linkUrl: art.linkUrl || '',
                                  linkLabel: art.linkLabel || 'VIEW DETAILS',
                                  facebookUrl: art.facebookUrl || ''
                                });
                              }}
                              aria-label={`Edit ${art.title}`}
                              className="min-h-[44px] min-w-[44px] p-2 rounded-xl bg-white/[0.04] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                            >
                              <Edit3 className="w-4 h-4" aria-hidden="true" />
                            </button>
                            <button
                              onClick={() => handleDeleteArticle(art.id, art.title)}
                              aria-label={`Delete ${art.title}`}
                              className="min-h-[44px] min-w-[44px] p-2 rounded-xl bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 flex items-center justify-center transition-colors"
                            >
                              <Trash2 className="w-4 h-4" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 3: FEU TEAM ROSTER TAB */}
              {activeTab === 'team' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Officer Form */}
                  <div className="lg:col-span-5 glass-card p-5 sm:p-6 rounded-2xl border border-white/10">
                    <h4 className="font-mono text-xs font-bold text-white mb-4 flex items-center justify-between">
                      <span>{editingMember ? 'UPDATE OFFICER PROFILE' : 'ADD NEW FEU OFFICER'}</span>
                      {editingMember && (
                        <button
                          onClick={() => {
                            setEditingMember(null);
                            setMemberForm({
                              name: '',
                              role: '',
                              division: 'Systems & Cloud Architecture',
                              badge: 'FEU DILIMAN EXEC',
                              bio: '',
                              github: '',
                              linkedin: '',
                              facebook: '',
                              website: '',
                              avatar: '',
                              tags: 'Fullstack, FEU'
                            });
                          }}
                          className="text-[11px] text-amber-300 hover:underline font-mono"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </h4>

                    <form onSubmit={handleSaveMember} className="space-y-3.5 text-xs font-mono">
                      
                      {/* Avatar Upload or URL */}
                      <div>
                        <label className="text-slate-300 block mb-1 font-medium">OFFICER AVATAR / PHOTO:</label>
                        <input
                          ref={memberFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleMemberAvatarUpload}
                          className="hidden"
                          id="member-avatar-upload"
                        />
                        <button
                          type="button"
                          onClick={() => memberFileInputRef.current?.click()}
                          className="w-full min-h-[44px] py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98] mb-2"
                        >
                          <Upload className="w-4 h-4 text-purple-400" aria-hidden="true" />
                          <span>UPLOAD AVATAR FILE</span>
                        </button>
                        <input
                          type="text"
                          value={memberForm.avatar}
                          onChange={(e) => setMemberForm({ ...memberForm, avatar: e.target.value })}
                          placeholder="or avatar image URL (leave blank for solid matte)"
                          className="glass-input w-full px-3 py-2 rounded-xl min-h-[40px] text-[11px]"
                        />
                      </div>

                      {/* Name & Role */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="member-name" className="text-slate-300 block mb-1">FULL NAME:</label>
                          <input
                            id="member-name"
                            type="text"
                            required
                            value={memberForm.name}
                            onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                            placeholder="e.g. Tyrone Vance"
                            className="glass-input w-full px-3 py-2 rounded-xl min-h-[44px]"
                          />
                        </div>
                        <div>
                          <label htmlFor="member-role" className="text-slate-300 block mb-1">ROLE / TITLE:</label>
                          <input
                            id="member-role"
                            type="text"
                            required
                            value={memberForm.role}
                            onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                            placeholder="Executive President"
                            className="glass-input w-full px-3 py-2 rounded-xl min-h-[44px]"
                          />
                        </div>
                      </div>

                      {/* Division & Badge */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="member-div" className="text-slate-300 block mb-1">DEPARTMENT / DIVISION:</label>
                          <input
                            id="member-div"
                            type="text"
                            value={memberForm.division}
                            onChange={(e) => setMemberForm({ ...memberForm, division: e.target.value })}
                            placeholder="Systems & Cloud Architecture"
                            className="glass-input w-full px-3 py-2 rounded-xl min-h-[44px]"
                          />
                        </div>
                        <div>
                          <label htmlFor="member-badge" className="text-slate-300 block mb-1">BADGE:</label>
                          <input
                            id="member-badge"
                            type="text"
                            value={memberForm.badge}
                            onChange={(e) => setMemberForm({ ...memberForm, badge: e.target.value })}
                            placeholder="FEU DILIMAN EXEC"
                            className="glass-input w-full px-3 py-2 rounded-xl min-h-[44px]"
                          />
                        </div>
                      </div>

                      {/* Customizable Social Profile Links */}
                      <div className="space-y-2 pt-1 border-t border-white/[0.06]">
                        <div className="text-[11px] font-bold text-slate-300 mb-1">CUSTOMIZABLE SOCIAL PROFILE LINKS:</div>
                        
                        <div className="flex items-center gap-2">
                          <FacebookIcon className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                          <input
                            type="url"
                            value={memberForm.facebook}
                            onChange={(e) => setMemberForm({ ...memberForm, facebook: e.target.value })}
                            placeholder="Facebook Profile URL"
                            className="glass-input w-full px-3 py-1.5 rounded-xl min-h-[40px] text-[11px]"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <GithubIcon className="w-4 h-4 text-slate-400 shrink-0" />
                          <input
                            type="url"
                            value={memberForm.github}
                            onChange={(e) => setMemberForm({ ...memberForm, github: e.target.value })}
                            placeholder="GitHub Profile URL"
                            className="glass-input w-full px-3 py-1.5 rounded-xl min-h-[40px] text-[11px]"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <LinkedinIcon className="w-4 h-4 text-slate-400 shrink-0" />
                          <input
                            type="url"
                            value={memberForm.linkedin}
                            onChange={(e) => setMemberForm({ ...memberForm, linkedin: e.target.value })}
                            placeholder="LinkedIn Profile URL"
                            className="glass-input w-full px-3 py-1.5 rounded-xl min-h-[40px] text-[11px]"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                          <input
                            type="url"
                            value={memberForm.website}
                            onChange={(e) => setMemberForm({ ...memberForm, website: e.target.value })}
                            placeholder="Personal Website / Portfolio URL"
                            className="glass-input w-full px-3 py-1.5 rounded-xl min-h-[40px] text-[11px]"
                          />
                        </div>
                      </div>

                      {/* Bio */}
                      <div>
                        <label htmlFor="member-bio" className="text-slate-300 block mb-1">BIOGRAPHY:</label>
                        <textarea
                          id="member-bio"
                          rows={2}
                          value={memberForm.bio}
                          onChange={(e) => setMemberForm({ ...memberForm, bio: e.target.value })}
                          placeholder="Brief technical biography and focus areas..."
                          className="glass-input w-full px-3 py-2 rounded-xl"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full min-h-[44px] py-2.5 rounded-xl btn-primary-purple font-mono text-xs font-bold tracking-wider transition-all mt-2 active:scale-[0.98]"
                      >
                        {editingMember ? 'SAVE OFFICER CHANGES' : 'ADD TO FEU ROSTER'}
                      </button>
                    </form>
                  </div>

                  {/* Team List */}
                  <div className="lg:col-span-7 space-y-3">
                    <h4 className="font-mono text-xs font-bold text-slate-300 mb-2">
                      FEU DILIMAN EXECUTIVE DIRECTORY ({team.length})
                    </h4>

                    <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
                      {team.map((m) => (
                        <div key={m.id} className="glass-panel p-4 rounded-2xl border border-white/10 flex items-start justify-between gap-4">
                          <div className="flex gap-3 overflow-hidden">
                            {m.avatar ? (
                              <img 
                                src={m.avatar} 
                                alt={m.name} 
                                className="w-14 h-14 rounded-full object-cover shrink-0 border border-purple-500/30"
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-full bg-[#050508] border border-white/[0.08] flex items-center justify-center shrink-0 font-bold text-sm text-[#FFD700]">
                                {m.name ? m.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'FEU'}
                              </div>
                            )}
                            <div className="overflow-hidden space-y-0.5">
                              <div className="text-xs font-bold text-white font-mono">{m.name}</div>
                              <div className="text-[11px] font-mono text-purple-300">{m.role} • {m.division}</div>
                              <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2 pt-1">
                                {m.facebook && <span className="text-[#8B5CF6]">FB</span>}
                                {m.github && <span>• <span className="hover:text-white">GitHub</span></span>}
                                {m.linkedin && <span>• <span className="hover:text-white">LinkedIn</span></span>}
                                {m.website && <span>• <span className="hover:text-white">Portfolio</span></span>}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => {
                                cyberAudio.playClick();
                                setEditingMember(m);
                                setMemberForm({
                                  ...m,
                                  tags: Array.isArray(m.tags) ? m.tags.join(', ') : m.tags,
                                  facebook: m.facebook || '',
                                  github: m.github || '',
                                  linkedin: m.linkedin || '',
                                  website: m.website || ''
                                });
                              }}
                              aria-label={`Edit ${m.name}`}
                              className="min-h-[44px] min-w-[44px] p-2 rounded-xl bg-white/[0.04] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                            >
                              <Edit3 className="w-4 h-4" aria-hidden="true" />
                            </button>
                            <button
                              onClick={() => handleDeleteMember(m.id, m.name)}
                              aria-label={`Remove ${m.name}`}
                              className="min-h-[44px] min-w-[44px] p-2 rounded-xl bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 flex items-center justify-center transition-colors"
                            >
                              <Trash2 className="w-4 h-4" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 4: MEMBERSHIP APPLICATIONS TAB */}
              {activeTab === 'applications' && (
                <div className="space-y-6">
                  {/* Header & Filter Controls */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                    <div className="flex flex-wrap items-center gap-2">
                      {[
                        { id: 'all', label: 'ALL', count: applications.length },
                        { id: 'pending', label: 'PENDING', count: applications.filter(a => a.status === 'pending').length },
                        { id: 'approved', label: 'APPROVED', count: applications.filter(a => a.status === 'approved').length },
                        { id: 'archived', label: 'ARCHIVED', count: applications.filter(a => a.status === 'archived').length }
                      ].map((f) => (
                        <button
                          key={f.id}
                          onClick={() => { cyberAudio.playClick(); setAppFilter(f.id); }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                            appFilter === f.id
                              ? 'bg-[#FFD700] text-black font-bold shadow-[0_0_15px_rgba(255,215,0,0.3)]'
                              : 'bg-white/[0.04] text-slate-300 hover:text-white border border-white/10'
                          }`}
                        >
                          <span>{f.label}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${appFilter === f.id ? 'bg-black text-[#FFD700]' : 'bg-white/10 text-slate-300'}`}>
                            {f.count}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="relative w-full sm:w-64">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={appSearch}
                        onChange={(e) => setAppSearch(e.target.value)}
                        placeholder="Search name, email, track..."
                        className="glass-input w-full pl-9 pr-3 py-1.5 rounded-xl text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Applications List */}
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                    {applications
                      .filter((app) => {
                        if (appFilter !== 'all' && app.status !== appFilter) return false;
                        if (appSearch.trim()) {
                          const query = appSearch.toLowerCase();
                          const matchName = app.fullName?.toLowerCase().includes(query);
                          const matchEmail = app.email?.toLowerCase().includes(query);
                          const matchDiscord = app.discord?.toLowerCase().includes(query);
                          const matchTrack = app.track?.toLowerCase().includes(query);
                          return matchName || matchEmail || matchDiscord || matchTrack;
                        }
                        return true;
                      })
                      .map((app) => {
                        const isPending = app.status === 'pending';
                        const isApproved = app.status === 'approved';
                        const isArchived = app.status === 'archived';

                        return (
                          <div 
                            key={app.id} 
                            className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3.5 transition-all hover:border-white/20"
                          >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
                              <div className="flex items-center gap-2.5">
                                <span className="font-mono font-bold text-white text-sm">
                                  {app.fullName}
                                </span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300">
                                  {app.year}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase ${
                                  isApproved 
                                    ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400' 
                                    : isArchived 
                                      ? 'bg-slate-500/15 border border-slate-500/40 text-slate-400' 
                                      : 'bg-[#FFD700]/15 border border-[#FFD700]/40 text-[#FFD700]'
                                }`}>
                                  {app.status || 'PENDING'}
                                </span>
                                <span className="text-[10px] font-mono text-slate-500">
                                  {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Recent'}
                                </span>
                              </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5 text-[#FFD700] shrink-0" />
                                <span className="text-slate-300 truncate" title={app.email}>{app.email}</span>
                              </div>
                              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2">
                                <MessageSquare className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                                <span className="text-slate-300 truncate">{app.discord || 'No Discord'}</span>
                              </div>
                              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2">
                                <Layers className="w-3.5 h-3.5 text-[#FF7A00] shrink-0" />
                                <span className="text-slate-300 truncate" title={app.track}>{app.track}</span>
                              </div>
                            </div>

                            {/* Reason for joining */}
                            {app.interest && (
                              <div className="p-3 rounded-xl bg-[#080312] border border-white/10 text-xs font-mono space-y-1">
                                <div className="text-[10px] text-[#FFD700] font-bold">REASON FOR JOINING CODX:</div>
                                <p className="text-slate-300 font-sans font-light leading-relaxed">
                                  "{app.interest}"
                                </p>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.04]">
                              {!isApproved && (
                                <button
                                  onClick={() => handleApproveApp(app.id)}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
                                >
                                  <UserCheck className="w-3.5 h-3.5" />
                                  <span>APPROVE</span>
                                </button>
                              )}
                              {!isArchived && (
                                <button
                                  onClick={() => handleArchiveApp(app.id)}
                                  className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
                                >
                                  <Archive className="w-3.5 h-3.5" />
                                  <span>ARCHIVE</span>
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteApp(app.id, app.fullName)}
                                aria-label="Delete entry"
                                className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>DELETE</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}

                    {applications.length === 0 && (
                      <div className="text-center py-12 text-slate-500 font-mono text-xs">
                        No membership applications submitted yet.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: COMMITTEES & TRACKS MANAGER */}
              {activeTab === 'tracks' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Form */}
                  <div className="lg:col-span-5 glass-card p-5 sm:p-6 rounded-2xl border border-white/10">
                    <h4 className="font-mono text-xs font-bold text-white mb-4 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-[#FFD700]" aria-hidden="true" />
                      {editingTrack ? 'EDIT COMMITTEE TRACK' : 'ADD NEW COMMITTEE TRACK'}
                    </h4>

                    <form onSubmit={handleSaveTrack} className="space-y-4 text-xs font-mono">
                      <div>
                        <label className="text-slate-300 block mb-1.5 font-medium">
                          COMMITTEE / TRACK NAME:
                        </label>
                        <input
                          type="text"
                          required
                          value={trackForm.name}
                          onChange={(e) => setTrackForm({ ...trackForm, name: e.target.value })}
                          placeholder="e.g. Systems & Cloud Infrastructure"
                          className="glass-input w-full px-3 py-2 rounded-xl text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-slate-300 block mb-1.5 font-medium">
                          TRACK DESCRIPTION & FOCUS:
                        </label>
                        <textarea
                          rows={3}
                          value={trackForm.description}
                          onChange={(e) => setTrackForm({ ...trackForm, description: e.target.value })}
                          placeholder="e.g. Distributed backend microservices, Go, Rust, Linux, Cloud Architecture"
                          className="glass-input w-full px-3 py-2 rounded-xl text-xs"
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          className="flex-1 min-h-[44px] py-2.5 rounded-xl btn-primary-purple font-mono text-xs font-bold tracking-wider transition-all active:scale-[0.98] cursor-pointer"
                        >
                          {editingTrack ? 'UPDATE TRACK' : 'CREATE COMMITTEE TRACK'}
                        </button>
                        {editingTrack && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingTrack(null);
                              setTrackForm({ name: '', description: '' });
                            }}
                            className="px-4 py-2.5 rounded-xl bg-white/[0.04] text-slate-400 hover:text-white border border-white/10 text-xs font-mono cursor-pointer"
                          >
                            CANCEL
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  {/* Tracks List */}
                  <div className="lg:col-span-7 space-y-3">
                    <h4 className="font-mono text-xs font-bold text-slate-300 mb-2">
                      ACTIVE COMMITTEES / TRACKS ({tracks.length})
                    </h4>

                    <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
                      {tracks.map((t) => (
                        <div 
                          key={t.id} 
                          className="glass-panel p-4 rounded-2xl border border-white/10 flex items-start justify-between gap-4"
                        >
                          <div className="space-y-1 overflow-hidden">
                            <div className="text-xs font-bold text-white font-mono flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#FFD700]" />
                              <span>{t.name}</span>
                            </div>
                            {t.description && (
                              <p className="text-[11px] font-sans text-slate-400 font-light leading-relaxed">
                                {t.description}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => {
                                cyberAudio.playClick();
                                setEditingTrack(t);
                                setTrackForm({ name: t.name, description: t.description || '' });
                              }}
                              aria-label={`Edit ${t.name}`}
                              className="min-h-[40px] min-w-[40px] p-2 rounded-xl bg-white/[0.04] text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-4 h-4" aria-hidden="true" />
                            </button>
                            <button
                              onClick={() => handleDeleteTrack(t.id, t.name)}
                              aria-label={`Delete ${t.name}`}
                              className="min-h-[40px] min-w-[40px] p-2 rounded-xl bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
