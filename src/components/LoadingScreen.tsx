import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 600); // smooth completion delay
          return 100;
        }
        return prev + Math.floor(Math.random() * 15 + 5);
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0506] heart-bg text-[#fdf8f8] select-none">
      {/* Background radial soft light */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,14,28,0.25)_0%,transparent_75%)]" />

      {/* Ambient pink/purple spots */}
      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-[#4a0e1c] rounded-full blur-[120px] opacity-30 pointer-events-none" />
      <div className="absolute bottom-[-50px] left-[-50px] w-[300px] h-[300px] bg-[#2d0a1a] rounded-full blur-[100px] opacity-40 pointer-events-none" />

      <div className="relative flex flex-col items-center max-w-sm px-6 text-center">
        {/* Pulsing heart graphic */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative mb-8"
        >
          {/* Heart container */}
          <div className="w-24 h-24 rounded-full bg-[#0a0506] border border-white/10 flex items-center justify-center shadow-2xl shadow-[#b04b4b]/30 backdrop-blur-md relative overflow-hidden">
            <Heart className="w-12 h-12 text-artistic-accent fill-artistic-accent" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#b04b4b]/20 to-transparent pointer-events-none" />
          </div>
          
          {/* Radial glow ripple */}
          <div className="absolute inset-0 rounded-full bg-artistic-accent/20 blur-xl -z-10 animate-ping-slow" />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-serif font-normal text-glow text-artistic-accent mb-2"
        >
          Preparing Your Surprise
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          className="text-xs text-white/50 font-sans font-light tracking-wide mb-8"
        >
          Aligning hearts & stars...
        </motion.p>

        {/* Progress Bar */}
        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeInOut' }}
            className="h-full rose-gradient shadow-[0_0_8px_rgba(224,168,153,0.5)]"
          />
        </div>

        {/* Percentage Counter */}
        <span className="text-xs text-artistic-accent font-sans font-medium mt-3">{progress}%</span>
      </div>
    </div>
  );
}
