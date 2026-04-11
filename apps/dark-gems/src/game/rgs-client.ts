import type { AuthResponse, SpinResult, EndRoundResponse, GameMode } from './types';

let rgsUrl = '';
let sessionID = '';

export function initRgs(url: string, session: string): void {
  rgsUrl = url.replace(/\/$/, '');
  sessionID = session;
}

async function rgsPost<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${rgsUrl}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionID}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ code: `HTTP_${res.status}` }));
    throw new RgsError(err.code ?? `HTTP_${res.status}`, err.message ?? res.statusText);
  }

  return res.json() as Promise<T>;
}

export class RgsError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = 'RgsError';
  }
}

export async function authenticate(): Promise<AuthResponse> {
  return rgsPost<AuthResponse>('/wallet/authenticate', { sessionID });
}

export async function play(betAmount: number, mode: GameMode): Promise<SpinResult> {
  return rgsPost<SpinResult>('/play', { sessionID, betAmount, mode });
}

export async function endRound(bookID: string, payoutMultiplier: number): Promise<EndRoundResponse> {
  return rgsPost<EndRoundResponse>('/wallet/end-round', {
    sessionID,
    bookID,
    payoutMultiplier,
  });
}
