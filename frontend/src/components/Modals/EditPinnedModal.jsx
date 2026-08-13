import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Star, Plus, Trash2, Edit2, ArrowUp, ArrowDown, Check, RefreshCw, Link as LinkIcon, Sparkles } from 'lucide-react';
import IconPicker from './IconPicker';
import RenderIcon from '../RenderIcon';

const POPULAR_PRESETS = [
  { title: 'Google', url: 'https://google.com', icon: '🔍' },
  { title: 'ChatGPT', url: 'https://chatgpt.com', icon: '🤖' },
  { title: 'GitHub', url: 'https://github.com', icon: '🐙' },
  { title: 'YouTube', url: 'https://youtube.com', icon: '📺' },
  { title: 'Reddit', url: 'https://reddit.com', icon: '🤖' },
  { title: 'Twitch', url: 'https://twitch.tv', icon: '🎮' },
  { title: 'Wikipedia', url: 'https://wikipedia.org', icon: '📚' },
  { title: 'Spotify', url: 'https://spotify.com', icon: '🎵' },
];

export default function EditPinnedModal({ isOpen, onClose, featuredItems = [], onRefreshData }) {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('⭐');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editIcon, setEditIcon] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setItems(featuredItems || []);
  }, [featuredItems, isOpen]);

  if (!isOpen) return null;

  const showFeedback = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleAddLink = async (e) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://') && !formattedUrl.startsWith('file://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    setIsSubmitting(true);
    try {
      await axios.post('/api/featured-links', {
        title: title.trim(),
        url: formattedUrl,
        icon: icon.trim() || '⭐'
      });

      setTitle('');
      setUrl('');
      setIcon('⭐');
      showFeedback('Link pinned successfully!');
      onRefreshData && onRefreshData();
    } catch (err) {
      showFeedback('Failed to add pinned link: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAddPreset = async (preset) => {
    setIsSubmitting(true);
    try {
      await axios.post('/api/featured-links', preset);
      showFeedback(`Added ${preset.title} to Pinned Links!`);
      onRefreshData && onRefreshData();
    } catch (err) {
      showFeedback('Failed to add preset link');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditUrl(item.url);
    setEditIcon(item.icon || '⭐');
  };

  const handleSaveEdit = async (id) => {
    if (!editTitle.trim() || !editUrl.trim()) return;

    let formattedUrl = editUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://') && !formattedUrl.startsWith('file://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    setIsSubmitting(true);
    try {
      if (items.find(i => i.id === id)?.is_bookmark) {
        // Edit bookmark's title/url/icon or toggle
        await axios.put(`/api/bookmarks/${id}`, {
          title: editTitle.trim(),
          url: formattedUrl,
          icon: editIcon.trim()
        });
      } else {
        await axios.put(`/api/featured-links/${id}`, {
          title: editTitle.trim(),
          url: formattedUrl,
          icon: editIcon.trim()
        });
      }
      setEditingId(null);
      showFeedback('Pinned link updated!');
      onRefreshData && onRefreshData();
    } catch (err) {
      showFeedback('Failed to update link');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Unpin "${item.title}"?`)) return;

    setIsSubmitting(true);
    try {
      if (item.is_bookmark) {
        // Unpin bookmark by setting is_featured = 0
        await axios.put(`/api/bookmarks/${item.id}`, { is_featured: 0 });
      } else {
        await axios.delete(`/api/featured-links/${item.id}`);
      }
      showFeedback('Link unpinned!');
      onRefreshData && onRefreshData();
    } catch (err) {
      showFeedback('Failed to remove pinned link');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMove = async (index, direction) => {
    const newItems = [...items];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= newItems.length) return;

    // Swap positions
    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;

    setItems(newItems);

    // Filter non-bookmark items to update backend order
    const customItems = newItems.filter(item => !item.is_bookmark);
    const reorderPayload = customItems.map((item, idx) => ({
      id: item.id,
      position: idx
    }));

    try {
      await axios.put('/api/featured-links/reorder', { items: reorderPayload });
      onRefreshData && onRefreshData();
    } catch (err) {
      console.error('Failed to reorder pinned links', err);
    }
  };

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl p-6 glass-panel shadow-2xl text-slate-100 max-h-[90vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 mb-4 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Star className="w-5 h-5 fill-sky-400 text-sky-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Manage Pinned Links</h3>
              <p className="text-xs text-slate-400">Add, edit, or reorder quick access links on your Featured Shelf</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Message Notification */}
        {message && (
          <div className="mb-4 px-3.5 py-2 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-200 text-xs font-medium flex items-center gap-2 animate-fadeIn">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>{message}</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-6 pr-1 text-xs sm:text-sm">
          {/* Add New Link Section */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="font-bold text-sky-300 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <Plus className="w-4 h-4" /> Add New Pinned Link
            </h4>

            <form onSubmit={handleAddLink} className="space-y-4">
              <IconPicker selectedIcon={icon} onSelectIcon={setIcon} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. GitHub"
                    required
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">URL</label>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://github.com"
                    required
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !title.trim() || !url.trim()}
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-md disabled:opacity-50 transition"
                >
                  <Plus className="w-4 h-4" /> Add Pinned Link
                </button>
              </div>
            </form>

            {/* Quick Add Presets Bar */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">Quick Add Popular Links:</span>
              <div className="flex flex-wrap gap-2">
                {POPULAR_PRESETS.map((preset) => (
                  <button
                    key={preset.title}
                    type="button"
                    onClick={() => handleQuickAddPreset(preset)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/60 text-slate-300 hover:text-sky-300 hover:border-sky-400/50 hover:bg-slate-800 text-xs font-medium transition"
                  >
                    <span>{preset.icon}</span>
                    <span>{preset.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Current Pinned Links List */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-300 text-xs uppercase tracking-wider flex items-center justify-between">
              <span>Current Pinned Links ({items.length})</span>
              <span className="text-[10px] text-slate-400 font-normal">Use arrows to reorder items</span>
            </h4>

            {items.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/40 rounded-xl border border-slate-800 text-slate-400 space-y-2">
                <Star className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs">No pinned links found.</p>
                <p className="text-[11px] text-slate-500">Use the form above or click quick presets to add pinned links to your dashboard!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item, idx) => {
                  const isEditing = editingId === item.id;

                  return (
                    <div
                      key={item.id || idx}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition"
                    >
                      {isEditing ? (
                        /* In-line Edit Form */
                        <div className="flex-1 flex items-center gap-2 flex-wrap sm:flex-nowrap">
                          <input
                            type="text"
                            value={editIcon}
                            onChange={(e) => setEditIcon(e.target.value)}
                            placeholder="⭐"
                            className="w-12 bg-slate-900 border border-slate-700 rounded-lg p-1 text-center text-sm text-slate-100"
                          />
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="Title"
                            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-100"
                          />
                          <input
                            type="text"
                            value={editUrl}
                            onChange={(e) => setEditUrl(e.target.value)}
                            placeholder="URL"
                            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-100"
                          />
                          <button
                            onClick={() => handleSaveEdit(item.id)}
                            className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-2 py-1 text-slate-400 hover:text-slate-200 text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        /* View Item Row */
                        <>
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
                              <RenderIcon icon={item.icon} defaultIcon="⭐" className="w-5 h-5 object-contain" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h5 className="font-bold text-slate-200 text-xs truncate flex items-center gap-1.5">
                                {item.title}
                                {item.is_bookmark && (
                                  <span className="text-[9px] bg-sky-500/20 text-sky-300 border border-sky-500/30 px-1.5 py-0.2 rounded font-mono">
                                    Category Bookmark
                                  </span>
                                )}
                              </h5>
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] text-slate-400 hover:text-sky-400 truncate block mt-0.5"
                              >
                                {item.url}
                              </a>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {/* Reorder Buttons */}
                            <button
                              onClick={() => handleMove(idx, -1)}
                              disabled={idx === 0}
                              className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-30"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleMove(idx, 1)}
                              disabled={idx === items.length - 1}
                              className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-30"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit Button */}
                            <button
                              onClick={() => handleStartEdit(item)}
                              className="p-1.5 rounded-lg text-sky-400 hover:text-sky-300 hover:bg-sky-500/20 transition"
                              title="Edit Title / URL / Icon"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete / Unpin Button */}
                            <button
                              onClick={() => handleDelete(item)}
                              className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 transition"
                              title="Unpin / Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-700/60 pt-3 mt-4 flex items-center justify-between flex-shrink-0">
          <button
            type="button"
            onClick={() => onRefreshData && onRefreshData()}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Sync Dashboard
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
