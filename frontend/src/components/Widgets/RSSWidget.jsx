import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Rss, ExternalLink, RefreshCw } from 'lucide-react';

export default function RSSWidget({ feedUrl = 'https://news.ycombinator.com/rss' }) {
  const [feed, setFeed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFeed = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`/api/widgets/rss?url=${encodeURIComponent(feedUrl)}`);
      setFeed(res.data);
    } catch (err) {
      setError('Failed to load RSS feed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (feedUrl) fetchFeed();
  }, [feedUrl]);

  if (loading) {
    return (
      <div className="glass-panel rounded-2xl p-4 text-xs text-slate-400 flex items-center justify-center gap-2">
        <RefreshCw className="w-4 h-4 animate-spin text-amber-400" /> Fetching News Feed...
      </div>
    );
  }

  if (error || !feed) return null;

  return (
    <div className="glass-panel rounded-2xl p-4 text-slate-200 flex flex-col gap-2.5">
      <div className="flex items-center justify-between border-b border-slate-700/50 pb-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 truncate">
          <Rss className="w-4 h-4" /> {feed.title || 'RSS Feed'}
        </h3>
        <button onClick={fetchFeed} className="text-slate-400 hover:text-amber-300 transition">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
        {feed.items && feed.items.slice(0, 6).map((item, idx) => (
          <a
            key={idx}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-amber-400/40 hover:bg-slate-800/60 transition group flex flex-col gap-0.5"
          >
            <h4 className="text-xs font-medium text-slate-200 group-hover:text-amber-300 line-clamp-2 transition-colors flex items-center justify-between">
              {item.title}
              <ExternalLink className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 flex-shrink-0" />
            </h4>
            {item.pubDate && (
              <span className="text-[10px] text-slate-500">{new Date(item.pubDate).toLocaleDateString()}</span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
