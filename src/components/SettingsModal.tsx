import React, { useState } from 'react';
import { ScreensaverSettings, FontStyle, VisualTheme, Era, QuoteCategory, Quote } from '../types';
import { X, Sliders, Volume2, Type, Sparkles, Plus, Check, Filter, Heart, RotateCcw } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  settings: ScreensaverSettings;
  onClose: () => void;
  onUpdateSettings: (newSettings: Partial<ScreensaverSettings>) => void;
  onAddCustomQuote: (quote: Omit<Quote, 'id'>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onClose,
  onUpdateSettings,
  onAddCustomQuote,
}) => {
  const [activeTab, setActiveTab] = useState<'filters' | 'display' | 'audio' | 'custom'>('filters');

  // Custom quote form state
  const [customText, setCustomText] = useState('');
  const [customAuthor, setCustomAuthor] = useState('');
  const [customRole, setCustomRole] = useState('Catholic Devotional Writer');
  const [customEra, setCustomEra] = useState<Era>('Latter-Day Popes');
  const [customCategory, setCustomCategory] = useState<QuoteCategory>('Prayer & Contemplation');
  const [customAddedSuccess, setCustomAddedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim() || !customAuthor.trim()) return;

    onAddCustomQuote({
      text: customText.trim(),
      author: customAuthor.trim(),
      era: customEra,
      lifespan: 'Custom Reflection',
      role: customRole.trim(),
      category: customCategory,
    });

    setCustomText('');
    setCustomAuthor('');
    setCustomAddedSuccess(true);
    setTimeout(() => setCustomAddedSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative flex flex-col w-full max-w-2xl bg-stone-950 border border-amber-500/30 text-amber-100 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-amber-950/40 border-b border-amber-500/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-amber-200">
                Screensaver Preferences
              </h2>
              <p className="text-xs text-amber-300/60">
                Customize visuals, typography, audio & custom quotes
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

        {/* Tab Bar */}
        <div className="flex border-b border-amber-500/15 bg-stone-900/50">
          <button
            onClick={() => setActiveTab('filters')}
            className={`flex-1 py-3 text-xs md:text-sm font-medium tracking-wide uppercase font-sans border-b-2 transition flex items-center justify-center space-x-1.5 ${
              activeTab === 'filters'
                ? 'border-amber-400 text-amber-200 bg-amber-500/10'
                : 'border-transparent text-stone-400 hover:text-amber-200'
            }`}
          >
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span>Rotation Filters</span>
          </button>

          <button
            onClick={() => setActiveTab('display')}
            className={`flex-1 py-3 text-xs md:text-sm font-medium tracking-wide uppercase font-sans border-b-2 transition ${
              activeTab === 'display'
                ? 'border-amber-400 text-amber-200 bg-amber-500/10'
                : 'border-transparent text-stone-400 hover:text-amber-200'
            }`}
          >
            Display & Visuals
          </button>

          <button
            onClick={() => setActiveTab('audio')}
            className={`flex-1 py-3 text-xs md:text-sm font-medium tracking-wide uppercase font-sans border-b-2 transition ${
              activeTab === 'audio'
                ? 'border-amber-400 text-amber-200 bg-amber-500/10'
                : 'border-transparent text-stone-400 hover:text-amber-200'
            }`}
          >
            Sanctuary Audio
          </button>

          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-3 text-xs md:text-sm font-medium tracking-wide uppercase font-sans border-b-2 transition ${
              activeTab === 'custom'
                ? 'border-amber-400 text-amber-200 bg-amber-500/10'
                : 'border-transparent text-stone-400 hover:text-amber-200'
            }`}
          >
            Add Quote
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'filters' && (
            <div className="space-y-6">
              {/* Active Filter Summary Bar */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30">
                <div className="space-y-0.5">
                  <div className="text-xs uppercase font-sans tracking-wider text-amber-300/70 font-semibold">
                    Current Screensaver Playback Filter
                  </div>
                  <div className="text-sm font-serif font-bold text-amber-100 flex flex-wrap gap-2 pt-1">
                    {settings.authorFilter !== 'All' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs">
                        Author: {settings.authorFilter}
                      </span>
                    )}
                    {settings.categoryFilter !== 'All' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs">
                        Theme: {settings.categoryFilter}
                      </span>
                    )}
                    {settings.eraFilter !== 'All' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs">
                        Era: {settings.eraFilter}
                      </span>
                    )}
                    {settings.onlyFavorites && (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs flex items-center space-x-1">
                        <Heart className="w-3 h-3 fill-rose-300" />
                        <span>Favorites Only</span>
                      </span>
                    )}
                    {settings.authorFilter === 'All' &&
                      settings.categoryFilter === 'All' &&
                      settings.eraFilter === 'All' &&
                      !settings.onlyFavorites && (
                        <span className="text-xs text-amber-200/70 italic font-sans">
                          Playing all quotes in catalog
                        </span>
                      )}
                  </div>
                </div>

                {(settings.authorFilter !== 'All' ||
                  settings.categoryFilter !== 'All' ||
                  settings.eraFilter !== 'All' ||
                  settings.onlyFavorites) && (
                  <button
                    onClick={() =>
                      onUpdateSettings({
                        authorFilter: 'All',
                        categoryFilter: 'All',
                        eraFilter: 'All',
                        onlyFavorites: false,
                      })
                    }
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/30 text-xs font-sans transition shrink-0 ml-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Source / Author Filter */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-sans text-amber-300/70 mb-2">
                  Categorize by Author / Source
                </label>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => onUpdateSettings({ authorFilter: 'All' })}
                      className={`px-3 py-1 rounded-full text-xs font-sans transition border ${
                        settings.authorFilter === 'All'
                          ? 'bg-amber-500/30 border-amber-400 text-amber-100 font-bold'
                          : 'bg-black/30 border-white/10 text-stone-400 hover:text-amber-200'
                      }`}
                    >
                      All Authors
                    </button>
                    {[
                      'St. Augustine',
                      'St. Thomas Aquinas',
                      'St. John Paul II',
                      'Pope Benedict XVI',
                      'Pope Francis',
                      'St. John Chrysostom',
                      'St. Teresa of Ávila',
                      'St. Catherine of Siena',
                      'St. Francis of Assisi',
                      'St. Thérèse of Lisieux',
                      'St. Ignatius of Antioch',
                      'St. Gregory the Great',
                      'St. Leo the Great',
                    ].map((author) => (
                      <button
                        key={author}
                        onClick={() => onUpdateSettings({ authorFilter: author })}
                        className={`px-3 py-1 rounded-full text-xs font-sans transition border ${
                          settings.authorFilter === author
                            ? 'bg-amber-500/30 border-amber-400 text-amber-100 font-bold shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                            : 'bg-black/30 border-white/10 text-stone-400 hover:text-amber-200'
                        }`}
                      >
                        {author}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Thematic Categories Filter */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-sans text-amber-300/70 mb-2">
                  Categorize by Thematic Theme
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => onUpdateSettings({ categoryFilter: 'All' })}
                    className={`px-3 py-1 rounded-full text-xs font-sans transition border ${
                      settings.categoryFilter === 'All'
                        ? 'bg-amber-500/30 border-amber-400 text-amber-100 font-bold'
                        : 'bg-black/30 border-white/10 text-stone-400 hover:text-amber-200'
                    }`}
                  >
                    All Themes
                  </button>
                  {(
                    [
                      'Prayer & Contemplation',
                      'Divine Love & Mercy',
                      'Faith & Hope',
                      'Grace & Holiness',
                      'Eucharist & Liturgy',
                      'Wisdom & Truth',
                      'Peace & Comfort',
                    ] as QuoteCategory[]
                  ).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => onUpdateSettings({ categoryFilter: cat })}
                      className={`px-3 py-1 rounded-full text-xs font-sans transition border ${
                        settings.categoryFilter === cat
                          ? 'bg-amber-500/30 border-amber-400 text-amber-100 font-bold shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                          : 'bg-black/30 border-white/10 text-stone-400 hover:text-amber-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Historical Era Filter */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-sans text-amber-300/70 mb-2">
                  Categorize by Historical Era
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => onUpdateSettings({ eraFilter: 'All' })}
                    className={`px-3 py-1 rounded-full text-xs font-sans transition border ${
                      settings.eraFilter === 'All'
                        ? 'bg-amber-500/30 border-amber-400 text-amber-100 font-bold'
                        : 'bg-black/30 border-white/10 text-stone-400 hover:text-amber-200'
                    }`}
                  >
                    All Eras
                  </button>
                  {(
                    [
                      'Apostolic & Ante-Nicene',
                      'Nicene & Post-Nicene',
                      'Early Popes',
                      'Medieval Doctors',
                      'Counter-Reformation',
                      'Latter-Day Popes',
                    ] as Era[]
                  ).map((era) => (
                    <button
                      key={era}
                      onClick={() => onUpdateSettings({ eraFilter: era })}
                      className={`px-3 py-1 rounded-full text-xs font-sans transition border ${
                        settings.eraFilter === era
                          ? 'bg-amber-500/30 border-amber-400 text-amber-100 font-bold shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                          : 'bg-black/30 border-white/10 text-stone-400 hover:text-amber-200'
                      }`}
                    >
                      {era}
                    </button>
                  ))}
                </div>
              </div>

              {/* Favorites Only Toggle */}
              <div className="pt-2 border-t border-amber-500/15">
                <label className="flex items-center justify-between p-3.5 rounded-xl bg-black/40 border border-amber-500/20 cursor-pointer">
                  <div className="flex items-center space-x-2.5">
                    <Heart className="w-4 h-4 text-rose-400 fill-rose-400/30" />
                    <div>
                      <span className="text-xs font-bold text-amber-200 block">
                        Play Only Favorite Quotes
                      </span>
                      <span className="text-[11px] text-amber-300/60 block">
                        Limit screensaver slideshow strictly to quotes you have favorited
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.onlyFavorites}
                    onChange={(e) => onUpdateSettings({ onlyFavorites: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'display' && (
            <div className="space-y-6">
              {/* Visual Atmosphere Theme */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-sans text-amber-300/70 mb-2">
                  Atmospheric Visual Theme
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {(
                    [
                      { id: 'candlelight', label: 'Candlelight Sanctuary', desc: 'Flickering warm glow' },
                      { id: 'stained-glass', label: 'Gothic Stained Glass', desc: 'Shimmering light rays' },
                      { id: 'monastic-parchment', label: 'Monastic Parchment', desc: 'Illuminated manuscript' },
                      { id: 'vatican-crimson', label: 'Vatican Crimson', desc: 'Regal papal red' },
                      { id: 'marian-blue', label: 'Marian Blue', desc: 'Celestial indigo' },
                    ] as { id: VisualTheme; label: string; desc: string }[]
                  ).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => onUpdateSettings({ theme: t.id })}
                      className={`p-3 rounded-xl border text-left transition ${
                        settings.theme === t.id
                          ? 'bg-amber-950/60 border-amber-400 text-amber-100 shadow-md'
                          : 'bg-black/30 border-amber-500/15 text-stone-400 hover:border-amber-500/30 hover:text-amber-200'
                      }`}
                    >
                      <div className="text-xs font-bold font-serif">{t.label}</div>
                      <div className="text-[10px] text-stone-400 mt-0.5">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Typography Style */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-sans text-amber-300/70 mb-2">
                  Typography Style
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(
                    [
                      { id: 'cinzel', label: 'Cinzel Serif', sample: 'In Principio' },
                      { id: 'cormorant', label: 'Cormorant Garamond', sample: 'Lux in Tenebris' },
                      { id: 'playfair', label: 'Playfair Display', sample: 'Veritas et Amor' },
                    ] as { id: FontStyle; label: string; sample: string }[]
                  ).map((f) => (
                    <button
                      key={f.id}
                      onClick={() => onUpdateSettings({ fontStyle: f.id })}
                      className={`p-3 rounded-xl border text-center transition ${
                        settings.fontStyle === f.id
                          ? 'bg-amber-950/60 border-amber-400 text-amber-100'
                          : 'bg-black/30 border-amber-500/15 text-stone-400 hover:border-amber-500/30 hover:text-amber-200'
                      }`}
                    >
                      <div className="text-xs font-bold">{f.label}</div>
                      <div className="text-[10px] italic text-amber-300/60 mt-1 font-serif">
                        {f.sample}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-amber-500/15">
                <label className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-amber-500/15 cursor-pointer">
                  <span className="text-xs font-medium text-amber-200">
                    Display Liturgical Clock
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.showClock}
                    onChange={(e) => onUpdateSettings({ showClock: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-amber-500/15 cursor-pointer">
                  <span className="text-xs font-medium text-amber-200">
                    Show Latin Original Text
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.showLatin}
                    onChange={(e) => onUpdateSettings({ showLatin: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-amber-500/15 cursor-pointer">
                  <span className="text-xs font-medium text-amber-200">
                    Show Devotional Reflection
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.showReflection}
                    onChange={(e) => onUpdateSettings({ showReflection: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-amber-500/15 cursor-pointer">
                  <span className="text-xs font-medium text-amber-200">
                    Floating Golden Embers Particle Canvas
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.particlesEnabled}
                    onChange={(e) => onUpdateSettings({ particlesEnabled: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'audio' && (
            <div className="space-y-6">
              {/* Sound Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-amber-500/20">
                <div>
                  <div className="text-sm font-bold text-amber-200">
                    Ambient Sanctuary Drone
                  </div>
                  <div className="text-xs text-amber-300/60">
                    Synthesized organ drone using Web Audio API (No downloads required)
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => onUpdateSettings({ soundEnabled: e.target.checked })}
                  className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              {/* Master Volume Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-amber-200">
                  <span>Organ Volume</span>
                  <span>{Math.round(settings.soundVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.soundVolume}
                  onChange={(e) => onUpdateSettings({ soundVolume: parseFloat(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {activeTab === 'custom' && (
            <form onSubmit={handleAddCustom} className="space-y-4">
              {customAddedSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Custom quote added successfully to your local catalog!</span>
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-wider font-sans text-amber-300/70 mb-1">
                  Devotional Quote Text *
                </label>
                <textarea
                  rows={3}
                  required
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Enter quote or prayer passage..."
                  className="w-full p-3 rounded-xl bg-black/50 border border-amber-500/20 text-xs text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-sans text-amber-300/70 mb-1">
                    Author / Saint *
                  </label>
                  <input
                    type="text"
                    required
                    value={customAuthor}
                    onChange={(e) => setCustomAuthor(e.target.value)}
                    placeholder="e.g. St. Francis de Sales"
                    className="w-full p-2.5 rounded-xl bg-black/50 border border-amber-500/20 text-xs text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-sans text-amber-300/70 mb-1">
                    Title or Role
                  </label>
                  <input
                    type="text"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    placeholder="e.g. Doctor of the Church"
                    className="w-full p-2.5 rounded-xl bg-black/50 border border-amber-500/20 text-xs text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Save to Local Catalog</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
