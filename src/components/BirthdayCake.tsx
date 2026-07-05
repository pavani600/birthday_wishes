import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, RefreshCw } from 'lucide-react';
import ConfettiEffect from './ConfettiEffect';

interface BirthdayCakeProps {
  recipientName: string;
}

export default function BirthdayCake({ recipientName }: BirthdayCakeProps) {
  const [candles, setCandles] = useState([
    { id: 1, lit: true, offset: '-mx-8' },
    { id: 2, lit: true, offset: '-mx-3' },
    { id: 3, lit: true, offset: 'mx-3' },
    { id: 4, lit: true, offset: 'mx-8' },
  ]);
  const [isBlown, setIsBlown] = useState(false);

  const blowOutCandles = () => {
    setCandles((prev) => prev.map((c) => ({ ...c, lit: false })));
    setIsBlown(true);
  };

  const relightCandles = () => {
    setCandles((prev) => prev.map((c) => ({ ...c, lit: true })));
    setIsBlown(false);
  };

  const toggleSingleCandle = (id: number) => {
    setCandles((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, lit: !c.lit } : c));
      const anyLit = next.some((c) => c.lit);
      setIsBlown(!anyLit);
      return next;
    });
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-[#0a0506] heart-bg text-[#fdf8f8] px-4 py-20">
      {/* Background radial spotlights */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,14,28,0.25)_0%,transparent_75%)]" />

      {/* Ambient pink/purple spots */}
      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-[#4a0e1c] rounded-full blur-[120px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-50px] left-[-50px] w-[300px] h-[300px] bg-[#2d0a1a] rounded-full blur-[100px] opacity-60 pointer-events-none" />

      {/* Show full celebration when candles are successfully blown out! */}
      {isBlown && <ConfettiEffect type="all" active={true} />}

      <div className="relative z-20 max-w-xl w-full flex flex-col items-center">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex p-2.5 rounded-full bg-white/5 border border-white/10 text-artistic-accent mb-4 animate-float-slow">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-glow text-artistic-accent mb-4">
            Blow Out Your Candles
          </h2>
          <p className="text-xs sm:text-sm text-white/60 max-w-sm mx-auto leading-relaxed font-sans font-light">
            Close your eyes, make a silent wish, and blow out the candles by tapping them or clicking the button below!
          </p>
        </div>

        {/* The 3D CSS Birthday Cake */}
        <div className="relative w-full h-80 flex flex-col items-center justify-end mb-12 select-none">
          
          {/* CANDLES ON TOP */}
          <div className="absolute bottom-40 left-0 right-0 flex justify-center items-end h-20 z-30">
            {candles.map((candle) => (
              <div
                key={candle.id}
                onClick={() => toggleSingleCandle(candle.id)}
                className={`absolute bottom-0 cursor-pointer flex flex-col items-center transform transition-all ${candle.offset} hover:scale-105`}
              >
                {/* Flame */}
                <AnimatePresence>
                  {candle.lit && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="w-3 h-6 bg-gradient-to-t from-amber-400 via-orange-400 to-yellow-200 rounded-full blur-[1px] animate-pulse origin-bottom shadow-[0_-2px_10px_rgba(245,158,11,0.8)]"
                      style={{ animationDuration: `${Math.random() * 0.4 + 0.3}s` }}
                    />
                  )}
                </AnimatePresence>

                {/* Wick */}
                <div className="w-[1.5px] h-2 bg-slate-400" />

                {/* Candle Body */}
                <div className="w-2.5 h-14 bg-gradient-to-r from-[#e0a899] via-[#b04b4b] to-[#e0a899] rounded-t-sm shadow-md flex flex-col justify-between overflow-hidden">
                  <div className="h-2 w-full bg-white/30" />
                  <div className="h-2 w-full bg-white/30" />
                  <div className="h-2 w-full bg-white/30" />
                </div>
              </div>
            ))}
          </div>

          {/* CAKE LAYER 3 (Top small Layer) */}
          <div className="w-36 h-12 bg-gradient-to-r from-rose-300 via-pink-200 to-rose-300 rounded-t-2xl shadow-md border-b-4 border-rose-400 z-20 flex items-center justify-around px-2 overflow-hidden relative">
            {/* Strawberries / Creams decor */}
            <div className="w-3 h-3 rounded-full bg-red-500 shadow" />
            <div className="w-3 h-3 rounded-full bg-white/80 shadow" />
            <div className="w-3 h-3 rounded-full bg-red-500 shadow" />
            <div className="w-3 h-3 rounded-full bg-white/80 shadow" />
            <div className="w-3 h-3 rounded-full bg-red-500 shadow" />
          </div>

          {/* CAKE LAYER 2 (Middle Layer) */}
          <div className="w-48 h-14 bg-gradient-to-r from-rose-400 via-pink-300 to-rose-400 rounded-t-xl shadow-lg border-b-4 border-rose-500 z-10 flex items-center justify-around px-4 overflow-hidden relative">
            {/* White chocolate drips */}
            <div className="absolute top-0 left-4 w-4 h-6 bg-amber-50 rounded-b-full opacity-60" />
            <div className="absolute top-0 left-16 w-3 h-4 bg-amber-50 rounded-b-full opacity-60" />
            <div className="absolute top-0 right-12 w-4 h-7 bg-amber-50 rounded-b-full opacity-60" />
            
            <div className="w-4 h-4 rounded-full bg-pink-100 shadow" />
            <div className="w-4 h-4 rounded-full bg-red-600 shadow" />
            <div className="w-4 h-4 rounded-full bg-pink-100 shadow" />
            <div className="w-4 h-4 rounded-full bg-red-600 shadow" />
          </div>

          {/* CAKE LAYER 1 (Bottom wide Layer) */}
          <div className="w-64 h-18 bg-gradient-to-r from-rose-500 via-pink-400 to-rose-500 rounded-t-lg shadow-xl border-b-[6px] border-rose-600 flex items-center justify-around px-6 overflow-hidden relative z-0">
            {/* Rainbow sprinkles */}
            <div className="absolute top-4 left-6 w-1 h-3 bg-blue-300 rounded rotate-45" />
            <div className="absolute top-8 left-20 w-1.5 h-3.5 bg-yellow-300 rounded -rotate-12" />
            <div className="absolute top-6 right-16 w-1 h-3 bg-emerald-300 rounded rotate-12" />
            <div className="absolute top-10 right-28 w-1 h-3 bg-purple-300 rounded -rotate-45" />

            <div className="w-5 h-5 rounded-full bg-red-500 border border-red-400" />
            <div className="w-5 h-5 rounded-full bg-white border border-slate-200" />
            <div className="w-5 h-5 rounded-full bg-red-500 border border-red-400" />
            <div className="w-5 h-5 rounded-full bg-white border border-slate-200" />
            <div className="w-5 h-5 rounded-full bg-red-500 border border-red-400" />
          </div>

          {/* THE STAND PLATE */}
          <div className="w-72 h-4 bg-slate-400 rounded-full shadow-2xl border-b-4 border-slate-500 relative" />
          <div className="w-28 h-6 bg-slate-500 rounded-b-lg shadow-lg" />
        </div>

        {/* Action Controls */}
        <div className="text-center relative z-20">
          <AnimatePresence mode="wait">
            {!isBlown ? (
              <motion.button
                key="blow-btn"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={blowOutCandles}
                className="group relative rose-gradient px-8 py-4 rounded-full font-sans font-bold text-black text-xs tracking-[0.2em] uppercase cursor-pointer shadow-2xl shadow-[#b04b4b]/20 hover:scale-105 active:scale-95 transition-all"
              >
                Make a Wish & Blow! 🎂
              </motion.button>
            ) : (
              <motion.div
                key="blown-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-4"
              >
                <h4 className="text-xl font-serif font-normal text-artistic-accent text-glow flex items-center justify-center gap-1.5 animate-pulse">
                  <Heart className="w-5 h-5 fill-artistic-accent" /> Yay! Happy Birthday {recipientName}! 🎉
                </h4>
                <p className="text-xs text-white/50 font-sans font-light">
                  Your wish has been safe-locked in the stars.
                </p>
                <button
                  onClick={relightCandles}
                  className="flex items-center gap-1.5 px-4 py-2 border border-white/10 hover:bg-white/5 rounded-full text-xs font-sans uppercase tracking-[0.1em] text-white/60 hover:text-white transition-all cursor-pointer mx-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Light candles again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
