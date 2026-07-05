import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getInitialConfig } from './data';
import { SurpiseConfig, ActivePage, WishItem, MemoryItem, SocialPost, ReasonItem, LoveLetterDetails, GiftRoomDetails, PersonalizationDetails } from './types';
import { auth } from './lib/firebase';
import {
  onAuthStateChanged,
  signInAnonymously,
  signOut,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { getSurpriseConfig, saveSurpriseConfig } from './lib/firebaseService';

// Page components imports
import CursorTrail from './components/CursorTrail';
import LoadingScreen from './components/LoadingScreen';
import LandingPage from './components/LandingPage';
import WelcomePage from './components/WelcomePage';
import MemoryGallery from './components/MemoryGallery';
import OurJourney from './components/OurJourney';
import LoveLetter from './components/LoveLetter';
import ReasonsILoveYou from './components/ReasonsILoveYou';
import GiftRoom from './components/GiftRoom';
import BirthdayCake from './components/BirthdayCake';
import WishesWall from './components/WishesWall';
import CountdownPage from './components/CountdownPage';
import FinalSurprise from './components/FinalSurprise';

// Lucide icons
import {
  Home,
  Sparkles,
  Image as ImageIcon,
  Compass,
  Mail,
  Heart,
  Gift,
  Cake,
  MessageSquare,
  Clock,
  Settings,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Lock,
  LogOut,
  Share2,
  Check,
  Copy,
  Plus,
  Trash2,
  Wand2,
  User as UserIcon,
  Save
} from 'lucide-react';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activePage, setActivePage] = useState<ActivePage>('landing');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorTab, setEditorTab] = useState<'profile' | 'personalization' | 'gallery' | 'letter' | 'reasons' | 'wishes' | 'gift'>('profile');

  // Authentication State
  const [user, setUser] = useState<User | null>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authDisplayName, setAuthDisplayName] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authError, setAuthError] = useState('');

  // Config State (loads current user surprise config)
  const [config, setConfig] = useState<SurpiseConfig | null>(null);

  // Link Shared View Mode State
  const [isSharedView, setIsSharedView] = useState(false);
  const [sharedUserId, setSharedUserId] = useState<string | null>(null);

  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // AI Loading states
  const [isGeneratingLetter, setIsGeneratingLetter] = useState(false);
  const [isGeneratingReasons, setIsGeneratingReasons] = useState(false);

  // 1. Detect if Shared Surprise View vs Owner Dashboard View
  useEffect(() => {
    const detectViewMode = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sharedId = urlParams.get('s') || urlParams.get('surprise');

      // Also support hash route parsed parameter #/surprise/{id}
      let hashSharedId = null;
      if (window.location.hash.startsWith('#/surprise/')) {
        const parts = window.location.hash.split('/');
        hashSharedId = parts[2];
      }

      // Also support pathname /surprise/{id}
      let pathSharedId = null;
      const pathParts = window.location.pathname.split('/');
      const surpriseIdx = pathParts.indexOf('surprise');
      if (surpriseIdx !== -1 && pathParts[surpriseIdx + 1]) {
        pathSharedId = pathParts[surpriseIdx + 1];
      }

      const finalSharedId = sharedId || hashSharedId || pathSharedId;

      if (finalSharedId) {
        setIsSharedView(true);
        setSharedUserId(finalSharedId);
        try {
          const loadedConfig = await getSurpriseConfig(finalSharedId);
          setConfig(loadedConfig);
        } catch (error) {
          console.error('Failed to load shared config:', error);
        }
      }
      setIsLoading(false);
    };

    detectViewMode();
  }, []);

  // 2. Listen to Auth State if NOT in Shared View
  useEffect(() => {
    if (isSharedView) return;

    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!isMounted) return;

      if (currentUser) {
        setUser(currentUser);
        try {
          const loadedConfig = await getSurpriseConfig(currentUser.uid);
          if (isMounted) {
            setConfig(loadedConfig);
            setIsLoading(false);
          }
        } catch (error) {
          console.error('Failed to load user config:', error);
          if (isMounted) {
            // Secondary fallback if getting config for the logged-in user fails
            setConfig(getInitialConfig(currentUser.uid));
            setIsLoading(false);
          }
        }
      } else {
        // Automatically sign in with a silent, persistent account to bypass any login wall
        const silentEmail = 'surprise-user@romanticbirthday.com';
        const silentPassword = 'romanticbirthday123';
        try {
          await signInWithEmailAndPassword(auth, silentEmail, silentPassword);
        } catch (error: any) {
          console.log('Silent sign-in failed, trying signup...', error.message);
          try {
            await createUserWithEmailAndPassword(auth, silentEmail, silentPassword);
          } catch (signUpError: any) {
            console.error('Silent signup failed, falling back to local memory config:', signUpError);
            if (isMounted) {
              const guestUid = 'guest-fallback-local';
              setUser({ uid: guestUid } as any);
              setConfig(getInitialConfig(guestUid));
              setIsLoading(false);
            }
          }
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [isSharedView]);

  // 3. Audio controller synced with musicUrl
  useEffect(() => {
    if (config?.musicUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(config.musicUrl);
        audioRef.current.loop = true;
      } else {
        audioRef.current.src = config.musicUrl;
      }
    }
  }, [config?.musicUrl]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (musicPlaying) {
      audioRef.current.pause();
      setMusicPlaying(false);
    } else {
      audioRef.current.play().catch((err) => console.log('Autoplay restriction:', err));
      setMusicPlaying(true);
    }
  };

  const startMusicOnOpen = () => {
    if (audioRef.current && config?.musicEnabled && !musicPlaying) {
      audioRef.current.play().catch((err) => console.log('Autoplay restriction:', err));
      setMusicPlaying(true);
    }
    setActivePage('welcome');
  };

  // Permanently save custom changes to Firestore
  const handleSaveConfig = async (newConfig: SurpiseConfig) => {
    if (!user) return;
    try {
      setConfig(newConfig);
      await saveSurpriseConfig(user.uid, newConfig);
      alert('Changes saved permanently to database! ✨');
    } catch (error) {
      console.error('Failed to save config:', error);
      alert('Failed to save configurations. Please try again.');
    }
  };

  // AI Generators
  const handleAILetterGenerate = async () => {
    if (!config) return;
    setIsGeneratingLetter(true);
    try {
      const res = await fetch('/api/generate-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: config.loveLetter.senderName || config.personalization.recipientName + '\'s partner',
          receiverName: config.personalization.recipientName,
          receiverGender: config.loveLetter.receiverGender || config.personalization.gender,
          relationship: config.personalization.relationship,
          nickname: config.personalization.nickname,
          favoriteQuote: config.personalization.favoriteQuote,
          customMessage: config.personalization.customMessage,
        }),
      });
      const data = await res.json();
      if (data.letter) {
        setConfig((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            loveLetter: {
              ...prev.loveLetter,
              text: data.letter,
              mode: 'ai',
            },
          };
        });
      } else {
        alert(data.error || 'Failed to generate AI letter.');
      }
    } catch (err) {
      console.error(err);
      alert('Error fetching AI letter.');
    } finally {
      setIsGeneratingLetter(false);
    }
  };

  const handleAIReasonsGenerate = async () => {
    if (!config) return;
    setIsGeneratingReasons(true);
    try {
      const res = await fetch('/api/generate-reasons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverName: config.personalization.recipientName,
          nickname: config.personalization.nickname,
          gender: config.personalization.gender,
          relationship: config.personalization.relationship,
          customMessage: config.personalization.customMessage,
        }),
      });
      const data = await res.json();
      if (data.reasons && Array.isArray(data.reasons)) {
        setConfig((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            reasons: data.reasons,
          };
        });
        alert('Successfully generated 5 romantic reasons using Gemini AI! ✨');
      } else {
        alert(data.error || 'Failed to generate AI reasons.');
      }
    } catch (err) {
      console.error(err);
      alert('Error fetching AI reasons.');
    } finally {
      setIsGeneratingReasons(false);
    }
  };

  // Copy shareable link
  const copyShareableLink = () => {
    if (!user) return;
    const link = `${window.location.origin}?s=${user.uid}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Pages definition list
  const pagesOrder: { id: ActivePage; label: string; icon: any }[] = [
    { id: 'landing', label: 'Cover', icon: Home },
    { id: 'welcome', label: 'Welcome', icon: Sparkles },
    { id: 'gallery', label: 'Memories', icon: ImageIcon },
    { id: 'journey', label: 'Our Journey', icon: Compass },
    { id: 'letter', label: 'Love Letter', icon: Mail },
    { id: 'reasons', label: 'Reasons', icon: Heart },
    { id: 'gift', label: 'Gift Room', icon: Gift },
    { id: 'cake', label: 'Cake', icon: Cake },
    { id: 'wishes', label: 'Wishes', icon: MessageSquare },
    { id: 'countdown', label: 'Countdown', icon: Clock },
    { id: 'final', label: 'Final Surprise', icon: Heart },
  ];

  const currentPageIndex = pagesOrder.findIndex((p) => p.id === activePage);

  const goNext = () => {
    if (currentPageIndex < pagesOrder.length - 1) {
      setActivePage(pagesOrder[currentPageIndex + 1].id);
    }
  };

  const goPrev = () => {
    if (currentPageIndex > 0) {
      setActivePage(pagesOrder[currentPageIndex - 1].id);
    }
  };

  const activeAccent = config?.accentColor || 'rose';
  const accentColorClasses = {
    rose: 'from-rose-500 to-pink-600 border-rose-500/30 text-rose-400',
    pink: 'from-pink-500 to-fuchsia-600 border-pink-500/30 text-pink-400',
    violet: 'from-violet-500 to-purple-600 border-violet-500/30 text-violet-400',
    ruby: 'from-red-600 to-rose-700 border-red-600/30 text-red-400',
    amber: 'from-amber-500 to-orange-600 border-amber-500/30 text-amber-400',
    emerald: 'from-emerald-500 to-teal-600 border-emerald-500/30 text-emerald-400',
  };

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  // A. RENDER SHARED OR LANDING SURPRISE IF CONFIG IS LOADED
  if (config) {
    return (
      <div className="relative min-h-screen bg-slate-950 heart-bg font-sans select-none overflow-x-hidden text-slate-100">
        <CursorTrail />
        <audio ref={audioRef} />

        {/* TOP NAVIGATION BAR WITH USER DASHBOARD & STATS (Only shown for owners, NEVER shown in Shared View) */}
        {!isSharedView && (
          <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <h1 className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-2">
                Surprise Dashboard <span className="text-xs text-rose-400 font-light hidden sm:inline">| Isolation Engine Active</span>
              </h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {/* Music controls */}
              <button
                onClick={toggleMusic}
                className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
                title={musicPlaying ? 'Mute Background Music' : 'Play Background Music'}
              >
                {musicPlaying ? <Volume2 className="w-4 h-4 text-rose-400" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Toggle Dashboard Controls */}
              <button
                onClick={() => setIsEditorOpen(!isEditorOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold text-xs rounded-full shadow-lg shadow-rose-500/15 transition-all cursor-pointer hover:scale-[1.02]"
              >
                <Settings className="w-4 h-4 animate-spin-slow" />
                <span>Configure Surprise</span>
              </button>
            </div>
          </header>
        )}

        {/* SHARED VIEW FLOATING MUSIC SWITCH (Since top nav is completely hidden for recipients) */}
        {isSharedView && activePage !== 'landing' && (
          <div className="fixed top-5 right-5 z-40">
            <button
              onClick={toggleMusic}
              className="p-3 rounded-full bg-slate-900/60 hover:bg-slate-900 border border-white/10 text-slate-300 hover:text-white shadow-xl backdrop-blur-md cursor-pointer transition-all"
              title={musicPlaying ? 'Mute Background Music' : 'Play Background Music'}
            >
              {musicPlaying ? <Volume2 className="w-4 h-4 text-rose-400 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        )}

        {/* MAIN SURPRISE PAGES ROUTER WRAPPER */}
        <main className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="min-h-screen w-full"
            >
              {activePage === 'landing' && (
                <LandingPage
                  recipientName={config.personalization.recipientName}
                  onOpen={startMusicOnOpen}
                />
              )}
              {activePage === 'welcome' && (
                <WelcomePage
                  recipientName={config.personalization.recipientName}
                  senderName={config.loveLetter.senderName}
                  musicEnabled={musicPlaying}
                  onToggleMusic={toggleMusic}
                  onNext={goNext}
                />
              )}
              {activePage === 'gallery' && (
                <MemoryGallery
                  memories={config.gallery}
                  recipientName={config.personalization.recipientName}
                />
              )}
              {activePage === 'journey' && (
                <OurJourney
                  milestones={config.milestones}
                  relationshipDate={config.personalization.relationshipDate}
                />
              )}
              {activePage === 'letter' && (
                <LoveLetter
                  loveLetterText={config.loveLetter.text}
                  senderName={config.loveLetter.senderName}
                />
              )}
              {activePage === 'reasons' && (
                <ReasonsILoveYou
                  reasons={config.reasons}
                  recipientName={config.personalization.recipientName}
                />
              )}
              {activePage === 'gift' && (
                <GiftRoom
                  recipientName={config.personalization.recipientName}
                  senderName={config.loveLetter.senderName}
                  giftConfig={config.giftRoom}
                />
              )}
              {activePage === 'cake' && (
                <BirthdayCake recipientName={config.personalization.recipientName} />
              )}
              {activePage === 'wishes' && (
                <WishesWall
                  wishes={config.wishes}
                  onAddWish={(newWish) => {
                    // Precompute text contrast class based on sticky color
                    const darkColors = ['bg-[#4a0e1c]/40', 'bg-[#2d0a1a]/55', 'bg-black/30', 'bg-slate-900'];
                    const isDark = darkColors.some(c => newWish.color.includes(c));
                    newWish.textColor = isDark ? 'light' : 'dark';

                    const updated = [newWish, ...config.wishes];
                    setConfig((prev) => prev ? { ...prev, wishes: updated } : null);
                  }}
                  onRemoveWish={(id) => {
                    if (isSharedView) return; // Only creator can delete wishes
                    const updated = config.wishes.filter((w) => w.id !== id);
                    setConfig((prev) => prev ? { ...prev, wishes: updated } : null);
                  }}
                />
              )}
              {activePage === 'countdown' && (
                <CountdownPage
                  recipientName={config.personalization.recipientName}
                  birthdayDate={config.personalization.birthdayDate}
                />
              )}
              {activePage === 'final' && (
                <FinalSurprise
                  recipientName={config.personalization.recipientName}
                  senderName={config.loveLetter.senderName}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* LEFT / RIGHT PAGE FLIP ARROWS */}
        {activePage !== 'landing' && (
          <>
            {currentPageIndex > 1 && (
              <button
                onClick={goPrev}
                className="fixed left-5 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-slate-900/60 hover:bg-slate-900 border border-white/10 text-slate-400 hover:text-white cursor-pointer shadow-lg backdrop-blur-md transition-all hidden md:block"
                title="Previous Section"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {currentPageIndex < pagesOrder.length - 1 && (
              <button
                onClick={goNext}
                className="fixed right-5 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-slate-900/60 hover:bg-slate-900 border border-white/10 text-slate-400 hover:text-white cursor-pointer shadow-lg backdrop-blur-md transition-all hidden md:block animate-pulse"
                title="Next Section"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </>
        )}

        {/* BOTTOM GLASSMORPHIC NAVIGATION DOCK */}
        {activePage !== 'landing' && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[95vw] w-full sm:w-auto flex justify-center px-4">
            <nav className="flex items-center gap-1.5 sm:gap-2 px-4 py-2.5 bg-slate-900/80 border border-white/10 rounded-full shadow-2xl backdrop-blur-lg overflow-x-auto max-w-full scrollbar-none">
              {pagesOrder.slice(1).map((page) => {
                const Icon = page.icon;
                const isActive = activePage === page.id;

                return (
                  <button
                    key={page.id}
                    onClick={() => setActivePage(page.id)}
                    className={`relative p-2.5 rounded-full transition-all cursor-pointer group flex-shrink-0 ${
                      isActive
                        ? `bg-gradient-to-r ${accentColorClasses[activeAccent].split(' ')[0]} ${accentColorClasses[activeAccent].split(' ')[1]} text-white shadow-lg`
                        : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                    }`}
                    title={page.label}
                  >
                    <Icon className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-2 py-1 rounded bg-slate-950 text-[10px] font-medium tracking-wide text-white uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-white/10 shadow-lg">
                      {page.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* SLIDING CONFIGURATION PANEL (DASHBOARD) - ONLY ACCESSIBLE BY OWNERS */}
        <AnimatePresence>
          {isEditorOpen && !isSharedView && (
            <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 180 }}
                className="w-full max-w-2xl bg-slate-900 border-l border-white/10 h-full flex flex-col shadow-2xl overflow-hidden"
              >
                {/* Drawer Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Settings className="w-5 h-5 text-rose-500" />
                      Configure Surprise
                    </h2>
                    <p className="text-xs text-white/50">Edit details and save them permanently to the database</p>
                  </div>
                  <button
                    onClick={() => setIsEditorOpen(false)}
                    className="p-2 hover:bg-white/5 rounded-full text-white/50 hover:text-white transition-all cursor-pointer"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>

                {/* Drawer Tabs Navigation */}
                <div className="flex border-b border-white/5 bg-black/20 overflow-x-auto scrollbar-none">
                  {([
                    { id: 'profile', label: 'Profile' },
                    { id: 'personalization', label: 'Details' },
                    { id: 'gallery', label: 'Gallery' },
                    { id: 'letter', label: 'Letter' },
                    { id: 'reasons', label: 'Reasons' },
                    { id: 'wishes', label: 'Wishes' },
                    { id: 'gift', label: 'Gift' }
                  ] as const).map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setEditorTab(tab.id)}
                      className={`px-4 py-3 text-xs font-semibold tracking-wider uppercase border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                        editorTab === tab.id
                          ? 'border-rose-500 text-rose-400 bg-white/5'
                          : 'border-transparent text-slate-400 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Forms Body */}
                <div className="flex-1 p-6 overflow-y-auto space-y-6">
                  {editorTab === 'profile' && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-rose-400 uppercase tracking-widest mb-2">User Profile & Share Link</h3>
                      <div className="bg-black/40 p-4 rounded-2xl border border-white/5 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-rose-500/10 rounded-xl text-rose-400">
                            <UserIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs text-white/40">Logged in as</p>
                            <p className="text-sm font-semibold text-white">{user?.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Share Link Generation */}
                      <div className="bg-gradient-to-tr from-rose-950/20 to-slate-900 border border-rose-500/20 p-5 rounded-2xl space-y-3">
                        <div className="flex items-center gap-2">
                          <Share2 className="w-4 h-4 text-rose-400 animate-bounce" />
                          <h4 className="text-sm font-bold text-white">Your Unique Shareable Link</h4>
                        </div>
                        <p className="text-xs text-white/60">
                          Send this exact URL to your loved one. They will only see the beautiful personalized surprise you designed, completely isolated from other pages or settings!
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            readOnly
                            value={`${window.location.origin}?s=${user?.uid}`}
                            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono select-all focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={copyShareableLink}
                            className="flex items-center gap-1 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
                          >
                            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {editorTab === 'personalization' && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-rose-400 uppercase tracking-widest mb-2">Personalization Form</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] text-white/50 uppercase tracking-wider mb-1">Receiver Name</label>
                          <input
                            type="text"
                            value={config.personalization.recipientName}
                            onChange={(e) => {
                              const updated = { ...config.personalization, recipientName: e.target.value };
                              setConfig({ ...config, personalization: updated });
                            }}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-white/50 uppercase tracking-wider mb-1">Nickname / Affectionate Title</label>
                          <input
                            type="text"
                            value={config.personalization.nickname}
                            onChange={(e) => {
                              const updated = { ...config.personalization, nickname: e.target.value };
                              setConfig({ ...config, personalization: updated });
                            }}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-white/50 uppercase tracking-wider mb-1">Gender</label>
                          <select
                            value={config.personalization.gender}
                            onChange={(e) => {
                              const updated = { ...config.personalization, gender: e.target.value };
                              setConfig({ ...config, personalization: updated });
                            }}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                          >
                            {['Girl', 'Boy', 'Woman', 'Man', 'Baby Girl', 'Baby Boy'].map((g) => (
                              <option key={g} value={g} className="bg-slate-900 text-white">{g}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] text-white/50 uppercase tracking-wider mb-1">Relationship Status</label>
                          <input
                            type="text"
                            value={config.personalization.relationship}
                            onChange={(e) => {
                              const updated = { ...config.personalization, relationship: e.target.value };
                              setConfig({ ...config, personalization: updated });
                            }}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-white/50 uppercase tracking-wider mb-1">Relationship Anniversary Date</label>
                          <input
                            type="date"
                            value={config.personalization.relationshipDate}
                            onChange={(e) => {
                              const updated = { ...config.personalization, relationshipDate: e.target.value };
                              setConfig({ ...config, personalization: updated });
                            }}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-white/50 uppercase tracking-wider mb-1">Birthday Date</label>
                          <input
                            type="date"
                            value={config.personalization.birthdayDate}
                            onChange={(e) => {
                              const updated = { ...config.personalization, birthdayDate: e.target.value };
                              setConfig({ ...config, personalization: updated });
                            }}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                          />
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-4 space-y-4">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Theme & Accent Styling</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] text-white/50 uppercase tracking-wider mb-1">Accent Theme</label>
                            <select
                              value={config.accentColor}
                              onChange={(e) => {
                                setConfig({ ...config, accentColor: e.target.value as any });
                              }}
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                            >
                              {['rose', 'pink', 'violet', 'ruby', 'amber', 'emerald'].map((col) => (
                                <option key={col} value={col} className="bg-slate-900 text-white capitalize">{col}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] text-white/50 uppercase tracking-wider mb-1">Favorite Music URL</label>
                            <input
                              type="text"
                              value={config.musicUrl}
                              onChange={(e) => {
                                setConfig({ ...config, musicUrl: e.target.value });
                              }}
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-4 space-y-4">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quotes & Dedications</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-[10px] text-white/50 uppercase tracking-wider mb-1">Favorite Romantic Quote</label>
                            <input
                              type="text"
                              value={config.personalization.favoriteQuote}
                              onChange={(e) => {
                                const updated = { ...config.personalization, favoriteQuote: e.target.value };
                                setConfig({ ...config, personalization: updated });
                              }}
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-white/50 uppercase tracking-wider mb-1">Custom Dedication Message</label>
                            <textarea
                              value={config.personalization.customMessage}
                              onChange={(e) => {
                                const updated = { ...config.personalization, customMessage: e.target.value };
                                setConfig({ ...config, personalization: updated });
                              }}
                              rows={3}
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {editorTab === 'gallery' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-rose-400 uppercase tracking-widest">Memory Photos</h3>
                        <button
                          type="button"
                          onClick={() => {
                            const newMemory: MemoryItem = {
                              id: `m_${Date.now()}`,
                              url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop',
                              caption: 'A beautiful sweet memory of us',
                              date: 'Oct 15, 2024',
                            };
                            setConfig({ ...config, gallery: [...config.gallery, newMemory] });
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 text-xs rounded-xl transition-all cursor-pointer"
                        >
                          <Plus className="w-4 h-4" /> Add Photo
                        </button>
                      </div>

                      <div className="space-y-4">
                        {config.gallery.map((item, idx) => (
                          <div key={item.id} className="bg-black/40 p-4 border border-white/5 rounded-2xl flex flex-col sm:flex-row gap-4">
                            <div className="w-full sm:w-28 h-28 rounded-xl overflow-hidden bg-slate-800 border border-white/10 relative group">
                              <img src={item.url} alt="Gallery Preview" className="w-full h-full object-cover" />
                              <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all text-[10px] font-semibold uppercase tracking-wider text-white">
                                Upload file
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        const updated = [...config.gallery];
                                        updated[idx].url = reader.result as string;
                                        setConfig({ ...config, gallery: updated });
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                              </label>
                            </div>

                            <div className="flex-1 space-y-2">
                              <input
                                type="text"
                                placeholder="Image URL (Alternative)"
                                value={item.url.startsWith('data:') ? 'Local file uploaded' : item.url}
                                disabled={item.url.startsWith('data:')}
                                onChange={(e) => {
                                  const updated = [...config.gallery];
                                  updated[idx].url = e.target.value;
                                  setConfig({ ...config, gallery: updated });
                                }}
                                className="w-full bg-black/30 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                              />
                              <input
                                type="text"
                                placeholder="Optional Description"
                                value={item.caption}
                                onChange={(e) => {
                                  const updated = [...config.gallery];
                                  updated[idx].caption = e.target.value;
                                  setConfig({ ...config, gallery: updated });
                                }}
                                className="w-full bg-black/30 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                              />
                              <div className="flex items-center justify-between gap-4">
                                <input
                                  type="text"
                                  placeholder="Memory Date"
                                  value={item.date}
                                  onChange={(e) => {
                                    const updated = [...config.gallery];
                                    updated[idx].date = e.target.value;
                                    setConfig({ ...config, gallery: updated });
                                  }}
                                  className="bg-black/30 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white w-28"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = config.gallery.filter((g) => g.id !== item.id);
                                    setConfig({ ...config, gallery: updated });
                                  }}
                                  className="p-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-xl transition-all cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {editorTab === 'letter' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-rose-400 uppercase tracking-widest">Love Letter Content</h3>
                        <button
                          type="button"
                          onClick={handleAILetterGenerate}
                          disabled={isGeneratingLetter}
                          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/20 cursor-pointer transition-all hover:scale-[1.02]"
                        >
                          <Wand2 className="w-4 h-4 animate-pulse" />
                          <span>{isGeneratingLetter ? 'Drafting...' : 'Write with Gemini AI ✨'}</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] text-white/50 uppercase tracking-wider mb-1">Sender Name</label>
                          <input
                            type="text"
                            value={config.loveLetter.senderName}
                            onChange={(e) => {
                              const updated = { ...config.loveLetter, senderName: e.target.value };
                              setConfig({ ...config, loveLetter: updated });
                            }}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-white/50 uppercase tracking-wider mb-1">Receiver Gender Opening</label>
                          <select
                            value={config.loveLetter.receiverGender}
                            onChange={(e) => {
                              const updated = { ...config.loveLetter, receiverGender: e.target.value };
                              setConfig({ ...config, loveLetter: updated });
                            }}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                          >
                            {['Girl', 'Boy', 'Woman', 'Man', 'Baby Girl', 'Baby Boy'].map((g) => (
                              <option key={g} value={g} className="bg-slate-900 text-white">{g}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] text-white/50 uppercase tracking-wider mb-1">Letter Body</label>
                        <textarea
                          value={config.loveLetter.text}
                          onChange={(e) => {
                            const updated = { ...config.loveLetter, text: e.target.value, mode: 'custom' };
                            setConfig({ ...config, loveLetter: updated });
                          }}
                          rows={12}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-serif leading-relaxed focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {editorTab === 'reasons' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-rose-400 uppercase tracking-widest">Personalized Reasons</h3>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleAIReasonsGenerate}
                            disabled={isGeneratingReasons}
                            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer hover:scale-[1.02]"
                          >
                            <Wand2 className="w-3.5 h-3.5" />
                            <span>{isGeneratingReasons ? 'Generating...' : 'Gemini AI Build ✨'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const newReason: ReasonItem = {
                                id: `r_${Date.now()}`,
                                title: 'Sweet Reason Title',
                                description: 'Why my world is infinitely beautiful with you.',
                                emoji: '💖',
                              };
                              setConfig({ ...config, reasons: [...config.reasons, newReason] });
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 text-xs rounded-xl cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" /> Reason
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {config.reasons.map((item, idx) => (
                          <div key={item.id} className="bg-black/40 p-4 border border-white/5 rounded-2xl flex gap-3 items-start">
                            <input
                              type="text"
                              value={item.emoji}
                              onChange={(e) => {
                                const updated = [...config.reasons];
                                updated[idx].emoji = e.target.value;
                                setConfig({ ...config, reasons: updated });
                              }}
                              className="w-10 bg-black/30 border border-white/10 rounded-lg py-1.5 text-center text-sm"
                            />
                            <div className="flex-1 space-y-2">
                              <input
                                type="text"
                                placeholder="Reason Title"
                                value={item.title}
                                onChange={(e) => {
                                  const updated = [...config.reasons];
                                  updated[idx].title = e.target.value;
                                  setConfig({ ...config, reasons: updated });
                                }}
                                className="w-full bg-black/30 border border-white/10 rounded-lg px-2.5 py-1 text-xs font-semibold text-white"
                              />
                              <textarea
                                placeholder="Heartfelt description"
                                value={item.description}
                                onChange={(e) => {
                                  const updated = [...config.reasons];
                                  updated[idx].description = e.target.value;
                                  setConfig({ ...config, reasons: updated });
                                }}
                                rows={2}
                                className="w-full bg-black/30 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white resize-none"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = config.reasons.filter((r) => r.id !== item.id);
                                setConfig({ ...config, reasons: updated });
                              }}
                              className="p-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-lg transition-all cursor-pointer self-start"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {editorTab === 'wishes' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-rose-400 uppercase tracking-widest">Pinboard Wishes</h3>
                        <button
                          type="button"
                          onClick={() => {
                            const newWish: WishItem = {
                              id: `w_${Date.now()}`,
                              author: 'Dearest Friend',
                              content: 'Have the absolute best birthday celebration! Wishing you tons of love, laughs, and pure success! ✨🎉',
                              color: 'bg-rose-100',
                              date: new Date().toISOString().split('T')[0],
                            };
                            setConfig({ ...config, wishes: [...config.wishes, newWish] });
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 text-xs rounded-xl transition-all cursor-pointer"
                        >
                          <Plus className="w-4 h-4" /> Add Card
                        </button>
                      </div>

                      <div className="space-y-4">
                        {config.wishes.map((item, idx) => (
                          <div key={item.id} className="bg-black/40 p-4 border border-white/5 rounded-2xl space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] text-white/50 mb-1">Author</label>
                                <input
                                  type="text"
                                  value={item.author}
                                  onChange={(e) => {
                                    const updated = [...config.wishes];
                                    updated[idx].author = e.target.value;
                                    setConfig({ ...config, wishes: updated });
                                  }}
                                  className="w-full bg-black/30 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] text-white/50 mb-1">Card Color Theme</label>
                                <select
                                  value={item.color}
                                  onChange={(e) => {
                                    const updated = [...config.wishes];
                                    updated[idx].color = e.target.value;
                                    setConfig({ ...config, wishes: updated });
                                  }}
                                  className="w-full bg-black/30 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white"
                                >
                                  <option value="bg-rose-100" className="bg-slate-900 text-white">Light Rose Card</option>
                                  <option value="bg-pink-100" className="bg-slate-900 text-white">Light Pink Card</option>
                                  <option value="bg-amber-100" className="bg-slate-900 text-white">Light Amber Card</option>
                                  <option value="bg-[#4a0e1c]/40" className="bg-slate-900 text-white">Dark Crimson Card</option>
                                  <option value="bg-[#2d0a1a]/55" className="bg-slate-900 text-white">Dark Amethyst Card</option>
                                  <option value="bg-slate-900" className="bg-slate-900 text-white">Dark Onyx Card</option>
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className="block text-[10px] text-white/50 mb-1">Message Content</label>
                              <textarea
                                value={item.content}
                                onChange={(e) => {
                                  const updated = [...config.wishes];
                                  updated[idx].content = e.target.value;
                                  setConfig({ ...config, wishes: updated });
                                }}
                                rows={2}
                                className="w-full bg-black/30 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white resize-none"
                              />
                            </div>
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = config.wishes.filter((w) => w.id !== item.id);
                                  setConfig({ ...config, wishes: updated });
                                }}
                                className="p-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-lg transition-all cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {editorTab === 'gift' && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-rose-400 uppercase tracking-widest mb-2">Gift Room Customization</h3>
                      
                      {/* Gift image upload option */}
                      <div>
                        <label className="block text-[10px] text-white/50 uppercase tracking-wider mb-2">Gift Surprise Image</label>
                        <div className="flex items-center gap-4">
                          {config.giftRoom.giftImage && (
                            <img src={config.giftRoom.giftImage} alt="Gift preview" className="w-20 h-20 rounded-xl object-cover border border-white/10 bg-slate-800" />
                          )}
                          <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-750 border border-white/10 rounded-xl cursor-pointer text-xs font-semibold text-white">
                            Upload surprise photo
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    const updated = { ...config.giftRoom, giftImage: reader.result as string };
                                    setConfig({ ...config, giftRoom: updated });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] text-white/50 uppercase tracking-wider mb-1">Opening Animation</label>
                          <select
                            value={config.giftRoom.giftAnimation}
                            onChange={(e) => {
                              const updated = { ...config.giftRoom, giftAnimation: e.target.value as any };
                              setConfig({ ...config, giftRoom: updated });
                            }}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                          >
                            {['float', 'spin', 'bounce', 'pulse'].map((anim) => (
                              <option key={anim} value={anim} className="bg-slate-900 text-white capitalize">{anim}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] text-white/50 uppercase tracking-wider mb-1">Unwrapping Particles</label>
                          <select
                            value={config.giftRoom.effects}
                            onChange={(e) => {
                              const updated = { ...config.giftRoom, effects: e.target.value as any };
                              setConfig({ ...config, giftRoom: updated });
                            }}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                          >
                            {['confetti', 'hearts', 'stars', 'snow'].map((eff) => (
                              <option key={eff} value={eff} className="bg-slate-900 text-white capitalize">{eff}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] text-white/50 uppercase tracking-wider mb-1">Gift Unwrapping Message</label>
                        <textarea
                          value={config.giftRoom.giftMessage}
                          onChange={(e) => {
                            const updated = { ...config.giftRoom, giftMessage: e.target.value };
                            setConfig({ ...config, giftRoom: updated });
                          }}
                          rows={4}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none resize-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Save Configurations permanently to Database */}
                <div className="p-6 border-t border-white/5 bg-slate-950 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white/60 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveConfig(config)}
                    className="flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-500/20 cursor-pointer transition-all hover:scale-[1.02]"
                  >
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // B. RENDER INITIALIZING SCREEN IF CONFIG IS NOT YET LOADED
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center relative px-4 select-none font-sans text-slate-200 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,14,28,0.25)_0%,transparent_75%)] pointer-events-none" />
      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-[#4a0e1c] rounded-full blur-[120px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-50px] left-[-50px] w-[300px] h-[300px] bg-[#2d0a1a] rounded-full blur-[100px] opacity-60 pointer-events-none" />

      <CursorTrail />

      <div className="relative z-10 text-center space-y-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 mx-auto animate-pulse">
          <Heart className="h-8 w-8 fill-rose-500/20" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight text-white">Opening Romantic Surprise...</h2>
          <p className="text-xs text-slate-400 font-light">Connecting to secure cloud engine</p>
        </div>
        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mx-auto">
          <div className="w-full h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
