import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Sliders, Image, Download, Upload, Palette, LayoutGrid, Eye, Search, Check, Trash2, Sparkles, MapPin, Clock, Layout, Sidebar, CloudSun, Star, Smartphone, ShieldCheck, ListPlus, Plus, User, LogOut, KeyRound, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import ColorPicker from './ColorPicker';

const PRESET_WALLPAPERS = [
  {
    id: 'abstract-1',
    category: 'Abstract',
    title: 'Neon Fluid Silk',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'abstract-2',
    category: 'Abstract',
    title: 'Glass Prism Wave',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'abstract-3',
    category: 'Abstract',
    title: 'Dark Violet Gradients',
    url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'landscape-1',
    category: 'Landscape',
    title: 'Misty Mountains',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'space-1',
    category: 'Space',
    title: 'Deep Space Nebula',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80'
  }
];

export default function SettingsModal({ isOpen, onClose, settings = {}, onSaveSettings, onRefreshData, onOpenEditPinned, onOpenEditDock, onAddCategory, user, onLogout }) {
  const [activeTab, setActiveTab] = useState('appearance');

  const [theme, setTheme] = useState('sparrow-dark');
  const [searchEngine, setSearchEngine] = useState('google');
  const [userName, setUserName] = useState('Sparrow');

  // User Profile & Password Change State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdSuccessMsg, setPwdSuccessMsg] = useState('');
  const [pwdErrorMsg, setPwdErrorMsg] = useState('');
  const [isSubmittingPwd, setIsSubmittingPwd] = useState(false);

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

  useEffect(() => {
    if (settings) {
      setTheme(settings.theme || 'sparrow-dark');
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
    window.open('/api/bookmarks/export', '_blank');
  };

  const handleImportJSON = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target.result;
        if (file.name.endsWith('.json')) {
          await axios.post('/api/bookmarks/import', { jsonContent: content });
        } else {
          await axios.post('/api/bookmarks/import', { htmlContent: content });
        }
        alert('Bookmarks imported successfully!');
        onRefreshData && onRefreshData();
      } catch (err) {
        alert('Failed to import bookmarks');
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
            <div className="space-y-6">
              {/* Profile Account Card */}
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-4">
                <h4 className="font-bold text-sky-400 flex items-center gap-1.5 text-sm sm:text-base">
                  <User className="w-4 h-4" /> Account Details
                </h4>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg">
                      {(user?.username || 'U')[0].toUpperCase()}
                    </div>
                    <div>
                      <h5 className="font-bold text-base text-slate-100 flex items-center gap-2">
                        {user?.username || 'Sparrow User'}
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-semibold">Active</span>
                      </h5>
                      <p className="text-xs text-slate-400">Account ID #{user?.id || '1'}</p>
                    </div>
                  </div>

                  {onLogout && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onLogout();
                      }}
                      className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold transition flex items-center gap-2 text-xs"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" /> Log Out of Account
                    </button>
                  )}
                </div>
              </div>

              {/* Change Password Form */}
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-4">
                <h4 className="font-bold text-sky-400 flex items-center gap-1.5 text-sm sm:text-base">
                  <KeyRound className="w-4 h-4 text-sky-400" /> Security & Password Management
                </h4>

                {pwdErrorMsg && (
                  <div className="px-3.5 py-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-medium flex items-center gap-2 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    <span>{pwdErrorMsg}</span>
                  </div>
                )}

                {pwdSuccessMsg && (
                  <div className="px-3.5 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-medium flex items-center gap-2 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{pwdSuccessMsg}</span>
                  </div>
                )}

                <div className="space-y-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Current Password (Required)
                    </label>
                    <input
                      type="password"
                      placeholder="Enter your current password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400 text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={handleChangePasswordSubmit}
                      disabled={isSubmittingPwd || !oldPassword.trim() || !newPassword.trim()}
                      className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-md disabled:opacity-50 transition"
                    >
                      {isSubmittingPwd ? (
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 animate-spin" /> Updating...
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <KeyRound className="w-3.5 h-3.5" /> Change Password
                        </span>
                      )}
                    </button>
                  </div>
                </div>
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
                    selectedColor={settings.custom_accent || '#38bdf8'}
                    onSelectColor={(newColor) => {
                      document.documentElement.style.setProperty('--accent-color', newColor);
                    }}
                    label="Custom Theme Accent Color"
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
            <div className="space-y-6">
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-4">
                <h4 className="font-bold text-sky-400 flex items-center justify-between text-sm sm:text-base">
                  <span className="flex items-center gap-1.5"><Image className="w-4 h-4" /> Wallpaper Presets</span>
                  {bgImage && (
                    <button
                      type="button"
                      onClick={() => setBgImage('')}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-normal"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove Image
                    </button>
                  )}
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                  <button
                    type="button"
                    onClick={() => setBgImage('')}
                    className={`h-16 rounded-xl border flex flex-col items-center justify-center p-1 text-center transition ${
                      !bgImage ? 'border-sky-400 bg-sky-500/20 text-sky-300 font-bold' : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs">None</span>
                    <span className="text-[10px] text-slate-500">Solid Color</span>
                  </button>

                  {PRESET_WALLPAPERS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setBgImage(preset.url)}
                      className={`h-16 rounded-xl border relative overflow-hidden group transition ${
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
            <div className="space-y-6">
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-4">
                <h4 className="font-bold text-sky-400 flex items-center gap-1.5 text-sm sm:text-base">
                  <Sidebar className="w-4 h-4" /> Widget Placement & Sidebar Positions
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Clock Widget Placement</label>
                    <select
                      value={clockPosition}
                      onChange={(e) => setClockPosition(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 outline-none cursor-pointer"
                    >
                      <option value="grid">Top Header Center</option>
                      <option value="left-sidebar">Left Collapsible Sidebar</option>
                      <option value="right-sidebar">Right Collapsible Sidebar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Weather Widget Placement</label>
                    <select
                      value={weatherPosition}
                      onChange={(e) => setWeatherPosition(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 outline-none cursor-pointer"
                    >
                      <option value="grid">Top Grid Widget</option>
                      <option value="left-sidebar">Left Collapsible Sidebar</option>
                      <option value="right-sidebar">Right Collapsible Sidebar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">To-Do List Placement</label>
                    <select
                      value={todoPosition}
                      onChange={(e) => setTodoPosition(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 outline-none cursor-pointer"
                    >
                      <option value="grid">Top Grid Widget</option>
                      <option value="left-sidebar">Left Collapsible Sidebar</option>
                      <option value="right-sidebar">Right Collapsible Sidebar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">RSS Reader Placement</label>
                    <select
                      value={rssPosition}
                      onChange={(e) => setRssPosition(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 outline-none cursor-pointer"
                    >
                      <option value="grid">Top Grid Widget</option>
                      <option value="left-sidebar">Left Collapsible Sidebar</option>
                      <option value="right-sidebar">Right Collapsible Sidebar</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4 className="font-bold text-sky-400 flex items-center gap-1.5 text-sm sm:text-base">
                    <Eye className="w-4 h-4" /> Component Toggles & Grid Columns
                  </h4>
                  {onAddCategory && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onAddCategory();
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 text-xs font-bold transition shadow-sm"
                      title="Add a new Category Column to dashboard"
                    >
                      <Plus className="w-4 h-4 text-sky-400" /> Add New Column
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Default Columns Count</label>
                    <select
                      value={columnCount}
                      onChange={(e) => setColumnCount(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 outline-none cursor-pointer"
                    >
                      <option value="1">1 Column</option>
                      <option value="2">2 Columns</option>
                      <option value="3">3 Columns</option>
                      <option value="4">4 Columns</option>
                      <option value="6">6 Columns</option>
                      <option value="8">8 Columns</option>
                    </select>
                  </div>

                  <div className="space-y-2 pt-1">
                    <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
                      <input type="checkbox" checked={showHeader} onChange={(e) => setShowHeader(e.target.checked)} className="rounded border-slate-700 bg-slate-900 text-sky-500 w-4 h-4" />
                      Show Top Header Navigation Bar
                    </label>
                    <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
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
                      Show Daily Greeting & Time Banner
                    </label>
                  </div>
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
            <div className="space-y-6">
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-4">
                <h4 className="font-bold text-sky-400 flex items-center gap-1.5 text-sm sm:text-base">
                  <MapPin className="w-4 h-4" /> Weather Location & Units
                </h4>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Search City / Location</label>
                  <form onSubmit={handleSearchWeatherLoc} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. London, Tokyo, New York..."
                      value={weatherQuery}
                      onChange={(e) => setWeatherQuery(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 outline-none"
                    />
                    <button
                      type="submit"
                      disabled={isSearchingLoc}
                      className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition"
                    >
                      {isSearchingLoc ? 'Searching...' : 'Search'}
                    </button>
                  </form>

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

                  <p className="text-xs text-slate-400 mt-2">Current Location: <span className="text-sky-300 font-semibold">{weatherLoc}</span></p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Temperature Units</label>
                    <select
                      value={weatherUnits}
                      onChange={(e) => setWeatherUnits(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 outline-none cursor-pointer"
                    >
                      <option value="celsius">Celsius (°C)</option>
                      <option value="fahrenheit">Fahrenheit (°F)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Widget Layout</label>
                    <select
                      value={weatherLayout}
                      onChange={(e) => setWeatherLayout(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 outline-none cursor-pointer"
                    >
                      <option value="vertical">Vertical Card</option>
                      <option value="horizontal">Horizontal Bar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Display Detail</label>
                    <select
                      value={weatherDisplaySize}
                      onChange={(e) => setWeatherDisplaySize(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 outline-none cursor-pointer"
                    >
                      <option value="normal">Standard View</option>
                      <option value="large">Detailed Forecast</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: DATA BACKUP */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-4">
                <h4 className="font-bold text-sky-400 flex items-center gap-1.5 text-sm sm:text-base">
                  <Download className="w-4 h-4" /> Data Migration & Backups
                </h4>
                <p className="text-xs text-slate-400">Export your entire bookmark database, custom categories, dock apps, and settings as a clean JSON backup file, or import existing browser bookmarks.</p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleExportJSON}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 font-semibold transition flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Export Backup JSON
                  </button>

                  <label className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition flex items-center gap-2 cursor-pointer">
                    <Upload className="w-4 h-4 text-emerald-400" /> Import JSON / HTML Bookmarks
                    <input type="file" onChange={handleImportJSON} accept=".json,.html" className="hidden" />
                  </label>
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
