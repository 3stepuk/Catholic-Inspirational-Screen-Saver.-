export type Era =
  | 'Apostolic & Ante-Nicene'
  | 'Nicene & Post-Nicene'
  | 'Early Popes'
  | 'Medieval Doctors'
  | 'Counter-Reformation'
  | 'Latter-Day Popes';

export type QuoteCategory =
  | 'Prayer & Contemplation'
  | 'Divine Love & Mercy'
  | 'Faith & Hope'
  | 'Grace & Holiness'
  | 'Eucharist & Liturgy'
  | 'Wisdom & Truth'
  | 'Peace & Comfort';

export interface Quote {
  id: string;
  text: string;
  author: string;
  era: Era;
  lifespan: string;
  role: string;
  category: QuoteCategory;
  latinOriginal?: string;
  reflectionPrompt?: string;
  sourceWork?: string;
}

export type VisualTheme =
  | 'candlelight'
  | 'stained-glass'
  | 'monastic-parchment'
  | 'vatican-crimson'
  | 'marian-blue';

export type FontStyle = 'cinzel' | 'cormorant' | 'playfair';

export interface ScreensaverSettings {
  intervalSeconds: number; // e.g. 15
  autoCycle: boolean;
  theme: VisualTheme;
  fontStyle: FontStyle;
  showClock: boolean;
  showLatin: boolean;
  showReflection: boolean;
  soundEnabled: boolean;
  ambientSoundType: 'organ' | 'bells-ambient' | 'silent';
  soundVolume: number;
  particlesEnabled: boolean;
  eraFilter: Era | 'All';
  categoryFilter: QuoteCategory | 'All';
  authorFilter: string | 'All';
  onlyFavorites: boolean;
}
