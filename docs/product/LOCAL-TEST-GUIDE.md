# Local RX Guard test guide

Clone-to-local-test guide for macOS and Windows. RX Guard uses synthetic/de-identified test data only; no live Prompt Opinion API key is needed. Partners who only need to review the UI can use the public staging guide instead: `docs/product/STAGING-TEST-GUIDE.md`.

## Requirements

Install before cloning:

- Git: <https://git-scm.com/downloads>
- Node.js LTS: <https://nodejs.org/en/download>

Confirm Node installed correctly:

```text
npm --version
```

## macOS

1. Open **Terminal**.
2. Clone and enter the repo:
   ```bash
   git clone https://github.com/mikepatraw/rx-guard.git
   cd rx-guard
   ```
3. Install packages:
   ```bash
   npm install
   ```
4. Run the CLI adapter local test:
   ```bash
   ./scripts/run-local-demo.sh
   ```
5. Start the web UI local test:
   ```bash
   ./scripts/start-ui-demo.sh
   ```
6. Leave Terminal open and browse to `http://localhost:4173`.
7. Select **Xanax 1 mg tablet**, read the auto-triggered risk/PDMP modal, then click **Do Not Prescribe**.
8. Stop the server with `Control+C`.

Optional check:

```bash
npm test
```

## Windows

1. Open **PowerShell**.
2. Clone and enter the repo:
   ```powershell
   git clone https://github.com/mikepatraw/rx-guard.git
   cd rx-guard
   ```
3. Install packages:
   ```powershell
   npm install
   ```
4. Run the CLI adapter local test:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\scripts\run-local-demo.ps1
   ```
5. Start the web UI local test:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\scripts\start-ui-demo.ps1
   ```
6. Leave PowerShell open and browse to `http://localhost:4173`.
7. Select **Xanax 1 mg tablet**, read the auto-triggered risk/PDMP modal, then click **Do Not Prescribe**.
8. Stop the server with `Ctrl+C`.

Optional check:

```powershell
npm test
```

## Expected local test output

The CLI and web UI should show:

- synthetic key `RXG-SB-001`
- medication-selection trigger in the web UI
- high-risk RX Guard review output
- deterministic local PDMP rows for Sheila Bankston

## If port 4173 is busy

Build the demo data, then serve the static UI on another port.

macOS:

```bash
npm run build:demo-data
python3 -m http.server 4174 --directory public
```

Windows:

```powershell
npm run build:demo-data
py -m http.server 4174 --directory public
```

Then open `http://localhost:4174`.

## What the wrapper scripts do

- `scripts/run-local-demo.sh` / `scripts/run-local-demo.ps1` wraps the full Sheila Bankston CLI adapter command.
- `scripts/start-ui-demo.sh` / `scripts/start-ui-demo.ps1` builds `public/demo-data.js` from the local adapter and starts the browser demo.

Prompt Opinion remains the compact decision-support layer; RX Guard owns the deterministic local PDMP rows and clinician-facing workflow UI. The local UI is Prompt Opinion-compatible, but it does not call live Prompt Opinion APIs.
