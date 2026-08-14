# 🪶 Nest 3.0 — High-Performance Personal Dashboard & AES-256 Link Vault

Nest 3.0 is a modern, modular, self-hosted personal dashboard and link management system built for speed, elegance, and productivity. Featuring encrypted link vaults, real-time widgets, customizable themes, and drag-and-drop organization, Nest 3.0 serves as an elevated browser start page and digital workspace.

---

## ✨ Features

- **🔐 AES-256-GCM Encrypted Link Vault**: Protect sensitive links and credentials at rest with authenticated AES-256-GCM encryption and a separate session PIN lock.
- **📁 Modular Category Columns & Folders**: Organize bookmarks into drag-and-drop customizable columns, categories, and nested bookmark folders.
- **⭐ Pinned Links & macOS-style Dock**: Access your daily tools quickly via customizable header quick-links and a floating bottom dock.
- **🌤️ Dynamic Widgets**:
  - **Open-Meteo Weather Widget**: Geocoding location search, temperature units ($^\circ\text{C} / ^\circ\text{F}$), multi-day forecasts.
  - **Clock & Time Widget**: Digital/Analog options, 12h/24h toggle, dynamic greeting.
  - **Interactive To-Do List**: Quick task creation, completion toggles, and reordering.
  - **Multi-Source RSS Reader**: Live feed reader with instant article summaries.
  - **iCal Calendar Parser**: Sync upcoming events directly from `.ics` calendar feeds.
- **🎨 Deep Customization & Themes**: Curated aesthetic color schemes (Sparrow Dark, Midnight Neon, Nord, Cyberpunk, OLED Black, Sunset, Forest), custom background wallpaper uploads, adjustable blur & dim controls.
- **🔍 Automated Metadata Scraper & Icon CDN**: Auto-fetch page titles, favicons, descriptions, or choose icons from Selfh.st Icons, TechIcons, or native Emojis.
- **⌨️ Command Palette (Ctrl + K)**: Quick keyboard access to search all bookmarks, toggle themes, open modals, or switch view modes.
- **📦 Netscape HTML & JSON Import/Export**: Seamlessly migrate bookmarks from Chrome, Firefox, Nest 2.0, or export backups anytime.

---

## 🛠️ Architecture & Tech Stack

Nest 3.0 is built on a clean lightweight architecture:

### Backend
- **Runtime & Server**: Node.js, Express.js
- **Database**: SQLite3 via `better-sqlite3` with Write-Ahead Logging (WAL) mode for maximum performance.
- **Security**: JSON Web Tokens (JWT) for user sessions, `bcryptjs` for password/PIN hashing, AES-256-GCM for encrypted vault links.
- **Integrations**: `cheerio` (HTML bookmark parsing & scraping), `rss-parser`, `node-ical`, `multer` (wallpaper storage).

### Frontend
- **Framework**: React 18, Vite 5
- **Styling**: Tailwind CSS, Vanilla CSS custom variable tokens
- **Icons**: Lucide React, Selfh.st CDN, TechIcons CDN
- **Drag & Drop**: SortableJS

---

## 🚀 Quick Start & Installation

### Option 1: Running Locally (Node.js & NVM)

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/SparrowForgeLab/nest3.git
   cd nest3
   ```

2. **Install Backend Dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies & Build**:
   ```bash
   cd ../frontend
   npm install
   npm run build
   ```

4. **Start the Production Server**:
   ```bash
   cd ../backend
   npm start
   ```
   *The app will be live at `http://localhost:5000`.*

---

### Option 2: Docker Compose (Recommended for Home Servers / VPS)

Nest 3.0 provides a single-stage container build and Docker Compose configuration.

```bash
docker-compose up -d --build
```

Access the dashboard at `http://<your-server-ip>:5000`.

Data is persisted in the Docker volume `nest3-data` mapped to `/app/backend/data`.

---

## ⚙️ Environment Variables

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` | Port for the Express server to listen on |
| `NODE_ENV` | `production` | Environment mode (`development` or `production`) |
| `JWT_SECRET` | *(Random key)* | Secret key for signing session tokens |
| `VAULT_SECRET_KEY` | *(32-byte key)* | Secret key for AES-256 vault encryption |
| `DB_PATH` | `./data/nest3.db` | Absolute or relative path to SQLite database |

---

## 📡 API Reference

### Auth & Vault
- `POST /api/auth/register` — Register a new account & provision starter layout.
- `POST /api/auth/login` — User login & JWT token cookie issuing.
- `POST /api/auth/logout` — End session and clear auth cookies.
- `POST /api/auth/vault/verify` — Unlock Private Link Vault with Vault PIN.
- `POST /api/auth/vault/lock` — Lock Private Link Vault.
- `GET /api/auth/status` — Return current authentication & vault state.

### Dashboard & Bookmarks
- `GET /api/dashboard` — Fetch full user dashboard data (categories, bookmarks, dock, settings).
- `POST /api/categories` — Create category column.
- `PUT /api/categories/reorder` — Reorder category positions.
- `POST /api/bookmarks` — Create bookmark or vault entry.
- `PUT /api/bookmarks/reorder` — Reorder bookmark cards.
- `POST /api/bookmarks/import` — Import Netscape HTML or Nest JSON bookmarks.
- `GET /api/bookmarks/export` — Export JSON backup.

### Dock & Pinned Links
- `GET /api/dock-links` — List user dock items.
- `POST /api/dock-links/toggle-bookmark` — Pin/unpin bookmark to bottom dock.
- `GET /api/featured-links` — List header pinned links.

### Widgets & Preferences
- `GET /api/widgets/weather` — Fetch Open-Meteo weather data.
- `GET /api/widgets/rss` — Fetch & parse RSS feed.
- `GET /api/widgets/calendar` — Fetch & parse iCal `.ics` calendar events.
- `PUT /api/settings` — Update theme, column counts, font size, and widget preferences.
- `POST /api/settings/upload-background` — Upload custom wallpaper image.

---

## 📄 License

Created by **SparrowForge Lab**. All rights reserved.
