import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { X, Sparkles, Lock, Link, Info, FolderPlus, Folder } from 'lucide-react';
import IconPicker from './IconPicker';

export default function AddBookmarkModal({
  isOpen,
  onClose,
  onSave,
  categories = [],
  initialBookmark = null,
  initialCategoryId = null,
  initialParentId = null
}) {
  const [itemType, setItemType] = useState('link'); // 'link' | 'folder'
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [parentId, setParentId] = useState('');
  const [isVault, setIsVault] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [scraping, setScraping] = useState(false);

  useEffect(() => {
    if (initialBookmark) {
      setItemType(initialBookmark.is_folder === 1 ? 'folder' : 'link');
      setTitle(initialBookmark.title || '');
      setUrl(initialBookmark.url || '');
      setDescription(initialBookmark.description || '');
      setIcon(initialBookmark.icon || '');
      setCategoryId(initialBookmark.category_id || categories[0]?.id || '');
      setParentId(initialBookmark.parent_id ? String(initialBookmark.parent_id) : '');
      setIsVault(initialBookmark.is_vault === 1);
      setIsFeatured(initialBookmark.is_featured === 1);
    } else {
      setItemType('link');
      setTitle('');
      setUrl('');
      setDescription('');
      setIcon('');
      setCategoryId(initialCategoryId || categories[0]?.id || '');
      setParentId(initialParentId ? String(initialParentId) : '');
      setIsVault(false);
      setIsFeatured(false);
    }
  }, [initialBookmark, initialCategoryId, initialParentId, categories, isOpen]);

  // Compute available folders in the selected category
  const availableFolders = useMemo(() => {
    if (!categoryId || !categories) return [];
    const cat = categories.find(c => String(c.id) === String(categoryId));
    if (!cat || !cat.bookmarks) return [];
    return cat.bookmarks.filter(b => b.is_folder === 1 && String(b.id) !== String(initialBookmark?.id));
  }, [categoryId, categories, initialBookmark]);

  const handleAutoScrape = async () => {
    if (!url.trim() || itemType === 'folder') return;
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
      category_id: parseInt(categoryId, 10),
      title: title.trim(),
      url: itemType === 'folder' ? '#' : url.trim(),
      description: description.trim(),
      icon: icon.trim() || (itemType === 'folder' ? '📁' : ''),
      is_vault: isVault ? 1 : 0,
      is_featured: isFeatured ? 1 : 0,
      parent_id: parentId ? parseInt(parentId, 10) : null,
      is_folder: itemType === 'folder' ? 1 : 0
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl p-6 glass-panel shadow-2xl text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 mb-4">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            {itemType === 'folder' ? <Folder className="w-5 h-5 text-amber-400" /> : <Link className="w-5 h-5 text-sky-400" />}
            {initialBookmark
              ? (itemType === 'folder' ? 'Edit Folder' : 'Edit Bookmark')
              : (itemType === 'folder' ? 'Create New Folder' : 'Add New Bookmark Link')}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item Type Toggle Selector */}
        {!initialBookmark && (
          <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setItemType('link')}
              className={`py-1.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                itemType === 'link' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Link className="w-3.5 h-3.5" /> Bookmark Link
            </button>
            <button
              type="button"
              onClick={() => setItemType('folder')}
              className={`py-1.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                itemType === 'folder' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FolderPlus className="w-3.5 h-3.5" /> New Folder
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs sm:text-sm">
          {itemType === 'link' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Bookmark URL</label>
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
          ) : null}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {itemType === 'folder' ? 'Folder Name' : 'Bookmark Title'}
            </label>
            <input
              type="text"
              required
              placeholder={itemType === 'folder' ? 'e.g. D&D Tools, Developer Docs, Socials' : 'e.g. GitHub, ChatGPT, OpenAI'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700/60 rounded-xl px-3 py-2 text-slate-100 outline-none focus:border-sky-400"
            />
          </div>

          <IconPicker selectedIcon={icon} onSelectIcon={setIcon} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category Column</label>
              <select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  setParentId('');
                }}
                className="w-full bg-slate-950/80 border border-slate-700/60 rounded-xl px-3 py-2 text-slate-100 outline-none focus:border-sky-400 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>

            {itemType === 'link' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Inside Folder (Optional)</label>
                <select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700/60 rounded-xl px-3 py-2 text-slate-100 outline-none focus:border-sky-400 cursor-pointer"
                >
                  <option value="">(None - Main Category Level)</option>
                  {availableFolders.map((f) => (
                    <option key={f.id} value={f.id}>
                      📁 {f.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
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

            {itemType === 'link' && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-400 focus:ring-0 bg-slate-800"
                />
                <span className="text-xs font-semibold text-amber-300">Pin to Featured</span>
              </label>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/60">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-medium shadow-lg transition">
              {itemType === 'folder' ? 'Save Folder' : 'Save Bookmark'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
