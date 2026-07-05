import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Star } from 'lucide-react';
import ConfettiEffect from './ConfettiEffect';

interface FinalSurpriseProps {
  recipientName: string;
  senderName: string;
}

export default function FinalSurprise({ recipientName, senderName }: FinalSurpriseProps) {
  const [clickedForever, setClickedForever] = useState(false);

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-[#0a0506] heart-bg text-[#fdf8f8] px-4 py-20">
      {/* Background radial spotlights */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,14,28,0.25)_0%,transparent_75%)]" />

      {/* Ambient pink/purple spots */}
      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-[#4a0e1c] rounded-full blur-[120px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-50px] left-[-50px] w-[300px] h-[300px] bg-[#2d0a1a] rounded-full blur-[100px] opacity-60 pointer-events-none" />

      {/* Massive full celebration effect active! */}
      <ConfettiEffect type="all" active={true} />

      <div className="relative z-20 max-w-2xl w-full flex flex-col items-center text-center px-4">
        
        {/* Floating Heart vector display */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative mb-10 cursor-pointer"
          onClick={() => setClickedForever((prev) => !prev)}
        >
          <div className="w-28 h-28 rounded-full bg-[#0a0506] border border-white/10 flex items-center justify-center shadow-2xl shadow-[#b04b4b]/30 backdrop-blur-md relative overflow-hidden">
            <Heart className="w-14 h-14 text-artistic-accent fill-artistic-accent animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#b04b4b]/20 to-transparent" />
          </div>
          {/* Pulsing ring outer */}
          <div className="absolute inset-0 rounded-full bg-artistic-accent/20 blur-xl scale-125 -z-10 animate-ping-slow" />
        </motion.div>

        {/* Big Romantic Happy Birthday Final Greeting Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="p-8 sm:p-12 rounded-[40px] glass shadow-2xl relative overflow-hidden mb-12 max-w-xl group"
        >
          {/* Glassmorphic border glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#b04b4b]/10 via-transparent to-[#e0a899]/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <h2 className="text-[10px] font-sans tracking-[0.2em] text-artistic-accent uppercase mb-4 font-semibold">
            Our Forever Story
          </h2>
          
          <h1 className="text-4xl sm:text-6xl font-serif font-normal tracking-tight mb-6 leading-tight select-all">
            I Love You, <br />
            <span className="text-glow text-artistic-accent font-normal">
              {recipientName}
            </span> ❤️
          </h1>

          <p className="text-xs sm:text-base text-white/80 leading-relaxed max-w-md mx-auto mb-6 font-sans font-light">
            Thank you for being the most beautiful, sparkling, and inspiring part of my life. Walking this life beside you is my greatest joy.
          </p>

          <div className="w-24 h-[1.5px] bg-gradient-to-r from-transparent via-artistic-accent to-transparent mx-auto mb-6" />

          <p className="text-xs sm:text-sm font-serif italic text-artistic-accent">
            "You are my today, my tomorrow, and all of my forevers."
          </p>
        </motion.div>

        {/* Forever Together magnetic button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <button
            onClick={() => setClickedForever(true)}
            className="group relative px-8 py-4 rose-gradient rounded-full font-sans font-bold text-black tracking-[0.2em] text-xs uppercase cursor-pointer shadow-xl shadow-[#b04b4b]/20 hover:scale-105 active:scale-95 transition-all overflow-hidden"
          >
            {/* Hover glare */}
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <span className="relative z-10 flex items-center gap-2">
              Forever Together <Heart className="w-4 h-4 fill-black" />
            </span>
          </button>
        </motion.div>

        {/* Parting Sweet modal / card upon clicking Forever Together */}
        <AnimatePresence>
          {clickedForever && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
              onClick={() => setClickedForever(false)}
            >
              <motion.div
                initial={{ scale: 0.92, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, y: 15 }}
                className="w-full max-w-md p-8 rounded-[32px] glass shadow-2xl text-center relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Gold sparkle header */}
                <div className="inline-flex p-3 rounded-full bg-white/5 border border-white/10 text-artistic-accent mb-4 animate-float-slow">
                  <Star className="w-6 h-6 text-artistic-accent fill-artistic-accent/30" />
                </div>

                <h3 className="text-xl sm:text-2xl font-serif font-normal text-glow text-artistic-accent mb-4">
                  Locked in the Cosmos ✨
                </h3>
                
                <p className="text-xs sm:text-sm text-white/80 font-sans font-light leading-relaxed mb-6">
                  "Our stars aligned for a reason, and no matter where the currents of time take us, my heart is anchored firmly in you. Happy Birthday, my absolute world!"
                </p>

                <p className="text-xs font-sans text-white/50 mb-6 uppercase tracking-widest font-semibold">
                  — Your loving partner, {senderName} ❤️
                </p>

                <button
                  onClick={() => setClickedForever(false)}
                  className="px-6 py-2.5 rose-gradient rounded-full text-xs font-sans font-bold tracking-[0.2em] uppercase text-black cursor-pointer shadow-lg shadow-[#b04b4b]/10 transition-all hover:scale-105"
                >
                  Close with Smile
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
