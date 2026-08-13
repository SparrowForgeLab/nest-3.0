import React, { useState, useEffect } from 'react';
import { X, Folder, Lock, Trash2, Palette, Smile } from 'lucide-react';

const EMOJI_PRESETS = ['📁', '⚡', '🍿', '🔐', '🛠️', '🎮', '📚', '🌐', '💼', '🎵', '🏠', '🎨', '🚀', '⭐', '🔥', '💻'];
const COLOR_PRESETS = ['#38bdf8', '#a855f7', '#ec4899', '#f43f5e', '#10b981', '#f59e0b', '#6366f1', '#84cc16'];

export default function EditCategoryModal({ isOpen, onClose, category, onSaveCategory, onDeleteCategory }) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('📁');
  const [color, setColor] = useState('#38bdf8');
  const [isVault, setIsVault] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setIcon(category.icon || '📁');
      setColor(category.color || '#38bdf8');
      setIsVault(category.is_vault === 1);
    } else {
      setName('');
      setIcon('📁');
      setColor('#38bdf8');
      setIsVault(false);
    }
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSaveCategory({
      ...(category?.id ? { id: category.id } : {}),
      name,
      icon,
      color,
      is_vault: isVault ? 1 : 0
    });
    onClose();
  };

  const handleDelete = () => {
    if (category && window.confirm(`Delete category "${category.name}" and all its bookmarks?`)) {
      onDeleteCategory && onDeleteCategory(category.id);
      onClose();
    }
  };

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl p-6 glass-panel shadow-2xl text-slate-100 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{icon}</span>
            <h3 className="text-lg font-bold">{category ? 'Edit Category Options' : 'Add New Category Column'}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Category Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Work Tools, Social, Entertainment..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5">
              <Smile className="w-4 h-4 text-sky-400" /> Icon / Emoji
            </label>
            <div className="grid grid-cols-8 gap-1.5 p-2 bg-slate-950 rounded-xl border border-slate-800 mb-2">
              {EMOJI_PRESETS.map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setIcon(em)}
                  className={`p-1.5 rounded-lg text-base hover:bg-slate-800 transition ${
                    icon === em ? 'bg-sky-500/20 border border-sky-400 scale-110' : ''
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Or type custom emoji or URL..."
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-100 outline-none text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-sky-400" /> Category Accent Color
            </label>
            <div className="flex items-center gap-2">
              {COLOR_PRESETS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    color === c ? 'scale-125 ring-2 ring-white shadow-lg' : 'opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-8 rounded-lg bg-transparent cursor-pointer border-none"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer bg-slate-950 p-3 rounded-xl border border-slate-800 hover:border-slate-700">
            <input
              type="checkbox"
              checked={isVault}
              onChange={(e) => setIsVault(e.target.checked)}
              className="rounded text-rose-500 accent-rose-500 w-4 h-4 cursor-pointer"
            />
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-rose-400" />
              <span className="font-semibold text-slate-100">Private Vault Category</span>
            </div>
          </label>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {category ? (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold transition flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> Delete Category
              </button>
            ) : (
              <div />
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold transition shadow-lg"
              >
                {category ? 'Save Category' : 'Create Column'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
