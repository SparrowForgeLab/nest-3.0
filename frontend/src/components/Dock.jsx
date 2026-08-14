import React, { useState } from 'react';
import { Settings2, Plus } from 'lucide-react';

export default function Dock({ items = [], onOpenEditDock }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!items || items.length === 0) {
    return (
      <aside role="region" aria-label="Application Dock" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
        <div className="glass-panel px-4 py-2 rounded-2xl flex items-center gap-3 border border-slate-700/60 shadow-2xl backdrop-blur-xl bg-slate-950/85">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            📱 Application Dock
          </span>
          {onOpenEditDock && (
            <button
              type="button"
              onClick={onOpenEditDock}
              aria-label="Add icons to application dock"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 text-xs font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" /> Add Icons
            </button>
          )}
        </div>
      </aside>
    );
  }

  const getItemStyle = (index) => {
    if (hoveredIndex === null) {
      return {
        transform: 'scale(1) translateY(0px)',
        marginLeft: '4px',
        marginRight: '4px',
        zIndex: 10
      };
    }

    const distance = Math.abs(hoveredIndex - index);

    if (distance === 0) {
      return {
        transform: 'scale(1.45) translateY(-14px)',
        marginLeft: '12px',
        marginRight: '12px',
        zIndex: 40
      };
    }
    if (distance === 1) {
      return {
        transform: 'scale(1.22) translateY(-7px)',
        marginLeft: '8px',
        marginRight: '8px',
        zIndex: 30
      };
    }
    if (distance === 2) {
      return {
        transform: 'scale(1.08) translateY(-2px)',
        marginLeft: '5px',
        marginRight: '5px',
        zIndex: 20
      };
    }

    return {
      transform: 'scale(1) translateY(0px)',
      marginLeft: '4px',
      marginRight: '4px',
      zIndex: 10
    };
  };

  return (
    <nav aria-label="Application Dock" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
      <div
        onMouseLeave={() => setHoveredIndex(null)}
        className="glass-panel px-3.5 py-2.5 rounded-2xl flex items-center border border-slate-700/70 shadow-2xl backdrop-blur-2xl bg-slate-950/85 transition-all duration-300"
      >
        {items.map((item, idx) => {
          const itemStyle = getItemStyle(idx);
          const iconStr = item.icon ? item.icon.trim() : '';
          const isImgIcon = iconStr.startsWith('http') || iconStr.startsWith('/') || iconStr.startsWith('data:');
          const isFileScheme = item.url && item.url.startsWith('file://');

          return (
            <a
              key={item.id || idx}
              href={isFileScheme ? '#' : item.url}
              target={isFileScheme ? '_self' : '_blank'}
              rel="noopener noreferrer"
              onMouseEnter={() => setHoveredIndex(idx)}
              onFocus={() => setHoveredIndex(idx)}
              onBlur={() => setHoveredIndex(null)}
              aria-label={`Dock item: ${item.name || item.title}`}
              onClick={(e) => {
                if (isFileScheme) {
                  e.preventDefault();
                  navigator.clipboard.writeText(item.url);
                  alert(`Browser Security Notice:\nHTTPS websites cannot launch local file:// links directly.\n\nThe file path has been copied to your clipboard:\n${item.url}`);
                }
              }}
              style={itemStyle}
              className="group relative flex flex-col items-center justify-center w-10 h-10 rounded-2xl bg-slate-900/90 border border-slate-700/80 hover:bg-sky-500/20 hover:border-sky-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 transition-all duration-200 ease-out shadow-lg transform-gpu"
            >
              {isImgIcon ? (
                <img src={iconStr} alt="" className="w-5 h-5 object-contain rounded" aria-hidden="true" />
              ) : (
                <span className="text-xl leading-none" aria-hidden="true">{iconStr || '📱'}</span>
              )}

              {/* macOS Active Indicator Dot */}
              <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-sky-400 opacity-75 group-hover:opacity-100 group-hover:scale-125 transition" aria-hidden="true" />

              {/* Hover/Focus Tooltip Label */}
              <span className="absolute -top-10 px-2.5 py-1 rounded-lg bg-slate-900/95 text-slate-100 text-xs font-semibold border border-slate-700 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-xl">
                {item.name || item.title}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
