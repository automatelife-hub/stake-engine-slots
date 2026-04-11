import { writable, derived } from 'svelte/store';
import { createActor } from 'xstate';
import { gameMachine } from '../game/machine';

export const gameActor = createActor(gameMachine);

export const gameState = writable(gameActor.getSnapshot());

gameActor.subscribe((snapshot) => {
  gameState.set(snapshot);
});

export const balance = derived(gameState, ($s) => $s.context.balance);
export const betAmount = derived(gameState, ($s) => $s.context.betAmount);
export const grid = derived(gameState, ($s) => $s.context.grid);
export const lastResult = derived(gameState, ($s) => $s.context.lastResult);
export const mode = derived(gameState, ($s) => $s.context.mode);
export const freeSpinsRemaining = derived(gameState, ($s) => $s.context.freeSpinsRemaining);
export const errorCode = derived(gameState, ($s) => $s.context.error);
export const isSpinning = derived(gameState, ($s) => $s.matches('spinning'));
export const isIdle = derived(gameState, ($s) => $s.matches('idle'));
export const canSpin = derived(
  gameState,
  ($s) => $s.matches('idle') && $s.context.balance >= $s.context.betAmount,
);

export function send(event: Parameters<typeof gameActor.send>[0]) {
  gameActor.send(event);
}
