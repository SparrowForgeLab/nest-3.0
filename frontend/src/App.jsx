import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import FeaturedLinks from './components/FeaturedLinks';
import CategoryColumn from './components/CategoryColumn';
import Dock from './components/Dock';
import CommandPalette from './components/CommandPalette';
import ContextMenu from './components/ContextMenu';

import AuthModal from './components/Modals/AuthModal';
import AddBookmarkModal from './components/Modals/AddBookmarkModal';
import EditCategoryModal from './components/Modals/EditCategoryModal';
import SettingsModal from './components/Modals/SettingsModal';
import EditPinnedModal from './components/Modals/EditPinnedModal';
import EditDockModal from './components/Modals/EditDockModal';
import VaultModal from './components/Modals/VaultModal';
import TutorialModal from './components/Modals/TutorialModal';
import BuyMeACoffeeCoin from './components/BuyMeACoffeeCoin';

import TimeWidget from './components/Widgets/TimeWidget';
import WeatherWidget from './components/Widgets/WeatherWidget';
import TodoWidget from './components/Widgets/TodoWidget';
import RSSWidget from './components/Widgets/RSSWidget';
import { Settings, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Modals
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPinnedModalOpen, setIsPinnedModalOpen] = useState(false);
  const [isDockModalOpen, setIsDockModalOpen] = useState(false);
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  // Sidebar Open & Resizing States with Persistence
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('nest3_left_sidebar_open');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('nest3_right_sidebar_open');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [leftSidebarWidth, setLeftSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('nest3_left_sidebar_width');
    return saved ? parseInt(saved, 10) : 320;
  });
  const [rightSidebarWidth, setRightSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('nest3_right_sidebar_width');
    return saved ? parseInt(saved, 10) : 320;
  });

  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);

  useEffect(() => {
    localStorage.setItem('nest3_left_sidebar_width', leftSidebarWidth.toString());
  }, [leftSidebarWidth]);

  useEffect(() => {
    localStorage.setItem('nest3_right_sidebar_width', rightSidebarWidth.toString());
  }, [rightSidebarWidth]);

  const toggleLeftSidebar = (explicitVal) => {
    const nextState = explicitVal !== undefined ? explicitVal : !isLeftSidebarOpen;
    setIsLeftSidebarOpen(nextState);
    localStorage.setItem('nest3_left_sidebar_open', JSON.stringify(nextState));
    axios.put('/api/settings', { left_sidebar_open: nextState ? 1 : 0 }).catch(console.error);
  };

  const toggleRightSidebar = (explicitVal) => {
    const nextState = explicitVal !== undefined ? explicitVal : !isRightSidebarOpen;
    setIsRightSidebarOpen(nextState);
    localStorage.setItem('nest3_right_sidebar_open', JSON.stringify(nextState));
    axios.put('/api/settings', { right_sidebar_open: nextState ? 1 : 0 }).catch(console.error);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizingLeft) {
        const newW = Math.min(Math.max(e.clientX, 240), 600);
        setLeftSidebarWidth(newW);
      }
      if (isResizingRight) {
        const newW = Math.min(Math.max(window.innerWidth - e.clientX, 240), 600);
        setRightSidebarWidth(newW);
      }
    };

    const handleMouseUp = () => {
      setIsResizingLeft(false);
      setIsResizingRight(false);
    };

    if (isResizingLeft || isResizingRight) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingLeft, isResizingRight]);

  // Context Menu & Edit State
  const [contextMenu, setContextMenu] = useState(null);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [initialCategoryId, setInitialCategoryId] = useState(null);

  const applyThemeSettings = (settings) => {
    if (!settings) return;
    const root = document.documentElement;

    const themeClass = settings.theme || 'sparrow-dark';
    root.className = themeClass;

    const fontSize = settings.font_size || 16;
    root.style.fontSize = `${fontSize}px`;
    root.style.setProperty('--base-font-size', `${fontSize}px`);

    if (settings.background_blur !== undefined) {
      root.style.setProperty('--bg-blur', `${settings.background_blur}px`);
    }
    if (settings.background_dim !== undefined) {
      root.style.setProperty('--bg-dim', `${settings.background_dim / 100}`);
    }
  };

  const fetchData = async () => {
    try {
      const authRes = await axios.get('/api/auth/status');
      if (authRes.data && authRes.data.authenticated && authRes.data.user) {
        setUser(authRes.data.user);
        setIsAuthenticated(true);

        const res = await axios.get('/api/dashboard');
        setData(res.data);
        if (res.data.settings) {
          applyThemeSettings(res.data.settings);
          if (res.data.settings.left_sidebar_open !== undefined && res.data.settings.left_sidebar_open !== null) {
            const lOpen = res.data.settings.left_sidebar_open !== 0;
            setIsLeftSidebarOpen(lOpen);
            localStorage.setItem('nest3_left_sidebar_open', JSON.stringify(lOpen));
          }
          if (res.data.settings.right_sidebar_open !== undefined && res.data.settings.right_sidebar_open !== null) {
            const rOpen = res.data.settings.right_sidebar_open !== 0;
            setIsRightSidebarOpen(rOpen);
            localStorage.setItem('nest3_right_sidebar_open', JSON.stringify(rOpen));
          }
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setIsAuthenticated(false);
        setUser(null);
      } else {
        console.error('Failed to fetch dashboard data:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    fetchData();
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (err) {
      console.error('Failed to log out:', err);
    }
    setIsAuthenticated(false);
    setUser(null);
    setData(null);
  };

  useEffect(() => {
    fetchData();

    // Show tutorial on first launch if not seen yet
    const hasSeen = localStorage.getItem('nest3_has_seen_tutorial');
    if (!hasSeen) {
      setIsTutorialOpen(true);
    }

    // Hotkey Listener for Ctrl+K / Cmd+K
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSaveBookmark = async (bookmarkData) => {
    try {
      if (bookmarkData.id) {
        await axios.put(`/api/bookmarks/${bookmarkData.id}`, bookmarkData);
      } else {
        await axios.post('/api/bookmarks', bookmarkData);
      }
      fetchData();
    } catch (err) {
      console.error('Failed to save bookmark:', err);
    }
  };

  const handleDeleteBookmark = async (bookmark) => {
    if (window.confirm(`Delete "${bookmark.title}"?`)) {
      try {
        await axios.delete(`/api/bookmarks/${bookmark.id}`);
        fetchData();
      } catch (err) {
        console.error('Failed to delete bookmark:', err);
      }
    }
  };

  const handleToggleFeatured = async (bookmark) => {
    try {
      await axios.put(`/api/bookmarks/${bookmark.id}`, {
        is_featured: bookmark.is_featured === 1 ? 0 : 1
      });
      fetchData();
    } catch (err) {
      console.error('Failed to toggle featured status:', err);
    }
  };

  const handleToggleDockPin = async (bookmark) => {
    try {
      await axios.post('/api/dock-links/toggle-bookmark', {
        title: bookmark.title,
        url: bookmark.url,
        icon: bookmark.icon
      });
      fetchData();
    } catch (err) {
      console.error('Failed to toggle dock pin status:', err);
    }
  };

  const handleSaveCategory = async (catData) => {
    try {
      if (catData.id) {
        await axios.put(`/api/categories/${catData.id}`, catData);
      } else {
        await axios.post('/api/categories', catData);
      }
      fetchData();
    } catch (err) {
      console.error('Failed to save category:', err);
    }
  };

  const handleDeleteCategory = async (catId) => {
    try {
      await axios.delete(`/api/categories/${catId}`);
      fetchData();
    } catch (err) {
      console.error('Failed to delete category:', err);
    }
  };

  const handleSaveSettings = async (newSettings) => {
    try {
      applyThemeSettings(newSettings);
      setData(prev => prev ? { ...prev, settings: { ...prev.settings, ...newSettings } } : prev);

      const res = await axios.put('/api/settings', newSettings);
      if (res.data && res.data.settings) {
        applyThemeSettings(res.data.settings);
        setData(prev => prev ? { ...prev, settings: res.data.settings } : prev);
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  };

  // Drag & Drop Category Reordering
  const handleDropCategory = async (e, targetCategoryId) => {
    const sourceId = parseInt(e.dataTransfer.getData('categoryId'), 10);
    const targetId = parseInt(targetCategoryId, 10);

    if (!sourceId || sourceId === targetId) return;

    setData(prev => {
      if (!prev || !prev.categories) return prev;
      const categories = [...prev.categories];
      const srcIndex = categories.findIndex(c => c.id === sourceId);
      const tgtIndex = categories.findIndex(c => c.id === targetId);

      if (srcIndex === -1 || tgtIndex === -1) return prev;

      const [removed] = categories.splice(srcIndex, 1);
      categories.splice(tgtIndex, 0, removed);

      const reorderedItems = categories.map((c, idx) => ({ id: c.id, position: idx }));
      axios.put('/api/categories/reorder', { items: reorderedItems }).catch(console.error);

      return { ...prev, categories };
    });
  };

  // Drag & Drop Bookmark Reordering & Moving
  const handleDropBookmark = async (e, targetBookmark, targetCategoryId) => {
    const bookmarkId = parseInt(e.dataTransfer.getData('bookmarkId'), 10);
    const targetCatId = parseInt(targetCategoryId, 10);

    if (!bookmarkId || !targetCatId) return;

    setData(prev => {
      if (!prev || !prev.categories) return prev;
      const categories = prev.categories.map(c => ({ ...c, bookmarks: [...(c.bookmarks || [])] }));

      let sourceBm = null;
      for (const cat of categories) {
        const idx = cat.bookmarks.findIndex(b => b.id === bookmarkId);
        if (idx !== -1) {
          [sourceBm] = cat.bookmarks.splice(idx, 1);
          break;
        }
      }

      if (!sourceBm) return prev;

      sourceBm.category_id = targetCatId;

      const targetCat = categories.find(c => c.id === targetCatId);
      if (targetCat) {
        if (targetBookmark) {
          const tgtIdx = targetCat.bookmarks.findIndex(b => b.id === targetBookmark.id);
          targetCat.bookmarks.splice(tgtIdx >= 0 ? tgtIdx : targetCat.bookmarks.length, 0, sourceBm);
        } else {
          targetCat.bookmarks.push(sourceBm);
        }
      }

      const reorderItems = [];
      categories.forEach(cat => {
        cat.bookmarks.forEach((bm, idx) => {
          reorderItems.push({ id: bm.id, category_id: cat.id, position: idx });
        });
      });

      axios.put('/api/bookmarks/reorder', { items: reorderItems }).catch(console.error);

      return { ...prev, categories };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-400">Loading Nest 3.0 Dashboard...</p>
      </div>
    );
  }

  if (!isAuthenticated || !data) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
        <AuthModal isOpen={true} onAuthSuccess={handleAuthSuccess} />
      </div>
    );
  }

  const { categories = [], featured = [], dock = [], settings = {}, vaultUnlocked = false } = data;
  const colCount = settings.column_count || 4;
  const rawBgImage = settings.background_image || '';
  const bgImage = rawBgImage.startsWith('file://') ? '' : rawBgImage;
  const bgBlur = settings.background_blur !== undefined ? settings.background_blur : 16;
  const bgDim = (settings.background_dim !== undefined ? settings.background_dim : 40) / 100;

  const showHeader = settings.show_header !== 0;
  const weatherPos = (settings.weather_position && settings.weather_position !== 'grid') ? settings.weather_position : 'left-sidebar';
  const todoPos = (settings.todo_position && settings.todo_position !== 'grid') ? settings.todo_position : 'right-sidebar';
  const rssPos = settings.rss_position || 'grid';
  const clockPos = settings.clock_position || 'grid';

  const leftSidebarWidgets = [];
  if (settings.show_clock !== 0 && clockPos === 'left-sidebar') leftSidebarWidgets.push('clock');
  if (settings.show_weather !== 0 && weatherPos === 'left-sidebar') leftSidebarWidgets.push('weather');
  if (settings.show_todo !== 0 && todoPos === 'left-sidebar') leftSidebarWidgets.push('todo');
  if (settings.show_rss === 1 && rssPos === 'left-sidebar') leftSidebarWidgets.push('rss');

  const rightSidebarWidgets = [];
  if (settings.show_clock !== 0 && clockPos === 'right-sidebar') rightSidebarWidgets.push('clock');
  if (settings.show_weather !== 0 && weatherPos === 'right-sidebar') rightSidebarWidgets.push('weather');
  if (settings.show_todo !== 0 && todoPos === 'right-sidebar') rightSidebarWidgets.push('todo');
  if (settings.show_rss === 1 && rssPos === 'right-sidebar') rightSidebarWidgets.push('rss');

  const hasLeftSidebar = true;
  const hasRightSidebar = true;

  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6',
    8: 'grid-cols-1 md:grid-cols-4 lg:grid-cols-8',
  }[colCount] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';

  return (
    <div
      className="min-h-screen relative flex flex-col transition-colors duration-300 pb-24 overflow-x-hidden"
      style={{
        backgroundColor: 'var(--bg-color)',
        color: 'var(--text-main)'
      }}
    >
      {/* Background Wallpaper */}
      {bgImage && (
        <div
          className="fixed inset-0 z-0 bg-cover bg-center transition-all duration-500"
          style={{
            backgroundImage: `url('${bgImage}')`,
            filter: `blur(${bgBlur}px)`,
          }}
        />
      )}
      <div
        className="fixed inset-0 z-0 transition-opacity duration-500"
        style={{
          backgroundColor: 'var(--bg-color)',
          opacity: bgImage ? bgDim : 1
        }}
      />

      {/* Main Content Container */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Navbar Header (Togglable) */}
        {showHeader ? (
          <Navbar
            user={user}
            vaultUnlocked={vaultUnlocked}
            onOpenCmdPalette={() => setIsCmdOpen(true)}
            onOpenAddBookmark={() => {
              setEditingBookmark(null);
              setInitialCategoryId(categories[0]?.id);
              setIsBookmarkModalOpen(true);
            }}
            onOpenVaultModal={() => setIsVaultModalOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenTutorial={() => setIsTutorialOpen(true)}
            onLogout={handleLogout}
          />
        ) : (
          /* Floating Preferences Icon when Header is hidden */
          <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
            <button
              onClick={() => setIsTutorialOpen(true)}
              className="p-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-sky-400 shadow-2xl backdrop-blur-md transition"
              title="Open Interactive Tutorial Tour"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-sky-400 shadow-2xl backdrop-blur-md transition flex items-center gap-2 group"
              title="Open Preferences (Ctrl+K)"
            >
              <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span className="text-xs font-semibold text-slate-200 pr-1">Preferences</span>
            </button>
          </div>
        )}

        {/* LEFT SIDEBAR PANEL */}
        {hasLeftSidebar && (
          <>
            <div
              style={{
                width: `${leftSidebarWidth}px`,
                transform: isLeftSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
                transition: isResizingLeft ? 'none' : 'transform 300ms ease-in-out, width 300ms ease-in-out'
              }}
              className="fixed top-0 bottom-0 left-0 z-40 bg-slate-950/95 border-r border-slate-700/80 backdrop-blur-2xl p-4 pt-20 pb-24 overflow-y-auto space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Left Sidebar</span>
                <button onClick={() => toggleLeftSidebar(false)} className="text-slate-400 hover:text-slate-200 p-1">
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
              {leftSidebarWidgets.includes('clock') && (
                <TimeWidget
                  clockType={settings.clock_type || 'digital'}
                  clockFormat={settings.clock_format || '12h'}
                  userName={settings.user_name || (user ? user.username : 'Sparrow')}
                  onSaveSettings={handleSaveSettings}
                />
              )}
              {leftSidebarWidgets.includes('weather') && (
                <WeatherWidget
                  location={settings.weather_location || 'London, UK'}
                  lat={settings.weather_lat || 51.5074}
                  lon={settings.weather_lon || -0.1278}
                  units={settings.weather_units || 'celsius'}
                  weatherSize="normal"
                  weatherLayout="vertical"
                  weatherDisplaySize="normal"
                  onUpdateLocation={handleSaveSettings}
                />
              )}
              {leftSidebarWidgets.includes('todo') && <TodoWidget />}
              {leftSidebarWidgets.includes('rss') && <RSSWidget feedUrl="https://news.ycombinator.com/rss" />}
              {leftSidebarWidgets.length === 0 && (
                <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/60 text-center space-y-2.5 my-4">
                  <p className="text-xs text-slate-400 font-medium">Left Sidebar is empty</p>
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="inline-block text-xs font-semibold text-sky-400 hover:text-sky-300 bg-sky-500/10 border border-sky-500/30 px-3 py-1.5 rounded-lg transition"
                  >
                    Assign Widgets in Preferences
                  </button>
                </div>
              )}

              {/* Drag Handle on Right Edge of Left Sidebar */}
              <div
                onMouseDown={(e) => {
                  e.preventDefault();
                  setIsResizingLeft(true);
                }}
                className="absolute top-0 bottom-0 right-0 w-2 cursor-col-resize hover:bg-sky-400/50 active:bg-sky-400 z-50 group flex items-center justify-center transition-colors"
                title="Drag to resize Left Sidebar"
              >
                <div className="w-0.5 h-10 bg-slate-600 group-hover:bg-sky-300 rounded-full" />
              </div>
            </div>

            <button
              onClick={() => toggleLeftSidebar()}
              style={{
                left: isLeftSidebarOpen ? `${leftSidebarWidth}px` : '0px',
                transition: isResizingLeft ? 'none' : 'left 300ms ease-in-out'
              }}
              className="fixed top-1/2 -translate-y-1/2 z-50 bg-slate-900/95 border border-slate-700/80 p-2.5 rounded-r-xl text-sky-400 shadow-2xl hover:bg-slate-800 hover:text-sky-300 backdrop-blur-md"
              title={isLeftSidebarOpen ? 'Collapse Left Sidebar' : 'Expand Left Sidebar'}
            >
              {isLeftSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
          </>
        )}

        {/* RIGHT SIDEBAR PANEL */}
        {hasRightSidebar && (
          <>
            <div
              style={{
                width: `${rightSidebarWidth}px`,
                transform: isRightSidebarOpen ? 'translateX(0)' : 'translateX(100%)',
                transition: isResizingRight ? 'none' : 'transform 300ms ease-in-out, width 300ms ease-in-out'
              }}
              className="fixed top-0 bottom-0 right-0 z-40 bg-slate-950/95 border-l border-slate-700/80 backdrop-blur-2xl p-4 pt-20 pb-24 overflow-y-auto space-y-4 shadow-2xl"
            >
              {/* Drag Handle on Left Edge of Right Sidebar */}
              <div
                onMouseDown={(e) => {
                  e.preventDefault();
                  setIsResizingRight(true);
                }}
                className="absolute top-0 bottom-0 left-0 w-2 cursor-col-resize hover:bg-sky-400/50 active:bg-sky-400 z-50 group flex items-center justify-center transition-colors"
                title="Drag to resize Right Sidebar"
              >
                <div className="w-0.5 h-10 bg-slate-600 group-hover:bg-sky-300 rounded-full" />
              </div>

              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Right Sidebar</span>
                <button onClick={() => toggleRightSidebar(false)} className="text-slate-400 hover:text-slate-200 p-1">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              {rightSidebarWidgets.includes('clock') && (
                <TimeWidget
                  clockType={settings.clock_type || 'digital'}
                  clockFormat={settings.clock_format || '12h'}
                  userName={settings.user_name || (user ? user.username : 'Sparrow')}
                  onSaveSettings={handleSaveSettings}
                />
              )}
              {rightSidebarWidgets.includes('weather') && (
                <WeatherWidget
                  location={settings.weather_location || 'London, UK'}
                  lat={settings.weather_lat || 51.5074}
                  lon={settings.weather_lon || -0.1278}
                  units={settings.weather_units || 'celsius'}
                  weatherSize="normal"
                  weatherLayout="vertical"
                  weatherDisplaySize="normal"
                  onUpdateLocation={handleSaveSettings}
                />
              )}
              {rightSidebarWidgets.includes('todo') && <TodoWidget />}
              {rightSidebarWidgets.includes('rss') && <RSSWidget feedUrl="https://news.ycombinator.com/rss" />}
              {rightSidebarWidgets.length === 0 && (
                <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/60 text-center space-y-2.5 my-4">
                  <p className="text-xs text-slate-400 font-medium">Right Sidebar is empty</p>
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="inline-block text-xs font-semibold text-sky-400 hover:text-sky-300 bg-sky-500/10 border border-sky-500/30 px-3 py-1.5 rounded-lg transition"
                  >
                    Assign Widgets in Preferences
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => toggleRightSidebar()}
              style={{
                right: isRightSidebarOpen ? `${rightSidebarWidth}px` : '0px',
                transition: isResizingRight ? 'none' : 'right 300ms ease-in-out'
              }}
              className="fixed top-1/2 -translate-y-1/2 z-50 bg-slate-900/95 border border-slate-700/80 p-2.5 rounded-l-xl text-sky-400 shadow-2xl hover:bg-slate-800 hover:text-sky-300 backdrop-blur-md"
              title={isRightSidebarOpen ? 'Collapse Right Sidebar' : 'Expand Right Sidebar'}
            >
              {isRightSidebarOpen ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </>
        )}

        {/* MAIN DASHBOARD CONTENT AREA */}
        <div
          style={{
            paddingLeft: (hasLeftSidebar && isLeftSidebarOpen) ? `${leftSidebarWidth + 20}px` : '20px',
            paddingRight: (hasRightSidebar && isRightSidebarOpen) ? `${rightSidebarWidth + 20}px` : '20px',
            transition: isResizingLeft || isResizingRight ? 'none' : 'padding 300ms ease-in-out'
          }}
          className="flex-1 w-full"
        >
          <main
            className={`w-full max-w-7xl mx-auto ${
              showHeader ? 'pt-6' : 'pt-12'
            }`}
          >
          {/* Time & Date Clock (If set to header/grid) */}
          {settings.show_clock !== 0 && clockPos === 'grid' && (
            <TimeWidget
              clockType={settings.clock_type || 'digital'}
              clockFormat={settings.clock_format || '12h'}
              userName={settings.user_name || (user ? user.username : 'Sparrow')}
              onSaveSettings={handleSaveSettings}
            />
          )}

          {/* Search Bar */}
          <SearchBar defaultEngine={settings.search_engine || 'google'} />

          {/* Featured Links Shelf */}
          {settings.show_featured !== 0 && (
            <FeaturedLinks items={featured} onOpenEditPinned={() => setIsPinnedModalOpen(true)} />
          )}

          {/* Top Widgets Grid (For non-sidebar widgets) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {settings.show_weather !== 0 && weatherPos === 'grid' && (
              <WeatherWidget
                location={settings.weather_location || 'London, UK'}
                lat={settings.weather_lat || 51.5074}
                lon={settings.weather_lon || -0.1278}
                units={settings.weather_units || 'celsius'}
                weatherSize={settings.weather_size || 'normal'}
                weatherLayout={settings.weather_layout || 'vertical'}
                weatherDisplaySize={settings.weather_display_size || 'large'}
                onUpdateLocation={handleSaveSettings}
              />
            )}
            {settings.show_todo !== 0 && todoPos === 'grid' && <TodoWidget />}
            {settings.show_rss === 1 && rssPos === 'grid' && <RSSWidget feedUrl="https://news.ycombinator.com/rss" />}
          </div>

          {/* Category Columns Dashboard Grid */}
          <div
            className={`grid gap-6 ${gridColsClass}`}
            style={{
              gridTemplateColumns: window.innerWidth >= 1024 && colCount > 1 ? `repeat(${colCount}, minmax(0, 1fr))` : undefined
            }}
          >
            {categories.map((cat) => (
              <CategoryColumn
                key={cat.id}
                category={cat}
                viewMode={settings.view_mode || 'grid'}
                onAddBookmark={(catId) => {
                  setEditingBookmark(null);
                  setInitialCategoryId(catId);
                  setIsBookmarkModalOpen(true);
                }}
                onContextMenuBookmark={(e, bm) => {
                  setContextMenu({ x: e.clientX, y: e.clientY, bookmark: bm });
                }}
                onLockClick={() => setIsVaultModalOpen(true)}
                onEditCategory={(categoryToEdit) => {
                  setEditingCategory(categoryToEdit);
                  setIsCategoryModalOpen(true);
                }}
                onDropCategory={handleDropCategory}
                onDropBookmark={handleDropBookmark}
              />
            ))}
          </div>
        </main>
      </div>

        {/* Floating macOS Application Dock */}
        {settings.show_dock !== 0 && (
          <Dock
            items={dock}
            onOpenEditDock={() => setIsDockModalOpen(true)}
          />
        )}
      </div>

      {/* Buy Me A NEURON Sparrow Coin Widget */}
      <BuyMeACoffeeCoin />

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCmdOpen}
        onClose={() => setIsCmdOpen(false)}
        categories={categories}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenVaultModal={() => setIsVaultModalOpen(true)}
      />

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          bookmark={contextMenu.bookmark}
          onClose={() => setContextMenu(null)}
          onEdit={(bm) => {
            setEditingBookmark(bm);
            setIsBookmarkModalOpen(true);
          }}
          onDelete={handleDeleteBookmark}
          onToggleFeatured={handleToggleFeatured}
          onToggleDock={handleToggleDockPin}
        />
      )}

      {/* Modals */}
      <AddBookmarkModal
        isOpen={isBookmarkModalOpen}
        onClose={() => setIsBookmarkModalOpen(false)}
        onSave={handleSaveBookmark}
        categories={categories}
        initialBookmark={editingBookmark}
        initialCategoryId={initialCategoryId}
      />

      <EditCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        category={editingCategory}
        onSaveCategory={handleSaveCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        onRefreshData={fetchData}
        onOpenEditPinned={() => setIsPinnedModalOpen(true)}
        onOpenEditDock={() => setIsDockModalOpen(true)}
        onAddCategory={() => {
          setEditingCategory(null);
          setIsCategoryModalOpen(true);
        }}
        user={user}
        onLogout={handleLogout}
      />

      <EditPinnedModal
        isOpen={isPinnedModalOpen}
        onClose={() => setIsPinnedModalOpen(false)}
        featuredItems={featured}
        onRefreshData={fetchData}
      />

      <EditDockModal
        isOpen={isDockModalOpen}
        onClose={() => setIsDockModalOpen(false)}
        dockItems={dock}
        onRefreshData={fetchData}
      />

      <VaultModal
        isOpen={isVaultModalOpen}
        onClose={() => setIsVaultModalOpen(false)}
        onSuccess={fetchData}
      />

      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />

      <AuthModal
        isOpen={!isAuthenticated && !loading}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
