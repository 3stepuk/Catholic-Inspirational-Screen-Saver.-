import React, { useState, useMemo } from 'react';
import { Quote, Era, QuoteCategory } from '../types';
import { Search, X, Heart, BookOpen, Filter, Check, Copy, Sparkles } from 'lucide-react';

interface CatalogModalProps {
  isOpen: boolean;
  quotes: Quote[];
  favorites: string[];
  currentQuoteId: string;
  initialEra?: Era | 'All';
  initialCategory?: QuoteCategory | 'All';
  onClose: () => void;
  onSelectQuote: (quote: Quote) => void;
  onToggleFavorite: (id: string) => void;
}

export const CatalogModal: React.FC<CatalogModalProps> = ({
  isOpen,
  quotes,
  favorites,
  currentQuoteId,
  initialEra = 'All',
  initialCategory = 'All',
  onClose,
  onSelectQuote,
  onToggleFavorite,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEra, setSelectedEra] = useState<Era | 'All'>(initialEra);
  const [selectedCategory, setSelectedCategory] = useState<QuoteCategory | 'All'>(initialCategory);
  const [onlyFavoritesFilter, setOnlyFavoritesFilter] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sync initial filters when modal opens or props change
  React.useEffect(() => {
    if (isOpen) {
      setSelectedEra(initialEra);
      setSelectedCategory(initialCategory);
    }
  }, [isOpen, initialEra, initialCategory]);

  const eras: (Era | 'All')[] = [
    'All',
    'Apostolic & Ante-Nicene',
    'Nicene & Post-Nicene',
    'Early Popes',
    'Medieval Doctors',
    'Counter-Reformation',
    'Latter-Day Popes',
  ];

  const categories: (QuoteCategory | 'All')[] = [
    'All',
    'Prayer & Contemplation',
    'Divine Love & Mercy',
    'Faith & Hope',
    'Grace & Holiness',
    'Eucharist & Liturgy',
    'Wisdom & Truth',
    'Peace & Comfort',
  ];

  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) => {
      const matchesSearch =
        q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (q.sourceWork && q.sourceWork.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesEra = selectedEra === 'All' || q.era === selectedEra;
      const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
      const matchesFavorites = !onlyFavoritesFilter || favorites.includes(q.id);

      return matchesSearch && matchesEra && matchesCategory && matchesFavorites;
    });
  }, [quotes, searchQuery, selectedEra, selectedCategory, onlyFavoritesFilter, favorites]);

  if (!isOpen) return null;

  const handleCopy = (e: React.MouseEvent, quote: Quote) => {
    e.stopPropagation();
    const formatted = `"${quote.text}" — ${quote.author} (${quote.lifespan})`;
    navigator.clipboard.writeText(formatted);
    setCopiedId(quote.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative flex flex-col w-full max-w-5xl h-[85vh] rounded-2xl bg-stone-950 border border-amber-500/30 text-amber-100 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-500/20 bg-amber-950/40">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-amber-200">
                Sacred Quote Catalog
              </h2>
              <p className="text-xs text-amber-300/60">
                Showing {filteredQuotes.length} of {quotes.length} devotional quotes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 bg-stone-900/60 border-b border-amber-500/10 space-y-3">
          <div className="flex items-center space-x-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search quotes, saints, popes, works..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/50 border border-amber-500/20 text-xs md:text-sm text-amber-100 placeholder-amber-200/40 focus:outline-none focus:border-amber-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Favorites Filter Toggle */}
            <button
              onClick={() => setOnlyFavoritesFilter(!onlyFavoritesFilter)}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border transition ${
                onlyFavoritesFilter
                  ? 'bg-rose-950/60 border-rose-500/60 text-rose-300'
                  : 'bg-black/40 border-amber-500/20 text-stone-400 hover:text-amber-200'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${onlyFavoritesFilter ? 'fill-rose-400' : ''}`} />
              <span>Saved ({favorites.length})</span>
            </button>
          </div>

          {/* Era Pills Filter */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs text-amber-300/50 uppercase font-sans tracking-wider whitespace-nowrap mr-1 shrink-0">
              Era:
            </span>
            {eras.map((era) => (
              <button
                key={era}
                onClick={() => setSelectedEra(era)}
                className={`px-3 py-1 rounded-full text-xs font-sans whitespace-nowrap border transition ${
                  selectedEra === era
                    ? 'bg-amber-500/25 border-amber-400 text-amber-200 font-semibold shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                    : 'bg-black/30 border-white/5 text-stone-400 hover:text-amber-200 hover:border-amber-500/30'
                }`}
              >
                {era}
              </button>
            ))}
          </div>

          {/* Category Pills Filter */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs text-amber-300/50 uppercase font-sans tracking-wider whitespace-nowrap mr-1 shrink-0">
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-sans whitespace-nowrap border transition ${
                  selectedCategory === cat
                    ? 'bg-amber-500/25 border-amber-400 text-amber-200 font-semibold shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                    : 'bg-black/30 border-white/5 text-stone-400 hover:text-amber-200 hover:border-amber-500/30'
                }`}
              >
                {cat}
              </button>
            ))}

            {(selectedEra !== 'All' || selectedCategory !== 'All' || searchQuery !== '' || onlyFavoritesFilter) && (
              <button
                onClick={() => {
                  setSelectedEra('All');
                  setSelectedCategory('All');
                  setSearchQuery('');
                  setOnlyFavoritesFilter(false);
                }}
                className="px-3 py-1 rounded-full text-xs font-sans whitespace-nowrap bg-stone-800 text-amber-300/80 hover:text-amber-100 border border-amber-500/30 transition shrink-0 ml-auto"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Quotes List Grid */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3">
          {filteredQuotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center text-amber-200/50 space-y-3">
              <Sparkles className="w-10 h-10 opacity-40" />
              <p className="text-sm">No quotes found matching your criteria.</p>
              <button
                onClick={() => {
                  setSelectedEra('All');
                  setSelectedCategory('All');
                  setSearchQuery('');
                  setOnlyFavoritesFilter(false);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-sans uppercase tracking-wider hover:bg-amber-500/30 transition"
              >
                Show All Quotes
              </button>
            </div>
          ) : (
            filteredQuotes.map((q) => {
              const isSelected = q.id === currentQuoteId;
              const isFav = favorites.includes(q.id);

              return (
                <div
                  key={q.id}
                  onClick={() => {
                    onSelectQuote(q);
                    onClose();
                  }}
                  className={`group relative p-4 md:p-5 rounded-xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-950/60 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : 'bg-stone-900/40 hover:bg-stone-900/80 border-amber-500/15 hover:border-amber-500/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEra(q.era);
                          }}
                          title={`Click to filter by era: ${q.era}`}
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-sans uppercase font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/40 hover:border-amber-400 transition"
                        >
                          {q.era}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCategory(q.category);
                          }}
                          title={`Click to filter by category: ${q.category}`}
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-sans text-amber-200/80 bg-white/5 hover:bg-white/10 hover:text-amber-100 border border-white/10 hover:border-amber-500/30 transition"
                        >
                          {q.category}
                        </button>
                      </div>

                      <p className="font-serif text-base md:text-lg text-amber-100 leading-relaxed group-hover:text-amber-200">
                        “{q.text}”
                      </p>

                      <div className="text-xs font-sans text-amber-300/70 pt-1">
                        <span className="font-bold">{q.author}</span> ({q.lifespan}) • {q.role}
                      </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={(e) => handleCopy(e, q)}
                        title="Copy Quote"
                        className="p-2 rounded-lg bg-black/40 hover:bg-amber-950/60 text-stone-400 hover:text-amber-200 border border-white/5 transition"
                      >
                        {copiedId === q.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(q.id);
                        }}
                        title="Toggle Favorite"
                        className="p-2 rounded-lg bg-black/40 hover:bg-rose-950/60 text-stone-400 hover:text-rose-300 border border-white/5 transition"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            isFav ? 'fill-rose-400 text-rose-400' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
