import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Flame,
  Palette,
  Clock,
  Bell,
  Lock,
} from 'lucide-react';
import { VisualTheme, ScreensaverSettings } from '../types';

interface SettingsBarProps {
  settings: ScreensaverSettings;
  isPlaying: boolean;
  progressPercent: number; // 0 to 100
  isUserActive: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleShuffle: () => void;
  onSelectTheme: (theme: VisualTheme) => void;
  onSetInterval: (seconds: number) => void;
  onPlayBell: () => void;
  onLockScreensaver: () => void;
  onUpdateSettings: (newSettings: Partial<ScreensaverSettings>) => void;
}

export const SettingsBar: React.FC<SettingsBarProps> = ({
  settings,
  isPlaying,
  progressPercent,
  isUserActive,
  onTogglePlay,
  onNext,
  onPrev,
  onToggleShuffle,
  onSelectTheme,
  onSetInterval,
  onPlayBell,
  onLockScreensaver,
}) => {
  const themeOptions: { id: VisualTheme; label: string; color: string }[] = [
    { id: 'candlelight', label: 'Candlelight', color: 'bg-amber-600' },
    { id: 'stained-glass', label: 'Stained Glass', color: 'bg-indigo-600' },
    { id: 'monastic-parchment', label: 'Parchment', color: 'bg-stone-600' },
    { id: 'vatican-crimson', label: 'Vatican Red', color: 'bg-rose-800' },
    { id: 'marian-blue', label: 'Marian Blue', color: 'bg-sky-800' },
  ];

  const intervalOptions = [10, 15, 30, 60, 180];

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-30 flex flex-col items-center px-4 pb-6 pt-2 bg-gradient-to-t from-black/90 via-black/60 to-transparent backdrop-blur-md select-none transition-all duration-700 ${
        isUserActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
      }`}
    >
      {/* Top Countdown Progress Bar */}
      {isPlaying && (
        <div className="w-full max-w-2xl h-1 bg-amber-950/60 rounded-full overflow-hidden mb-3 border border-amber-500/20">
          <div
            className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-300 transition-all duration-300 ease-linear shadow-[0_0_8px_rgba(245,158,11,0.5)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Main Control Panel */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-2.5 rounded-2xl bg-black/60 border border-amber-500/20 shadow-2xl max-w-4xl w-full">
        {/* Playback Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onPrev}
            title="Previous Quote (Left Arrow)"
            className="p-2.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 text-amber-200 transition active:scale-95"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={onTogglePlay}
            title={isPlaying ? 'Pause Screensaver (Space)' : 'Start Screensaver (Space)'}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-semibold border border-amber-300/40 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition active:scale-95"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-stone-950" />
                <span className="text-xs uppercase tracking-wider font-bold">Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-stone-950 ml-0.5" />
                <span className="text-xs uppercase tracking-wider font-bold">Start</span>
              </>
            )}
          </button>

          <button
            onClick={onNext}
            title="Next Quote (Right Arrow)"
            className="p-2.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 text-amber-200 transition active:scale-95"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Themes Selector */}
        <div className="hidden sm:flex items-center space-x-1.5 p-1 rounded-xl bg-black/40 border border-amber-500/15">
          <Palette className="w-3.5 h-3.5 text-amber-400 ml-1.5 mr-0.5" />
          {themeOptions.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelectTheme(t.id)}
              title={`Theme: ${t.label} (B)`}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                settings.theme === t.id
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-400/50 shadow-sm'
                  : 'text-stone-400 hover:text-amber-200 hover:bg-white/5'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${t.color}`} />
              <span className="hidden md:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Interval Selector */}
        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-black/40 border border-amber-500/15">
          <Clock className="w-3.5 h-3.5 text-amber-400 ml-1.5 mr-0.5" />
          {intervalOptions.map((sec) => (
            <button
              key={sec}
              onClick={() => onSetInterval(sec)}
              className={`px-2 py-1 rounded-lg text-xs font-sans font-medium transition ${
                settings.intervalSeconds === sec
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-400/50'
                  : 'text-stone-400 hover:text-amber-200'
              }`}
            >
              {sec < 60 ? `${sec}s` : `${sec / 60}m`}
            </button>
          ))}
        </div>

        {/* Extra Utilities */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onPlayBell}
            title="Ring Sanctuary Bell"
            className="p-2.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 text-amber-300 transition active:scale-95"
          >
            <Bell className="w-4 h-4" />
          </button>

          <button
            onClick={onLockScreensaver}
            title="Lock Pure Screensaver Mode (Hide Controls)"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-amber-950/60 hover:bg-amber-900/80 border border-amber-500/40 text-amber-200 text-xs font-medium transition active:scale-95"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Lock Screen</span>
          </button>
        </div>
      </div>
    </div>
  );
};
