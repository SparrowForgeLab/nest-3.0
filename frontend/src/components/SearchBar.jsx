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
      <form role="search" aria-label="Web Search" onSubmit={handleSearch} className="relative flex items-center shadow-2xl rounded-2xl overflow-hidden glass-input border border-slate-700/60 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-400/50">
        <label htmlFor="search-engine-select" className="sr-only">Select Search Engine</label>
        <select
          id="search-engine-select"
          value={engine}
          onChange={(e) => setEngine(e.target.value)}
          aria-label="Search Engine"
          className="bg-slate-900/80 text-slate-200 text-xs sm:text-sm font-medium py-3 px-3 border-r border-slate-700/60 outline-none cursor-pointer hover:text-sky-400 transition focus:ring-2 focus:ring-sky-400"
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

        <label htmlFor="search-input-field" className="sr-only">Search Query</label>
        <input
          id="search-input-field"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the web..."
          aria-label="Search the web"
          className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-sm sm:text-base py-3.5 px-4 outline-none focus:ring-2 focus:ring-sky-400/50"
        />

        <button
          type="submit"
          aria-label="Submit search query"
          className="pr-4 pl-2 text-slate-400 hover:text-sky-400 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-lg"
          title="Search"
        >
          <Search className="w-5 h-5" aria-hidden="true" />
          <span className="sr-only">Search</span>
        </button>
      </form>
    </div>
  );
}
