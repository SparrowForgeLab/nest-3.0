import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Sliders, Image, Download, Upload, Palette, LayoutGrid, Eye, Search, Check, Trash2, Sparkles, MapPin, Clock, Layout, Sidebar, CloudSun, Star, Smartphone, ShieldCheck, ListPlus, Plus, User, LogOut, KeyRound, Lock, AlertCircle, CheckCircle2, Rss } from 'lucide-react';
import ColorPicker from './ColorPicker';

const POPULAR_RSS_PRESETS = [
  { title: 'Hacker News', url: 'https://news.ycombinator.com/rss', category: 'Tech' },
  { title: 'TechCrunch', url: 'https://techcrunch.com/feed/', category: 'Tech' },
  { title: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', category: 'Tech' },
  { title: 'BBC World', url: 'http://feeds.bbci.co.uk/news/rss.xml', category: 'General' },
  { title: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index', category: 'Tech' },
  { title: 'Reddit Tech', url: 'https://www.reddit.com/r/technology/.rss', category: 'Social' }
];

const PRESET_WALLPAPERS = [
  // 1. BRIGHT COLOR ABSTRACTS (5)
  {
    id: 'bright-1',
    category: 'Bright Color Abstracts',
    title: 'Neon Fluid Silk',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'bright-2',
    category: 'Bright Color Abstracts',
    title: 'Rainbow Pastel Prism',
    url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'bright-3',
    category: 'Bright Color Abstracts',
    title: 'Liquid Vivid Coral',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'bright-4',
    category: 'Bright Color Abstracts',
    title: 'Vibrant Acrylic Splash',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'bright-5',
    category: 'Bright Color Abstracts',
    title: 'Holo Light Waves',
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=400&q=80'
  },

  // 2. DARK COLOR ABSTRACTS (5)
  {
    id: 'dark-1',
    category: 'Dark Color Abstracts',
    title: 'Dark Violet Gradients',
    url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'dark-2',
    category: 'Dark Color Abstracts',
    title: 'Midnight Obsidian Mesh',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'dark-3',
    category: 'Dark Color Abstracts',
    title: 'Deep Cyan Neon Waves',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'dark-4',
    category: 'Dark Color Abstracts',
    title: 'Dark Geometric Poly',
    url: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'dark-5',
    category: 'Dark Color Abstracts',
    title: 'Black Gold Silk Flow',
    url: 'https://images.unsplash.com/photo-1604076913837-52ab5629fba9?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1604076913837-52ab5629fba9?auto=format&fit=crop&w=400&q=80'
  },

  // 3. SPACE (5)
  {
    id: 'space-1',
    category: 'Space',
    title: 'Deep Space Nebula',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'space-2',
    category: 'Space',
    title: 'Cosmic Galaxy Dust',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'space-3',
    category: 'Space',
    title: 'Stellar Aurora Borealis',
    url: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'space-4',
    category: 'Space',
    title: 'Saturn Ring Horizon',
    url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'space-5',
    category: 'Space',
    title: 'Earth Night Lights',
    url: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?auto=format&fit=crop&w=400&q=80'
  },

  // 4. NATURE & LANDSCAPE (5)
  {
    id: 'nature-1',
    category: 'Nature & Landscape',
    title: 'Misty Mountains',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'nature-2',
    category: 'Nature & Landscape',
    title: 'Emerald Forest Fog',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'nature-3',
    category: 'Nature & Landscape',
    title: 'Alpine Lake Reflection',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'nature-4',
    category: 'Nature & Landscape',
    title: 'Golden Sunset Horizon',
    url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'nature-5',
    category: 'Nature & Landscape',
    title: 'Ocean Cliff Waves',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80'
  },

  // 5. TECH (5)
  {
    id: 'tech-1',
    category: 'Tech',
    title: 'Cyberpunk Neon Grid',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'tech-2',
    category: 'Tech',
    title: 'Glowing Motherboard Circuit',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'tech-3',
    category: 'Tech',
    title: 'Server Room Glow',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'tech-4',
    category: 'Tech',
    title: 'Binary Code Stream',
    url: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'tech-5',
    category: 'Tech',
    title: 'Matrix Terminal Glow',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80'
  }
];

export default function SettingsModal({ isOpen, onClose, settings = {}, onSaveSettings, onRefreshData, onOpenEditPinned, onOpenEditDock, onAddCategory, user, onLogout }) {
  const [activeTab, setActiveTab] = useState('profile');

  const [theme, setTheme] = useState('sparrow-dark');
  const [accentColor, setAccentColor] = useState('#38bdf8');
  const [wallpaperCategory, setWallpaperCategory] = useState('All');
  const [searchEngine, setSearchEngine] = useState('google');
  const [userName, setUserName] = useState('Sparrow');

  // Backup & Restore State
  const [importStatusMsg, setImportStatusMsg] = useState('');
  const [importErrorMsg, setImportErrorMsg] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  // User Profile & Password Change State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdSuccessMsg, setPwdSuccessMsg] = useState('');
  const [pwdErrorMsg, setPwdErrorMsg] = useState('');
  const [isSubmittingPwd, setIsSubmittingPwd] = useState(false);

  // Account Deletion State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteErrorMsg, setDeleteErrorMsg] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const handleDeleteAccountSubmit = async (e) => {
    e.preventDefault();
    if (!deletePassword.trim()) return;

    setDeleteErrorMsg('');
    setIsDeletingAccount(true);

    try {
      const res = await axios.post('/api/auth/delete-account', {
        password: deletePassword.trim()
      });

      if (res.data.success) {
        localStorage.removeItem('nest3_token');
        delete axios.defaults.headers.common['Authorization'];
        alert('Your account and all associated data have been permanently deleted.');
        window.location.reload();
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Account deletion failed.';
      setDeleteErrorMsg(msg);
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwdSuccessMsg('');
    setPwdErrorMsg('');

    if (!oldPassword.trim() || !newPassword.trim()) {
      setPwdErrorMsg('Both current password and new password are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwdErrorMsg('New password and confirm password do not match.');
      return;
    }

    if (newPassword.length < 4) {
      setPwdErrorMsg('New password must be at least 4 characters long.');
      return;
    }

    setIsSubmittingPwd(true);
    try {
      const res = await axios.post('/api/auth/change-password', {
        oldPassword: oldPassword.trim(),
        newPassword: newPassword.trim()
      });

      if (res.data.success) {
        setPwdSuccessMsg('Password updated successfully!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Failed to update password. Check your current password.';
      setPwdErrorMsg(msg);
    } finally {
      setIsSubmittingPwd(false);
    }
  };
  const [columnCount, setColumnCount] = useState(4);
  const [layoutStyle, setLayoutStyle] = useState('normal');
  const [viewMode, setViewMode] = useState('grid');
  const [fontSize, setFontSize] = useState(16);
  const [bgImage, setBgImage] = useState('');
  const [bgBlur, setBgBlur] = useState(16);
  const [bgDim, setBgDim] = useState(40);
  const [showHeader, setShowHeader] = useState(true);
  const [showFeatured, setShowFeatured] = useState(true);
  const [showDaily, setShowDaily] = useState(true);
  const [showDock, setShowDock] = useState(true);
  const [showClock, setShowClock] = useState(true);
  const [showWeather, setShowWeather] = useState(true);
  const [showRss, setShowRss] = useState(false);
  const [showTodo, setShowTodo] = useState(true);

  // Clock & Sidebar Positions
  const [clockType, setClockType] = useState('digital');
  const [clockFormat, setClockFormat] = useState('12h');
  const [rssPosition, setRssPosition] = useState('grid');
  const [todoPosition, setTodoPosition] = useState('right-sidebar');
  const [weatherPosition, setWeatherPosition] = useState('left-sidebar');
  const [clockPosition, setClockPosition] = useState('grid');

  // Weather Customization Settings
  const [weatherLoc, setWeatherLoc] = useState('London, UK');
  const [weatherLat, setWeatherLat] = useState(51.5074);
  const [weatherLon, setWeatherLon] = useState(-0.1278);
  const [weatherUnits, setWeatherUnits] = useState('celsius');
  const [weatherSize, setWeatherSize] = useState('normal');
  const [weatherLayout, setWeatherLayout] = useState('vertical');
  const [weatherDisplaySize, setWeatherDisplaySize] = useState('large');
  const [weatherQuery, setWeatherQuery] = useState('');
  const [weatherResults, setWeatherResults] = useState([]);
  const [isSearchingLoc, setIsSearchingLoc] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  // Multi-Feed RSS State & Handlers
  const [rssFeeds, setRssFeeds] = useState([]);
  const [newRssTitle, setNewRssTitle] = useState('');
  const [newRssUrl, setNewRssUrl] = useState('');
  const [newRssCategory, setNewRssCategory] = useState('Tech');
  const [isAddingRss, setIsAddingRss] = useState(false);
  const [rssMsg, setRssMsg] = useState('');

  const fetchRssFeeds = async () => {
    try {
      const res = await axios.get('/api/rss-feeds');
      if (res.data.success) {
        setRssFeeds(res.data.feeds);
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (isOpen) fetchRssFeeds();
  }, [isOpen]);

  const handleAddRssFeed = async (e) => {
    e.preventDefault();
    if (!newRssUrl.trim()) return;
    setIsAddingRss(true);
    setRssMsg('');
    try {
      const res = await axios.post('/api/rss-feeds', {
        title: newRssTitle.trim() || 'RSS Feed',
        url: newRssUrl.trim(),
        category: newRssCategory
      });
      if (res.data.success) {
        setRssFeeds(prev => [...prev, res.data.feed]);
        setNewRssTitle('');
        setNewRssUrl('');
        setRssMsg('RSS Feed added successfully!');
        onRefreshData && onRefreshData();
      }
    } catch (err) {
      setRssMsg('Failed to add RSS feed.');
    } finally {
      setIsAddingRss(false);
    }
  };

  const handleDeleteRssFeed = async (id) => {
    try {
      await axios.delete(`/api/rss-feeds/${id}`);
      setRssFeeds(prev => prev.filter(f => f.id !== id));
      onRefreshData && onRefreshData();
    } catch (e) {}
  };

  const handleQuickAddRssPreset = async (preset) => {
    try {
      const res = await axios.post('/api/rss-feeds', preset);
      if (res.data.success) {
        setRssFeeds(prev => [...prev, res.data.feed]);
        setRssMsg(`Added ${preset.title}!`);
        onRefreshData && onRefreshData();
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (settings) {
      setTheme(settings.theme || 'sparrow-dark');
      setAccentColor(settings.accent_color || '#38bdf8');
      setSearchEngine(settings.search_engine || 'google');
      setUserName(settings.user_name || 'Sparrow');
      setColumnCount(settings.column_count || 4);
      setLayoutStyle(settings.layout_style || 'normal');
      setViewMode(settings.view_mode || 'grid');
      setFontSize(settings.font_size || 16);
      setBgImage(settings.background_image || '');
      setBgBlur(settings.background_blur !== undefined ? settings.background_blur : 16);
      setBgDim(settings.background_dim !== undefined ? settings.background_dim : 40);
      setShowHeader(settings.show_header !== 0);
      setShowFeatured(settings.show_featured !== 0);
      setShowDaily(settings.show_daily !== 0 && settings.show_clock !== 0);
      setShowClock(settings.show_daily !== 0 && settings.show_clock !== 0);
      setShowDock(settings.show_dock !== 0);
      setShowWeather(settings.show_weather !== 0);
      setShowRss(settings.show_rss === 1);
      setShowTodo(settings.show_todo !== 0);

      setClockType(settings.clock_type || 'digital');
      setClockFormat(settings.clock_format || '12h');
      setRssPosition(settings.rss_position || 'grid');
      setTodoPosition(settings.todo_position || 'right-sidebar');
      setWeatherPosition(settings.weather_position || 'left-sidebar');
      setClockPosition(settings.clock_position || 'grid');

      setWeatherLoc(settings.weather_location || 'London, UK');
      setWeatherLat(settings.weather_lat || 51.5074);
      setWeatherLon(settings.weather_lon || -0.1278);
      setWeatherUnits(settings.weather_units || 'celsius');
      setWeatherSize(settings.weather_size || 'normal');
      setWeatherLayout(settings.weather_layout || 'vertical');
      setWeatherDisplaySize(settings.weather_display_size || 'large');
    }
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings({
      theme,
      accent_color: accentColor,
      search_engine: searchEngine,
      user_name: userName.trim() || 'Sparrow',
      column_count: parseInt(columnCount, 10),
      layout_style: layoutStyle,
      view_mode: viewMode,
      font_size: parseInt(fontSize, 10),
      background_image: bgImage.startsWith('file://') ? '' : bgImage,
      background_blur: parseInt(bgBlur, 10),
      background_dim: parseInt(bgDim, 10),
      show_header: showHeader ? 1 : 0,
      show_featured: showFeatured ? 1 : 0,
      show_daily: showDaily ? 1 : 0,
      show_dock: showDock ? 1 : 0,
      show_clock: showClock ? 1 : 0,
      show_weather: showWeather ? 1 : 0,
      show_rss: showRss ? 1 : 0,
      show_todo: showTodo ? 1 : 0,
      clock_type: clockType,
      clock_format: clockFormat,
      rss_position: rssPosition,
      todo_position: todoPosition,
      weather_position: weatherPosition,
      clock_position: clockPosition,
      weather_location: weatherLoc,
      weather_lat: parseFloat(weatherLat),
      weather_lon: parseFloat(weatherLon),
      weather_units: weatherUnits,
      weather_size: weatherSize,
      weather_layout: weatherLayout,
      weather_display_size: weatherDisplaySize
    });
    onClose();
  };

  const handleSearchWeatherLoc = async (e) => {
    e.preventDefault();
    if (!weatherQuery.trim()) return;

    setIsSearchingLoc(true);
    try {
      const res = await axios.get(`/api/widgets/weather/search?query=${encodeURIComponent(weatherQuery)}`);
      setWeatherResults(res.data || []);
    } catch (err) {
      setWeatherResults([]);
    } finally {
      setIsSearchingLoc(false);
    }
  };

  const handleSelectWeatherLoc = (loc) => {
    const locName = loc.formatted || loc.name || 'Custom Location';
    setWeatherLoc(locName);
    setWeatherLat(loc.latitude);
    setWeatherLon(loc.longitude);
    setWeatherResults([]);
    setWeatherQuery('');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadMessage('Uploading image...');

    try {
      const formData = new FormData();
      formData.append('wallpaper', file);

      const res = await axios.post('/api/settings/upload-background', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data && res.data.url) {
        setBgImage(res.data.url);
        setUploadMessage('Wallpaper uploaded successfully!');
      }
    } catch (err) {
      setUploadMessage('Upload failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadMessage(''), 4000);
    }
  };

  const handleExportJSON = () => {
    const savedToken = localStorage.getItem('nest3_token');
    const exportUrl = '/api/bookmarks/export' + (savedToken ? `?token=${encodeURIComponent(savedToken)}` : '');
    window.open(exportUrl, '_blank');
  };

  const handleImportJSON = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImportStatusMsg('');
    setImportErrorMsg('');
    setIsImporting(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target.result;
        let res;
        if (file.name.toLowerCase().endsWith('.json')) {
          res = await axios.post('/api/bookmarks/import', { jsonContent: content, overwrite: true });
        } else {
          res = await axios.post('/api/bookmarks/import', { htmlContent: content });
        }
        setImportStatusMsg(res.data?.message || 'Full backup restored successfully! Reloading your dashboard...');
        onRefreshData && onRefreshData();
      } catch (err) {
        setImportErrorMsg('Failed to restore backup: ' + (err.response?.data?.error || err.message));
      } finally {
        setIsImporting(false);
      }
    };
    reader.readAsText(file);
  };

  const tabs = [
    { id: 'profile', label: 'User Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'wallpaper', label: 'Wallpaper & Glass', icon: Image },
    { id: 'layout', label: 'Layout & Sidebars', icon: Sidebar },
    { id: 'pinned_dock', label: 'Pinned & Dock', icon: Star },
    { id: 'weather', label: 'Weather', icon: CloudSun },
    { id: 'data', label: 'Backup & Data', icon: Download },
  ];

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl p-6 glass-panel shadow-2xl text-slate-100 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 mb-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-sky-400" />
            <h3 className="text-lg font-bold">Unified Preferences Panel</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Header Bar */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-slate-800 mb-4 flex-shrink-0 scrollbar-none">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-sky-500/20 border border-sky-400/60 text-sky-300 shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-6 pr-2 text-xs sm:text-sm">
          {/* TAB 0: USER PROFILE & SECURITY */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              {/* Profile Account Card & Display Name */}
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-sky-400 flex items-center gap-1.5 text-sm">
                  <User className="w-4 h-4" /> Profile Details & Display Name
                </h4>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg flex-shrink-0">
                      {(userName || user?.username || 'U')[0].toUpperCase()}
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="block text-[11px] font-semibold text-slate-400">Account Display Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Sparrow, Alex..."
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-1.5 text-slate-100 text-xs outline-none focus:border-sky-400"
                      />
                    </div>
                  </div>

                  {onLogout && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onLogout();
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-semibold transition flex items-center gap-1.5 text-xs whitespace-nowrap"
                    >
                      <LogOut className="w-3.5 h-3.5 text-slate-400" /> Log Out
                    </button>
                  )}
                </div>
              </div>

              {/* Change Password Form */}
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-sky-400 flex items-center gap-1.5 text-sm">
                  <KeyRound className="w-4 h-4 text-sky-400" /> Security & Password Management
                </h4>

                {pwdErrorMsg && (
                  <div className="px-3 py-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-medium flex items-center gap-2 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    <span>{pwdErrorMsg}</span>
                  </div>
                )}

                {pwdSuccessMsg && (
                  <div className="px-3 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-medium flex items-center gap-2 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{pwdSuccessMsg}</span>
                  </div>
                )}

                <div className="space-y-3 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Current Password (Required)
                    </label>
                    <input
                      type="password"
                      placeholder="Enter your current password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400 text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={handleChangePasswordSubmit}
                      disabled={isSubmittingPwd || !oldPassword.trim() || !newPassword.trim()}
                      className="px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-md disabled:opacity-50 transition"
                    >
                      {isSubmittingPwd ? (
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 animate-spin" /> Updating...
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <KeyRound className="w-3.5 h-3.5" /> Update Password
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* DANGER ZONE: Account Deletion */}
              <div className="bg-rose-950/30 p-4 rounded-xl border border-rose-900/60 space-y-3">
                <h4 className="font-bold text-rose-400 flex items-center gap-1.5 text-sm">
                  <Trash2 className="w-4 h-4 text-rose-400" /> Danger Zone: Permanent Account Deletion
                </h4>

                <p className="text-xs text-rose-300/80">
                  Deleting your account will permanently purge all your custom categories, bookmarks, settings, RSS feeds, and dock shortcuts. This action cannot be undone.
                </p>

                {deleteErrorMsg && (
                  <div className="px-3 py-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-medium flex items-center gap-2 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    <span>{deleteErrorMsg}</span>
                  </div>
                )}

                {!showDeleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/50 text-rose-300 font-bold text-xs transition flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete My Account
                  </button>
                ) : (
                  <form onSubmit={handleDeleteAccountSubmit} className="space-y-3 bg-slate-900/90 p-3.5 rounded-xl border border-rose-500/40">
                    <label className="block text-xs font-semibold text-rose-300">
                      Enter your password to confirm permanent account deletion:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        placeholder="Your account password..."
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        className="flex-1 bg-slate-950 border border-rose-500/40 rounded-xl px-3 py-1.5 text-slate-100 text-xs outline-none focus:border-rose-400"
                      />
                      <button
                        type="submit"
                        disabled={isDeletingAccount || !deletePassword.trim()}
                        className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg disabled:opacity-50 transition flex items-center gap-1"
                      >
                        {isDeletingAccount ? 'Deleting...' : 'Confirm & Delete'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeletePassword('');
                          setDeleteErrorMsg('');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* TAB 1: APPEARANCE */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-4">
                <h4 className="font-bold text-sky-400 flex items-center gap-1.5 text-sm sm:text-base">
                  <Palette className="w-4 h-4" /> Aesthetic Theme Presets
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Greeting Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Sparrow, Alex, Captain..."
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Select Theme</label>
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 outline-none cursor-pointer"
                    >
                      <option value="sparrow-dark">Sparrow Glass Dark (Default)</option>
                      <option value="midnight-oled">Midnight OLED (True Black)</option>
                      <option value="aurora-glow">Aurora Glow (Teal & Emerald)</option>
                      <option value="cyber-amber">Cyberpunk Amber</option>
                      <option value="frosted-light">Frosted Glass (Light)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Default Search Engine</label>
                    <select
                      value={searchEngine}
                      onChange={(e) => setSearchEngine(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 outline-none cursor-pointer"
                    >
                      <option value="google">Google</option>
                      <option value="duckduckgo">DuckDuckGo</option>
                      <option value="brave">Brave</option>
                      <option value="bing">Bing</option>
                      <option value="youtube">YouTube</option>
                      <option value="github">GitHub</option>
                      <option value="reddit">Reddit</option>
                      <option value="wikipedia">Wikipedia</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <ColorPicker
                    selectedColor={accentColor}
                    onSelectColor={(newColor) => {
                      setAccentColor(newColor);
                      document.documentElement.style.setProperty('--accent-color', newColor);
                      document.documentElement.style.setProperty('--sky-400', newColor);
                      document.documentElement.style.setProperty('--accent-glow', newColor + '40');
                    }}
                    label="Custom Accent Color Palette"
                  />
                </div>
              </div>

              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-4">
                <h4 className="font-bold text-sky-400 flex items-center gap-1.5 text-sm sm:text-base">
                  <LayoutGrid className="w-4 h-4" /> Card Display & Typography
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Card View Mode</label>
                    <select
                      value={viewMode}
                      onChange={(e) => setViewMode(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 outline-none cursor-pointer"
                    >
                      <option value="grid">Multi-Column Grid</option>
                      <option value="card">Large Cards</option>
                      <option value="list">Compact List View</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Base Font Size ({fontSize}px)</label>
                    <input
                      type="range"
                      min="12"
                      max="22"
                      value={fontSize}
                      onChange={(e) => setFontSize(e.target.value)}
                      className="w-full accent-sky-400 mt-2 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WALLPAPER & GLASS */}
          {activeTab === 'wallpaper' && (
            <div className="space-y-4">
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="font-bold text-sky-400 flex items-center gap-1.5 text-sm">
                    <Image className="w-4 h-4" /> Wallpaper Presets (5 per category)
                  </h4>
                  {bgImage && (
                    <button
                      type="button"
                      onClick={() => setBgImage('')}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-normal"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove Image
                    </button>
                  )}
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {['All', 'Bright Color Abstracts', 'Dark Color Abstracts', 'Space', 'Nature & Landscape', 'Tech'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setWallpaperCategory(cat)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                        wallpaperCategory === cat
                          ? 'bg-sky-500 text-white shadow-md'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Grid of Wallpapers */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-h-56 overflow-y-auto pr-1">
                  <button
                    type="button"
                    onClick={() => setBgImage('')}
                    className={`h-20 rounded-xl border flex flex-col items-center justify-center p-1 text-center transition ${
                      !bgImage ? 'border-sky-400 bg-sky-500/20 text-sky-300 font-bold' : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs">None</span>
                    <span className="text-[10px] text-slate-500">Solid Color</span>
                  </button>

                  {PRESET_WALLPAPERS.filter(p => wallpaperCategory === 'All' || p.category === wallpaperCategory).map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setBgImage(preset.url)}
                      className={`h-20 rounded-xl border relative overflow-hidden group transition ${
                        bgImage === preset.url ? 'border-sky-400 ring-2 ring-sky-400/50' : 'border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <img src={preset.thumb} alt={preset.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors" />
                      <span className="absolute bottom-1 left-1 right-1 text-[10px] font-semibold text-white bg-slate-950/80 px-1 py-0.5 rounded truncate text-center">
                        {preset.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-4">
                <h4 className="font-bold text-sky-400 flex items-center gap-1.5 text-sm sm:text-base">
                  <Upload className="w-4 h-4" /> Custom Image & Local Upload
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Custom Wallpaper Image URL</label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/your-image.jpg"
                      value={bgImage}
                      onChange={(e) => setBgImage(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 placeholder-slate-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Upload Local Image</label>
                    <label className="flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sky-400 font-semibold cursor-pointer transition">
                      <Upload className="w-4 h-4" /> {isUploading ? 'Uploading...' : 'Choose Local File'}
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={isUploading} />
                    </label>
                    {uploadMessage && <p className="text-xs text-sky-300 mt-1">{uploadMessage}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Background Blur ({bgBlur}px)</label>
                    <input
                      type="range"
                      min="0"
                      max="64"
                      value={bgBlur}
                      onChange={(e) => setBgBlur(e.target.value)}
                      className="w-full accent-sky-400 mt-1 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Background Dimming ({bgDim}%)</label>
                    <input
                      type="range"
                      min="0"
                      max="90"
                      value={bgDim}
                      onChange={(e) => setBgDim(e.target.value)}
                      className="w-full accent-sky-400 mt-1 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LAYOUT & SIDEBARS */}
          {activeTab === 'layout' && (
            <div className="space-y-4">
              {/* Grid Columns & Density */}
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="font-bold text-sky-400 flex items-center gap-1.5 text-sm">
                    <Layout className="w-4 h-4" /> Grid Columns & Density
                  </h4>
                  {onAddCategory && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onAddCategory();
                      }}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 text-xs font-bold transition shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5 text-sky-400" /> Add Category Column
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Columns Count</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setColumnCount(num)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition border ${
                            columnCount === num
                              ? 'bg-sky-500 border-sky-400 text-white shadow-md'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">View Mode</label>
                    <select
                      value={viewMode}
                      onChange={(e) => setViewMode(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-100 text-xs outline-none cursor-pointer"
                    >
                      <option value="grid">Multi-Column Grid</option>
                      <option value="card">Large Cards</option>
                      <option value="list">Compact List View</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Layout Spacing</label>
                    <select
                      value={layoutStyle}
                      onChange={(e) => setLayoutStyle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-100 text-xs outline-none cursor-pointer"
                    >
                      <option value="compact">Compact (Tighter)</option>
                      <option value="normal">Standard View</option>
                      <option value="spacious">Spacious (Roomy)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Base Interface Font Size ({fontSize}px)</label>
                  <input
                    type="range"
                    min="12"
                    max="22"
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Widget Placement & Sidebars */}
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-sky-400 flex items-center gap-1.5 text-sm">
                  <Sidebar className="w-4 h-4" /> Widget Placement & Visibility
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Clock Position</label>
                    <select
                      value={clockPosition}
                      onChange={(e) => setClockPosition(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-100 text-xs outline-none cursor-pointer"
                    >
                      <option value="grid">Top Header Center</option>
                      <option value="left-sidebar">Left Sidebar</option>
                      <option value="right-sidebar">Right Sidebar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">To-Do List Position</label>
                    <select
                      value={todoPosition}
                      onChange={(e) => setTodoPosition(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-100 text-xs outline-none cursor-pointer"
                    >
                      <option value="grid">Top Grid Widget</option>
                      <option value="left-sidebar">Left Sidebar</option>
                      <option value="right-sidebar">Right Sidebar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">RSS Position</label>
                    <select
                      value={rssPosition}
                      onChange={(e) => setRssPosition(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-100 text-xs outline-none cursor-pointer"
                    >
                      <option value="grid">Top Grid Widget</option>
                      <option value="left-sidebar">Left Sidebar</option>
                      <option value="right-sidebar">Right Sidebar</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-800/80">
                  <label className="flex items-center gap-2 text-slate-200 text-xs cursor-pointer">
                    <input type="checkbox" checked={showHeader} onChange={(e) => setShowHeader(e.target.checked)} className="rounded border-slate-700 bg-slate-900 text-sky-500 w-4 h-4" />
                    Show Top Navigation Bar
                  </label>
                  <label className="flex items-center gap-2 text-slate-200 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showDaily && showClock}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setShowDaily(val);
                        setShowClock(val);
                      }}
                      className="rounded border-slate-700 bg-slate-900 text-sky-500 w-4 h-4"
                    />
                    Show Daily Greeting & Clock Banner
                  </label>
                </div>
              </div>

              {/* RSS Feeds Manager */}
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="font-bold text-sky-400 flex items-center gap-1.5 text-sm">
                    <Rss className="w-4 h-4 text-amber-400" /> RSS Reader Feeds Manager
                  </h4>
                  <label className="flex items-center gap-2 text-slate-200 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showRss}
                      onChange={(e) => setShowRss(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-900 text-sky-500 w-4 h-4"
                    />
                    Enable RSS Reader
                  </label>
                </div>

                {rssMsg && (
                  <div className="px-3 py-1.5 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-200 text-xs font-medium flex items-center gap-2 animate-fadeIn">
                    <Sparkles className="w-4 h-4 text-sky-400" />
                    <span>{rssMsg}</span>
                  </div>
                )}

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <div className="sm:col-span-5">
                      <input
                        type="text"
                        placeholder="Feed Title (e.g. Hacker News)"
                        value={newRssTitle}
                        onChange={(e) => setNewRssTitle(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-1.5 text-slate-100 placeholder-slate-500 text-xs outline-none focus:border-sky-400"
                      />
                    </div>
                    <div className="sm:col-span-7 flex gap-2">
                      <input
                        type="url"
                        placeholder="https://news.ycombinator.com/rss"
                        value={newRssUrl}
                        onChange={(e) => setNewRssUrl(e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-1.5 text-slate-100 placeholder-slate-500 text-xs outline-none focus:border-sky-400"
                      />
                      <button
                        type="button"
                        onClick={handleAddRssFeed}
                        disabled={isAddingRss || !newRssUrl.trim()}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md disabled:opacity-50 transition whitespace-nowrap"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400 font-semibold self-center mr-1">Popular Presets:</span>
                    {POPULAR_RSS_PRESETS.map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => handleQuickAddRssPreset(preset)}
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-950 border border-slate-700/60 text-slate-300 hover:text-amber-300 text-[11px] font-medium transition"
                      >
                        <Rss className="w-3 h-3 text-amber-400" />
                        <span>{preset.title}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h5 className="font-bold text-xs text-slate-300">Active RSS Feeds ({rssFeeds.length})</h5>
                  {rssFeeds.length > 0 ? (
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {rssFeeds.map((feed) => (
                        <div
                          key={feed.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs"
                        >
                          <div className="min-w-0 pr-2">
                            <div className="font-bold text-slate-100 truncate">{feed.title}</div>
                            <div className="text-[10px] text-slate-400 truncate">{feed.url}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteRssFeed(feed.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-300 hover:bg-rose-500/20 transition flex-shrink-0"
                            title="Delete Feed"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-2 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-lg">
                      No custom RSS feeds configured yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PINNED LINKS & DOCK */}
          {activeTab === 'pinned_dock' && (
            <div className="space-y-6">
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-4">
                <h4 className="font-bold text-sky-400 flex items-center gap-1.5 text-sm sm:text-base">
                  <Star className="w-4 h-4 text-sky-400 fill-sky-400" /> Pinned Links Shelf Settings
                </h4>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-slate-200 font-semibold cursor-pointer">
                      <input type="checkbox" checked={showFeatured} onChange={(e) => setShowFeatured(e.target.checked)} className="rounded border-slate-700 bg-slate-900 text-sky-500 w-4 h-4" />
                      Show Pinned Links Shelf on Dashboard
                    </label>
                    <p className="text-xs text-slate-400">Quickly launch your top priority bookmarks directly below search.</p>
                  </div>

                  {onOpenEditPinned && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenEditPinned();
                      }}
                      className="px-4 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 font-semibold transition flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <ListPlus className="w-4 h-4 text-sky-400" /> Manage Pinned Links
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-4">
                <h4 className="font-bold text-sky-400 flex items-center gap-1.5 text-sm sm:text-base">
                  <Smartphone className="w-4 h-4" /> Floating Application Dock Settings
                </h4>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-slate-200 font-semibold cursor-pointer">
                      <input type="checkbox" checked={showDock} onChange={(e) => setShowDock(e.target.checked)} className="rounded border-slate-700 bg-slate-900 text-sky-500 w-4 h-4" />
                      Show macOS Floating Application Dock
                    </label>
                    <p className="text-xs text-slate-400">Bottom pinned quick dock with smooth magnifying hover animations.</p>
                  </div>

                  {onOpenEditDock && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenEditDock();
                      }}
                      className="px-4 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 font-semibold transition flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <Sliders className="w-4 h-4" /> Manage Dock Apps
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: WEATHER & LOCATION */}
          {activeTab === 'weather' && (
            <div className="space-y-4">
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="font-bold text-sky-400 flex items-center gap-1.5 text-sm">
                    <CloudSun className="w-4 h-4" /> Weather Widget & Location
                  </h4>
                  <label className="flex items-center gap-2 text-slate-200 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showWeather}
                      onChange={(e) => setShowWeather(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-900 text-sky-500 w-4 h-4"
                    />
                    Enable Weather Widget
                  </label>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Search City / Location</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. London, Tokyo, New York, Sydney..."
                      value={weatherQuery}
                      onChange={(e) => setWeatherQuery(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSearchWeatherLoc(e); } }}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-100 text-xs outline-none focus:border-sky-400"
                    />
                    <button
                      type="button"
                      onClick={handleSearchWeatherLoc}
                      disabled={isSearchingLoc}
                      className="px-4 py-1.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-semibold transition shadow-md"
                    >
                      {isSearchingLoc ? 'Searching...' : 'Search'}
                    </button>
                  </div>

                  {weatherResults.length > 0 && (
                    <div className="mt-2 bg-slate-900 border border-slate-700 rounded-xl p-2 max-h-40 overflow-y-auto space-y-1">
                      {weatherResults.map((loc, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectWeatherLoc(loc)}
                          className="w-full text-left p-2 rounded-lg hover:bg-slate-800 text-xs text-slate-200 transition"
                        >
                          {loc.formatted || loc.name}
                        </button>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-slate-400 mt-2">Active Location: <span className="text-sky-300 font-semibold">{weatherLoc}</span></p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Widget Position</label>
                    <select
                      value={weatherPosition}
                      onChange={(e) => setWeatherPosition(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-100 text-xs outline-none cursor-pointer"
                    >
                      <option value="left-sidebar">Left Sidebar</option>
                      <option value="grid">Top Grid Widget</option>
                      <option value="right-sidebar">Right Sidebar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Temperature Units</label>
                    <select
                      value={weatherUnits}
                      onChange={(e) => setWeatherUnits(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-100 text-xs outline-none cursor-pointer"
                    >
                      <option value="celsius">Celsius (°C)</option>
                      <option value="fahrenheit">Fahrenheit (°F)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Widget Layout</label>
                    <select
                      value={weatherLayout}
                      onChange={(e) => setWeatherLayout(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-100 text-xs outline-none cursor-pointer"
                    >
                      <option value="vertical">Vertical Card</option>
                      <option value="horizontal">Horizontal Bar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Display Detail</label>
                    <select
                      value={weatherDisplaySize}
                      onChange={(e) => setWeatherDisplaySize(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-100 text-xs outline-none cursor-pointer"
                    >
                      <option value="normal">Standard View</option>
                      <option value="large">Detailed Forecast</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: DATA BACKUP & RESTORE */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sky-400 flex items-center gap-2 text-base">
                      <Download className="w-5 h-5" /> Full Backup & Restore System
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Export or restore your complete Nest 3.0 workspace — including all settings, custom categories, bookmarks, featured links, dock shortcuts, RSS feeds, and widgets.
                    </p>
                  </div>
                </div>

                {importStatusMsg && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{importStatusMsg}</span>
                  </div>
                )}

                {importErrorMsg && (
                  <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    <span>{importErrorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3">
                    <div>
                      <h5 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                        <Download className="w-4 h-4 text-sky-400" /> Export Full Backup
                      </h5>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Download a clean <code className="text-sky-300">.json</code> file containing all your settings, themes, bookmarks, widgets, and dock links.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleExportJSON}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" /> Download Full Nest Backup (.json)
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3">
                    <div>
                      <h5 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                        <Upload className="w-4 h-4 text-emerald-400" /> Restore / Import File
                      </h5>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Restore a Nest JSON backup or import Chrome/Firefox HTML bookmarks directly into your dashboard.
                      </p>
                    </div>
                    <label className={`w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer ${isImporting ? 'opacity-50 pointer-events-none' : ''}`}>
                      <Upload className="w-4 h-4" /> {isImporting ? 'Restoring Backup...' : 'Select Backup File (.json / .html)'}
                      <input type="file" onChange={handleImportJSON} accept=".json,.html" className="hidden" disabled={isImporting} />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/80 flex-shrink-0">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition font-medium">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold transition shadow-lg">
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
