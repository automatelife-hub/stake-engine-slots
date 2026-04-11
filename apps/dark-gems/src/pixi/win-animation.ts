import { Graphics, Container, Text, TextStyle } from 'pixi.js';
import type { WinLine } from '../game/types';

const REEL_START_X = 80;
const REEL_START_Y = 80;
const SYMBOL_SIZE = 148;
const ROW_HEIGHT = 167;
const WIN_LINE_COLORS = [
  0xff2244, 0x00ff70, 0x4488ff, 0xffdd00, 0xcc44ff, 0xff8800, 0x00ccff, 0xff44aa, 0x88ff00,
  0xffaa00, 0x44ffcc, 0xaa44ff, 0xff6644, 0x44ff66, 0x6644ff, 0xffcc44, 0x44ffff, 0xff4488,
  0x88ff44, 0xccff44,
];

// Payline definitions (20 lines, positions per reel [row index 0-2])
const PAYLINE_DEFS: number[][] = [
  [1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0],
  [2, 2, 2, 2, 2],
  [0, 0, 1, 2, 2],
  [2, 2, 1, 0, 0],
  [0, 1, 2, 1, 0],
  [2, 1, 0, 1, 2],
  [1, 0, 0, 0, 1],
  [1, 2, 2, 2, 1],
  [0, 1, 1, 1, 0],
  [2, 1, 1, 1, 2],
  [1, 0, 1, 0, 1],
  [1, 2, 1, 2, 1],
  [0, 0, 1, 0, 0],
  [2, 2, 1, 2, 2],
  [0, 1, 0, 1, 0],
  [2, 1, 2, 1, 2],
  [0, 0, 2, 0, 0],
  [2, 2, 0, 2, 2],
  [1, 1, 0, 1, 1],
];

export function drawWinLines(parent: Container, winLines: WinLine[]): Container {
  const container = new Container();

  for (const line of winLines) {
    const def = PAYLINE_DEFS[line.lineId - 1];
    if (!def) continue;

    const color = WIN_LINE_COLORS[(line.lineId - 1) % WIN_LINE_COLORS.length];
    const g = new Graphics();

    for (let r = 0; r < line.count; r++) {
      const cx = REEL_START_X + r * SYMBOL_SIZE + SYMBOL_SIZE / 2;
      const cy = REEL_START_Y + def[r] * ROW_HEIGHT + ROW_HEIGHT / 2;

      if (r === 0) {
        g.moveTo(cx, cy);
      } else {
        g.lineTo(cx, cy);
      }
    }

    g.stroke({ width: 4, color, alpha: 0.8 });
    container.addChild(g);
  }

  parent.addChild(container);
  return container;
}

export function showWinText(parent: Container, amount: number, currency: string): Container {
  const container = new Container();
  const style = new TextStyle({
    fontFamily: 'Arial, sans-serif',
    fontSize: 48,
    fontWeight: 'bold',
    fill: 0xffd700,
    stroke: { color: 0x000000, width: 4 },
    dropShadow: { color: 0x000000, blur: 8, distance: 2 },
  });

  const text = new Text({
    text: `${currency} ${(amount / 100).toFixed(2)}`,
    style,
  });
  text.anchor.set(0.5);
  text.x = 480;
  text.y = 540;

  container.addChild(text);
  parent.addChild(container);
  return container;
}
