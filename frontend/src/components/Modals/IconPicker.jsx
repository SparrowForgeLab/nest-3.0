import React, { useState } from 'react';
import { Smile, Sparkles, ChevronDown, ChevronUp, Search } from 'lucide-react';

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
    items: ['💻', '🖥️', '⚡', '⚙️', '🛠️', '🤖', '🌐', '📦', '🔒', '🔑', '💾', '📱', '📡', '☁️', '📊', '🔌', '🖥', '⌨️', '🖱️', '🖨️']
  },
  {
    category: 'Media & Entertainment',
    icon: '🍿',
    items: ['🍿', '🎬', '🎵', '🎧', '📻', '📺', '📷', '🎨', '🎟️', '🎶', '🎙️', '🔊', '🎥', '🖼️', '🎸', '🎺', '🎹', '🥁', '📽️']
  },
  {
    category: 'Work & Productivity',
    icon: '💼',
    items: ['💼', '📚', '📝', '📅', '📈', '📊', '📧', '📌', '🏷️', '📂', '📋', '✏️', '🖊️', '🗂️', '📊', '📁', '🗄️', '⏳', '📌']
  },
  {
    category: 'Social & Chat',
    icon: '💬',
    items: ['💬', '🌐', '👥', '📣', '💌', '📢', '🤝', '❤️', '⭐', '🔔', '📬', '🗣️', '💭', '📱', '✉️', '📮']
  },
  {
    category: 'Gaming & Fun',
    icon: '🎮',
    items: ['🎮', '🕹️', '🎲', '🎯', '🏆', '👾', '🧩', '🃏', '⚔️', '🛡️', '🚀', '✨', '🥇', '🥈', '🥉', '🥇', '👑', '🔮']
  },
  {
    category: 'Health, Life & D&D',
    icon: '🩺',
    items: ['❤️', '🩺', '💊', '🏃', '🥗', '🧘', '🐉', '🏰', '📜', '⚔️', '🛡️', '🧙', '🔮', '🪙', '🌿', '🍎', '💧', '☀️', '🌙', '🍃']
  },
  {
    category: 'Finance & Shopping',
    icon: '🪙',
    items: ['🪙', '💳', '💰', '🛒', '🛍️', '🏦', '💲', '💎', '📈', '🎁', '🏷️', '🧾', '💵', '💶', '💷']
  },
  {
    category: 'Badges & Symbols',
    icon: '✨',
    items: ['🔥', '⭐', '🌟', '⚡', '✨', '💎', '🎯', '🔔', '💡', '📌', '🚩', '🎉', '🚀', '🛡️', '🔒', '✅', '❌', '⚠️', '💯', '🌀']
  }
];

export default function IconPicker({ selectedIcon, onSelectIcon }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = CATEGORIZED_ICONS.map(cat => {
    if (!searchQuery.trim()) {
      if (activeCategory !== 'All' && cat.category !== activeCategory) return null;
      return cat;
    }
    const matchingItems = cat.items.filter(item => 
      cat.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (matchingItems.length === 0) return null;
    return { ...cat, items: matchingItems };
  }).filter(Boolean);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-slate-300 font-semibold text-xs flex items-center gap-1.5">
          <Smile className="w-4 h-4 text-sky-400" /> Icon / Emoji Selection
        </label>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 bg-sky-500/10 hover:bg-sky-500/20 px-2.5 py-1 rounded-lg border border-sky-500/30 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isExpanded ? 'Hide Full Library' : 'Browse Full Library (100+ Icons)'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Quick Favorites Bar (Always Visible) */}
      <div className="grid grid-cols-8 sm:grid-cols-8 gap-1.5 p-2 bg-slate-950/80 rounded-xl border border-slate-800">
        {QUICK_PRESETS.map((em) => (
          <button
            key={em}
            type="button"
            onClick={() => onSelectIcon(em)}
            className={`p-1.5 rounded-lg text-base hover:bg-slate-800 transition flex items-center justify-center ${
              selectedIcon === em ? 'bg-sky-500/20 border border-sky-400 scale-110 shadow-sm' : ''
            }`}
          >
            {em}
          </button>
        ))}
      </div>

      {/* Expanded Categorized Icon Library */}
      {isExpanded && (
        <div className="p-3 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-3 animate-fadeIn shadow-xl max-h-72 overflow-y-auto">
          {/* Category Tabs Header */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none border-b border-slate-800">
            <button
              type="button"
              onClick={() => setActiveCategory('All')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                activeCategory === 'All'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              All Categories
            </button>
            {CATEGORIZED_ICONS.map((cat) => (
              <button
                key={cat.category}
                type="button"
                onClick={() => setActiveCategory(cat.category)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-1 ${
                  activeCategory === cat.category
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.category}</span>
              </button>
            ))}
          </div>

          {/* Categorized Icon Grids */}
          <div className="space-y-3 pt-1">
            {filteredCategories.map((cat) => (
              <div key={cat.category} className="space-y-1.5">
                <h5 className="text-[11px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                  <span>{cat.icon}</span>
                  <span>{cat.category}</span>
                </h5>
                <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5">
                  {cat.items.map((em, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onSelectIcon(em)}
                      className={`p-2 rounded-lg text-lg hover:bg-slate-800 transition flex items-center justify-center ${
                        selectedIcon === em ? 'bg-sky-500/20 border border-sky-400 scale-110 shadow-sm' : ''
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manual Input for Custom Emoji or Image URL */}
      <input
        type="text"
        placeholder="Or type custom emoji / image URL..."
        value={selectedIcon}
        onChange={(e) => onSelectIcon(e.target.value)}
        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 outline-none focus:border-sky-400 text-xs"
      />
    </div>
  );
}
