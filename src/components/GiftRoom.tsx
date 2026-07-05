import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Sparkles, Heart } from 'lucide-react';
import ConfettiEffect from './ConfettiEffect';
import { GiftRoomDetails } from '../types';

interface GiftRoomProps {
  recipientName: string;
  senderName: string;
  giftConfig: GiftRoomDetails;
}

export default function GiftRoom({ recipientName, senderName, giftConfig }: GiftRoomProps) {
  const [isOpened, setIsOpened] = useState(false);

  const getAnimationProps = () => {
    switch (giftConfig.giftAnimation) {
      case 'spin':
        return {
          animate: { rotate: 360 },
          transition: { duration: 15, repeat: Infinity, ease: 'linear' },
        };
      case 'bounce':
        return {
          animate: { y: [0, -20, 0] },
          transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        };
      case 'pulse':
        return {
          animate: { scale: [1, 1.05, 1] },
          transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        };
      case 'float':
      default:
        return {
          animate: { y: [0, -10, 0] },
          transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        };
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-[#0a0506] heart-bg text-[#fdf8f8] px-4 py-20">
      {/* Background radial spotlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,14,28,0.25)_0%,transparent_75%)]" />

      {/* Ambient pink/purple spots */}
      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-[#4a0e1c] rounded-full blur-[120px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-50px] left-[-50px] w-[300px] h-[300px] bg-[#2d0a1a] rounded-full blur-[100px] opacity-60 pointer-events-none" />

      {/* Trigger active particle canvas on box opened matching the effects theme! */}
      {isOpened && (
        <ConfettiEffect
          type={
            giftConfig.effects === 'confetti'
              ? 'confetti'
              : giftConfig.effects === 'hearts'
              ? 'hearts'
              : giftConfig.effects === 'stars'
              ? 'fireworks'
              : 'all'
          }
          active={true}
        />
      )}

      <div className="relative z-20 max-w-2xl w-full flex flex-col items-center">
        
        {/* Header section */}
        <div className="text-center mb-12">
          <div className="inline-flex p-2.5 rounded-full bg-white/5 border border-white/10 text-artistic-accent mb-4 animate-float-slow">
            <Gift className="w-5 h-5" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-glow text-artistic-accent mb-4">
            The Surprise Gift Room
          </h2>
          <p className="text-xs sm:text-sm text-white/60 max-w-sm mx-auto leading-relaxed font-sans font-light">
            I prepared a special symbolic box of happiness for you. Give it a gentle tap to unwrap the surprise.
          </p>
        </div>

        {/* 3D Gift Box Wrapper */}
        <div className="relative flex flex-col items-center justify-center w-full min-h-[400px]">
          <AnimatePresence mode="wait">
            {!isOpened ? (
              /* Unopened Gift Box */
              <motion.div
                key="closed-gift"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setIsOpened(true)}
                className="cursor-pointer flex flex-col items-center group relative"
              >
                {/* Visual pulse glow behind box */}
                <div className="absolute inset-0 rounded-2xl bg-artistic-accent/10 blur-2xl group-hover:bg-artistic-accent/20 transition-all duration-500 scale-110 -z-10" />

                {/* Gift Box Structure (Pure CSS Glassmorphism & Gold ribbon) using theme colors */}
                <div className="relative w-44 h-44 bg-gradient-to-tr from-[#3a0b16] via-[#4a0e1c] to-[#3a0b16] border border-white/10 rounded-2xl shadow-2xl flex flex-col items-center justify-center">
                  
                  {/* Vertical Gold Ribbon */}
                  <div className="absolute top-0 bottom-0 left-[45%] w-5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 border-x border-amber-300/20 z-10 shadow-md" />
                  {/* Horizontal Gold Ribbon */}
                  <div className="absolute left-0 right-0 top-[45%] h-5 bg-gradient-to-b from-amber-400 via-yellow-300 to-amber-500 border-y border-amber-300/20 z-10 shadow-md" />

                  {/* Ribbon Bow on top */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-8 flex items-center justify-center z-25">
                    <div className="w-6 h-6 rounded-full border-4 border-amber-400 bg-transparent rotate-45 transform origin-bottom-right shadow-md" />
                    <div className="w-6 h-6 rounded-full border-4 border-amber-400 bg-transparent -rotate-45 transform origin-bottom-left shadow-md -ml-2" />
                    <div className="absolute w-4 h-4 rounded-full bg-amber-500 border border-amber-400 shadow" />
                  </div>

                  {/* Lid of the box overlay */}
                  <div className="absolute top-0 left-0 right-0 h-8 bg-[#22050b] border-b-2 border-white/5 rounded-t-2xl z-20 shadow-md" />

                  {/* Gentle floating icon */}
                  <div className="z-30 text-artistic-accent animate-bounce">
                    <Heart className="w-8 h-8 fill-artistic-accent/30" />
                  </div>

                  {/* Sparkle lines */}
                  <Sparkles className="absolute bottom-3 right-3 w-4 h-4 text-amber-300 opacity-40 group-hover:opacity-100 animate-spin-slow" />
                </div>

                <span className="text-xs font-sans text-artistic-accent uppercase tracking-[0.2em] mt-8 group-hover:text-[#fdf8f8] transition-colors font-semibold">
                  Tap to unwrap gift box 🎁
                </span>
              </motion.div>
            ) : (
              /* Opened Gift Box Contents */
              <motion.div
                key="opened-gift"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', damping: 20 }}
                className="w-full max-w-lg p-8 rounded-[40px] glass shadow-2xl relative overflow-hidden text-center group"
              >
                {/* Glow spot */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-artistic-accent/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-artistic-rose/10 rounded-full blur-2xl" />

                {/* Optional Custom Image of the gift */}
                {giftConfig.giftImage ? (
                  <motion.div
                    {...getAnimationProps()}
                    className="w-full h-48 rounded-2xl overflow-hidden mb-6 border border-white/10 shadow-lg relative bg-black/40"
                  >
                    <img
                      src={giftConfig.giftImage}
                      alt="Unwrapped Gift"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ) : (
                  /* Fallback Floating Heart vector display if no image */
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="inline-flex p-4 rounded-full bg-artistic-accent/10 border border-artistic-accent/30 text-artistic-accent mb-6 relative shadow-lg"
                  >
                    <Heart className="w-12 h-12 fill-artistic-accent" />
                    <div className="absolute inset-0 rounded-full bg-artistic-accent/20 blur-md scale-110" />
                  </motion.div>
                )}

                {/* Message */}
                <h3 className="text-2xl sm:text-3xl font-serif font-normal text-glow text-artistic-accent mb-4">
                  My Heart Belongs to You!
                </h3>

                <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-sm mx-auto mb-6 font-sans font-light whitespace-pre-line">
                  {giftConfig.giftMessage || `If I had a flower for every time I thought of you, I could walk through my garden forever. You are my most precious gift in life, ${recipientName}.`}
                </p>

                <div className="w-16 h-[1.5px] bg-gradient-to-r from-transparent via-artistic-accent to-transparent mx-auto mb-6" />

                <p className="text-xs font-sans text-artistic-accent/80 uppercase tracking-widest mb-6 font-semibold">
                  With all my respect and love, <br />
                  <span className="text-white font-serif italic text-sm font-normal">{senderName}</span>
                </p>

                {/* Reset Trigger */}
                <button
                  onClick={() => setIsOpened(false)}
                  className="px-4 py-2 border border-white/10 hover:bg-white/5 rounded-full text-xs font-sans uppercase tracking-[0.1em] text-white/60 hover:text-white transition-all cursor-pointer"
                >
                  Wrap the box again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
