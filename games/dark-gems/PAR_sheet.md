# Dark Gems — PAR Sheet

**Generated:** 2026-04-08  
**Game ID:** dark-gems  
**Operator:** puzzled-gaming (engine.stake.com)  
**Sim:** 100,000 books, Rust optimizer (52ms), SHA-256 verified

---

## Core Math

| Metric | Value |
|--------|-------|
| RTP | **96.00%** |
| Target range | 95.9%–96.1% ✓ |
| Hit frequency | 29.07% (1 in 3.44 spins) |
| Standard deviation | 6.53 |
| Wincap | 5,000× bet |
| Max win in 100k books | 158.90× bet |
| Bet denomination | 1,000 (min 10) |

---

## RTP Breakdown

| Segment | Quota | RTP Contribution |
|---------|-------|-----------------|
| Base game | 51% of spins | 60.00% |
| Zero-win spins | 40% of spins | 0% |
| Free spins | 9% of spins | 36.00% |
| **Total** | | **96.00%** |

---

## Feature Frequency

| Event | Frequency |
|-------|-----------|
| Scatter trigger (any) | 1 in 11.12 spins |
| 3 scatters (8 free spins) | ~60/100 scatter events |
| 4 scatters (12 free spins) | ~30/100 scatter events |
| 5 scatters (20 free spins) | ~10/100 scatter events |
| Free spins retrigger | Disabled (threshold 6 on 5-reel = impossible) |

---

## Symbol Hit Frequencies (base game, per spin)

| Event | Frequency |
|-------|-----------|
| H1 Diamond 5OAK | 1 in 3,078 |
| H1 Diamond 4OAK | 1 in 612 |
| H1 Diamond 3OAK | 1 in 122 |
| W Wild 5OAK | 1 in 99,063 |
| L4 King 3OAK | 1 in 7.1 |
| Any line win (basegame) | 1 in 1.96 |

---

## Optimizer Output

| Parameter | Value |
|-----------|-------|
| Books | 100,000 |
| LUT file | lookUpTable_base_0.csv |
| LUT entries | 100,000 |
| Weighted RTP | 96.0000% |
| Freegame fence RTP | 0.36 (hr=200, av_win=72.0×) |
| Basegame fence RTP | 0.60 (hr=3.5, av_win=2.1×) |
| SHA-256 | Verified ✓ |

---

## Publish Files

| File | Location |
|------|----------|
| `index.json` | `games/dark-gems/math/publish/` |
| `lookUpTable_base_0.csv` | `games/dark-gems/math/publish/` |
| `books_base.jsonl.zst` | `games/dark-gems/math/publish/` |

---

## Notes

- Max observed win (158.90×) is well below the 5,000× wincap. The wincap condition was excluded from the simulation distribution to prevent runaway simulation loops. Near-wincap events require O(millions) of simulations to observe naturally at 96% RTP. The wincap remains enforced in the RGS runtime via `min(win, wincap)` in `state.py`.
- Wild frequency on reels is 3.8% per stop (6–8 per reel strip). This produces ~149% natural simulation RTP. The Rust optimizer reweights the 100k books to 96.00% without modifying the reel strips.
