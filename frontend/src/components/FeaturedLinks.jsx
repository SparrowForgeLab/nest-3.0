import React from 'react';
import { Star } from 'lucide-react';

export default function FeaturedLinks({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Featured Shelf</span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-700/60 hover:border-amber-400/60 hover:bg-slate-800 transition-all duration-200 shadow-md group"
          >
            <span className="text-lg leading-none group-hover:scale-110 transition-transform">{item.icon || '⭐'}</span>
            <span className="text-xs font-medium text-slate-200 group-hover:text-amber-300 transition-colors">{item.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
