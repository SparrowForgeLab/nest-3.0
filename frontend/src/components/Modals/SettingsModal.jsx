import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Sliders, Image, Download, Upload, Palette, LayoutGrid, Eye, Search, Check, Trash2, Sparkles, MapPin, Clock, Layout, Sidebar, CloudSun } from 'lucide-react';

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

export default function SettingsModal({ isOpen, onClose, settings = {}, onSaveSettings, onRefreshData }) {
  const [theme, setTheme] = useState('sparrow-dark');
  const [searchEngine, setSearchEngine] = useState('google');
  const [columnCount, setColumnCount] = useState(4);
  const [layoutStyle, setLayoutStyle] = useState('normal');
  const [viewMode, setViewMode] = useState('grid');
  const [fontSize, setFontSize] = useState(16);
  const [bgImage, setBgImage] = useState('');
  const [bgBlur, setBgBlur] = useState(16);
  const [bgDim, setBgDim] = useState(40);
  const [showHeader, setShowHeader] = useState(true);
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
  const [todoPosition, setTodoPosition] = useState('grid');

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

  // Gallery Filters
  const [wallpaperCategory, setWallpaperCategory] = useState('All');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  useEffect(() => {
    if (settings) {
      setTheme(settings.theme || 'sparrow-dark');
      setSearchEngine(settings.search_engine || 'google');
      setColumnCount(settings.column_count || 4);
      setLayoutStyle(settings.layout_style || 'normal');
      setViewMode(settings.view_mode || 'grid');
      setFontSize(settings.font_size || 16);
      setBgImage(settings.background_image || '');
      setBgBlur(settings.background_blur !== undefined ? settings.background_blur : 16);
      setBgDim(settings.background_dim !== undefined ? settings.background_dim : 40);
      setShowHeader(settings.show_header !== 0);
      setShowDaily(settings.show_daily !== 0);
      setShowDock(settings.show_dock !== 0);
      setShowClock(settings.show_clock !== 0);
      setShowWeather(settings.show_weather !== 0);
      setShowRss(settings.show_rss === 1);
      setShowTodo(settings.show_todo !== 0);

      setClockType(settings.clock_type || 'digital');
      setClockFormat(settings.clock_format || '12h');
      setRssPosition(settings.rss_position || 'grid');
      setTodoPosition(settings.todo_position || 'grid');

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
      column_count: parseInt(columnCount, 10),
      layout_style: layoutStyle,
      view_mode: viewMode,
      font_size: parseInt(fontSize, 10),
      background_image: bgImage.startsWith('file://') ? '' : bgImage,
      background_blur: parseInt(bgBlur, 10),
      background_dim: parseInt(bgDim, 10),
      show_header: showHeader ? 1 : 0,
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

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl p-6 glass-panel shadow-2xl text-slate-100 max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 mb-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-sky-400" />
            <h3 className="text-lg font-bold">Nest 3.0 Preferences</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-6 pr-2 text-xs sm:text-sm">
          {/* Consolidated Weather Widget Settings Panel */}
          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-4">
            <h4 className="font-bold text-sky-400 flex items-center gap-1.5 text-sm sm:text-base">
              <CloudSun className="w-4 h-4" /> Weather Location, Format & Display Settings
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Temperature Unit</label>
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
                <label className="block text-slate-300 mb-1 font-medium">Widget Size</label>
                <select
                  value={weatherSize}
                  onChange={(e) => setWeatherSize(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 outline-none cursor-pointer"
                >
                  <option value="normal">Standard (1 Column)</option>
                  <option value="large">Wide (2 Columns)</option>
                  <option value="hero">Hero Banner (Full Width)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Layout Mode</label>
                <select
                  value={weatherLayout}
                  onChange={(e) => setWeatherLayout(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 outline-none cursor-pointer"
                >
                  <option value="vertical">Stacked (Vertical)</option>
                  <option value="horizontal">Side-by-Side (Horizontal)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Current Temperature Display Size</label>
                <select
                  value={weatherDisplaySize}
                  onChange={(e) => setWeatherDisplaySize(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 outline-none cursor-pointer"
                >
                  <option value="normal">Normal Text</option>
                  <option value="large">Large Typography</option>
                  <option value="hero">Hero Big Typography</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Active Weather Location</label>
                <div className="p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-xs flex items-center justify-between">
                  <span className="truncate font-semibold text-sky-300">{weatherLoc}</span>
                  <span className="text-[10px] text-slate-400 font-mono ml-2">
                    {weatherLat.toFixed(2)}, {weatherLon.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* City / Zip Code / Lat,Lon Search */}
            <div className="pt-2 border-t border-slate-800">
              <label className="block text-[11px] text-slate-400 mb-1">Search City, ZIP code, or Lat,Lon Coordinates:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Austin TX, 90210, Tokyo, or 40.71, -74.00"
                  value={weatherQuery}
                  onChange={(e) => setWeatherQuery(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-sky-400"
                />
                <button
                  type="button"
                  onClick={handleSearchWeatherLoc}
                  disabled={isSearchingLoc}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-semibold transition"
                >
                  {isSearchingLoc ? 'Searching...' : 'Search'}
                </button>
              </div>

              {weatherResults.length > 0 && (
                <div className="mt-2 max-h-36 overflow-y-auto border border-slate-700 rounded-xl bg-slate-900 p-1.5 space-y-1">
                  {weatherResults.map((loc, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectWeatherLoc(loc)}
                      className="w-full text-left p-2 rounded-lg hover:bg-sky-500/20 hover:text-sky-300 text-xs transition flex items-center justify-between"
                    >
                      <span className="font-medium truncate">{loc.formatted || loc.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono ml-2 flex-shrink-0">
                        {loc.latitude.toFixed(2)}, {loc.longitude.toFixed(2)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Header & Navbar Settings */}
          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="font-bold text-sky-400 flex items-center gap-1.5 text-sm sm:text-base">
              <Layout className="w-4 h-4" /> Header & Navbar Visibility
            </h4>
            <label className="flex items-center gap-3 cursor-pointer bg-slate-900 p-3 rounded-xl border border-slate-800 hover:border-slate-700">
              <input
                type="checkbox"
                checked={showHeader}
                onChange={(e) => setShowHeader(e.target.checked)}
                className="w-4 h-4 rounded text-sky-400 accent-sky-400 cursor-pointer"
              />
              <div>
                <span className="font-semibold text-slate-100">Show Top Navigation Bar</span>
                <p className="text-[11px] text-slate-400">If unchecked, the top header is hidden for a clean immersive startpage. Press <kbd className="bg-slate-800 px-1 py-0.5 rounded font-mono">Ctrl + K</kbd> anytime to open navigation.</p>
              </div>
            </label>
          </div>

          {/* Clock Widget Settings */}
          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="font-bold text-sky-400 flex items-center gap-1.5 text-sm sm:text-base">
              <Clock className="w-4 h-4" /> Clock Widget Customization
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Clock Display Style</label>
                <select
                  value={clockType}
                  onChange={(e) => setClockType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 outline-none cursor-pointer"
                >
                  <option value="digital">Digital Clock</option>
                  <option value="analog">Analog Glass Clock</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Time Format</label>
                <select
                  value={clockFormat}
                  onChange={(e) => setClockFormat(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 outline-none cursor-pointer"
                >
                  <option value="12h">12-Hour (1:30 PM)</option>
                  <option value="24h">24-Hour (13:30)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sidebar & Widget Positions */}
          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="font-bold text-sky-400 flex items-center gap-1.5 text-sm sm:text-base">
              <Sidebar className="w-4 h-4" /> Widget Positions & Sidebars
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">To-Do List Placement</label>
                <select
                  value={todoPosition}
                  onChange={(e) => setTodoPosition(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 outline-none cursor-pointer"
                >
                  <option value="grid">Top Grid Widget</option>
                  <option value="right-sidebar">Right Collapsible Sidebar</option>
                  <option value="left-sidebar">Left Collapsible Sidebar</option>
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
                  <option value="right-sidebar">Right Collapsible Sidebar</option>
                  <option value="left-sidebar">Left Collapsible Sidebar</option>
                </select>
              </div>
            </div>
          </div>

          {/* Theme & Search Engine */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="font-bold text-sky-400 mb-2 flex items-center gap-1.5">
                <Palette className="w-4 h-4" /> Theme Preset
              </h4>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 outline-none cursor-pointer"
              >
                <option value="sparrow-dark">Sparrow Glass Dark (Default)</option>
                <option value="midnight-oled">Midnight OLED (True Black)</option>
                <option value="aurora-glow">Aurora Glow (Teal & Emerald)</option>
                <option value="cyber-amber">Cyberpunk Amber</option>
                <option value="frosted-light">Frosted Glass (Light)</option>
              </select>
            </div>

            <div>
              <h4 className="font-bold text-sky-400 mb-2 flex items-center gap-1.5">
                <Search className="w-4 h-4" /> Default Search Engine
              </h4>
              <select
                value={searchEngine}
                onChange={(e) => setSearchEngine(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 outline-none cursor-pointer"
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

          {/* Grid Layout, Columns & Font Size */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Default Columns</label>
              <select
                value={columnCount}
                onChange={(e) => setColumnCount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 outline-none cursor-pointer"
              >
                <option value="1">1 Column</option>
                <option value="2">2 Columns</option>
                <option value="3">3 Columns</option>
                <option value="4">4 Columns</option>
                <option value="6">6 Columns</option>
                <option value="8">8 Columns</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Card View Mode</label>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 outline-none cursor-pointer"
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

          {/* Backup & Import/Export */}
          <div className="pt-4 border-t border-slate-800">
            <h4 className="font-bold text-slate-200 mb-2">Data Backup & Migration</h4>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleExportJSON}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 font-medium transition flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Export Backup JSON
              </button>

              <label className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition flex items-center gap-1.5 cursor-pointer">
                <Upload className="w-4 h-4 text-emerald-400" /> Import JSON / HTML
                <input type="file" onChange={handleImportJSON} accept=".json,.html" className="hidden" />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700 flex-shrink-0">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold transition shadow-lg">
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
