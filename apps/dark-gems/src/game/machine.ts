import { setup, assign, fromPromise } from 'xstate';
import { authenticate, play, endRound, RgsError } from './rgs-client';
import type { SymbolId, SpinResult, GameMode } from './types';
import { REELS, ROWS } from './types';

function emptyGrid(): SymbolId[][] {
  return Array.from({ length: REELS }, () =>
    Array.from({ length: ROWS }, () => 'L4' as SymbolId),
  );
}

interface GameContext {
  balance: number;
  currency: string;
  wincap: number;
  betAmount: number;
  grid: SymbolId[][];
  lastResult: SpinResult | null;
  mode: GameMode;
  freeSpinsRemaining: number;
  freeSpinsTotalWin: number;
  error: string | null;
  bookID: string | null;
}

type GameEvent =
  | { type: 'SPIN' }
  | { type: 'BET_UP' }
  | { type: 'BET_DOWN' }
  | { type: 'DISMISS_ERROR' }
  | { type: 'ANIMATION_DONE' }
  | { type: 'FREE_SPIN_INTRO_DONE' };

const BET_LEVELS = [20, 40, 60, 100, 200, 500, 1000, 2000];

export const gameMachine = setup({
  types: {
    context: {} as GameContext,
    events: {} as GameEvent,
  },
  actors: {
    authenticateActor: fromPromise(async () => {
      return await authenticate();
    }),
    spinActor: fromPromise(async ({ input }: { input: { betAmount: number; mode: GameMode } }) => {
      return await play(input.betAmount, input.mode);
    }),
    endRoundActor: fromPromise(
      async ({ input }: { input: { bookID: string; payoutMultiplier: number } }) => {
        return await endRound(input.bookID, input.payoutMultiplier);
      },
    ),
  },
}).createMachine({
  id: 'darkGems',
  initial: 'authenticating',
  context: {
    balance: 0,
    currency: 'USD',
    wincap: 500000,
    betAmount: 100,
    grid: emptyGrid(),
    lastResult: null,
    mode: 'base',
    freeSpinsRemaining: 0,
    freeSpinsTotalWin: 0,
    error: null,
    bookID: null,
  },
  states: {
    authenticating: {
      invoke: {
        src: 'authenticateActor',
        onDone: {
          target: 'idle',
          actions: assign({
            balance: ({ event }) => event.output.balance,
            currency: ({ event }) => event.output.currency,
            wincap: ({ event }) => event.output.wincap,
          }),
        },
        onError: {
          target: 'error',
          actions: assign({
            error: ({ event }) =>
              event.error instanceof RgsError ? event.error.code : 'AUTH_FAILED',
          }),
        },
      },
    },

    idle: {
      on: {
        SPIN: {
          target: 'spinning',
          guard: ({ context }) => context.balance >= context.betAmount,
        },
        BET_UP: {
          actions: assign({
            betAmount: ({ context }) => {
              const idx = BET_LEVELS.indexOf(context.betAmount);
              return idx < BET_LEVELS.length - 1 ? BET_LEVELS[idx + 1] : context.betAmount;
            },
          }),
        },
        BET_DOWN: {
          actions: assign({
            betAmount: ({ context }) => {
              const idx = BET_LEVELS.indexOf(context.betAmount);
              return idx > 0 ? BET_LEVELS[idx - 1] : context.betAmount;
            },
          }),
        },
      },
    },

    spinning: {
      invoke: {
        src: 'spinActor',
        input: ({ context }) => ({ betAmount: context.betAmount, mode: context.mode }),
        onDone: {
          target: 'evaluating',
          actions: assign({
            grid: ({ event }) => event.output.grid,
            lastResult: ({ event }) => event.output,
            balance: ({ event }) => event.output.newBalance,
            bookID: ({ event }) => event.output.bookID,
          }),
        },
        onError: {
          target: 'error',
          actions: assign({
            error: ({ event }) =>
              event.error instanceof RgsError ? event.error.code : 'SPIN_FAILED',
          }),
        },
      },
    },

    evaluating: {
      always: [
        {
          target: 'winAnimation',
          guard: ({ context }) => (context.lastResult?.payoutMultiplier ?? 0) > 0,
        },
        {
          target: 'freeSpinIntro',
          guard: ({ context }) => (context.lastResult?.freeSpinsAwarded ?? 0) > 0,
        },
        {
          target: 'freeSpinSpin',
          guard: ({ context }) => context.freeSpinsRemaining > 0,
        },
        { target: 'idle' },
      ],
    },

    winAnimation: {
      on: {
        ANIMATION_DONE: [
          {
            target: 'endingRound',
            guard: ({ context }) => (context.lastResult?.payoutMultiplier ?? 0) > 0,
          },
        ],
      },
    },

    endingRound: {
      invoke: {
        src: 'endRoundActor',
        input: ({ context }) => ({
          bookID: context.bookID!,
          payoutMultiplier: context.lastResult!.payoutMultiplier,
        }),
        onDone: {
          actions: assign({
            balance: ({ event }) => event.output.newBalance,
          }),
          target: 'postWin',
        },
        onError: {
          target: 'error',
          actions: assign({ error: () => 'END_ROUND_FAILED' }),
        },
      },
    },

    postWin: {
      always: [
        {
          target: 'freeSpinIntro',
          guard: ({ context }) =>
            context.mode === 'base' && (context.lastResult?.freeSpinsAwarded ?? 0) > 0,
          actions: assign({
            freeSpinsRemaining: ({ context }) => context.lastResult?.freeSpinsAwarded ?? 0,
            freeSpinsTotalWin: 0,
          }),
        },
        {
          target: 'freeSpinSpin',
          guard: ({ context }) => context.freeSpinsRemaining > 0,
          actions: assign({
            freeSpinsTotalWin: ({ context }) =>
              context.freeSpinsTotalWin +
              (context.lastResult?.payoutMultiplier ?? 0) * context.betAmount,
          }),
        },
        { target: 'idle' },
      ],
    },

    freeSpinIntro: {
      on: {
        FREE_SPIN_INTRO_DONE: 'freeSpinSpin',
      },
    },

    freeSpinSpin: {
      entry: assign({
        mode: 'freespin',
        freeSpinsRemaining: ({ context }) => context.freeSpinsRemaining - 1,
      }),
      invoke: {
        src: 'spinActor',
        input: ({ context }) => ({ betAmount: context.betAmount, mode: 'freespin' as GameMode }),
        onDone: {
          target: 'evaluating',
          actions: assign({
            grid: ({ event }) => event.output.grid,
            lastResult: ({ event }) => event.output,
            balance: ({ event }) => event.output.newBalance,
            bookID: ({ event }) => event.output.bookID,
          }),
        },
        onError: {
          target: 'error',
          actions: assign({ error: () => 'FREE_SPIN_FAILED' }),
        },
      },
    },

    error: {
      on: {
        DISMISS_ERROR: 'idle',
      },
    },
  },
});
