import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MailOpen, Mail, Sparkles } from 'lucide-react';
import ConfettiEffect from './ConfettiEffect';

interface LoveLetterProps {
  loveLetterText: string;
  senderName: string;
}

export default function LoveLetter({ loveLetterText, senderName }: LoveLetterProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-[#0a0506] heart-bg text-[#fdf8f8] px-4 py-20">
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,14,28,0.25)_0%,transparent_75%)]" />

      {/* Ambient pink/purple spots */}
      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-[#4a0e1c] rounded-full blur-[120px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-50px] left-[-50px] w-[300px] h-[300px] bg-[#2d0a1a] rounded-full blur-[100px] opacity-60 pointer-events-none" />

      {/* Floating pink cherry petals background */}
      {isOpen && <ConfettiEffect type="hearts" active={true} />}

      <div className="relative z-20 max-w-2xl w-full flex flex-col items-center">
        
        {/* Header section */}
        <div className="text-center mb-12">
          <div className="inline-flex p-2.5 rounded-full bg-white/5 border border-white/10 text-artistic-accent mb-4 animate-float-slow">
            <Mail className="w-5 h-5" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-glow text-artistic-accent mb-4">
            A Letter From My Heart
          </h2>
          <p className="text-xs sm:text-sm text-white/60 max-w-sm mx-auto leading-relaxed font-sans font-light">
            I folded my soul into these words, written just for you. Click the envelope below to open it.
          </p>
        </div>

        {/* Envelope Container */}
        <div className="relative flex flex-col items-center justify-center w-full min-h-[350px]">
          <AnimatePresence mode="wait">
            {!isOpen ? (
              /* Closed Envelope */
              <motion.div
                key="closed-envelope"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.03 }}
                onClick={() => setIsOpen(true)}
                className="cursor-pointer flex flex-col items-center group"
              >
                {/* 3D Envelope body using Burgundy palette */}
                <div className="relative w-80 h-52 bg-[#3a0b16] rounded-xl shadow-2xl border border-white/5 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:shadow-[#b04b4b]/10">
                  {/* Flap triangles simulation with CSS */}
                  <div className="absolute top-0 left-0 right-0 h-0 border-t-[100px] border-t-[#22050b] border-x-[160px] border-x-transparent z-10 origin-top group-hover:scale-y-95 transition-transform duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 h-0 border-b-[110px] border-b-[#120104] border-x-[160px] border-x-transparent z-20" />
                  
                  {/* Wax seal using Artistic Rose palette */}
                  <div className="absolute z-30 w-14 h-14 rounded-full bg-[#b04b4b] flex items-center justify-center shadow-lg shadow-black/60 group-hover:scale-110 transition-transform duration-300 border border-[#e0a899]/30">
                    <Heart className="w-6 h-6 text-[#fdf8f8] fill-[#fdf8f8]/85 animate-pulse" />
                  </div>

                  {/* Sparkle lines */}
                  <Sparkles className="absolute top-4 right-4 w-4 h-4 text-artistic-accent opacity-40 group-hover:opacity-100 animate-spin-slow" />
                </div>
                
                <span className="text-xs font-sans text-artistic-accent uppercase tracking-[0.25em] mt-6 group-hover:text-[#fdf8f8] transition-colors font-semibold">
                  Tap to unfold letter ❤️
                </span>
              </motion.div>
            ) : (
              /* Opened Envelope + Unfolded Letter */
              <motion.div
                key="opened-letter"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ type: 'spring', damping: 25 }}
                className="w-full"
              >
                {/* Letter Paper Sheet */}
                <div className="relative w-full max-w-xl mx-auto rounded-[32px] bg-[#fdfaf5] text-[#221013] p-8 sm:p-12 shadow-2xl border-2 border-[#e0a899]/20 overflow-hidden">
                  
                  {/* Subtle paper lines/texture */}
                  <div className="absolute inset-0 bg-linear-[rgba(176,75,75,0.015)_1px,transparent_1px] bg-[size:100%_28px] pointer-events-none" />
                  
                  {/* Envelope close button inside letter */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-6 right-6 p-1.5 rounded-full hover:bg-[#b04b4b]/10 text-[#b04b4b] transition-all cursor-pointer z-10"
                    title="Close Letter"
                  >
                    <MailOpen className="w-5 h-5" />
                  </button>

                  {/* Romantic cursive letter contents */}
                  <div className="relative space-y-6 select-all">
                    {/* Golden decorative crown */}
                    <div className="text-center text-[#b04b4b]/20 text-2xl">⚜️</div>
                    
                    <p className="font-hand text-3xl text-[#4a0e1c] leading-relaxed whitespace-pre-wrap">
                      {loveLetterText}
                    </p>
                  </div>

                  {/* Subtle love trail stamp */}
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 opacity-[0.03] select-none pointer-events-none rotate-12">
                    <Heart className="w-full h-full fill-[#b04b4b]" />
                  </div>
                </div>

                {/* Back button */}
                <div className="text-center mt-6">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-5 py-2 bg-white/5 border border-white/10 hover:border-artistic-accent/30 text-artistic-accent hover:text-white rounded-full text-xs font-sans tracking-[0.2em] uppercase font-bold cursor-pointer transition-all"
                  >
                    Fold letter back in
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
