import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles } from 'lucide-react';
import ConfettiEffect from './ConfettiEffect';

interface LandingPageProps {
  recipientName: string;
  onOpen: () => void;
}

export default function LandingPage({ recipientName, onOpen }: LandingPageProps) {
  const [typedText, setTypedText] = useState('');
  const fullMessage = `A Special Surprise Awaits You, ${recipientName}... ❤️`;

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(fullMessage.substring(0, index));
      index++;
      if (index > fullMessage.length) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [fullMessage]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#0a0506] heart-bg text-[#fdf8f8] px-4">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,14,28,0.25)_0%,transparent_75%)] z-0" />
      
      {/* Floating Sparkles & Hearts canvas background */}
      <ConfettiEffect type="hearts" />

      {/* Radial ambient glow lights */}
      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-[#4a0e1c] rounded-full blur-[120px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-50px] left-[-50px] w-[300px] h-[300px] bg-[#2d0a1a] rounded-full blur-[100px] opacity-60 pointer-events-none" />

      <div className="relative z-20 flex flex-col items-center text-center max-w-xl">
        {/* Sparkles tag */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/5 border border-white/10 backdrop-blur-md rounded-full text-xs font-sans font-medium tracking-[0.2em] uppercase text-artistic-accent mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-artistic-accent animate-pulse" />
          Special Invitation
        </motion.div>

        {/* Cinematic Heart container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-8"
        >
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-md relative overflow-hidden transition-all duration-500 group-hover:border-artistic-accent/50">
              <Heart className="w-10 h-10 text-artistic-accent fill-artistic-accent/30 group-hover:fill-artistic-accent/80 transition-all duration-500 animate-pulse" />
              {/* Spinning shine */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
            {/* Pulsing ring outer */}
            <div className="absolute inset-0 rounded-full bg-artistic-accent/10 blur-md group-hover:bg-artistic-accent/20 transition-all duration-500 scale-110 -z-10" />
          </div>
        </motion.div>

        {/* Typewriter Header */}
        <div className="h-20 flex items-center justify-center mb-10">
          <h1 className="text-2xl sm:text-4xl font-serif font-normal tracking-wide text-[#fdf8f8] text-glow leading-relaxed">
            {typedText}
            <span className="inline-block w-1 h-8 bg-artistic-accent ml-1 animate-pulse" />
          </h1>
        </div>

        {/* Description paragraph */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="text-xs sm:text-sm text-white/70 font-sans font-light leading-relaxed max-w-md mb-12"
        >
          An immersive, cinematic story constructed specifically to celebrate your wonderful existence. Turn your volume on for the best experience.
        </motion.p>

        {/* Beautiful click-ripple Open Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 2 }}
        >
          <button
            onClick={onOpen}
            className="group relative rose-gradient px-8 py-4 rounded-full font-sans font-bold text-black text-xs tracking-[0.2em] uppercase cursor-pointer shadow-2xl shadow-[#b04b4b]/20 hover:scale-105 active:scale-95 transition-all overflow-hidden"
          >
            {/* Glowing background bloom */}
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <span className="relative z-10 flex items-center gap-2">
              Open the Surprise ❤️
            </span>
          </button>
        </motion.div>
      </div>

      {/* Ambient bottom footer */}
      <div className="absolute bottom-6 left-0 right-0 text-center z-20">
        <p className="text-[10px] font-sans tracking-[0.2em] text-white/30 uppercase">
          L'Amour • Experience Live
        </p>
      </div>
    </div>
  );
}
