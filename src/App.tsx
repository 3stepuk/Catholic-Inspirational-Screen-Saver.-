import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { CHURCH_QUOTES } from './data/quotes';
import { Quote, ScreensaverSettings, VisualTheme } from './types';
import { ScreensaverCanvas } from './components/ScreensaverCanvas';
import { LiturgicalClock } from './components/LiturgicalClock';
import { QuoteDisplay } from './components/QuoteDisplay';
import { SettingsBar } from './components/SettingsBar';
import { CatalogModal } from './components/CatalogModal';
import { SettingsModal } from './components/SettingsModal';
import { ambientAudio } from './lib/ambientAudio';
import { Filter, RotateCcw } from 'lucide-react';

const DEFAULT_SETTINGS: ScreensaverSettings = {
  intervalSeconds: 15,
  autoCycle: true,
  theme: 'candlelight',
  fontStyle: 'cormorant',
  showClock: true,
  showLatin: true,
  showReflection: true,
  soundEnabled: false,
  ambientSoundType: 'organ',
  soundVolume: 0.25,
  particlesEnabled: true,
  eraFilter: 'All',
  categoryFilter: 'All',
  authorFilter: 'All',
  onlyFavorites: false,
};

export default function App() {
  // Load settings from localStorage
  const [settings, setSettings] = useState<ScreensaverSettings>(() => {
    try {
      const saved = localStorage.getItem('verbum_patrum_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Save settings when updated
  useEffect(() => {
    try {
      localStorage.setItem('verbum_patrum_settings', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  // Custom Quotes from localStorage
  const [customQuotes, setCustomQuotes] = useState<Quote[]>(() => {
    try {
      const saved = localStorage.getItem('verbum_patrum_custom_quotes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Combine built-in quotes + custom quotes
  const allQuotes = useCallback(() => {
    return [...CHURCH_QUOTES, ...customQuotes];
  }, [customQuotes]);

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('verbum_patrum_favorites');
      return saved ? JSON.parse(saved) : ['q3', 'q8', 'q14', 'q31'];
    } catch {
      return ['q3', 'q8', 'q14', 'q31'];
    }
  });

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('verbum_patrum_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  // Active Quote State
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [isUserActive, setIsUserActive] = useState<boolean>(true);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Modals and Catalog Filters
  const [isCatalogOpen, setIsCatalogOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [catalogInitialEra, setCatalogInitialEra] = useState<Quote['era'] | 'All'>('All');
  const [catalogInitialCategory, setCatalogInitialCategory] = useState<Quote['category'] | 'All'>('All');

  const handleOpenCatalogWithEra = (era: Quote['era']) => {
    setCatalogInitialEra(era);
    setCatalogInitialCategory('All');
    setIsCatalogOpen(true);
  };

  const handleOpenCatalogWithCategory = (category: Quote['category']) => {
    setCatalogInitialCategory(category);
    setCatalogInitialEra('All');
    setIsCatalogOpen(true);
  };

  // Idle Activity Timer Ref
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle Mouse Movement (Fade controls out during inactivity)
  const handleUserActivity = useCallback(() => {
    if (isLocked) {
      setIsUserActive(false);
      return;
    }

    setIsUserActive(true);

    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    idleTimerRef.current = setTimeout(() => {
      setIsUserActive(false);
    }, 4500); // 4.5 seconds of quietness before hiding controls
  }, [isLocked]);

  useEffect(() => {
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('touchstart', handleUserActivity);

    handleUserActivity();

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [handleUserActivity]);

  // Current active quote & Filtered rotation
  const rawQuotesList = allQuotes();
  const quotesList = useMemo(() => {
    return rawQuotesList.filter((q) => {
      // Era filter
      if (settings.eraFilter && settings.eraFilter !== 'All' && q.era !== settings.eraFilter) {
        return false;
      }
      // Category / Theme filter
      if (
        settings.categoryFilter &&
        settings.categoryFilter !== 'All' &&
        q.category !== settings.categoryFilter
      ) {
        return false;
      }
      // Author / Source filter
      if (settings.authorFilter && settings.authorFilter !== 'All') {
        if (!q.author.toLowerCase().includes(settings.authorFilter.toLowerCase())) {
          return false;
        }
      }
      // Favorites filter
      if (settings.onlyFavorites && !favorites.includes(q.id)) {
        return false;
      }
      return true;
    });
  }, [
    rawQuotesList,
    settings.eraFilter,
    settings.categoryFilter,
    settings.authorFilter,
    settings.onlyFavorites,
    favorites,
  ]);

  // Keep index within bounds
  useEffect(() => {
    if (quotesList.length > 0 && currentIndex >= quotesList.length) {
      setCurrentIndex(0);
    }
  }, [quotesList.length, currentIndex]);

  const currentQuote = quotesList[currentIndex] || quotesList[0];
  const hasActiveFilter =
    settings.eraFilter !== 'All' ||
    settings.categoryFilter !== 'All' ||
    (settings.authorFilter && settings.authorFilter !== 'All') ||
    settings.onlyFavorites;

  // Navigation handlers
  const handleNextQuote = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % quotesList.length);
    setProgressPercent(0);
  }, [quotesList.length]);

  const handlePrevQuote = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + quotesList.length) % quotesList.length);
    setProgressPercent(0);
  }, [quotesList.length]);

  const handleToggleShuffle = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * quotesList.length);
    setCurrentIndex(randomIndex);
    setProgressPercent(0);
  }, [quotesList.length]);

  // Slideshow Progress Timer
  useEffect(() => {
    if (!isPlaying || isCatalogOpen || isSettingsOpen) return;

    const intervalMs = 100;
    const totalMs = settings.intervalSeconds * 1000;

    const timer = setInterval(() => {
      setProgressPercent((prev) => {
        const next = prev + (intervalMs / totalMs) * 100;
        if (next >= 100) {
          handleNextQuote();
          return 0;
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, settings.intervalSeconds, isCatalogOpen, isSettingsOpen, handleNextQuote]);

  // Fullscreen Handler
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => console.error(err));
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => console.error(err));
      }
      setIsFullscreen(false);
    }
  };

  // Sound Engine Sync
  useEffect(() => {
    ambientAudio.setVolume(settings.soundVolume);
    if (settings.soundEnabled) {
      ambientAudio.startOrgan();
    } else {
      ambientAudio.stopOrgan();
    }
  }, [settings.soundEnabled, settings.soundVolume]);

  const handleToggleSound = () => {
    const newSoundState = !settings.soundEnabled;
    setSettings((prev) => ({ ...prev, soundEnabled: newSoundState }));
  };

  const handlePlayBell = () => {
    ambientAudio.playSanctuaryBell(1.0);
  };

  // Favorite Handler
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Copy Quote Handler
  const handleCopyQuote = (q: Quote) => {
    const text = `"${q.text}"\n— ${q.author} (${q.lifespan})\n${q.role}`;
    navigator.clipboard.writeText(text);
  };

  // Add Custom Quote
  const handleAddCustomQuote = (newQ: Omit<Quote, 'id'>) => {
    const customObj: Quote = {
      ...newQ,
      id: `custom_${Date.now()}`,
    };
    const updated = [...customQuotes, customObj];
    setCustomQuotes(updated);
    try {
      localStorage.setItem('verbum_patrum_custom_quotes', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing inside an input or textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          setIsPlaying((prev) => !prev);
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNextQuote();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handlePrevQuote();
          break;
        case 'KeyF':
          e.preventDefault();
          handleToggleFullscreen();
          break;
        case 'KeyM':
          e.preventDefault();
          handleToggleSound();
          break;
        case 'KeyB':
          e.preventDefault();
          {
            const themes: VisualTheme[] = [
              'candlelight',
              'stained-glass',
              'monastic-parchment',
              'vatican-crimson',
              'marian-blue',
            ];
            const nextIdx = (themes.indexOf(settings.theme) + 1) % themes.length;
            setSettings((prev) => ({ ...prev, theme: themes[nextIdx] }));
          }
          break;
        case 'KeyC':
          e.preventDefault();
          setIsCatalogOpen((prev) => !prev);
          break;
        case 'Escape':
          setIsCatalogOpen(false);
          setIsSettingsOpen(false);
          setIsLocked(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextQuote, handlePrevQuote, settings.theme]);

  return (
    <div
      onClick={handleUserActivity}
      className="relative w-screen h-screen overflow-hidden bg-stone-950 font-serif select-none"
    >
      {/* 1. Animated Atmospheric Canvas Background */}
      <ScreensaverCanvas
        theme={settings.theme}
        particlesEnabled={settings.particlesEnabled}
      />

      {/* 2. Top Header / Liturgical Clock (Fades out during screensaver inactivity) */}
      <div
        className={`transition-opacity duration-700 ${
          isUserActive && !isLocked
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <LiturgicalClock
          showClock={settings.showClock}
          isFullscreen={isFullscreen}
          soundEnabled={settings.soundEnabled}
          quoteCount={quotesList.length}
          onToggleFullscreen={handleToggleFullscreen}
          onToggleSound={handleToggleSound}
          onOpenCatalog={() => setIsCatalogOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      </div>

      {/* Active Filter Pill Badge (Fades out with controls) */}
      {hasActiveFilter && (
        <div
          className={`fixed top-16 left-1/2 -translate-x-1/2 z-30 transition-all duration-500 ${
            isUserActive && !isLocked
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-black/80 border border-amber-500/40 text-amber-200 text-xs font-sans backdrop-blur-md shadow-2xl">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium">
              Rotation Filtered ({quotesList.length} Quotes):
              {settings.authorFilter !== 'All' ? ` ${settings.authorFilter}` : ''}
              {settings.categoryFilter !== 'All' ? ` • ${settings.categoryFilter}` : ''}
              {settings.eraFilter !== 'All' ? ` • ${settings.eraFilter}` : ''}
              {settings.onlyFavorites ? ` • Favorites` : ''}
            </span>
            <button
              onClick={() =>
                setSettings((prev) => ({
                  ...prev,
                  eraFilter: 'All',
                  categoryFilter: 'All',
                  authorFilter: 'All',
                  onlyFavorites: false,
                }))
              }
              title="Reset Active Rotation Filters"
              className="ml-1 p-1 rounded-full bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 hover:text-white transition"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Main Center Quote Display or Empty Filter State */}
      {quotesList.length > 0 ? (
        currentQuote && (
          <QuoteDisplay
            quote={currentQuote}
            fontStyle={settings.fontStyle}
            theme={settings.theme}
            showLatin={settings.showLatin}
            showReflection={settings.showReflection}
            isFavorite={favorites.includes(currentQuote.id)}
            currentIndex={currentIndex}
            totalCount={quotesList.length}
            onToggleFavorite={handleToggleFavorite}
            onCopyQuote={handleCopyQuote}
            onSelectEraFilter={handleOpenCatalogWithEra}
            onSelectCategoryFilter={handleOpenCatalogWithCategory}
          />
        )
      ) : (
        <div className="relative z-20 flex flex-col items-center justify-center min-h-screen p-8 text-center max-w-md mx-auto">
          <div className="p-4 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 mb-4 shadow-xl">
            <Filter className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-amber-200 mb-2">
            No Matching Quotes
          </h2>
          <p className="text-xs font-sans text-stone-300/80 mb-6 leading-relaxed">
            No quotes match your active screensaver filter combination. Reset filters to resume full slideshow playback.
          </p>
          <button
            onClick={() =>
              setSettings((prev) => ({
                ...prev,
                eraFilter: 'All',
                categoryFilter: 'All',
                authorFilter: 'All',
                onlyFavorites: false,
              }))
            }
            className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold font-sans text-xs uppercase tracking-wider shadow-lg transition"
          >
            Reset Active Filters
          </button>
        </div>
      )}

      {/* 4. Bottom Controls & Progress Bar (Fades out during screensaver inactivity) */}
      <SettingsBar
        settings={settings}
        isPlaying={isPlaying}
        progressPercent={progressPercent}
        isUserActive={isUserActive && !isLocked}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onNext={handleNextQuote}
        onPrev={handlePrevQuote}
        onToggleShuffle={handleToggleShuffle}
        onSelectTheme={(theme) => setSettings((prev) => ({ ...prev, theme }))}
        onSetInterval={(intervalSeconds) =>
          setSettings((prev) => ({ ...prev, intervalSeconds }))
        }
        onPlayBell={handlePlayBell}
        onLockScreensaver={() => setIsLocked(true)}
        onUpdateSettings={(newPartial) =>
          setSettings((prev) => ({ ...prev, ...newPartial }))
        }
      />

      {/* 5. Modals */}
      <CatalogModal
        isOpen={isCatalogOpen}
        quotes={quotesList}
        favorites={favorites}
        currentQuoteId={currentQuote?.id || ''}
        initialEra={catalogInitialEra}
        initialCategory={catalogInitialCategory}
        onClose={() => {
          setIsCatalogOpen(false);
          setCatalogInitialEra('All');
          setCatalogInitialCategory('All');
        }}
        onSelectQuote={(selectedQ) => {
          const idx = quotesList.findIndex((q) => q.id === selectedQ.id);
          if (idx !== -1) setCurrentIndex(idx);
          setProgressPercent(0);
        }}
        onToggleFavorite={handleToggleFavorite}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        onClose={() => setIsSettingsOpen(false)}
        onUpdateSettings={(newPartial) =>
          setSettings((prev) => ({ ...prev, ...newPartial }))
        }
        onAddCustomQuote={handleAddCustomQuote}
      />

      {/* Unlock Screen Prompt when locked */}
      {isLocked && (
        <div
          onClick={() => setIsLocked(false)}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-full bg-black/60 border border-amber-500/30 text-amber-200/70 text-xs font-sans tracking-widest uppercase cursor-pointer hover:text-amber-200 hover:border-amber-400 transition animate-bounce"
        >
          Click anywhere or press ESC to unlock controls
        </div>
      )}
    </div>
  );
}
