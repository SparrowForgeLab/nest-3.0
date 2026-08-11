import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';

const ENGINES = {
  google: 'https://www.google.com/search?q=',
  duckduckgo: 'https://duckduckgo.com/?q=',
  brave: 'https://search.brave.com/search?q=',
  bing: 'https://www.bing.com/search?q=',
  youtube: 'https://www.youtube.com/results?search_query=',
  github: 'https://github.com/search?q=',
  reddit: 'https://www.reddit.com/search/?q=',
  wikipedia: 'https://en.wikipedia.org/wiki/Special:Search?search=',
};

const BANGS = [
  { prefix: '!g', name: 'Google', engine: 'google' },
  { prefix: '!yt', name: 'YouTube', engine: 'youtube' },
  { prefix: '!gh', name: 'GitHub', engine: 'github' },
  { prefix: '!ai', name: 'ChatGPT', url: 'https://chatgpt.com/?q=' },
  { prefix: '!w', name: 'Wikipedia', engine: 'wikipedia' },
  { prefix: '!r', name: 'Reddit', engine: 'reddit' },
];

export default function SearchBar({ defaultEngine = 'google' }) {
  const [engine, setEngine] = useState(defaultEngine);
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    let targetUrl = ENGINES[engine] + encodeURIComponent(query);

    // Check for search bangs
    const trimmed = query.trim();
    for (const bang of BANGS) {
      if (trimmed.startsWith(bang.prefix + ' ')) {
        const term = trimmed.slice(bang.prefix.length + 1);
        if (bang.url) {
          targetUrl = bang.url + encodeURIComponent(term);
        } else if (bang.engine && ENGINES[bang.engine]) {
          targetUrl = ENGINES[bang.engine] + encodeURIComponent(term);
        }
        break;
      }
    }

    window.open(targetUrl, '_blank');
  };

  const handleBangClick = (prefix) => {
    setQuery(prefix + ' ');
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-6">
      <form onSubmit={handleSearch} className="relative flex items-center shadow-2xl rounded-2xl overflow-hidden glass-input border border-slate-700/60 focus-within:border-sky-400">
        <select
          value={engine}
          onChange={(e) => setEngine(e.target.value)}
          className="bg-slate-900/80 text-slate-200 text-xs sm:text-sm font-medium py-3 px-3 border-r border-slate-700/60 outline-none cursor-pointer hover:text-sky-400 transition"
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

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search web or type bang (!g, !yt, !gh, !ai, !w, !r)..."
          className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-sm sm:text-base py-3.5 px-4 outline-none"
        />

        <button
          type="submit"
          className="pr-4 pl-2 text-slate-400 hover:text-sky-400 transition"
          title="Search"
        >
          <Search className="w-5 h-5" />
        </button>
      </form>

      {/* Bang Shortcut Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-2 px-2">
        {BANGS.map((b) => (
          <button
            key={b.prefix}
            type="button"
            onClick={() => handleBangClick(b.prefix)}
            className="text-[11px] font-medium bg-slate-800/60 hover:bg-sky-500/20 text-slate-300 hover:text-sky-300 px-2.5 py-0.5 rounded-full border border-slate-700/50 transition flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-sky-400" />
            <span className="font-semibold text-sky-400">{b.prefix}</span> {b.name}
          </button>
        ))}
      </div>
    </div>
  );
}
