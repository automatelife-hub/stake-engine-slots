# Stake Engine Slots — Darkside Gaming

Game development workspace for building original HTML5 slot titles on [engine.stake.com](https://engine.stake.com) (Stake Engine).

---

## Overview

This repo tracks our local toolchain setup and game development for Darkside Gaming's published slot catalogue. Two external SDKs sit alongside this repo in the project workspace:

| SDK | Location | Purpose |
|-----|----------|---------|
| **Math SDK** | `../math-sdk/` | Python simulation engine — produces RTP books, payout tables, and publish files |
| **Frontend SDK (web-sdk)** | `../web-sdk/` | PixieJS + Svelte 5 + Vite — slot game frontend with Storybook |

---

## Prerequisites

### System Requirements

| Tool | Version | Notes |
|------|---------|-------|
| Python | 3.12+ (3.14 tested) | 3.14 requires `numpy --pre` flag |
| Node.js | 18.18.0+ (v24 tested) | Use nvm for version management |
| pnpm | 10.5.0+ | Monorepo package manager |
| Rust + Cargo | latest | Required for Math SDK optimization step |
| Git | any | For cloning SDKs |

### Install Rust (if not present)

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
# Windows: download rustup-init.exe from https://rustup.rs
```

---

## Math SDK Setup

The Math SDK is Stake Engine's Python simulation engine. It generates the game books (lookup tables) consumed by the RGS.

### 1. Clone

```bash
git clone https://github.com/StakeEngine/math-sdk
cd math-sdk
```

### 2. Create Virtual Environment

```bash
python -m venv env

# Windows
env\Scripts\activate.bat

# macOS/Linux
source env/bin/activate
```

### 3. Install Dependencies

**Python 3.12 / 3.13:**
```bash
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python -m pip install -e .
```

**Python 3.14+ (pre-release):**
numpy pre-release wheel required before installing the rest:
```bash
python -m pip install --upgrade pip
python -m pip install numpy --pre
python -m pip install boto3 botocore jmespath packaging pluggy pytest python-dateutil python-dotenv s3transfer six urllib3 xlsxwriter zstandard toml matplotlib
python -m pip install -e .
```

### 4. Run the `0_0_lines` Example

```bash
cd math-sdk
env/Scripts/python.exe games/0_0_lines/run.py   # Windows
# or
env/bin/python games/0_0_lines/run.py           # macOS/Linux
```

**Expected output:**
```
Thread 0 finished with X.XXX RTP. [baseGame: X.XXX, freeGame: X.XXX]
Thread 1 finished with X.XXX RTP. [baseGame: X.XXX, freeGame: X.XXX]
...
Running optimization for mode: base
Running optimization for mode: bonus
```

> **Note (Python 3.14):** Thread 1 may hit a `MemoryError` in `write_json` when building the intermediate JSON string. This is a memory pressure issue with larger batches on Python 3.14. The other 9 threads complete and all `.jsonl.zst` files are written. The optimization step runs regardless.

---

## Math SDK Output Format

After a successful run, output files land in `games/<GAME_ID>/library/`:

```
library/
├── publish_files/          ← final files for Stake Engine upload
│   ├── index.json          ← game manifest + RTP table
│   ├── lookUpTable.csv     ← spin index → book record mapping
│   └── books_<mode>.jsonl.zst  ← compressed game event books
├── configs/
│   ├── math_config.json    ← optimization parameters
│   └── event_config_<mode>.json  ← sample event for each mode
└── temp_multi_threaded_files/   ← intermediate per-thread files
    ├── books_<mode>_<thread>_0.jsonl.zst
    ├── books_<mode>_<thread>_0.payouts
    ├── force_<mode>_<thread>_0.json
    └── lookUpTable_<mode>_<thread>_0
```

### File Format Details

#### `.jsonl.zst` — Game Books (main output)

Zstandard-compressed JSONL. Each line is a JSON spin record:

```json
{
  "id": 1000,
  "payoutMultiplier": 10,
  "criteria": "basegame",
  "baseGameWins": [...],
  "freeGameWins": [...],
  "events": [
    {
      "index": 0,
      "type": "reveal",
      "board": [
        [{"name": "L4"}, {"name": "L5"}, {"name": "L2"}, {"name": "L4"}, {"name": "L1"}],
        ...
      ]
    }
  ]
}
```

- `board` is a **5×3 array** (5 reels × 3 rows), each cell is a symbol object
- Symbol names: `H1–H4` (high pay), `L1–L5` (low pay), `W` (wild), `S` (scatter)

#### `.payouts` — Payout Lookup

Plain text, one integer per line. Each integer = `payoutMultiplier × 100`. Maps spin index to payout for fast RTP calculation.

#### Reel CSVs (e.g., `BR0.csv`)

5-column CSV — one column per reel. Each row is a symbol on the reel strip. Used as input to generate the spin distribution.

```
L1,H3,L5,L4,L3
H1,H3,H4,L2,L5
...
S,S,S,S,S
```

---

## Frontend SDK Setup (web-sdk)

### 1. Clone

```bash
git clone https://github.com/automatelife-hub/web-sdk
cd web-sdk
```

### 2. Install Dependencies

```bash
pnpm install
```

This resolves ~523 packages across the monorepo (PixieJS, Svelte 5, Storybook, XState, Turborepo).

### 3. Run Storybook (Lines Game)

```bash
pnpm run storybook --filter=lines
# Opens at http://localhost:6001
```

Navigate to `MODE_BASE/book/random` in the sidebar → click **Action** to simulate a base game round.

### Available App Modules

| App | Math SDK Counterpart | Description |
|-----|---------------------|-------------|
| `lines` | `0_0_lines` | Standard 5×3 lines-pay game |
| `cluster` | `0_0_cluster` | Cluster-pay mechanic |
| `scatter` | `0_0_scatter` | Scatter-pay |
| `ways` | `0_0_ways` | 243-ways mechanic |

---

## RGS API Integration

Games communicate with Stake Engine's RGS (Remote Gaming Server) via these endpoints:

### Game URL Structure

```
https://{TeamName}.cdn.stake-engine.com/{GameID}/{GameVersion}/index.html
  ?sessionID={sessionID}
  &lang={ISO-639-1}
  &device={mobile|desktop}
  &rgs_url={rgsUrl}
```

### Core Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/wallet/authenticate` | POST | Validate session, get balance + config |
| `/wallet/balance` | POST | Get current balance |
| `/play` | POST | Place bet, get round result |
| `/wallet/end-round` | POST | Finalize round (required when `payoutMultiplier > 0`) |
| `/bet/event` | POST | Track in-progress player actions |

### Money Format

All monetary values are **integers with 6 implied decimal places**:

| Integer | Display |
|---------|---------|
| `100,000` | $0.10 |
| `1,000,000` | $1.00 |
| `10,000,000` | $10.00 |

### Error Codes

| Code | Meaning |
|------|---------|
| `ERR_IS` | Invalid/expired session |
| `ERR_IPB` | Insufficient player balance |
| `ERR_GLE` | Gambling limits exceeded |
| `ERR_LOC` | Invalid player location |
| `ERR_GEN` | General server error |

---

## Game Configuration Reference (`0_0_lines`)

- **Grid**: 5 reels × 3 rows
- **Paylines**: 20 fixed lines
- **Target RTP**: 97.00%
- **Win cap**: 5000× bet
- **Wilds**: `W` symbol (also acts as multiplier in free spins)
- **Scatters**: `S` symbol triggers free spins (3→8, 4→12, 5→15 spins)
- **Free spin retrigger**: 2→+3, 3→+5, 4→+8, 5→+12 spins
- **Bet modes**: `base` (1.0× cost), `bonus` buy-feature (100× cost)

---

## Development Workflow

```
1. Design game math (paytable, reels, RTP target)
   └─ Edit game_config.py + reel CSVs

2. Run Math SDK simulation
   └─ python games/<game>/run.py
   └─ Outputs: library/publish_files/

3. Upload math files to Stake Engine (engine.stake.com)
   └─ Dashboard → Games → Upload Math Files

4. Build frontend in web-sdk
   └─ pnpm run storybook --filter=<game>
   └─ pnpm run build --filter=<game>

5. Upload frontend dist/ to Stake Engine
   └─ Dashboard → Games → Upload Frontend Files

6. Test game with live RGS sessionID
```

---

## Resources

- [Stake Engine Math SDK](https://github.com/StakeEngine/math-sdk)
- [Stake Engine Frontend SDK](https://github.com/automatelife-hub/web-sdk)
- [RGS API Reference](https://stakeengine.github.io/math-sdk/rgs_docs/RGS/)
- [RGS Simple Example](https://stakeengine.github.io/math-sdk/simple_example/simple_example/)
- [Math SDK Docs](https://stakeengine.github.io/math-sdk/math_home/)
- [Frontend SDK Docs](https://stakeengine.github.io/math-sdk/fe_home/)
