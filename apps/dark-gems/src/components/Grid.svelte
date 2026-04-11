<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { initPixi, getApp, destroyPixi } from '../pixi/renderer';
  import { loadSymbolTextures, loadUiTextures } from '../pixi/symbol-loader';
  import { createReelContainers, startSpin, setResult, updateReels } from '../pixi/reel-animation';
  import { drawWinLines, showWinText } from '../pixi/win-animation';
  import { grid, lastResult, gameState, send } from '../stores/game-store';
  import { Container, Sprite } from 'pixi.js';
  import type { SymbolId } from '../game/types';

  let canvas: HTMLCanvasElement;
  let winContainer: Container | null = null;
  let winTextContainer: Container | null = null;

  let prevState = '';

  onMount(async () => {
    const app = await initPixi(canvas);

    await loadSymbolTextures();
    const uiTex = await loadUiTextures();

    // Background
    const bg = new Sprite(uiTex['background']);
    bg.width = 960;
    bg.height = 640;
    app.stage.addChild(bg);

    // Reel frame
    const frame = new Sprite(uiTex['reel-frame']);
    frame.x = 0;
    frame.y = 0;
    app.stage.addChild(frame);

    // Reel containers
    const reelParent = new Container();
    app.stage.addChild(reelParent);
    createReelContainers(reelParent);

    // Tick-based animation
    app.ticker.add((ticker) => updateReels(ticker));

    // React to state changes
    const unsubState = gameState.subscribe((snapshot) => {
      const state = snapshot.value as string;

      if (state === 'spinning' && prevState !== 'spinning') {
        if (winContainer) { winContainer.destroy(); winContainer = null; }
        if (winTextContainer) { winTextContainer.destroy(); winTextContainer = null; }
        startSpin();
      }

      if (state === 'evaluating' && prevState === 'spinning') {
        const result = snapshot.context.lastResult;
        if (result) {
          setResult(result.grid as SymbolId[][]);
        }
      }

      if (state === 'winAnimation' && prevState !== 'winAnimation') {
        const result = snapshot.context.lastResult;
        if (result?.winLines.length) {
          winContainer = drawWinLines(app.stage, result.winLines);
          const winAmount = result.payoutMultiplier * snapshot.context.betAmount;
          winTextContainer = showWinText(app.stage, winAmount, snapshot.context.currency);
        }
        setTimeout(() => send({ type: 'ANIMATION_DONE' }), 2000);
      }

      prevState = state;
    });

    return () => {
      unsubState();
    };
  });

  onDestroy(() => {
    destroyPixi();
  });
</script>

<div class="grid-container">
  <canvas bind:this={canvas}></canvas>
</div>

<style>
  .grid-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    background: #0a0a1e;
  }
  canvas {
    max-width: 100%;
    height: auto;
  }
</style>
