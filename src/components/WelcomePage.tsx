import { motion } from 'motion/react';
import { Sparkles, Music, Volume2, VolumeX, ArrowRight, Heart } from 'lucide-react';
import ConfettiEffect from './ConfettiEffect';

interface WelcomePageProps {
  recipientName: string;
  senderName: string;
  onNext: () => void;
  musicEnabled: boolean;
  onToggleMusic: () => void;
}

export default function WelcomePage({
  recipientName,
  senderName,
  onNext,
  musicEnabled,
  onToggleMusic,
}: WelcomePageProps) {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#0a0506] heart-bg text-[#fdf8f8] px-4 py-16">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,14,28,0.25)_0%,transparent_75%)] z-0" />
      
      {/* Immersive Particle Canvas: fireworks, balloons and confetti! */}
      <ConfettiEffect type="all" />

      {/* Ambient pink/purple spots */}
      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-[#4a0e1c] rounded-full blur-[120px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-50px] left-[-50px] w-[300px] h-[300px] bg-[#2d0a1a] rounded-full blur-[100px] opacity-60 pointer-events-none" />

      <div className="relative z-20 flex flex-col items-center text-center max-w-2xl px-4">
        {/* Decorative Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-sans tracking-[0.2em] text-artistic-accent mb-6 uppercase"
        >
          <Sparkles className="w-3.5 h-3.5 text-artistic-accent animate-spin-slow" />
          Today is Your Special Day
        </motion.div>

        {/* Big Romantic Happy Birthday Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="glass p-8 sm:p-12 rounded-[40px] relative overflow-hidden group mb-10 max-w-xl shadow-2xl"
        >
          {/* Glassmorphic border glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#e0a899]/10 via-transparent to-[#b04b4b]/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <h2 className="text-xs font-sans tracking-[0.2em] text-artistic-accent uppercase mb-4">
            A beautiful soul was born
          </h2>
          
          <h1 className="text-4xl sm:text-6xl font-serif font-normal tracking-tight mb-6 leading-tight select-all text-glow">
            Happy Birthday, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-artistic-accent to-artistic-rose font-bold drop-shadow-sm">
              {recipientName}
            </span> ❤️
          </h1>

          <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-md mx-auto mb-6">
            May this day be as extraordinary, beautiful, and absolutely brilliant as your presence is to my world. You deserve all the stars in the sky!
          </p>

          <div className="w-16 h-[1.5px] bg-gradient-to-r from-transparent via-artistic-accent to-transparent mx-auto mb-6" />

          <p className="text-xs font-serif italic text-artistic-accent/80">
            "With all my love, always and forever."
          </p>
        </motion.div>

        {/* Interactive sound track controller panel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mb-12 flex flex-col items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 backdrop-blur-md max-w-sm"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${musicEnabled ? 'bg-artistic-accent/20 text-artistic-accent animate-pulse' : 'bg-white/5 text-white/30'}`}>
              <Music className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-sans uppercase tracking-[0.1em] text-white/80">Romantic Ambient Music</h4>
              <p className="text-[10px] text-white/40">
                {musicEnabled ? 'Playing soft instrumental...' : 'Soundtrack is currently muted'}
              </p>
            </div>
            <button
              onClick={onToggleMusic}
              className={`ml-4 px-3 py-1.5 rounded-lg text-xs font-sans uppercase tracking-[0.1em] cursor-pointer transition-all flex items-center gap-1.5 ${
                musicEnabled
                  ? 'bg-artistic-accent text-black font-semibold shadow-md hover:bg-white'
                  : 'bg-white/15 hover:bg-white/20 text-white'
              }`}
            >
              {musicEnabled ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              {musicEnabled ? 'Mute' : 'Play'}
            </button>
          </div>
        </motion.div>

        {/* Next page trigger button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          onClick={onNext}
          className="group flex items-center gap-2 px-6 py-3 border border-artistic-accent/40 hover:border-artistic-accent bg-artistic-accent/5 hover:bg-artistic-accent text-artistic-accent hover:text-black rounded-full text-xs font-sans tracking-[0.2em] uppercase font-bold cursor-pointer shadow-lg hover:shadow-artistic-accent/20 active:scale-95 transition-all"
        >
          Begin the Journey <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>

      {/* Corner floating decor elements */}
      <div className="absolute top-8 left-8 text-rose-500/20 text-2xl hidden md:block select-none animate-float-slow">🌸</div>
      <div className="absolute bottom-16 left-16 text-rose-500/10 text-3xl hidden md:block select-none animate-float">💕</div>
      <div className="absolute top-16 right-16 text-pink-500/20 text-4xl hidden md:block select-none animate-float">🌺</div>
      <div className="absolute bottom-8 right-8 text-rose-500/25 text-3xl hidden md:block select-none animate-float-slow">🌹</div>
    </div>
  );
}
