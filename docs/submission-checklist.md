# Stake Engine Game Submission Checklist

**Operator:** puzzled-gaming  
**Platform:** engine.stake.com  
**CDN URL pattern:** `https://puzzled-gaming.cdn.stake-engine.com/{GameID}/{GameVersion}/index.html`  
**Approval guidelines:** https://stake-engine.com/docs/approval-guidelines

> **Critical:** Do not submit until the game is 100% finalized. Once approved, only minor visual updates are permitted — no math model changes, no new game modes, no gameplay mechanic modifications.

---

## Math Sign-off

- [ ] 100k simulation complete — RTP confirmed **95.9–96.1%** (within 0.1% of 96% target)
- [ ] Publish files committed to repo:
  - [ ] `index.json` — game manifest with mode names and file references
  - [ ] `lookUpTable_<mode>_0.csv` — weighted spin index → book record mapping
  - [ ] `books_<mode>.jsonl.zst` — compressed game event books (Zstandard)
- [ ] SHA-256 hashes match values in `library/configs/config.json`
- [ ] `config.json` RTP field matches optimizer output (±0.1%)
- [ ] `bookLength` = 100,000
- [ ] Math version tagged in git

### Per-game math status

| Game | Math status | Publish files committed | Uploaded to engine |
|------|-------------|------------------------|-------------------|
| Dark Gems (`dark-gems`) | Pending simulation | Pending | Pending |

---

## Frontend Sign-off

- [ ] `pnpm run build --filter=dark-gems` succeeds — clean `dist/`
- [ ] Storybook QA pass (grid, win lines, symbols, bonus trigger)
- [ ] `index.html` at game root
- [ ] Game URL loads with query params: `sessionID`, `lang`, `device`, `rgs_url`
- [ ] `/wallet/authenticate` integration working
- [ ] `/play` returns correct `payoutMultiplier`
- [ ] `/wallet/end-round` called when `payoutMultiplier > 0`
- [ ] Win capped at `wincap` (5,000× for Dark Gems)
- [ ] Mobile + desktop layout tested (375px width minimum)
- [ ] Scatter anticipation animation on reels 1–2 before reel 3 lands
- [ ] Frontend version tagged in git

---

## Stake Engine Compliance (REQUIRED)

These are mandatory per https://stake-engine.com/docs/approval-guidelines:

- [ ] Game is **stateless** — each bet is independent of previous outcomes
  - Dark Gems verified: no jackpot, no gamble feature, no continuation, no cashout ✅
- [ ] No jackpot mechanic
- [ ] No gamble / double-up feature
- [ ] No early cashout mechanic
- [ ] No continuation / carry-over feature
- [ ] Original design — not licensed or pre-purchased
- [ ] No Stake™ branding or themes in any asset
- [ ] No content appealing to minors
- [ ] Stake.us language requirements reviewed (strict for social play on stake.us)

---

## RGS Integration Verification

- [ ] Session auth handshake succeeds
- [ ] Balance updates correctly after each spin
- [ ] Free spin sequence completes without orphaned rounds
- [ ] `ERR_IPB` shown gracefully on insufficient balance
- [ ] `ERR_GLE` handled (gambling limit exceeded)
- [ ] Provably fair: `bookID` surfaced in result for player verification

---

## Submission Package

All items required before submitting a review request:

- [ ] Short blurb written — 1–2 paragraph description of Dark Gems theme + mechanics (required by Stake Engine)
- [ ] Frontend version number confirmed and tagged
- [ ] Math version number confirmed and tagged
- [ ] Game fully finalized — **no math model changes permitted post-approval**

---

## Regulatory

- [ ] RTP ≥ 95.9% and ≤ 96.1% (confirmed: 96.00%)
- [ ] Wincap enforced server-side and in frontend display
- [ ] No retrigger loop possible (scatter threshold exceeds max possible scatters in freegame)
- [ ] Hit frequency documented in PAR sheet

---

## Launch Sign-off

| Role | Sign-off |
|------|---------|
| Game Developer (math) | |
| Game Developer (frontend) | |
| CTO | |
