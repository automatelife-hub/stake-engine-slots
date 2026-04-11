import { Assets, Texture } from 'pixi.js';
import { SYMBOL_ID_MAP, type SymbolId } from '../game/types';

const ASSET_BASE = 'assets/symbols/';
const textureCache = new Map<SymbolId, Texture>();

export async function loadSymbolTextures(): Promise<void> {
  const entries = Object.entries(SYMBOL_ID_MAP) as [SymbolId, string][];

  const promises = entries.map(async ([id, name]) => {
    const texture = await Assets.load<Texture>(`${ASSET_BASE}${name}.svg`);
    textureCache.set(id, texture);
  });

  await Promise.all(promises);
}

export function getSymbolTexture(id: SymbolId): Texture {
  const tex = textureCache.get(id);
  if (!tex) throw new Error(`Symbol texture not loaded: ${id}`);
  return tex;
}

export async function loadUiTextures(): Promise<Record<string, Texture>> {
  const uiAssets = [
    'assets/ui/background.svg',
    'assets/ui/reel-frame.svg',
    'assets/ui/win-display.svg',
    'assets/ui/free-spins-counter.svg',
    'assets/ui/multiplier-badge.svg',
  ];

  const textures: Record<string, Texture> = {};
  for (const path of uiAssets) {
    const key = path.split('/').pop()!.replace('.svg', '');
    textures[key] = await Assets.load<Texture>(path);
  }
  return textures;
}
