import React from 'react';
import { Star, Settings2, Plus } from 'lucide-react';

export default function FeaturedLinks({ items = [], onOpenEditPinned }) {
  if (!items || items.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 shadow-md backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-sky-400 fill-sky-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pinned Links Shelf</span>
          </div>
          {onOpenEditPinned && (
            <button
              onClick={onOpenEditPinned}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 text-xs font-semibold transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Pinned Links
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mb-6 group/shelf">
      <div className="flex items-center gap-2 mb-2 px-1">
        <Star className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pinned Shelf</span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {items.map((item) => {
          const isFileScheme = item.url && item.url.startsWith('file://');
          return (
            <a
              key={item.id}
              href={isFileScheme ? '#' : item.url}
              target={isFileScheme ? '_self' : '_blank'}
              rel="noopener noreferrer"
              onClick={(e) => {
                if (isFileScheme) {
                  e.preventDefault();
                  navigator.clipboard.writeText(item.url);
                  alert(`Browser Security Notice:\nHTTPS websites cannot launch local file:// links directly.\n\nThe file path has been copied to your clipboard:\n${item.url}`);
                }
              }}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-700/60 hover:border-sky-400/60 hover:bg-sky-500/10 transition-all duration-200 shadow-md group"
            >
              <span className="text-lg leading-none group-hover:scale-110 transition-transform">{item.icon || '⭐'}</span>
              <span className="text-xs font-medium text-slate-200 group-hover:text-sky-300 transition-colors">{item.title}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
