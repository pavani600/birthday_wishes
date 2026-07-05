import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Clock, Star, Heart } from 'lucide-react';

interface CountdownPageProps {
  recipientName: string;
  birthdayDate: string; // e.g. "10-15" (month-day) or fully specified date
}

export default function CountdownPage({ recipientName, birthdayDate }: CountdownPageProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      let year = now.getFullYear();
      
      // Parse birthday date (e.g. "2026-10-15" or similar format)
      const bdate = new Date(birthdayDate);
      const bMonth = bdate.getMonth();
      const bDay = bdate.getDate();

      let targetDate = new Date(year, bMonth, bDay);
      
      // If birthday has already passed this year, set target to next year
      if (now.getTime() > targetDate.getTime()) {
        targetDate = new Date(year + 1, bMonth, bDay);
      }

      const diff = targetDate.getTime() - now.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [birthdayDate]);

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-[#0a0506] heart-bg text-[#fdf8f8] px-4 py-20">
      {/* Background radial spotlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,14,28,0.25)_0%,transparent_75%)]" />

      {/* Ambient pink/purple spots */}
      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-[#4a0e1c] rounded-full blur-[120px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-50px] left-[-50px] w-[300px] h-[300px] bg-[#2d0a1a] rounded-full blur-[100px] opacity-60 pointer-events-none" />

      {/* Spawns some floating gold star particles */}
      <div className="absolute top-20 left-20 text-artistic-accent/20 text-2xl animate-spin-slow">✨</div>
      <div className="absolute top-40 right-28 text-artistic-accent/10 text-xl animate-bounce">⭐</div>
      <div className="absolute bottom-24 left-32 text-[#b04b4b]/15 text-lg animate-pulse">✨</div>
      <div className="absolute bottom-40 right-16 text-artistic-accent/20 text-2xl animate-spin-slow">⭐</div>

      <div className="relative z-20 max-w-xl w-full flex flex-col items-center text-center">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex p-2.5 rounded-full bg-white/5 border border-white/10 text-artistic-accent mb-4 animate-float-slow">
            <Clock className="w-5 h-5" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-glow text-artistic-accent mb-4">
            Countdown to Next Birthday
          </h2>
          <p className="text-xs sm:text-sm text-white/60 max-w-sm mx-auto leading-relaxed font-sans font-light">
            The celebration never truly stops. Counting down the seconds until we get to pamper you all over again!
          </p>
        </div>

        {/* The Animated Countdown Clock */}
        <div className="relative w-full max-w-lg p-8 sm:p-10 rounded-[32px] glass shadow-2xl overflow-hidden mb-8">
          {/* Light radial spot */}
          <div className="absolute inset-0 bg-gradient-to-tr from-artistic-accent/5 via-transparent to-artistic-rose/5 opacity-50" />

          <h3 className="text-[10px] font-sans uppercase text-artistic-accent tracking-[0.2em] mb-8 font-semibold">
            Hours, Minutes & Seconds Until Your Big Day
          </h3>

          <div className="grid grid-cols-4 gap-3 sm:gap-4">
            {[
              { val: timeLeft.days, label: 'Days' },
              { val: timeLeft.hours, label: 'Hours' },
              { val: timeLeft.minutes, label: 'Minutes' },
              { val: timeLeft.seconds, label: 'Seconds' },
            ].map((unit, i) => (
              <div key={i} className="flex flex-col p-3 sm:p-5 rounded-2xl bg-[#4a0e1c]/25 border border-[#b04b4b]/20 group hover:border-artistic-accent transition-all duration-300">
                <span className="text-2xl sm:text-4xl font-mono text-[#fdf8f8] text-glow group-hover:scale-105 transition-transform duration-300">
                  {String(unit.val).padStart(2, '0')}
                </span>
                <span className="text-[8px] sm:text-[9px] font-sans font-medium text-white/50 uppercase tracking-[0.15em] mt-2">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>

          <p className="text-[9px] text-white/30 font-sans mt-8 uppercase tracking-widest">
            Tick-tock, counting down in the fabric of eternity... ⭐
          </p>
        </div>

        {/* Cute micro footer message */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="flex items-center gap-1.5 text-xs text-artistic-accent font-serif"
        >
          <Heart className="w-3.5 h-3.5 fill-artistic-accent/30" /> Every single second with you is a gift.
        </motion.div>

      </div>
    </div>
  );
}
