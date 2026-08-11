import React from 'react';
import { ExternalLink, Lock, MoreVertical, FileText, GripVertical } from 'lucide-react';

export default function BookmarkCard({ bookmark, viewMode = 'grid', onContextMenu, onLockClick, onDragStartCard, onDropCard }) {
  const isLocked = bookmark.locked;
  const isFileScheme = bookmark.url && bookmark.url.startsWith('file://');

  const getIconElement = (sizeClass = 'w-5 h-5') => {
    if (isLocked) {
      return <Lock className={`${sizeClass} text-rose-400 animate-pulse`} />;
    }
    if (isFileScheme) {
      return <FileText className={`${sizeClass} text-amber-400`} />;
    }

    const icon = bookmark.icon ? bookmark.icon.trim() : '';

    if (icon.startsWith('http') || icon.startsWith('/') || icon.startsWith('data:')) {
      return (
        <img
          src={icon}
          alt=""
          className={`${sizeClass} object-contain rounded`}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      );
    }

    if (icon.length > 0) {
      return <span className="text-lg leading-none">{icon}</span>;
    }

    // Google Favicon Fallback
    try {
      const domain = new URL(bookmark.url).hostname;
      if (domain) {
        return (
          <img
            src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
            alt=""
            className={`${sizeClass} object-contain rounded`}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        );
      }
    } catch (e) {
      // Fallback
    }

    return <span className="text-lg">🌐</span>;
  };

  const handleClick = (e) => {
    if (isLocked) {
      e.preventDefault();
      onLockClick && onLockClick(bookmark);
      return;
    }

    if (isFileScheme) {
      e.preventDefault();
      navigator.clipboard.writeText(bookmark.url);
      alert(`Browser Security Notice:\nHTTPS websites cannot launch local file:// links directly.\n\nThe file path has been copied to your clipboard:\n${bookmark.url}`);
      return;
    }
  };

  const handleDragStart = (e) => {
    e.stopPropagation();
    e.dataTransfer.setData('type', 'bookmark');
    e.dataTransfer.setData('bookmarkId', String(bookmark.id));
    e.dataTransfer.setData('categoryId', String(bookmark.category_id));
    onDragStartCard && onDragStartCard(e, bookmark);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDropCard && onDropCard(e, bookmark);
  };

  // 1. Compact List View
  if (viewMode === 'list') {
    return (
      <div
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onContextMenu={(e) => {
          e.preventDefault();
          onContextMenu && onContextMenu(e, bookmark);
        }}
        className="group relative flex items-center justify-between gap-2.5 px-3 py-1.5 rounded-lg border border-slate-700/40 bg-slate-900/50 hover:bg-slate-800/90 hover:border-sky-500/40 transition-all duration-150 cursor-grab active:cursor-grabbing text-xs"
      >
        <a
          href={isLocked || isFileScheme ? '#' : bookmark.url}
          target={isLocked || isFileScheme ? '_self' : '_blank'}
          rel="noopener noreferrer"
          onClick={handleClick}
          className="flex items-center gap-2 flex-1 min-w-0"
        >
          <GripVertical className="w-3 h-3 text-slate-600 group-hover:text-slate-400 flex-shrink-0" />
          <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
            {getIconElement('w-3.5 h-3.5')}
          </div>

          <span className="font-semibold text-slate-200 group-hover:text-sky-300 truncate">
            {bookmark.title}
          </span>

          {isLocked && <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1 py-0.2 rounded font-mono">Vault</span>}
          {isFileScheme && <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded font-mono">Local</span>}
        </a>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <ExternalLink className="w-3 h-3 text-slate-400 hover:text-sky-400" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onContextMenu && onContextMenu(e, bookmark);
            }}
            className="p-0.5 rounded text-slate-400 hover:text-slate-100"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // 2. Large Card View
  if (viewMode === 'card') {
    return (
      <div
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onContextMenu={(e) => {
          e.preventDefault();
          onContextMenu && onContextMenu(e, bookmark);
        }}
        className="group relative flex flex-col p-4 rounded-2xl border border-slate-700/60 bg-slate-900/70 hover:bg-slate-800 hover:border-sky-500/50 transition-all duration-200 cursor-grab active:cursor-grabbing shadow-md hover:shadow-sky-500/10 space-y-3"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <GripVertical className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              {getIconElement('w-6 h-6')}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onContextMenu && onContextMenu(e, bookmark);
            }}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h4 className="font-bold text-sm text-slate-100 group-hover:text-sky-300 transition-colors flex items-center gap-2">
            {bookmark.title}
            {isLocked && <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-mono">Encrypted</span>}
          </h4>
          {bookmark.description && !isLocked && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{bookmark.description}</p>
          )}
        </div>

        <a
          href={isLocked || isFileScheme ? '#' : bookmark.url}
          target={isLocked || isFileScheme ? '_self' : '_blank'}
          rel="noopener noreferrer"
          onClick={handleClick}
          className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-sky-400 group-hover:text-sky-300"
        >
          <span>Launch Link</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }

  // 3. Multi-Column Grid View (Default)
  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu && onContextMenu(e, bookmark);
      }}
      className="group relative flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-700/50 bg-slate-900/60 hover:bg-slate-800/80 hover:border-sky-500/40 transition-all duration-200 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-sky-500/10"
    >
      <GripVertical className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 flex-shrink-0" />
      <a
        href={isLocked || isFileScheme ? '#' : bookmark.url}
        target={isLocked || isFileScheme ? '_self' : '_blank'}
        rel="noopener noreferrer"
        onClick={handleClick}
        className="flex items-center gap-2.5 flex-1 min-w-0"
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-center group-hover:scale-110 transition-transform">
          {getIconElement('w-5 h-5')}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-sky-300 truncate transition-colors flex items-center gap-1.5">
            {bookmark.title}
            {isLocked && <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-mono">Encrypted</span>}
            {isFileScheme && <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">Local</span>}
          </h4>
          {bookmark.description && !isLocked && (
            <p className="text-[11px] text-slate-400 truncate mt-0.5">{bookmark.description}</p>
          )}
        </div>

        <ExternalLink className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 group-hover:text-sky-400 transition-opacity flex-shrink-0" />
      </a>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onContextMenu && onContextMenu(e, bookmark);
        }}
        className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 opacity-0 group-hover:opacity-100 transition-opacity"
        title="Options"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
    </div>
  );
}
