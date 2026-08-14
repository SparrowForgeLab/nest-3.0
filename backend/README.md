# ⚙️ Nest 3.0 Backend Server

Express.js & SQLite3 backend for Nest 3.0 dashboard.

## Overview
- **Database**: SQLite3 (`better-sqlite3`) with WAL journal mode at `backend/data/nest3.db`.
- **Controllers**:
  - [`authController.js`](file:///home/vaggumonsfl/projects/nest3/backend/src/controllers/authController.js): Authentication, registration, password changes, and Vault lock/unlock.
  - [`bookmarkController.js`](file:///home/vaggumonsfl/projects/nest3/backend/src/controllers/bookmarkController.js): Dashboard data aggregation, category CRUD, bookmark CRUD, reordering, Netscape HTML & JSON import/export.
  - [`dockController.js`](file:///home/vaggumonsfl/projects/nest3/backend/src/controllers/dockController.js): Dock links management and toggle actions.
  - [`featuredController.js`](file:///home/vaggumonsfl/projects/nest3/backend/src/controllers/featuredController.js): Pinned/Featured header links and dropdown folder items.
  - [`iconController.js`](file:///home/vaggumonsfl/projects/nest3/backend/src/controllers/iconController.js): Icon search indexes for Selfh.st and TechIcons CDN sets.
  - [`scraperController.js`](file:///home/vaggumonsfl/projects/nest3/backend/src/controllers/scraperController.js): URL metadata & favicon auto-scraper using Cheerio.
  - [`widgetController.js`](file:///home/vaggumonsfl/projects/nest3/backend/src/controllers/widgetController.js): Open-Meteo weather API proxy, RSS feed parser, iCal calendar parser, To-Do list operations, theme/layout settings updates, custom wallpaper uploads via Multer.
- **Services**:
  - [`encryption.js`](file:///home/vaggumonsfl/projects/nest3/backend/src/services/encryption.js): AES-256-GCM encryption service for Vault links.
- **Middleware**:
  - [`auth.js`](file:///home/vaggumonsfl/projects/nest3/backend/src/middleware/auth.js): JWT token validation & vault lock status checking.

## Usage
```bash
# Start server in production mode
npm start

# Start server in watch/dev mode
npm run dev
```
