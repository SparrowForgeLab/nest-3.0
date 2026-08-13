import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Smile, Sparkles, ChevronDown, ChevronUp, Search, Globe, Link, Cpu, Server, ChevronLeft, ChevronRight } from 'lucide-react';
import RenderIcon from '../RenderIcon';

export const QUICK_PRESETS = ['📁', '⚡', '🍿', '🔐', '🛠️', '🎮', '📚', '🌐', '💼', '🎵', '🏠', '🎨', '🚀', '⭐', '🔥', '💻'];

export const CATEGORIZED_ICONS = [
  {
    category: 'Quick Favorites',
    icon: '⭐',
    items: ['📁', '⚡', '🍿', '🔐', '🛠️', '🎮', '📚', '🌐', '💼', '🎵', '🏠', '🎨', '🚀', '⭐', '🔥', '💻']
  },
  {
    category: 'Tech & Hardware',
    icon: '💻',
    items: ['💻', '🖥️', '⚡', '⚙️', '🛠️', '🤖', '🌐', '📦', '🔒', '🔑', '💾', '📱', '📡', '☁️', '📊', '🔌', '⌨️', '🖱️', '🖨️']
  },
  {
    category: 'Media & Entertainment',
    icon: '🍿',
    items: ['🍿', '🎬', '🎵', '🎧', '📻', '📺', '📷', '🎨', '🎟️', '🎶', '🎙️', '🔊', '🎥', '🖼️', '🎸', '🎺', '🎹', '🥁', '📽️']
  },
  {
    category: 'Work & Productivity',
    icon: '💼',
    items: ['💼', '📚', '📝', '📅', '📈', '📊', '📧', '📌', '🏷️', '📂', '📋', '✏️', '🖊️', '🗂️', '📁', '🗄️', '⏳']
  },
  {
    category: 'Social & Chat',
    icon: '💬',
    items: ['💬', '🌐', '👥', '📣', '💌', '📢', '🤝', '❤️', '⭐', '🔔', '📬', '🗣️', '💭', '📱', '✉️']
  },
  {
    category: 'Gaming & Fun',
    icon: '🎮',
    items: ['🎮', '🕹️', '🎲', '🎯', '🏆', '👾', '🧩', '🃏', '⚔️', '🛡️', '🚀', '✨', '👑', '🔮']
  },
  {
    category: 'Health, Life & D&D',
    icon: '🩺',
    items: ['❤️', '🩺', '💊', '🏃', '🥗', '🧘', '🐉', '🏰', '📜', '⚔️', '🛡️', '🧙', '🔮', '🪙', '🌿', '🍎', '💧', '☀️', '🌙']
  }
];

export default function IconPicker({ selectedIcon, onSelectIcon }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('selfhst'); // 'selfhst', 'tech', 'emoji', 'custom'
  const [searchQuery, setSearchQuery] = useState('');
  const [customUrlInput, setCustomUrlInput] = useState('');

  // API Icon Library States
  const [iconsList, setIconsList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch Icons from API when tab, search, or page changes
  useEffect(() => {
    if (!isExpanded) return;
    if (activeTab === 'emoji' || activeTab === 'custom') return;

    const endpoint = activeTab === 'selfhst' ? '/api/icons/selfhst' : '/api/icons/tech';
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(endpoint, {
          params: { search: searchQuery, page, limit: 60 }
        });
        if (res.data.success) {
          setIconsList(res.data.icons);
          setTotalCount(res.data.total);
          setTotalPages(res.data.totalPages);
        }
      } catch (err) {
        console.error('Failed to fetch icon library:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [isExpanded, activeTab, searchQuery, page]);

  // Reset page to 1 when tab or search query changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchQuery('');
    setPage(1);
  };

  useEffect(() => {
    if (selectedIcon && (selectedIcon.startsWith('http://') || selectedIcon.startsWith('https://') || selectedIcon.startsWith('data:'))) {
      setCustomUrlInput(selectedIcon);
    }
  }, [selectedIcon]);

  const handleCustomUrlChange = (val) => {
    setCustomUrlInput(val);
    if (val.trim()) {
      onSelectIcon(val.trim());
    }
  };

  const handleFetchFavicon = () => {
    if (!customUrlInput.trim()) return;
    try {
      let domain = customUrlInput.trim();
      if (domain.startsWith('http')) {
        domain = new URL(domain).hostname;
      }
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      setCustomUrlInput(faviconUrl);
      onSelectIcon(faviconUrl);
    } catch (e) {
      onSelectIcon(customUrlInput.trim());
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="block text-slate-300 font-semibold text-xs flex items-center gap-1.5">
          <Smile className="w-4 h-4 text-sky-400" /> Icon Selection
        </label>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 bg-sky-500/10 hover:bg-sky-500/20 px-2.5 py-1 rounded-lg border border-sky-500/30 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isExpanded ? 'Hide Full Library' : 'Browse selfh.st & techicons (6,800+ Icons)'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Selected Icon Active Badge / Quick Bar */}
      <div className="flex items-center gap-2 p-2 bg-slate-950/80 rounded-xl border border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-lg flex-shrink-0">
          <RenderIcon icon={selectedIcon} defaultIcon="⭐" className="w-5 h-5 object-contain" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-semibold text-slate-400 block truncate">Current Selected Icon:</span>
          <span className="text-xs font-bold text-sky-300 truncate block">
            {selectedIcon ? (selectedIcon.startsWith('http') ? 'Custom / Web SVG Icon' : selectedIcon) : 'Default Icon'}
          </span>
        </div>

        {/* Quick Emoji Bar */}
        <div className="hidden sm:flex items-center gap-1 overflow-x-auto">
          {QUICK_PRESETS.slice(0, 7).map((em) => (
            <button
              key={em}
              type="button"
              onClick={() => onSelectIcon(em)}
              className={`p-1 rounded-lg text-sm hover:bg-slate-800 transition ${
                selectedIcon === em ? 'bg-sky-500/20 border border-sky-400' : ''
              }`}
            >
              {em}
            </button>
          ))}
        </div>
      </div>

      {/* Expanded Icon Libraries Modal Box */}
      {isExpanded && (
        <div className="p-3.5 bg-slate-950/95 border border-slate-800 rounded-2xl space-y-3 animate-fadeIn shadow-2xl">
          {/* Library Source Tabs */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto">
            <button
              type="button"
              onClick={() => handleTabChange('selfhst')}
              className={`flex-1 min-w-[120px] px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                activeTab === 'selfhst'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>selfh.st (3,300+)</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('tech')}
              className={`flex-1 min-w-[130px] px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                activeTab === 'tech'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>techicons.dev (3,400+)</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('emoji')}
              className={`flex-1 min-w-[90px] px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                activeTab === 'emoji'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smile className="w-3.5 h-3.5" />
              <span>Emojis</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('custom')}
              className={`flex-1 min-w-[90px] px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                activeTab === 'custom'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Link className="w-3.5 h-3.5" />
              <span>Custom URL</span>
            </button>
          </div>

          {/* Search Bar (For Selfh.st, Tech, and Emoji tabs) */}
          {activeTab !== 'custom' && (
            <div className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder={
                    activeTab === 'selfhst'
                      ? 'Search 3,360+ selfh.st icons (e.g. Plex, Jellyfin, Sonarr, Home Assistant)...'
                      : activeTab === 'tech'
                      ? 'Search 3,450+ tech icons (e.g. React, Node, Python, Docker)...'
                      : 'Search emojis...'
                  }
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-sky-400"
                />
              </div>

              {/* Pagination indicators for API icons */}
              {(activeTab === 'selfhst' || activeTab === 'tech') && totalPages > 1 && (
                <div className="flex items-center gap-1 text-xs text-slate-400 flex-shrink-0">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage(p => Math.max(p - 1, 1))}
                    className="p-1 rounded-lg bg-slate-900 border border-slate-800 hover:text-white disabled:opacity-30 transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-[11px] px-1">{page}/{totalPages}</span>
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                    className="p-1 rounded-lg bg-slate-900 border border-slate-800 hover:text-white disabled:opacity-30 transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 1 & 2: Selfh.st Icons & TechIcons (Full 6,800+ API library) */}
          {(activeTab === 'selfhst' || activeTab === 'tech') && (
            <div className="space-y-2">
              <div className="text-[11px] text-slate-400 flex items-center justify-between px-1">
                <span>Found {totalCount} matching SVG icons</span>
                {loading && <span className="text-sky-400 animate-pulse font-medium">Searching icon library...</span>}
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-64 overflow-y-auto pr-1">
                {iconsList.map((item) => (
                  <button
                    key={item.slug || item.name}
                    type="button"
                    onClick={() => onSelectIcon(item.icon)}
                    className={`p-2 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-sky-400/60 hover:bg-slate-800 transition flex flex-col items-center gap-1.5 group ${
                      selectedIcon === item.icon ? 'border-sky-400 bg-sky-500/10 shadow-sm' : ''
                    }`}
                    title={item.name}
                  >
                    <RenderIcon icon={item.icon} defaultIcon="📦" className="w-6 h-6 object-contain group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-semibold text-slate-300 truncate w-full text-center">{item.name}</span>
                  </button>
                ))}

                {!loading && iconsList.length === 0 && (
                  <div className="col-span-full p-6 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-xl">
                    No icons found matching "{searchQuery}". Try searching another keyword or paste a custom URL!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Emoji Library */}
          {activeTab === 'emoji' && (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {CATEGORIZED_ICONS.map((cat) => (
                <div key={cat.category} className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 block">{cat.category}</span>
                  <div className="grid grid-cols-8 gap-1">
                    {cat.items.map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => onSelectIcon(em)}
                        className={`p-1.5 rounded-lg text-base hover:bg-slate-800 transition flex items-center justify-center ${
                          selectedIcon === em ? 'bg-sky-500/20 border border-sky-400' : ''
                        }`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: Custom Image URL / Auto-Fetch Favicon */}
          {activeTab === 'custom' && (
            <div className="space-y-3 p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Direct SVG / Image URL or Web Address</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="e.g. https://plex.tv or https://site.com/logo.svg"
                    value={customUrlInput}
                    onChange={(e) => handleCustomUrlChange(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-slate-100 placeholder-slate-500 text-xs outline-none focus:border-sky-400"
                  />
                  <button
                    type="button"
                    onClick={handleFetchFavicon}
                    className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs flex items-center gap-1 transition"
                  >
                    <Globe className="w-3.5 h-3.5" /> Fetch Icon
                  </button>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 leading-relaxed">
                Paste any website address (e.g. <code>github.com</code> or <code>https://selfh.st</code>) to fetch its high-res favicon automatically, or paste a direct <code>.svg</code> / <code>.png</code> URL.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
