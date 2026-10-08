# Project A1 — Co-Founder Operating System
> Tailored Business Development & Operating Platform for **Milan Jadhav** & **Sujan Akash**.

---

## 🚀 Quick Start

### 🖥️ On Windows:
- **Option 1 (Double-Click)**: Simply double-click **`run.bat`** in this folder. It starts the server and opens `http://localhost:8000`.
- **Option 2 (Terminal)**: Run `python server.py` in PowerShell or Command Prompt.

---

### 🍏 On Mac:
- **Option 1 (1-Click Launcher)**: Double-click **`run.command`** in Finder. It will launch the server and open your default browser.
  *(Note: If macOS prompts with "unidentified developer", right-click `run.command` and select **Open** once).*
- **Option 2 (Terminal)**:
  ```bash
  cd "path/to/Project A1/A1"
  python3 server.py
  ```
- **Option 3 (Direct Browser Launch)**: Double-click **`index.html`** to open directly in Safari or Google Chrome.

---

### 📱 Opening from a Different Device (Phone, Tablet, or Another Laptop)

#### Method A: Same Wi-Fi Network / Hotspot (Instant)
1. Start `server.py` on the host computer (`run.bat` on Windows or `run.command` on Mac).
2. The terminal will display your **Network Access URL**, for example:
   ```
   👉  http://192.168.1.15:8000
   ```
3. On your **iPhone, Android phone, Mac, or secondary computer connected to the same Wi-Fi**, open Chrome or Safari and enter that exact URL (e.g. `http://192.168.1.15:8000`).
4. **Live Data Sync**: All transactions, bills, whiteboard sketches, and roadmaps sync automatically between both devices via `/api/state`!

#### Method B: Different Cities / Internet (Free Public URL)
If the co-founders are in different locations (not on the same Wi-Fi):
- Run a free tunnel like Cloudflare Tunnel or ngrok:
  ```bash
  npx cloudflared tunnel --url http://localhost:8000
  # or
  npx localtunnel --port 8000
  ```
  This gives a secure HTTPS link (e.g., `https://project-a1-founders.loca.lt`) accessible from anywhere in the world on any device.

---

## 🔑 Co-Founder Access Credentials

| Co-Founder | Role | Default Access Code |
| :--- | :--- | :--- |
| **Milan Jadhav** | Co-Founder | `BusinessSlut@2167` |
| **Sujan Akash** | Co-Founder | `PatnerInSlut@1557` |

> [!TIP]
> **Authentication & Security Rules**:
> - **Login Page Shows First**: The portal always opens to the confidential login screen upon page load or reload; sessions are not pre-loaded, requiring secret code authentication before accessing the workspace.
> - **Profile Isolation**: A logged-in co-founder can only view and update **their own** login passcode. The other co-founder's credentials remain locked and protected.
> - **Switching Profiles**: To switch profiles, click **"Log Out & Switch"** in the top navigation or Settings. The current session will be logged out, and the other co-founder must enter their secret credentials to enter.

---

## 🌟 Architecture & Features

### 1. Welcome Portal & Live Presence
- Authenticates the partner based on their unique access code.
- Greets the partner by name (*"Welcome back, Milan!"* / *"Welcome back, Sujan!"*).
- **Non-Repeating Motivational Business Quote**: Rotates through a curated pool of 60+ entrepreneurial quotes, strictly guaranteeing zero repeats until the entire bank is exhausted.
- **Real-Time Cross-Tab Presence**: Displays live online/away indicators for both partners in real-time using the HTML5 `BroadcastChannel` API.

### 2. Main Cockpit Dashboard
- **3-Tier To-Do List Matrix**:
  1. *My To-Dos*: Personal pending priorities for the active partner.
  2. *Team To-Dos*: Tasks executed together by Milan and Sujan.
  3. *Co-Founder's To-Dos*: Tasks assigned to the other partner.
- **Master Roadmap Stage & Intelligent Pace Indicator**:
  - Displays current development stage, target deadline, and days remaining.
  - Automatically analyzes progress % vs timeline to calculate pacing:
    - 🟢 *Ahead of Schedule*
    - 🟡 *On Track — Healthy Pace*
    - 🔴 *Behind Pace — Attention Needed*
  - Directly interlinked with the Operations division.
- **Division Navigation Grid**: Instant routing to Finance, Marketing, Operations, Legal, and Overall Dashboard.

### 3. Finance Division (Emerald Green & Floating Rupee Theme)
- **Live Camera / File Invoice Capture**: Take photos of paper bills, lab invoices, and receipts using your webcam/device camera or upload images. Attached proofs are stored directly with each transaction and can be inspected in full-screen zoom in the lightbox.
- **Cash Treasury & Spend Tracking**: Available balance, total development spend, burn rate, and runway in months.
- **Partner Capital & Reimbursement Settlement**:
  - Compares Milan's capital vs Sujan's capital.
  - Automatically calculates 50/50 balance equalization (*"Sujan owes Milan ₹X"* or vice versa).
- **Financial Statements**: Balance Sheet, Profit & Loss (P&L), Cash Flow Statement, and Startup Financial Ratios.

### 4. Marketing Division (Modern 3D Studio Theme)
- **Idea Dump**: Rapid concept dumping with customizable folders. Triages ideas to:
  - *Bin*: Archive or permanently purge.
  - *Doubtful*: Parking lot for ideas needing validation.
  - *Implementation*: Graduated campaigns.
- **Brainstorming Fun**:
  - Live collaborative drawing whiteboard (brush sizes, palette, eraser, clear).
  - Instant founder chat & sticky notes.
  - Interactive emoji reaction bursts.
- **Implementation Stage**:
  - Grouped by category folder.
  - Individual milestone roadmaps with checkable progress.
  - Scrap idea capability with explicit confirmation safeguards.
- **Other Ideas**: Archive for long-term thoughts, competitor analysis, and podcast pitches.

### 5. Operations Division (Motivational Cockpit Theme)
- **Interlinked Master Roadmap**: Editable stages, milestones, target dates, and progress sliders that immediately sync back to the main cockpit pace widget.
- **SKU Catalog**: Manage product/service SKU codes, formulations, prototype specs, and packaging.
- **Dynamic Pricing Calculator**: Computes COGS, dev allocation, packaging, freight, target margins, and taxes to output recommended B2C retail (MSRP) and B2B wholesale prices.
- **Unified "My Work" Hub**: Centralized task board aggregating tasks from across the entire dashboard.

### 6. Legal Division (Parchment & Certified Seals Theme)
- Formal legal charter styling with official rubber-stamped compliance badges (*CERTIFIED CLEARED*, *UNDER EXAMINATION*, *PENDING FILING*).
- Tracks licenses (FSSAI, Trade, GST, RoC), laboratory testings (CoA, toxicology), audit reports, and founder agreements.
- Visual 5-stage progress stepper per docket.

### 7. Overall Dashboard (Mechanics Telemetry HUD Theme)
- Industrial command center with rotating mechanical gear animations and live telemetry streams.
- Interactive Chart.js graphs:
  - Multi-Sector Development Readiness Radar
  - Expense Category Breakdown Doughnut
  - Marketing Concept Pipeline Funnel
  - Roadmap Milestone Completion Velocity
  - Statutory Legal Clearance Matrix
- Single-sector drilldown filters.

### 8. Local Computer Backup & Restore (In Settings)
- **1-Click Local Backup**: Downloads a timestamped `.json` file (`Project_A1_Backup_YYYY-MM-DD.json`) directly to your computer containing all transactions, receipts, ideas, roadmaps, SKUs, and dockets.
- **Restore from File**: Seamlessly reconstitutes full workspace data from any backup file.
