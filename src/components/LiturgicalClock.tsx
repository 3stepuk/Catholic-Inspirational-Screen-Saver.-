import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Maximize2, Minimize2, BookOpen, Settings, Sparkles } from 'lucide-react';

interface LiturgicalClockProps {
  showClock: boolean;
  isFullscreen: boolean;
  soundEnabled: boolean;
  quoteCount: number;
  onToggleFullscreen: () => void;
  onToggleSound: () => void;
  onOpenCatalog: () => void;
  onOpenSettings: () => void;
}

export const LiturgicalClock: React.FC<LiturgicalClockProps> = ({
  showClock,
  isFullscreen,
  soundEnabled,
  quoteCount,
  onToggleFullscreen,
  onToggleSound,
  onOpenCatalog,
  onOpenSettings,
}) => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = time.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const dateString = time.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent backdrop-blur-[2px] text-amber-100/90 select-none transition-opacity duration-500">
      {/* Left: App Identity */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-700/30 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-md">
          <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
        </div>
        <div>
          <h1 className="font-serif text-lg md:text-xl font-bold tracking-wide text-amber-200 drop-shadow-sm">
            Verbum Patrum
          </h1>
          <p className="text-[11px] font-sans tracking-wider text-amber-300/60 uppercase">
            {quoteCount} Sacred Quotes • Early Fathers & Popes
          </p>
        </div>
      </div>

      {/* Center: Liturgical / Standard Clock */}
      {showClock && (
        <div className="hidden sm:flex flex-col items-center">
          <div className="font-serif text-2xl tracking-widest text-amber-100 drop-shadow-md">
            {timeString}
          </div>
          <div className="text-xs font-sans text-amber-300/70 tracking-wide">
            {dateString}
          </div>
        </div>
      )}

      {/* Right: Quick Action Buttons */}
      <div className="flex items-center space-x-2 md:space-x-3">
        <button
          onClick={onOpenCatalog}
          title="Browse All Quotes (C)"
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 text-amber-200 text-xs font-medium tracking-wide transition-all duration-200 active:scale-95"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">Catalog</span>
        </button>

        <button
          onClick={onToggleSound}
          title="Toggle Ambient Audio (M)"
          className={`p-2 rounded-full border transition-all duration-200 active:scale-95 ${
            soundEnabled
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
              : 'bg-black/40 border-amber-900/40 text-amber-200/50 hover:text-amber-200'
          }`}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 animate-pulse" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>

        <button
          onClick={onToggleFullscreen}
          title="Toggle Fullscreen Screensaver (F)"
          className="p-2 rounded-full bg-black/40 hover:bg-amber-900/40 border border-amber-500/30 text-amber-200/80 hover:text-amber-200 transition-all duration-200 active:scale-95"
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>

        <button
          onClick={onOpenSettings}
          title="Screensaver Settings"
          className="p-2 rounded-full bg-black/40 hover:bg-amber-900/40 border border-amber-500/30 text-amber-200/80 hover:text-amber-200 transition-all duration-200 active:scale-95"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
