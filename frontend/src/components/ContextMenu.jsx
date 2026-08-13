import React, { useEffect, useRef } from 'react';
import { Edit2, Trash2, Star, Image, ArrowRightLeft, ExternalLink, Smartphone } from 'lucide-react';

export default function ContextMenu({ x, y, bookmark, onClose, onEdit, onDelete, onToggleFeatured, onToggleDock }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!bookmark) return null;

  return (
    <div
      ref={menuRef}
      style={{ top: `${y}px`, left: `${x}px` }}
      className="fixed z-50 min-w-[200px] bg-slate-900/95 border border-slate-700/80 rounded-xl shadow-2xl p-1.5 glass-panel text-xs text-slate-200 animate-in fade-in zoom-in-95 duration-150"
    >
      <div className="px-3 py-1.5 border-b border-slate-800 text-[11px] font-semibold text-slate-400 truncate">
        {bookmark.title}
      </div>

      <button
        onClick={() => {
          window.open(bookmark.url, '_blank');
          onClose();
        }}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-sky-300 transition text-left"
      >
        <ExternalLink className="w-3.5 h-3.5" /> Open Link
      </button>

      <button
        onClick={() => {
          onEdit(bookmark);
          onClose();
        }}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-sky-300 transition text-left"
      >
        <Edit2 className="w-3.5 h-3.5" /> Edit Bookmark & Icon
      </button>

      <button
        onClick={() => {
          onToggleFeatured && onToggleFeatured(bookmark);
          onClose();
        }}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-sky-300 transition text-left"
      >
        <Star className={`w-3.5 h-3.5 ${bookmark.is_featured ? 'fill-sky-400 text-sky-400' : 'text-sky-400'}`} />
        {bookmark.is_featured ? 'Unpin from Featured' : 'Pin to Featured Shelf'}
      </button>

      <button
        onClick={() => {
          onToggleDock && onToggleDock(bookmark);
          onClose();
        }}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-sky-300 transition text-left"
      >
        <Smartphone className="w-3.5 h-3.5 text-sky-400" />
        Pin to Bottom Dock
      </button>

      <div className="my-1 border-t border-slate-800" />

      <button
        onClick={() => {
          onDelete(bookmark);
          onClose();
        }}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-rose-500/20 text-rose-400 transition text-left"
      >
        <Trash2 className="w-3.5 h-3.5" /> Delete Bookmark
      </button>
    </div>
  );
}
