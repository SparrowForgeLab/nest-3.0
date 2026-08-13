import React, { useState, useMemo } from 'react';
import BookmarkCard from './BookmarkCard';
import FolderCard from './FolderCard';
import { Plus, Lock, Folder, MoreHorizontal, GripVertical, ArrowUpDown } from 'lucide-react';
import RenderIcon from './RenderIcon';

export default function CategoryColumn({
  category,
  viewMode = 'grid',
  onAddBookmark,
  onContextMenuBookmark,
  onLockClick,
  onEditCategory,
  onDragStartCategory,
  onDropCategory,
  onDragStartBookmark,
  onDropBookmark
}) {
  const accentColor = category.color || '#38bdf8';

  const [sortMode, setSortMode] = useState(() => {
    return localStorage.getItem(`nest3_cat_sort_${category.id}`) || 'custom';
  });

  const handleToggleSort = () => {
    const nextMode = sortMode === 'custom' ? 'az' : 'custom';
    setSortMode(nextMode);
    localStorage.setItem(`nest3_cat_sort_${category.id}`, nextMode);
  };

  // Separate Folders and Top-Level Unparented Links
  const folders = useMemo(() => {
    if (!category.bookmarks) return [];
    return category.bookmarks.filter(b => b.is_folder === 1 && !b.parent_id);
  }, [category.bookmarks]);

  const folderMap = useMemo(() => {
    if (!category.bookmarks) return {};
    const map = {};
    category.bookmarks.forEach(b => {
      if (b.parent_id) {
        if (!map[b.parent_id]) map[b.parent_id] = [];
        map[b.parent_id].push(b);
      }
    });
    return map;
  }, [category.bookmarks]);

  const topLevelLinks = useMemo(() => {
    if (!category.bookmarks) return [];
    const unparented = category.bookmarks.filter(b => b.is_folder !== 1 && !b.parent_id);
    if (sortMode === 'az') {
      return unparented.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }
    return unparented;
  }, [category.bookmarks, sortMode]);

  const handleCategoryDragStart = (e) => {
    e.stopPropagation();
    e.dataTransfer.setData('type', 'category');
    e.dataTransfer.setData('categoryId', String(category.id));
    onDragStartCategory && onDragStartCategory(e, category.id);
  };

  const handleCategoryDragOver = (e) => {
    e.preventDefault();
  };

  const handleCategoryDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('type');
    if (type === 'category') {
      onDropCategory && onDropCategory(e, category.id);
    } else if (type === 'bookmark') {
      onDropBookmark && onDropBookmark(e, null, category.id, null);
    }
  };

  const hasItems = folders.length > 0 || topLevelLinks.length > 0;

  return (
    <div
      onDragOver={handleCategoryDragOver}
      onDrop={handleCategoryDrop}
      className={`glass-panel rounded-2xl p-4 flex flex-col gap-3 transition-all duration-300 relative group border-t-2 ${
        viewMode === 'list' ? 'col-span-full' : ''
      }`}
      style={{ borderTopColor: accentColor }}
    >
      {/* Category Header */}
      <div
        draggable
        onDragStart={handleCategoryDragStart}
        className="flex items-center justify-between border-b border-slate-700/50 pb-2.5 cursor-grab active:cursor-grabbing select-none"
      >
        <div className="flex items-center gap-2 min-w-0">
          <GripVertical className="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition-colors flex-shrink-0" />
          <RenderIcon icon={category.icon} defaultIcon="📁" className="w-5 h-5 object-contain flex-shrink-0" />
          <h3 className="font-bold text-sm sm:text-base text-slate-100 truncate">
            {category.name}
          </h3>
          {category.is_vault === 1 && (
            <span className="bg-rose-500/20 text-rose-300 text-[10px] px-2 py-0.5 rounded-full border border-rose-500/30 font-medium flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" /> Vault
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Column Bookmark Sort Toggle Button (Icon Only) */}
          <button
            onClick={handleToggleSort}
            className={`p-1.5 rounded-lg border transition-all duration-300 ${
              sortMode === 'az'
                ? 'bg-sky-500/20 text-sky-400 border-sky-500/50 shadow-md ring-1 ring-sky-500/30'
                : 'bg-slate-800/40 text-slate-400 border-slate-700/50 hover:text-slate-200 hover:bg-slate-800/80'
            }`}
            title={sortMode === 'az' ? 'Sort Mode: Alphabetical (A-Z). Click for Custom Drag & Drop.' : 'Sort Mode: Custom Drag & Drop. Click for Alphabetical A-Z.'}
          >
            <ArrowUpDown className={`w-4 h-4 transition-transform duration-300 ${sortMode === 'az' ? 'rotate-90 text-sky-400' : ''}`} />
          </button>

          <button
            onClick={() => onAddBookmark && onAddBookmark(category.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-slate-800/80 transition"
            title="Add Link or Folder to Category"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEditCategory && onEditCategory(category)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition"
            title="Edit Category"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bookmarks List Container */}
      <div className={`gap-2 min-h-[60px] ${
        viewMode === 'card' ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : 'flex flex-col gap-2'
      }`}>
        {/* 1. Folders Section (ALWAYS AT THE VERY TOP OF CATEGORY LIST) */}
        {folders.map((folder) => (
          <FolderCard
            key={folder.id}
            folder={folder}
            childBookmarks={folderMap[folder.id] || []}
            viewMode={viewMode}
            onAddLinkToFolder={(folderId) => onAddBookmark && onAddBookmark(category.id, folderId)}
            onContextMenuFolder={onContextMenuBookmark}
            onContextMenuBookmark={onContextMenuBookmark}
            onLockClick={onLockClick}
            onDragStartBookmark={onDragStartBookmark}
            onDropBookmark={onDropBookmark}
          />
        ))}

        {/* 2. Top-Level Links Section (Rendered below Folders) */}
        {topLevelLinks.map((bm) => (
          <BookmarkCard
            key={bm.id}
            bookmark={bm}
            viewMode={viewMode}
            onContextMenu={onContextMenuBookmark}
            onLockClick={onLockClick}
            onDragStartCard={onDragStartBookmark}
            onDropCard={(e, targetBm) => onDropBookmark && onDropBookmark(e, targetBm, category.id, null)}
          />
        ))}

        {!hasItems && (
          <div className="py-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl col-span-full">
            No links or folders yet. Click <span className="text-sky-400 font-semibold">+</span> to add one.
          </div>
        )}
      </div>
    </div>
  );
}
