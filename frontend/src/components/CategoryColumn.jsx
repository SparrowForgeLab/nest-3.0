import React from 'react';
import BookmarkCard from './BookmarkCard';
import { Plus, Lock, Folder, MoreHorizontal, GripVertical } from 'lucide-react';
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
      onDropBookmark && onDropBookmark(e, null, category.id);
    }
  };

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

        <div className="flex items-center gap-1">
          <button
            onClick={() => onAddBookmark && onAddBookmark(category.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-slate-800/80 transition"
            title="Add Bookmark to Category"
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
        {category.bookmarks && category.bookmarks.length > 0 ? (
          category.bookmarks.map((bm) => (
            <BookmarkCard
              key={bm.id}
              bookmark={bm}
              viewMode={viewMode}
              onContextMenu={onContextMenuBookmark}
              onLockClick={onLockClick}
              onDragStartCard={onDragStartBookmark}
              onDropCard={(e, targetBm) => onDropBookmark && onDropBookmark(e, targetBm, category.id)}
            />
          ))
        ) : (
          <div className="py-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl col-span-full">
            No bookmarks yet. Drag items here or click <span className="text-sky-400 font-semibold">+</span> to add one.
          </div>
        )}
      </div>
    </div>
  );
}
