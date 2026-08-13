import React, { useState } from 'react';
import BookmarkCard from './BookmarkCard';
import RenderIcon from './RenderIcon';
import { ChevronDown, ChevronRight, Plus, Folder, MoreVertical, Trash2, Edit } from 'lucide-react';

export default function FolderCard({
  folder,
  childBookmarks = [],
  viewMode = 'grid',
  onAddLinkToFolder,
  onContextMenuFolder,
  onContextMenuBookmark,
  onLockClick,
  onDragStartBookmark,
  onDropBookmark
}) {
  const [isOpen, setIsOpen] = useState(true);

  const handleDragOverFolder = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDropOnFolder = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDropBookmark && onDropBookmark(e, null, folder.category_id, folder.id);
  };

  return (
    <div
      onDragOver={handleDragOverFolder}
      onDrop={handleDropOnFolder}
      className="bg-slate-900/90 border border-slate-700/80 rounded-xl overflow-hidden transition-all duration-300 shadow-md col-span-full"
    >
      {/* Folder Header */}
      <div
        className="flex items-center justify-between p-2.5 bg-slate-950/60 hover:bg-slate-800/80 transition cursor-pointer select-none border-b border-slate-800/80"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            className="p-1 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-slate-800 transition"
          >
            {isOpen ? <ChevronDown className="w-4 h-4 text-sky-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
          </button>

          <RenderIcon icon={folder.icon} defaultIcon="📁" className="w-4 h-4 object-contain flex-shrink-0 text-amber-400" />

          <span className="font-bold text-xs sm:text-sm text-slate-100 truncate">
            {folder.title}
          </span>

          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60 flex-shrink-0">
            {childBookmarks.length} {childBookmarks.length === 1 ? 'link' : 'links'}
          </span>
        </div>

        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onAddLinkToFolder && onAddLinkToFolder(folder.id)}
            className="p-1 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-slate-800 transition"
            title="Add Link inside this Folder"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => onContextMenuFolder && onContextMenuFolder(e, folder)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            title="Folder Options"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expandable Folder Body Container */}
      {isOpen && (
        <div className="p-2 bg-slate-950/40 space-y-2">
          {childBookmarks.length > 0 ? (
            <div className={`gap-2 ${viewMode === 'card' ? 'grid grid-cols-1 sm:grid-cols-2 gap-2' : 'flex flex-col gap-1.5'}`}>
              {childBookmarks.map((bm) => (
                <BookmarkCard
                  key={bm.id}
                  bookmark={bm}
                  viewMode={viewMode}
                  onContextMenu={onContextMenuBookmark}
                  onLockClick={onLockClick}
                  onDragStartCard={onDragStartBookmark}
                  onDropCard={(e, targetBm) => onDropBookmark && onDropBookmark(e, targetBm, folder.category_id, folder.id)}
                />
              ))}
            </div>
          ) : (
            <div
              onDragOver={handleDragOverFolder}
              onDrop={handleDropOnFolder}
              className="py-4 px-3 text-center text-[11px] text-slate-500 border border-dashed border-slate-800/80 rounded-xl bg-slate-900/30 flex items-center justify-center gap-1.5"
            >
              <span>Folder is empty. Click</span>
              <button
                type="button"
                onClick={() => onAddLinkToFolder && onAddLinkToFolder(folder.id)}
                className="text-sky-400 font-bold hover:underline flex items-center gap-0.5"
              >
                <Plus className="w-3 h-3" /> Add Link
              </button>
              <span>or drag items here.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
