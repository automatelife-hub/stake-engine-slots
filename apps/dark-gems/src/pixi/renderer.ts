import { Application } from 'pixi.js';

let app: Application | null = null;

export async function initPixi(canvas: HTMLCanvasElement): Promise<Application> {
  app = new Application();
  await app.init({
    canvas,
    width: 960,
    height: 640,
    backgroundColor: 0x0a0a1e,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });
  return app;
}

export function getApp(): Application {
  if (!app) throw new Error('PixiJS not initialized');
  return app;
}

export function destroyPixi(): void {
  if (app) {
    app.destroy(true);
    app = null;
  }
}
