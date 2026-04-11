export type SymbolId = 'W' | 'S' | 'H1' | 'H2' | 'H3' | 'H4' | 'L1' | 'L2' | 'L3' | 'L4';

export type GameMode = 'base' | 'freespin';

export interface AuthResponse {
  playerID: string;
  currency: string;
  balance: number;
  wincap: number;
}

export interface WinLine {
  lineId: number;
  symbol: SymbolId;
  count: number;
  multiplier: number;
}

export interface SpinResult {
  bookID: string;
  spinIndex: number;
  grid: SymbolId[][];
  payoutMultiplier: number;
  winLines: WinLine[];
  scatterCount: number;
  freeSpinsAwarded: number;
  newBalance: number;
  mode: GameMode;
}

export interface EndRoundResponse {
  newBalance: number;
}

export interface GameConfig {
  sessionID: string;
  lang: string;
  device: 'mobile' | 'desktop';
  rgsUrl: string;
}

export interface SymbolInfo {
  id: SymbolId;
  name: string;
  file: string;
  tier: 'special' | 'high' | 'low';
  animClass: string;
  glowColor: string;
}

export const REELS = 5;
export const ROWS = 3;
export const PAYLINES = 20;
export const WINCAP = 5000;

export const SYMBOL_ID_MAP: Record<SymbolId, string> = {
  W: 'wild',
  S: 'scatter',
  H1: 'diamond',
  H2: 'ruby',
  H3: 'emerald',
  H4: 'sapphire',
  L1: 'amethyst',
  L2: 'topaz',
  L3: 'ace',
  L4: 'king',
};
