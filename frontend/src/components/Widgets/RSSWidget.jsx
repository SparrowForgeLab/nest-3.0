import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Rss, ExternalLink, RefreshCw, Layers } from 'lucide-react';

export default function RSSWidget({ onOpenSettings }) {
  const [feedsList, setFeedsList] = useState([]);
  const [activeFeedId, setActiveFeedId] = useState(null);
  const [feedData, setFeedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch User's RSS Feeds
  const fetchFeedsList = async () => {
    try {
      const res = await axios.get('/api/rss-feeds');
      if (res.data.success && res.data.feeds.length > 0) {
        setFeedsList(res.data.feeds);
        if (!activeFeedId || !res.data.feeds.some(f => f.id === activeFeedId)) {
          setActiveFeedId(res.data.feeds[0].id);
        }
      } else {
        setFeedsList([]);
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to load feeds list');
      setLoading(false);
    }
  };

  const fetchActiveFeedContent = async () => {
    const current = feedsList.find(f => f.id === activeFeedId) || feedsList[0];
    if (!current) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`/api/widgets/rss?url=${encodeURIComponent(current.url)}`);
      setFeedData(res.data);
    } catch (err) {
      setError('Failed to parse RSS feed content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedsList();
  }, []);

  useEffect(() => {
    if (activeFeedId) {
      fetchActiveFeedContent();
    }
  }, [activeFeedId, feedsList]);

  if (loading && !feedData) {
    return (
      <div className="glass-panel rounded-2xl p-4 text-xs text-slate-400 flex items-center justify-center gap-2">
        <RefreshCw className="w-4 h-4 animate-spin text-amber-400" /> Loading News Feeds...
      </div>
    );
  }

  if (feedsList.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-4 text-slate-200 flex flex-col gap-2 text-center text-xs">
        <div className="flex items-center justify-center gap-1.5 text-amber-400 font-bold">
          <Rss className="w-4 h-4" /> Multi-Feed RSS Reader
        </div>
        <p className="text-slate-400">No RSS feeds added yet.</p>
        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="mt-1 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold border border-amber-500/30 transition self-center"
          >
            + Add RSS Feeds in Preferences
          </button>
        )}
      </div>
    );
  }

  const activeFeedObj = feedsList.find(f => f.id === activeFeedId) || feedsList[0];

  return (
    <div className="glass-panel rounded-2xl p-4 text-slate-200 flex flex-col gap-2.5 shadow-xl border border-slate-800">
      {/* Widget Header */}
      <div className="flex items-center justify-between border-b border-slate-700/50 pb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <Rss className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 truncate">
            {activeFeedObj?.title || feedData?.title || 'RSS Feeds'}
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={fetchActiveFeedContent}
            className="p-1 rounded-lg text-slate-400 hover:text-amber-300 transition"
            title="Refresh Feed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Multi-Feed Selector Tabs */}
      {feedsList.length > 1 && (
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none border-b border-slate-800">
          {feedsList.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFeedId(f.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition ${
                activeFeedId === f.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {f.title}
            </button>
          ))}
        </div>
      )}

      {/* Feed Articles List */}
      {error ? (
        <div className="p-3 text-xs text-rose-400 bg-rose-500/10 rounded-xl border border-rose-500/20">
          {error}
        </div>
      ) : (
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
          {feedData?.items && feedData.items.slice(0, 7).map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-amber-400/50 hover:bg-slate-800/80 transition group flex flex-col gap-1 shadow-sm"
            >
              <h4 className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 line-clamp-2 transition-colors flex items-start justify-between gap-1.5">
                <span>{item.title}</span>
                <ExternalLink className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 flex-shrink-0 mt-0.5" />
              </h4>
              {item.snippet && (
                <p className="text-[11px] text-slate-400 line-clamp-1 leading-relaxed">{item.snippet}</p>
              )}
              {item.pubDate && (
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(item.pubDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
