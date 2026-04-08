# Stake Engine Game Submission Checklist

**Operator:** puzzled-gaming  
**Platform:** engine.stake.com  
**CDN base:** `https://puzzled-gaming.cdn.stake-engine.com/{GameID}/{GameVersion}/`

---

## Math Files Upload

Upload via: Dashboard → Games → Upload Math Files

- [ ] `index.json` — game manifest with mode names and file references
- [ ] `lookUpTable_<mode>_0.csv` — weighted spin index → book record mapping
- [ ] `books_<mode>.jsonl.zst` — compressed game event books (Zstandard)
- [ ] SHA-256 hashes match values in `library/configs/config.json`
- [ ] `config.json` RTP field matches optimizer output (±0.1%)
- [ ] `bookLength` = 100,000

### Per-game math checklist

| Game | Math status | Publish files committed | Uploaded to engine |
|------|-------------|------------------------|-------------------|
| Dark Gems (`dark-gems`) | Complete — 96.00% RTP | Yes | Pending |

---

## Frontend Files Upload

Upload via: Dashboard → Games → Upload Frontend Files

- [ ] `index.html` at game root
- [ ] Game URL loads with query params: `sessionID`, `lang`, `device`, `rgs_url`
- [ ] `/wallet/authenticate` integration working
- [ ] `/play` returns correct `payoutMultiplier`
- [ ] `/wallet/end-round` called when `payoutMultiplier > 0`
- [ ] Win capped at `wincap` (5,000× for Dark Gems)
- [ ] Mobile layout tested (375px width minimum)
- [ ] Scatter anticipation animation on reels 1–2 before reel 3 lands

---

## RGS Integration Verification

- [ ] Session auth handshake succeeds
- [ ] Balance updates correctly after each spin
- [ ] Free spin sequence completes without orphaned rounds
- [ ] `ERR_IPB` shown gracefully on insufficient balance
- [ ] `ERR_GLE` handled (gambling limit exceeded)
- [ ] Provably fair: `bookID` surfaced in result for player verification

---

## Regulatory

- [ ] RTP ≥ 95.9% and ≤ 96.1% (confirmed: 96.00%)
- [ ] Wincap enforced server-side and in frontend display
- [ ] No retrigger loop possible (scatter threshold exceeds max possible scatters in freegame)
- [ ] Hit frequency documented in PAR sheet
- [ ] Game version tagged in git before upload

---

## Launch Sign-off

| Role | Sign-off |
|------|---------|
| Game Developer (math) | |
| Game Developer (frontend) | |
| CTO | |
