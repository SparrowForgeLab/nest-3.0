import React, { useState, useEffect, useRef } from 'react';
import { Search, Command, ExternalLink, Settings, Lock, Sparkles, X } from 'lucide-react';

export default function CommandPalette({ isOpen, onClose, categories = [], onOpenSettings, onOpenVaultModal }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Flatten all bookmarks for searching
  const allBookmarks = [];
  categories.forEach(cat => {
    if (cat.bookmarks) {
      cat.bookmarks.forEach(bm => {
        allBookmarks.push({
          ...bm,
          categoryName: cat.name
        });
      });
    }
  });

  const filtered = allBookmarks.filter(bm => 
    bm.title.toLowerCase().includes(query.toLowerCase()) ||
    (bm.description && bm.description.toLowerCase().includes(query.toLowerCase())) ||
    bm.categoryName.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        window.open(filtered[selectedIndex].url, '_blank');
        onClose();
      }
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-20 px-4 animate-in fade-in duration-200"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette Search and Navigation"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-slate-900/90 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden glass-panel flex flex-col"
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-700/70">
          <Search className="w-5 h-5 text-sky-400 flex-shrink-0" aria-hidden="true" />
          <label htmlFor="command-palette-input" className="sr-only">Search Bookmarks and Commands</label>
          <input
            id="command-palette-input"
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            aria-label="Type to search bookmarks, open links, or run commands"
            placeholder="Type to search bookmarks, open links, run commands..."
            className="w-full bg-transparent text-slate-100 text-base outline-none placeholder-slate-400 focus:ring-2 focus:ring-sky-400/40 rounded-md px-1"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Command Palette"
            className="text-slate-400 hover:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-lg p-1"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-950/40 border-b border-slate-800 text-xs text-slate-400">
          <span className="font-medium text-slate-300">Quick Shortcuts:</span>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSettings();
            }}
            aria-label="Open Preferences"
            className="hover:text-sky-300 flex items-center gap-1 bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            <Settings className="w-3 h-3" aria-hidden="true" /> Preferences
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenVaultModal();
            }}
            aria-label="Open Private Vault"
            className="hover:text-rose-300 flex items-center gap-1 bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
          >
            <Lock className="w-3 h-3 text-rose-400" aria-hidden="true" /> Private Vault
          </button>
        </div>

        {/* Results List */}
        <div role="listbox" aria-label="Search Results" className="max-h-96 overflow-y-auto p-2 flex flex-col gap-1">
          {filtered.length > 0 ? (
            filtered.map((item, idx) => (
              <div
                key={item.id}
                role="option"
                aria-selected={idx === selectedIndex}
                tabIndex={0}
                onClick={() => {
                  window.open(item.url, '_blank');
                  onClose();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    window.open(item.url, '_blank');
                    onClose();
                  }
                }}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                  idx === selectedIndex ? 'bg-sky-500/20 text-sky-200 border border-sky-500/40' : 'text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-lg" aria-hidden="true">{item.icon || '🌐'}</span>
                  <div className="min-w-0">
                    <h5 className="font-medium text-sm truncate flex items-center gap-2">
                      {item.title}
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                        {item.categoryName}
                      </span>
                    </h5>
                    {item.description && (
                      <p className="text-xs text-slate-300 truncate mt-0.5">{item.description}</p>
                    )}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 opacity-60 flex-shrink-0" aria-hidden="true" />
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-sm text-slate-300">
              No matching bookmarks found for "<span className="text-slate-100 font-semibold">{query}</span>"
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span><kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">↑</kbd> <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">↓</kbd> Navigate</span>
            <span><kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">↵</kbd> Select</span>
            <span><kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">ESC</kbd> Close</span>
          </div>
          <span className="flex items-center gap-1 text-sky-400 font-medium">
            <Command className="w-3 h-3" aria-hidden="true" /> Nest 3.0
          </span>
        </div>
      </div>
    </div>
  );
}
