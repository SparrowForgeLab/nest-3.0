import React from 'react';
import { Plus } from 'lucide-react';
import RenderIcon from './RenderIcon';

export default function FeaturedLinks({ items = [], onOpenEditPinned }) {
  if (!items || items.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-center px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 shadow-md backdrop-blur-md">
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
              <RenderIcon icon={item.icon} defaultIcon="⭐" className="w-5 h-5 object-contain group-hover:scale-110 transition-transform flex-shrink-0" />
              <span className="text-xs font-medium text-slate-200 group-hover:text-sky-300 transition-colors truncate">{item.title}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
