import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, FontStyle, VisualTheme, Era, QuoteCategory } from '../types';
import { Heart, Copy, Check, Quote as QuoteIcon, Book, Sparkles, ScrollText, Filter } from 'lucide-react';

interface QuoteDisplayProps {
  quote: Quote;
  fontStyle: FontStyle;
  theme: VisualTheme;
  showLatin: boolean;
  showReflection: boolean;
  isFavorite: boolean;
  currentIndex: number;
  totalCount: number;
  onToggleFavorite: (id: string) => void;
  onCopyQuote: (quote: Quote) => void;
  onSelectEraFilter?: (era: Era) => void;
  onSelectCategoryFilter?: (category: QuoteCategory) => void;
}

export const QuoteDisplay: React.FC<QuoteDisplayProps> = ({
  quote,
  fontStyle,
  theme,
  showLatin,
  showReflection,
  isFavorite,
  currentIndex,
  totalCount,
  onToggleFavorite,
  onCopyQuote,
  onSelectEraFilter,
  onSelectCategoryFilter,
}) => {
  const [copied, setCopied] = useState(false);
  const [showReflectionCard, setShowReflectionCard] = useState(false);

  const handleCopy = () => {
    onCopyQuote(quote);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine font family styling class based on settings
  const fontClass =
    fontStyle === 'cinzel'
      ? 'font-serif tracking-normal'
      : fontStyle === 'cormorant'
      ? 'font-serif tracking-wide leading-relaxed'
      : 'font-serif font-light leading-relaxed';

  // Theme-specific accent colors for text and badges
  const accentText =
    theme === 'vatican-crimson'
      ? 'text-amber-300'
      : theme === 'marian-blue'
      ? 'text-sky-200'
      : theme === 'stained-glass'
      ? 'text-amber-200'
      : 'text-amber-200/90';

  const badgeBg =
    theme === 'vatican-crimson'
      ? 'bg-amber-950/60 border-amber-500/40 text-amber-200'
      : theme === 'marian-blue'
      ? 'bg-sky-950/60 border-sky-400/40 text-sky-200'
      : 'bg-amber-950/50 border-amber-500/30 text-amber-300';

  // Extract first letter for drop cap
  const firstLetter = quote.text.charAt(0);
  const restOfQuote = quote.text.slice(1);

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20 max-w-5xl mx-auto text-center pointer-events-none select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={quote.id}
          initial={{ opacity: 0, filter: 'blur(4px)', scale: 0.99 }}
          animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
          exit={{ opacity: 0, filter: 'blur(4px)', scale: 0.99 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1.0] }}
          className="flex flex-col items-center w-full pointer-events-auto"
        >
          {/* Era & Category Pill */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <button
              onClick={() => onSelectEraFilter?.(quote.era)}
              title={`Click to filter catalog by era: ${quote.era}`}
              className={`flex items-center space-x-1 px-3.5 py-1 rounded-full text-[11px] uppercase tracking-widest font-sans font-semibold border backdrop-blur-md shadow-lg transition-all hover:scale-105 hover:border-amber-300 active:scale-95 cursor-pointer ${badgeBg}`}
            >
              <Filter className="w-3 h-3 text-amber-400 opacity-70" />
              <span>{quote.era}</span>
            </button>

            <button
              onClick={() => onSelectCategoryFilter?.(quote.category)}
              title={`Click to filter catalog by category: ${quote.category}`}
              className="flex items-center space-x-1 px-3.5 py-1 rounded-full text-[11px] uppercase tracking-widest font-sans font-medium bg-black/40 border border-white/10 text-stone-200 hover:text-amber-200 hover:border-amber-400/50 backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Filter className="w-3 h-3 text-amber-400 opacity-70" />
              <span>{quote.category}</span>
            </button>

            <span className="text-xs font-sans text-amber-300/40 px-2">
              {currentIndex + 1} / {totalCount}
            </span>
          </div>

          {/* Illuminated Framing Container */}
          <div className="relative p-8 md:p-12 lg:p-14 rounded-2xl bg-[#0c0c0b]/80 backdrop-blur-xl border border-[#c5a059]/30 shadow-[0_25px_60px_rgba(0,0,0,0.85)] max-w-4xl w-full gold-border-glow">
            {/* Corner Decorative Cross / Filigree Marks */}
            <div className="absolute top-4 left-4 text-[#c5a059]/60 text-sm font-serif">
              ✦
            </div>
            <div className="absolute top-4 right-4 text-[#c5a059]/60 text-sm font-serif">
              ✦
            </div>
            <div className="absolute bottom-4 left-4 text-[#c5a059]/60 text-sm font-serif">
              ✦
            </div>
            <div className="absolute bottom-4 right-4 text-[#c5a059]/60 text-sm font-serif">
              ✦
            </div>

            {/* Subtle Watermark Quote Icon */}
            <QuoteIcon className="absolute top-8 left-8 w-14 h-14 text-[#c5a059]/10 -rotate-180 pointer-events-none" />

            {/* Main Quote Text */}
            <blockquote className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl ${fontClass} ${accentText} drop-shadow-lg text-balance my-3 font-serif leading-tight tracking-tight`}>
              <span className="inline-block font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black gold-gradient mr-2 align-baseline leading-none float-left pt-1 pr-3 drop-shadow-[0_4px_12px_rgba(197,160,89,0.3)]">
                {firstLetter}
              </span>
              {restOfQuote}
            </blockquote>

            {/* Optional Latin Original Text */}
            {showLatin && quote.latinOriginal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 pt-4 border-t border-[#c5a059]/20 italic text-sm md:text-base font-serif text-[#d4c8b4]/70 tracking-wider"
              >
                “{quote.latinOriginal}”
              </motion.div>
            )}

            {/* Divider Line */}
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#c5a059]/50 to-transparent my-8 mx-auto" />

            {/* Author Attribution */}
            <div className="flex flex-col items-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-extrabold tracking-tight gold-gradient drop-shadow-md">
                {quote.author}
              </h2>

              <p className="text-xs sm:text-sm font-sans tracking-widest uppercase text-[#d4c8b4]/80 mt-2 font-semibold">
                {quote.lifespan} • {quote.role}
              </p>

              {quote.sourceWork && (
                <div className="flex items-center space-x-1.5 mt-2 text-xs sm:text-sm font-serif italic text-[#c5a059]/80">
                  <Book className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>{quote.sourceWork}</span>
                </div>
              )}
            </div>

            {/* Reflection / Prayer Prompt Collapsible Card */}
            {(showReflection || showReflectionCard) && quote.reflectionPrompt && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 p-4 rounded-xl bg-amber-950/40 border border-amber-500/25 text-left text-xs sm:text-sm font-serif text-amber-100/90 leading-relaxed shadow-inner"
              >
                <div className="flex items-center space-x-2 text-amber-400 font-sans font-semibold uppercase tracking-widest text-[11px] mb-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Devotional Reflection</span>
                </div>
                <p className="italic">{quote.reflectionPrompt}</p>
              </motion.div>
            )}

            {/* Action Bar inside card */}
            <div className="flex items-center justify-center space-x-3 mt-6 pt-2">
              <button
                onClick={() => onToggleFavorite(quote.id)}
                title={isFavorite ? 'Remove from Favorites' : 'Save to Favorites'}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all active:scale-95 ${
                  isFavorite
                    ? 'bg-rose-950/60 border-rose-500/60 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                    : 'bg-black/30 border-amber-500/20 text-amber-200/70 hover:text-amber-200 hover:bg-amber-950/40'
                }`}
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    isFavorite ? 'fill-rose-400 text-rose-400' : ''
                  }`}
                />
                <span>{isFavorite ? 'Saved' : 'Favorite'}</span>
              </button>

              <button
                onClick={handleCopy}
                title="Copy Quote Text"
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-black/30 border border-amber-500/20 text-amber-200/70 hover:text-amber-200 hover:bg-amber-950/40 transition-all active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              {quote.reflectionPrompt && !showReflection && (
                <button
                  onClick={() => setShowReflectionCard(!showReflectionCard)}
                  title="Toggle Reflection Prompt"
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-black/30 border border-amber-500/20 text-amber-200/70 hover:text-amber-200 hover:bg-amber-950/40 transition-all active:scale-95"
                >
                  <ScrollText className="w-3.5 h-3.5 text-amber-400" />
                  <span>{showReflectionCard ? 'Hide Reflection' : 'Reflect'}</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
