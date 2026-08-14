# 💻 Nest 3.0 Frontend App

React 18 & Vite single-page web app for Nest 3.0 dashboard.

## Overview
- **Build System**: Vite 5 with React plugin and Tailwind CSS.
- **Key Components**:
  - [`App.jsx`](file:///home/vaggumonsfl/projects/nest3/frontend/src/App.jsx): Main dashboard layout, state management, theme application, and modal controls.
  - [`Navbar.jsx`](file:///home/vaggumonsfl/projects/nest3/frontend/src/components/Navbar.jsx): Top navigation bar with action buttons and vault status indicator.
  - [`SearchBar.jsx`](file:///home/vaggumonsfl/projects/nest3/frontend/src/components/SearchBar.jsx): Interactive search bar with search engine selector.
  - [`CategoryColumn.jsx`](file:///home/vaggumonsfl/projects/nest3/frontend/src/components/CategoryColumn.jsx): Render category columns with drag-and-drop sortable bookmarks.
  - [`BookmarkCard.jsx`](file:///home/vaggumonsfl/projects/nest3/frontend/src/components/BookmarkCard.jsx): Bookmark tile component with context menu and vault lock states.
  - [`Dock.jsx`](file:///home/vaggumonsfl/projects/nest3/frontend/src/components/Dock.jsx): Floating bottom dock bar.
  - [`CommandPalette.jsx`](file:///home/vaggumonsfl/projects/nest3/frontend/src/components/CommandPalette.jsx): Keyboard shortcut overlay (Ctrl+K).
  - [`ContextMenu.jsx`](file:///home/vaggumonsfl/projects/nest3/frontend/src/components/ContextMenu.jsx): Custom right-click menu for instant bookmark/category actions.
  - `Modals/`: Preference settings, Vault unlock, link creation, icon picker, and interactive tutorial tour.
  - `Widgets/`: Real-time weather, clock, to-do list, and RSS feed widgets.

## Commands
```bash
# Start Vite development server
npm run dev

# Build production bundle
npm run build

# Preview build output
npm run preview
```
