import { Container, Sprite, Ticker } from 'pixi.js';
import { getSymbolTexture } from './symbol-loader';
import { REELS, ROWS, type SymbolId } from '../game/types';

const SYMBOL_SIZE = 148;
const ROW_HEIGHT = 167;
const REEL_START_X = 80;
const REEL_START_Y = 80;
const SPIN_SPEED = 30;
const DECEL_RATE = 0.92;

interface ReelState {
  container: Container;
  symbols: Sprite[];
  speed: number;
  spinning: boolean;
  targetGrid: SymbolId[] | null;
  stopDelay: number;
}

const reels: ReelState[] = [];

export function createReelContainers(parent: Container): void {
  for (let r = 0; r < REELS; r++) {
    const container = new Container();
    container.x = REEL_START_X + r * SYMBOL_SIZE;
    container.y = REEL_START_Y;

    const symbols: Sprite[] = [];
    for (let row = 0; row < ROWS + 1; row++) {
      const sprite = new Sprite(getSymbolTexture('L4'));
      sprite.width = SYMBOL_SIZE;
      sprite.height = SYMBOL_SIZE;
      sprite.y = row * ROW_HEIGHT;
      container.addChild(sprite);
      symbols.push(sprite);
    }

    parent.addChild(container);
    reels.push({
      container,
      symbols,
      speed: 0,
      spinning: false,
      targetGrid: null,
      stopDelay: r * 150,
    });
  }
}

export function startSpin(): void {
  for (const reel of reels) {
    reel.spinning = true;
    reel.speed = SPIN_SPEED;
    reel.targetGrid = null;
  }
}

export function setResult(grid: SymbolId[][]): Promise<void> {
  return new Promise((resolve) => {
    let stoppedCount = 0;

    for (let r = 0; r < REELS; r++) {
      const reel = reels[r];
      reel.targetGrid = grid[r];

      setTimeout(() => {
        reel.spinning = false;
        stoppedCount++;
        if (stoppedCount === REELS) resolve();
      }, reel.stopDelay + 400);
    }
  });
}

export function updateReels(ticker: Ticker): void {
  for (const reel of reels) {
    if (reel.speed <= 0) continue;

    if (!reel.spinning) {
      reel.speed *= DECEL_RATE;
      if (reel.speed < 0.5) {
        reel.speed = 0;
        if (reel.targetGrid) {
          for (let row = 0; row < ROWS; row++) {
            reel.symbols[row].texture = getSymbolTexture(reel.targetGrid[row]);
            reel.symbols[row].y = row * ROW_HEIGHT;
          }
        }
        continue;
      }
    }

    for (const sprite of reel.symbols) {
      sprite.y += reel.speed * ticker.deltaTime;
      if (sprite.y > (ROWS + 1) * ROW_HEIGHT) {
        sprite.y -= (ROWS + 1) * ROW_HEIGHT;
        const randomSymbols: SymbolId[] = ['H1', 'H2', 'H3', 'H4', 'L1', 'L2', 'L3', 'L4'];
        sprite.texture = getSymbolTexture(
          randomSymbols[Math.floor(Math.random() * randomSymbols.length)],
        );
      }
    }
  }
}
