# Stake Engine RGS Integration Guide

**Operator:** puzzled-gaming  
**Platform:** engine.stake.com  
**RGS Docs:** https://stake-engine.com/docs/rgs-integration

---

## Overview

Stake Engine uses a server-side RGS (Remote Game Server) model. The frontend calls Stake's backend directly — Darkside Gaming does **not** run an RGS server. The math publish files (index.json, lookUpTable, books) are uploaded to Stake Engine and they execute the spin logic server-side.

---

## Game Launch URL

```
https://puzzled-gaming.cdn.stake-engine.com/{GameID}/{GameVersion}/index.html
  ?sessionID={token}
  &lang={en|...}
  &device={mobile|desktop}
  &rgs_url={stake-engine-rgs-endpoint}
```

The `rgs_url` is injected by the casino operator — do not hardcode it.

---

## API Endpoints (called by frontend)

All requests include `Authorization: Bearer {sessionID}`.

### POST /wallet/authenticate

Called on game load to validate the session and retrieve initial balance.

**Request:**
```json
{ "sessionID": "string" }
```

**Response:**
```json
{
  "playerID": "string",
  "currency": "USD",
  "balance": 10000,
  "wincap": 500000
}
```

`balance` and `wincap` are in cents.

---

### POST /play

Executes a single spin. The RGS resolves spin outcome from the precomputed book.

**Request:**
```json
{
  "sessionID": "string",
  "betAmount": 100,
  "mode": "base"
}
```

`betAmount` is total bet in cents (20 lines × line bet).  
`mode`: `"base"` or `"freespin"`.

**Response:**
```json
{
  "bookID": "string",
  "spinIndex": 42,
  "grid": [[sym, sym, sym], ...],
  "payoutMultiplier": 2.5,
  "winLines": [{"lineId": 1, "symbol": "H1", "count": 3, "multiplier": 2.5}],
  "scatterCount": 0,
  "freeSpinsAwarded": 0,
  "newBalance": 10250,
  "mode": "base"
}
```

`payoutMultiplier` is relative to total bet. `bookID` enables provably fair verification.

---

### POST /wallet/end-round

Called after every spin where `payoutMultiplier > 0`. Required to credit winnings.

**Request:**
```json
{
  "sessionID": "string",
  "bookID": "string",
  "payoutMultiplier": 2.5
}
```

**Response:**
```json
{ "newBalance": 10250 }
```

---

## Free Spins Flow

1. Base spin returns `freeSpinsAwarded > 0` (3+ scatters).
2. Frontend transitions to free spins mode (dark screen, counter UI).
3. Frontend calls `/play` with `mode: "freespin"` for each free spin.
4. Free spins complete when counter reaches 0.
5. No retrigger in Dark Gems (scatter threshold > max possible scatters in freegame reel).
6. Final `/wallet/end-round` called with cumulative multiplier or per-spin — follow Stake Engine spec.

---

## Error Codes

| Code | Meaning | Frontend Handling |
|------|---------|------------------|
| `ERR_IPB` | Insufficient balance | Show "Insufficient balance" modal, disable spin |
| `ERR_GLE` | Gambling limit exceeded | Show responsible gambling message, disable spin |
| `ERR_SESSION` | Session expired/invalid | Redirect to lobby |
| `ERR_WINCAP` | Win capped at wincap | Apply cap, display capped win amount |
| `ERR_GAME_LOCKED` | Concurrent spin attempt | Ignore — frontend should prevent this |

---

## Provably Fair

Each spin result references a `bookID` from the precomputed 100k book. Players can verify their outcome by:

1. Noting the `bookID` and `spinIndex` from the game result.
2. Requesting the book hash from Stake Engine's verification endpoint.
3. Cross-referencing against the published `books_base.jsonl.zst`.

The frontend must surface `bookID` in the result overlay or history panel.

---

## Integration Checklist

- [ ] `sessionID` passed via query param on launch
- [ ] `/wallet/authenticate` called on load, balance displayed
- [ ] `/play` called with correct `betAmount` (totalBet in cents)
- [ ] `payoutMultiplier` applied to totalBet for win display
- [ ] `/wallet/end-round` called on every non-zero win
- [ ] `ERR_IPB` triggers graceful "Insufficient balance" UX
- [ ] `ERR_GLE` triggers responsible gambling message
- [ ] Wincap (`5000×` for Dark Gems) enforced in win display
- [ ] `bookID` surfaced in result for provably fair verification
- [ ] Free spin sequence completes without orphaned rounds
- [ ] No concurrent `/play` calls possible (spin lock in UI state)
