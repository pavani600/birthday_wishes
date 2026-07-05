import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { MilestoneItem } from '../types';
import { Compass, Sparkles, Heart, Coffee, Gift, Calendar, Trophy, Globe } from 'lucide-react';

interface OurJourneyProps {
  milestones: MilestoneItem[];
  relationshipDate: string;
}

// Icon mapper for timeline
const iconMap: Record<string, any> = {
  Sparkles: Sparkles,
  Coffee: Coffee,
  Heart: Heart,
  Compass: Compass,
  Gift: Gift,
  Calendar: Calendar,
  Trophy: Trophy,
  Globe: Globe,
};

export default function OurJourney({ milestones, relationshipDate }: OurJourneyProps) {
  const [timePassed, setTimePassed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(relationshipDate);
      const now = new Date();
      const diff = now.getTime() - start.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimePassed({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [relationshipDate]);

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-[#0a0506] heart-bg text-[#fdf8f8] px-4 py-20">
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,14,28,0.25)_0%,transparent_75%)]" />

      {/* Ambient pink/purple spots */}
      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-[#4a0e1c] rounded-full blur-[120px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-50px] left-[-50px] w-[300px] h-[300px] bg-[#2d0a1a] rounded-full blur-[100px] opacity-60 pointer-events-none" />

      <div className="relative z-20 max-w-4xl w-full flex flex-col items-center">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex p-2.5 rounded-full bg-white/5 border border-white/10 text-artistic-accent mb-4 animate-float-slow">
            <Heart className="w-5 h-5 fill-artistic-accent/30" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-glow text-artistic-accent mb-4">
            Our Beautiful Journey
          </h2>
          <p className="text-xs sm:text-sm text-white/60 max-w-md mx-auto leading-relaxed font-sans font-light">
            Every step we took led us closer to each other. Here is our beautiful story, written in the stars.
          </p>
        </div>

        {/* Dynamic Days Counter Widget */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="w-full max-w-2xl p-6 sm:p-8 rounded-[40px] glass shadow-2xl relative overflow-hidden text-center mb-16"
        >
          {/* Light flare */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#e0a899]/10 via-transparent to-[#b04b4b]/10 opacity-30" />
          
          <h3 className="text-xs font-sans uppercase text-artistic-accent tracking-[0.2em] mb-6 font-semibold">
            Days of Infinite Love & Laughter
          </h3>

          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {[
              { val: timePassed.days, label: 'Days' },
              { val: timePassed.hours, label: 'Hours' },
              { val: timePassed.minutes, label: 'Mins' },
              { val: timePassed.seconds, label: 'Secs' },
            ].map((unit, i) => (
              <div key={i} className="flex flex-col p-2 sm:p-4 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-sm">
                <span className="text-xl sm:text-3xl font-mono font-bold text-glow text-artistic-accent">
                  {String(unit.val).padStart(2, '0')}
                </span>
                <span className="text-[9px] sm:text-[10px] font-medium text-white/40 uppercase tracking-widest mt-1">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-white/50 font-sans mt-6 uppercase tracking-[0.15em] font-light">
            Since we embarked on this magical path together ❤️
          </p>
        </motion.div>

        {/* Vertical Timeline */}
        <div className="relative w-full border-l-2 border-white/10 ml-4 sm:ml-0 sm:left-1/2 sm:border-l-2 sm:border-white/10 flex flex-col gap-12">
          
          {/* Connecting Heart Icon in center */}
          <div className="absolute top-0 -left-4 sm:left-1/2 sm:-ml-4 w-8 h-8 rounded-full bg-slate-950 border border-white/10 flex items-center justify-center text-artistic-accent z-10 animate-pulse">
            <Heart className="w-4 h-4 fill-artistic-accent" />
          </div>

          {milestones.map((ms, index) => {
            const IconComponent = iconMap[ms.icon] || Heart;
            const isEven = index % 2 === 0;

            return (
              <div
                key={ms.id}
                className={`relative w-full flex flex-col sm:flex-row ${
                  isEven ? 'sm:justify-start' : 'sm:justify-end'
                }`}
              >
                {/* Connector Node */}
                <div className="absolute -left-[23px] sm:left-1/2 sm:-ml-[11px] top-4 w-[22px] h-[22px] rounded-full bg-slate-900 border-2 border-artistic-accent flex items-center justify-center text-artistic-accent shadow-[0_0_8px_rgba(224,168,153,0.4)] z-10">
                  <IconComponent className="w-2.5 h-2.5" />
                </div>

                {/* Timeline Card */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  className={`w-full sm:w-[45%] pl-6 sm:pl-0 ${
                    isEven ? 'sm:pr-8 text-left' : 'sm:pl-8 text-left'
                  }`}
                >
                  <div className="p-6 rounded-[32px] glass hover:border-artistic-accent/40 shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                    {/* Background flare on card hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#e0a899]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <span className="inline-block px-2.5 py-1 rounded-md bg-artistic-accent/10 border border-artistic-accent/20 text-artistic-accent text-[9px] font-sans font-bold uppercase tracking-widest mb-3">
                      {ms.date}
                    </span>
                    
                    <h4 className="text-lg font-serif font-normal text-white group-hover:text-artistic-accent transition-colors mb-2">
                      {ms.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-white/70 font-sans font-light leading-relaxed">
                      {ms.description}
                    </p>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
