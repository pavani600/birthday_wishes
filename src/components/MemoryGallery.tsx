import { useState, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MemoryItem } from '../types';
import { Image, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface MemoryGalleryProps {
  memories: MemoryItem[];
  recipientName: string;
}

export default function MemoryGallery({ memories, recipientName }: MemoryGalleryProps) {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setActivePhotoIndex(index);
  };

  const closeLightbox = () => {
    setActivePhotoIndex(null);
  };

  const nextPhoto = (e?: MouseEvent) => {
    if (e) e.stopPropagation();
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((prevIndex) => {
      if (prevIndex === null) return 0;
      return (prevIndex + 1) % memories.length;
    });
  };

  const prevPhoto = (e?: MouseEvent) => {
    if (e) e.stopPropagation();
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((prevIndex) => {
      if (prevIndex === null) return 0;
      return (prevIndex - 1 + memories.length) % memories.length;
    });
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-[#0a0506] heart-bg text-[#fdf8f8] px-4 py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(74,14,28,0.25)_0%,transparent_60%)] pointer-events-none" />

      {/* Ambient pink/purple spots */}
      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-[#4a0e1c] rounded-full blur-[120px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-50px] left-[-50px] w-[300px] h-[300px] bg-[#2d0a1a] rounded-full blur-[100px] opacity-60 pointer-events-none" />

      <div className="relative z-20 max-w-5xl w-full">
        {/* Header section */}
        <div className="text-center mb-12">
          <div className="inline-flex p-2.5 rounded-full bg-white/5 border border-white/10 text-artistic-accent mb-4 animate-float">
            <Image className="w-5 h-5" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-glow text-artistic-accent mb-4">
            Our Memory Gallery
          </h2>
          <p className="text-xs sm:text-sm text-white/60 max-w-md mx-auto leading-relaxed font-sans font-light">
            A sweet visual timeline of some of our favorite moments. Hover to peek, click to enlarge our stories.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {memories.map((mem, index) => (
            <motion.div
              key={mem.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer perspective-1000"
              onClick={() => openLightbox(index)}
            >
              {/* Card Container */}
              <div className="relative h-80 rounded-[32px] overflow-hidden glass hover:border-artistic-accent/40 shadow-xl group-hover:shadow-artistic-accent/5 transition-all duration-500 transform group-hover:-translate-y-2 group-hover:rotate-1">
                {/* Image */}
                <img
                  src={mem.url}
                  alt={mem.caption}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out scale-100 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />

                {/* Dark gradient mask */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0506] via-[#0a0506]/30 to-transparent opacity-85 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Hover Details Button */}
                <div className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 border border-white/10 text-white opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300">
                  <ZoomIn className="w-4 h-4" />
                </div>

                {/* Date Tag */}
                {mem.date && (
                  <div className="absolute top-4 left-4 px-2.5 py-1 rounded-md rose-gradient text-black font-sans font-bold text-[9px] uppercase tracking-wider backdrop-blur-sm shadow">
                    {mem.date}
                  </div>
                )}

                {/* Details caption */}
                <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-[10px] font-sans text-artistic-accent mb-1.5 uppercase tracking-widest font-semibold">
                    {mem.date || 'Memory'}
                  </p>
                  <p className="text-sm font-serif text-[#fdf8f8] leading-relaxed line-clamp-2">
                    {mem.caption}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {activePhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md p-4"
            onClick={closeLightbox}
          >
            {/* Top Bar info */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-slate-300 text-xs">
              <span className="font-mono">
                {activePhotoIndex + 1} / {memories.length}
              </span>
              <button
                onClick={closeLightbox}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Left and Right navigation buttons */}
            <button
              onClick={prevPhoto}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white hover:text-artistic-accent transition-all hidden sm:block cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white hover:text-artistic-accent transition-all hidden sm:block cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Main Image content wrapper */}
            <motion.div
              key={activePhotoIndex}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="max-w-3xl max-h-[70vh] relative rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center bg-slate-900"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={memories[activePhotoIndex].url}
                alt={memories[activePhotoIndex].caption}
                className="max-w-full max-h-[70vh] object-contain"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Lightbox Caption */}
            <div
              className="max-w-2xl text-center mt-6 px-4"
              onClick={(e) => e.stopPropagation()}
            >
              {memories[activePhotoIndex].date && (
                <p className="text-xs font-sans text-artistic-accent uppercase tracking-widest mb-1 font-semibold">
                  {memories[activePhotoIndex].date}
                </p>
              )}
              <p className="text-lg font-serif text-white leading-relaxed">
                {memories[activePhotoIndex].caption}
              </p>
            </div>

            {/* Mobile swipe info */}
            <p className="text-[10px] text-slate-500 font-mono mt-4 sm:hidden">
              Tap anywhere outside the photo to close
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
