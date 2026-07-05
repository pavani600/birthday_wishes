import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ReasonItem } from '../types';
import { Sparkles, Heart, Gift } from 'lucide-react';

interface ReasonsILoveYouProps {
  reasons: ReasonItem[];
  recipientName: string;
}

export default function ReasonsILoveYou({ reasons, recipientName }: ReasonsILoveYouProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-[#0a0506] heart-bg text-[#fdf8f8] px-4 py-20">
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,14,28,0.25)_0%,transparent_75%)] pointer-events-none" />

      {/* Ambient pink/purple spots */}
      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-[#4a0e1c] rounded-full blur-[120px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-50px] left-[-50px] w-[300px] h-[300px] bg-[#2d0a1a] rounded-full blur-[100px] opacity-60 pointer-events-none" />

      <div className="relative z-20 max-w-4xl w-full">
        {/* Header section */}
        <div className="text-center mb-16">
          <div className="inline-flex p-2.5 rounded-full bg-white/5 border border-white/10 text-artistic-accent mb-4 animate-float">
            <Sparkles className="w-5 h-5 text-artistic-accent animate-pulse" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-glow text-artistic-accent mb-4">
            Reasons Why I Love You
          </h2>
          <p className="text-xs sm:text-sm text-white/60 max-w-md mx-auto leading-relaxed font-sans font-light">
            There are a million reasons, but here are some of my absolute favorites. Click on any card to read more.
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {reasons.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              onClick={() => setSelectedId(selectedId === item.id ? null : item.id)}
              className="cursor-pointer group"
            >
              <div className="relative p-6 h-56 rounded-[32px] glass hover:border-artistic-accent/40 shadow-xl flex flex-col justify-between overflow-hidden transition-all duration-300 transform group-hover:-translate-y-1">
                {/* Glowing border effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-artistic-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-artistic-accent/5 rounded-full blur-xl group-hover:bg-artistic-accent/15 transition-all duration-500" />

                {/* Card Top: Emoji & Sparkle icon */}
                <div className="flex items-center justify-between relative z-10">
                  <span className="text-3xl filter drop-shadow-md group-hover:scale-125 transition-transform duration-300 select-none">
                    {item.emoji}
                  </span>
                  <Heart className="w-4 h-4 text-white/20 group-hover:text-artistic-accent group-hover:fill-artistic-accent transition-colors" />
                </div>

                {/* Card Content */}
                <div className="mt-4 relative z-10">
                  <h4 className="text-md font-serif font-normal text-white group-hover:text-artistic-accent transition-colors mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-white/60 font-sans font-light leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                {/* Interactive Expand label */}
                <div className="text-[9px] font-sans text-white/30 group-hover:text-artistic-accent transition-colors pt-2 uppercase tracking-[0.15em] text-right font-medium relative z-10">
                  {selectedId === item.id ? 'Collapse' : 'Read Detail'}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Selected Reason Overlay Lightbox details */}
        <AnimatePresence>
          {selectedId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
              onClick={() => setSelectedId(null)}
            >
              {(() => {
                const selectedItem = reasons.find((r) => r.id === selectedId);
                if (!selectedItem) return null;

                return (
                  <motion.div
                    initial={{ scale: 0.95, y: 15 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 15 }}
                    className="w-full max-w-md p-8 rounded-[40px] glass border border-white/10 shadow-2xl relative text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-5xl inline-block mb-4 select-none animate-bounce">
                      {selectedItem.emoji}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif font-normal text-glow text-artistic-accent mb-4">
                      {selectedItem.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/85 font-sans font-light leading-relaxed mb-6 whitespace-pre-wrap">
                      {selectedItem.description}
                    </p>
                    
                    <button
                      onClick={() => setSelectedId(null)}
                      className="px-6 py-2.5 rose-gradient rounded-full text-xs font-sans font-bold tracking-[0.2em] uppercase text-black cursor-pointer shadow-lg shadow-[#b04b4b]/20 transition-all hover:scale-105"
                    >
                      Close Reason
                    </button>
                  </motion.div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
