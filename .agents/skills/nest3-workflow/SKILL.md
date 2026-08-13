---
name: nest3-workflow
description: Workflow cheat sheet for building, managing, and deploying Nest 3.0 on Ubuntu 22.04 with Docker and user-space NVM.
---

# Nest 3.0 Workflow Cheat Sheet

## 1. User-Space Node & Environment Setup
When executing Node or NPM commands for Nest 3.0 on Ubuntu, use the user-space NVM environment (`~/.nvm`) and global NPM module path to prevent permission conflicts:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
export NODE_PATH=$HOME/.npm-global/node_modules:$NODE_PATH
```

## 2. Production Build & Deployment
Nest 3.0 runs in a containerized environment managed via Docker Compose (`nest3-app` container mapped to port 5000):

- **Rebuild Frontend Local Assets**:
  ```bash
  cd /home/vaggumonsfl/projects/nest3/frontend
  npm run build
  ```

- **Rebuild and Deploy Docker Container**:
  ```bash
  cd /home/vaggumonsfl/projects/nest3
  docker compose up -d --build nest3
  ```

- **Check Server Logs**:
  ```bash
  docker logs nest3-app -n 50
  ```

## 3. Database & Pinned Links Architecture
- **Database Location**: SQLite database is stored at `/home/vaggumonsfl/projects/nest3/backend/data/nest3.db`.
- **Pinned Links (Featured Shelf)**:
  - Custom pinned links are stored in `featured_links` table (`id, user_id, title, url, icon, position`).
  - Bookmarks marked `is_featured = 1` in `bookmarks` table are also merged into the Pinned Shelf.
  - CRUD operations are handled via `/api/featured-links` endpoints and managed in UI via `EditPinnedModal.jsx`.
