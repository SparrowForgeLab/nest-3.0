import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function Dock({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
      <div className="glass-panel px-4 py-2.5 rounded-2xl flex items-center gap-3 border border-slate-700/60 shadow-2xl backdrop-blur-xl bg-slate-950/70">
        {items.map((item, idx) => (
          <a
            key={item.id || idx}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            title={item.name}
            className="group relative flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-700/60 hover:bg-sky-500/20 hover:border-sky-400 transition-all duration-300 transform hover:-translate-y-2 hover:scale-125 shadow-md"
          >
            <span className="text-xl leading-none">{item.icon || '📱'}</span>
            
            {/* Tooltip */}
            <span className="absolute -top-9 px-2.5 py-1 rounded-md bg-slate-900 text-slate-100 text-xs font-medium border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
              {item.name}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
