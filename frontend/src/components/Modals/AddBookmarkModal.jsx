import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Sparkles, Lock, Link, Info } from 'lucide-react';

export default function AddBookmarkModal({ isOpen, onClose, onSave, categories = [], initialBookmark = null, initialCategoryId = null }) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isVault, setIsVault] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [scraping, setScraping] = useState(false);

  useEffect(() => {
    if (initialBookmark) {
      setTitle(initialBookmark.title || '');
      setUrl(initialBookmark.url || '');
      setDescription(initialBookmark.description || '');
      setIcon(initialBookmark.icon || '');
      setCategoryId(initialBookmark.category_id || categories[0]?.id || '');
      setIsVault(initialBookmark.is_vault === 1);
      setIsFeatured(initialBookmark.is_featured === 1);
    } else {
      setTitle('');
      setUrl('');
      setDescription('');
      setIcon('');
      setCategoryId(initialCategoryId || categories[0]?.id || '');
      setIsVault(false);
      setIsFeatured(false);
    }
  }, [initialBookmark, initialCategoryId, categories, isOpen]);

  const handleAutoScrape = async () => {
    if (!url.trim()) return;
    setScraping(true);
    try {
      const res = await axios.get(`/api/scraper/scrape?url=${encodeURIComponent(url)}`);
      if (res.data.title && !title) setTitle(res.data.title);
      if (res.data.description && !description) setDescription(res.data.description);
      if (res.data.favicon && !icon) setIcon(res.data.favicon);
    } catch (err) {
      console.error('Failed to auto scrape');
    } finally {
      setScraping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: initialBookmark?.id,
      category_id: categoryId,
      title,
      url,
      description,
      icon,
      is_vault: isVault,
      is_featured: isFeatured
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl p-6 glass-panel shadow-2xl text-slate-100">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 mb-4">
          <h3 className="text-lg font-bold text-slate-100">
            {initialBookmark ? 'Edit Bookmark' : 'Add New Bookmark'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">URL</label>
            <div className="flex gap-2">
              <input
                type="url"
                required
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onBlur={handleAutoScrape}
                className="w-full bg-slate-950/80 border border-slate-700/60 rounded-xl px-3 py-2 text-slate-100 outline-none focus:border-sky-400"
              />
              <button
                type="button"
                onClick={handleAutoScrape}
                disabled={scraping}
                className="px-3 py-2 bg-sky-500/20 text-sky-300 border border-sky-500/40 rounded-xl hover:bg-sky-500/30 transition flex items-center gap-1 font-medium whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5" /> Auto Fill
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Bookmark Name</label>
            <input
              type="text"
              required
              placeholder="e.g. GitHub, ChatGPT, OpenAI"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700/60 rounded-xl px-3 py-2 text-slate-100 outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Icon (Emoji or Image URL)</label>
            <input
              type="text"
              placeholder="✨ or https://..."
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700/60 rounded-xl px-3 py-2 text-slate-100 outline-none focus:border-sky-400"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Leave blank to fetch website favicon automatically.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Category Column</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700/60 rounded-xl px-3 py-2 text-slate-100 outline-none focus:border-sky-400 cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description (Optional)</label>
            <input
              type="text"
              placeholder="Short notes or description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700/60 rounded-xl px-3 py-2 text-slate-100 outline-none focus:border-sky-400"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isVault}
                onChange={(e) => setIsVault(e.target.checked)}
                className="w-4 h-4 rounded text-sky-400 focus:ring-0 bg-slate-800"
              />
              <span className="text-xs font-semibold text-rose-300 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-rose-400" /> AES-256 Vault Encryption
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-amber-400 focus:ring-0 bg-slate-800"
              />
              <span className="text-xs font-semibold text-amber-300">Pin to Featured</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/60">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-medium shadow-lg transition">
              Save Bookmark
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
