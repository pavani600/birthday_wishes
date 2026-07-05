import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WishItem } from '../types';
import { MessageSquare, Plus, Send, Trash2 } from 'lucide-react';

interface WishesWallProps {
  wishes: WishItem[];
  onAddWish: (newWish: WishItem) => void;
  onRemoveWish: (id: string) => void;
}

const colorPresets = [
  { name: 'Rose', bg: 'bg-[#4a0e1c]/40 text-[#fdf8f8] border-[#b04b4b]/35' },
  { name: 'Gold', bg: 'bg-white/5 text-[#fdf8f8] border-[#e0a899]/30' },
  { name: 'Crimson', bg: 'bg-[#2d0a1a]/55 text-[#fdf8f8] border-[#b04b4b]/20' },
  { name: 'Onyx Glass', bg: 'bg-black/30 text-[#fdf8f8] border-white/10' },
];

export default function WishesWall({ wishes, onAddWish, onRemoveWish }: WishesWallProps) {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [colorIdx, setColorIdx] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;

    const newWish: WishItem = {
      id: `w_${Date.now()}`,
      author: author.trim(),
      content: content.trim(),
      color: colorPresets[colorIdx].bg,
      date: new Date().toISOString().split('T')[0],
    };

    onAddWish(newWish);
    setAuthor('');
    setContent('');
    setIsFormOpen(false);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-[#0a0506] heart-bg text-[#fdf8f8] px-4 py-20">
      {/* Pinboard backing styling */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,14,28,0.25)_0%,transparent_75%)] pointer-events-none" />

      {/* Ambient pink/purple spots */}
      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-[#4a0e1c] rounded-full blur-[120px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-50px] left-[-50px] w-[300px] h-[300px] bg-[#2d0a1a] rounded-full blur-[100px] opacity-60 pointer-events-none" />

      <div className="relative z-20 max-w-4xl w-full">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex p-2.5 rounded-full bg-white/5 border border-white/10 text-artistic-accent mb-4 animate-float">
            <MessageSquare className="w-5 h-5 text-artistic-accent" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-glow text-artistic-accent mb-4">
            Birthday Wishes Wall
          </h2>
          <p className="text-xs sm:text-sm text-white/60 max-w-md mx-auto leading-relaxed font-sans font-light">
            Beautiful messages left by people who love you. You can also pin your own custom blessing to the wall!
          </p>
        </div>

        {/* Wishes Pin Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          <AnimatePresence>
            {wishes.map((wish, index) => {
              // unique static tilt for realistic organic pin look
              const rotationDegrees = ((index * 3) % 7) - 3; // from -3 to +3 degrees

              return (
                <motion.div
                  key={wish.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1, rotate: rotationDegrees }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', damping: 20 }}
                  whileHover={{ scale: 1.03, zIndex: 10, rotate: 0 }}
                  className={`p-6 rounded-[24px] border backdrop-blur-md relative shadow-lg flex flex-col justify-between min-h-[180px] overflow-hidden ${wish.color || colorPresets[0].bg}`}
                >
                  {/* Decorative Pin needle with metallic gold finish */}
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#b04b4b] border-2 border-[#e0a899]/80 shadow-md z-10" />

                  {/* Body text */}
                  <p className="font-hand text-2xl leading-relaxed italic mb-4 pt-4 text-white/90">
                    "{wish.content}"
                  </p>

                  {/* Footer metadata */}
                  <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[10px] font-sans uppercase tracking-[0.15em] text-white/55">
                    <span className="font-semibold">— {wish.author}</span>
                    <div className="flex items-center gap-1.5">
                      <span>{wish.date}</span>
                      <button
                        onClick={() => onRemoveWish(wish.id)}
                        className="p-1 rounded hover:bg-white/10 transition-colors text-white/30 hover:text-artistic-rose cursor-pointer"
                        title="Delete Wish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Add Wish Form trigger button */}
        <div className="text-center relative z-20">
          <AnimatePresence mode="wait">
            {!isFormOpen ? (
              <motion.button
                key="open-form-btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFormOpen(true)}
                className="group flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:border-artistic-accent/40 text-artistic-accent hover:text-[#fdf8f8] rounded-full text-xs font-sans tracking-[0.15em] uppercase font-bold cursor-pointer shadow-lg hover:shadow-[#b04b4b]/5 transition-all mx-auto"
              >
                <Plus className="w-4 h-4 text-artistic-accent group-hover:text-white" /> Leave a Birthday Wish
              </motion.button>
            ) : (
              /* Sticky Note Form */
              <motion.form
                key="wish-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                onSubmit={handleSubmit}
                className="max-w-md mx-auto p-8 rounded-[32px] glass border border-white/10 shadow-2xl space-y-4 text-left relative"
              >
                <h4 className="text-md font-serif font-normal text-glow text-artistic-accent">Pin Your Custom Message</h4>
                
                <div>
                  <label className="block text-[10px] text-white/50 font-sans uppercase tracking-wider mb-1">Your Name / Signature</label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g., Mom, Bestie, John"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-sans focus:outline-none focus:border-artistic-accent transition-all text-white font-light"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-white/50 font-sans uppercase tracking-wider mb-1">Your Blessing / Wish</label>
                  <textarea
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={3}
                    placeholder="Write a sweet romantic or celebratory note..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-sans focus:outline-none focus:border-artistic-accent transition-all text-white font-light resize-none"
                  />
                </div>

                {/* Color presets chooser */}
                <div>
                  <label className="block text-[10px] text-white/50 font-sans uppercase tracking-wider mb-1.5">Sticky Note Theme</label>
                  <div className="flex gap-2">
                    {colorPresets.map((preset, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setColorIdx(i)}
                        className={`px-2.5 py-1 text-[10px] font-sans font-medium rounded-lg border cursor-pointer transition-all ${
                          colorIdx === i
                            ? 'bg-artistic-accent text-black border-white font-semibold'
                            : 'bg-black/30 border-white/10 text-white/60 hover:text-white'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-sans text-white/50 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2 rose-gradient rounded-xl text-xs font-sans uppercase tracking-[0.1em] font-bold text-black cursor-pointer shadow-md transition-all hover:scale-[1.02]"
                  >
                    <Send className="w-3.5 h-3.5 text-black" /> Pin Wish
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
