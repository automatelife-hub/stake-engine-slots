# Dark Gems — Game Design Document

**Developer:** Darkside Gaming (puzzled-gaming operator account)  
**Platform:** engine.stake.com (Stake Engine by Stake)  
**Game ID:** `dark-gems`  
**Status:** Math complete — frontend pending

---

## Concept

Dark Gems is a 5-reel, 3-row lines-pay slot with a dark gemstone theme. High-value symbols are premium gems; low-value symbols are semi-precious stones and card ranks styled in a dark/gothic aesthetic.

---

## Math Summary

| Property | Value |
|----------|-------|
| Grid | 5×3 (5 reels, 3 rows) |
| Paylines | 20 fixed lines |
| Target RTP | 96.00% |
| Hit frequency | 29.07% (1 in 3.44 spins) |
| Free spins trigger | 1 in 11.12 base spins |
| Free spins awarded | 3S→8, 4S→12, 5S→20 |
| Wincap | 5,000× bet |
| Max recorded win | 158.90× (100k book sample) |
| StdDev | 6.53 |
| Books | 100,000 (Zstandard compressed) |

### RTP Split

| Segment | RTP Contribution |
|---------|-----------------|
| Base game | 60.00% |
| Free spins | 36.00% |
| **Total** | **96.00%** |

---

## Symbol Paytable

All pays are **bet-per-line multipliers**.

| Symbol | 3× | 4× | 5× |
|--------|----|----|-----|
| W (Wild) | 5 | 20 | 50 |
| H1 Diamond | 5 | 20 | 50 |
| H2 Ruby | 3 | 10 | 30 |
| H3 Emerald | 2 | 6 | 20 |
| H4 Sapphire | 1.5 | 4 | 12 |
| L1 Amethyst | 0.8 | 2 | 8 |
| L2 Topaz | 0.5 | 1.5 | 5 |
| L3 Ace | 0.3 | 1.0 | 3 |
| L4 King | 0.2 | 0.7 | 2 |

W substitutes for all symbols except S (scatter).  
S does not pay on lines — triggers free spins only.

---

## Paylines (20 fixed)

Row indices: 0=top, 1=middle, 2=bottom

| # | Pattern |
|---|---------|
| 1 | [1,1,1,1,1] — middle row |
| 2 | [0,0,0,0,0] — top row |
| 3 | [2,2,2,2,2] — bottom row |
| 4 | [0,1,2,1,0] — V shape |
| 5 | [2,1,0,1,2] — inverted V |
| 6 | [0,0,1,2,2] — down-right |
| 7 | [2,2,1,0,0] — up-right |
| 8 | [1,0,1,2,1] — zigzag up |
| 9 | [1,2,1,0,1] — zigzag down |
| 10 | [0,1,1,1,2] |
| 11 | [2,1,1,1,0] |
| 12 | [0,1,0,1,2] |
| 13 | [2,1,2,1,0] |
| 14 | [1,1,0,1,1] — bump up |
| 15 | [1,1,2,1,1] — bump down |
| 16 | [0,2,1,0,2] |
| 17 | [2,0,1,2,0] |
| 18 | [0,0,2,0,0] — dip |
| 19 | [2,2,0,2,2] — peak |
| 20 | [1,0,0,0,1] — valley |

---

## Reels

| Strip | Used in |
|-------|---------|
| BR0 | Base game reel |
| FR0 | Free spins reel |

Reel CSVs: `math-sdk/games/dark-gems/library/reels/`

---

## Frontend Plan

- Framework: web-sdk (PixieJS + Svelte 5 + Vite)
- Theme: dark/gothic — deep purple/black background, glowing gem particles
- Reel animations: cascade-style on win, glow pulse on feature trigger
- Scatter anticipation: reels 1–2 locked with scatter highlight before reel 3+
- Free spins: dark screen transition, counter UI in top-left
- Win lines: animated highlight with gem particle burst
