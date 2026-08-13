import React, { useState, useRef } from 'react';
import { Plus, ChevronDown, ExternalLink } from 'lucide-react';
import RenderIcon from './RenderIcon';

export default function FeaturedLinks({ items = [], onOpenEditPinned }) {
  const [openFolderId, setOpenFolderId] = useState(null);
  const closeTimerRef = useRef(null);

  if (!items || items.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-center px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 shadow-md backdrop-blur-md">
          {onOpenEditPinned && (
            <button
              onClick={onOpenEditPinned}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 text-xs font-semibold transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Pinned Links
            </button>
          )}
        </div>
      </div>
    );
  }

  const handleMouseEnter = (folderId) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    setOpenFolderId(folderId);
  };

  const handleMouseLeave = () => {
    closeTimerRef.current = setTimeout(() => {
      setOpenFolderId(null);
    }, 250);
  };

  // Separate top-level items and child items assigned to dropdown folders
  const topLevelItems = items.filter(item => !item.parent_id);
  const getFolderChildren = (folderId) => items.filter(item => String(item.parent_id) === String(folderId));

  return (
    <div className="w-full max-w-4xl mx-auto mb-6 group/shelf">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {topLevelItems.map((item) => {
          const isFolder = item.is_folder === 1;
          const children = isFolder ? getFolderChildren(item.id) : [];
          const isFileScheme = item.url && item.url.startsWith('file://');
          const isDropdownOpen = openFolderId === item.id;

          if (isFolder) {
            return (
              <div
                key={item.id}
                className="relative group/folder"
                onMouseEnter={() => handleMouseEnter(item.id)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setOpenFolderId(openFolderId === item.id ? null : item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 border transition-all duration-200 shadow-md group ${
                    isDropdownOpen
                      ? 'border-sky-400 bg-sky-500/20 text-sky-300'
                      : 'border-slate-700/60 hover:border-sky-400/60 hover:bg-sky-500/10 text-slate-200'
                  }`}
                >
                  <RenderIcon icon={item.icon} defaultIcon="📁" className="w-5 h-5 object-contain group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span className="text-xs font-medium truncate">{item.title}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-sky-300 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-sky-400' : ''}`} />
                </button>

                {/* Dropdown Category Menu Box with zero-gap padding bridge and grace period */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 pt-1.5 w-52 z-50 animate-fadeIn">
                    <div className="bg-slate-950/95 border border-slate-800 rounded-2xl p-2 shadow-2xl backdrop-blur-2xl space-y-1">
                      <div className="px-2 py-1 border-b border-slate-800/80 mb-1 flex items-center justify-between text-[11px] font-bold text-sky-400 uppercase tracking-wider">
                        <span className="truncate">{item.title}</span>
                        <span className="text-[10px] text-slate-500 font-normal">{children.length} links</span>
                      </div>

                      {children.length > 0 ? (
                        children.map((child) => {
                          const isChildFileScheme = child.url && child.url.startsWith('file://');
                          return (
                            <a
                              key={child.id}
                              href={isChildFileScheme ? '#' : child.url}
                              target={isChildFileScheme ? '_self' : '_blank'}
                              rel="noopener noreferrer"
                              onClick={(e) => {
                                if (isChildFileScheme) {
                                  e.preventDefault();
                                  navigator.clipboard.writeText(child.url);
                                  alert(`Browser Security Notice:\nHTTPS websites cannot launch local file:// links directly.\n\nThe file path has been copied to your clipboard:\n${child.url}`);
                                }
                                setOpenFolderId(null);
                              }}
                              className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-slate-900/60 border border-slate-800/60 hover:border-sky-400/50 hover:bg-slate-800/90 text-slate-200 hover:text-sky-300 text-xs font-semibold transition group/child"
                            >
                              <RenderIcon icon={child.icon} defaultIcon="🔗" className="w-4 h-4 object-contain flex-shrink-0 group-hover/child:scale-110 transition-transform" />
                              <span className="truncate flex-1">{child.title}</span>
                              <ExternalLink className="w-3 h-3 text-slate-500 opacity-0 group-hover/child:opacity-100 flex-shrink-0 transition-opacity" />
                            </a>
                          );
                        })
                      ) : (
                        <div className="p-3 text-center text-[11px] text-slate-400 italic">
                          Dropdown category is empty. Edit Pinned Links to add shortcuts inside.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          }

          // Direct Button Link
          return (
            <a
              key={item.id}
              href={isFileScheme ? '#' : item.url}
              target={isFileScheme ? '_self' : '_blank'}
              rel="noopener noreferrer"
              onClick={(e) => {
                if (isFileScheme) {
                  e.preventDefault();
                  navigator.clipboard.writeText(item.url);
                  alert(`Browser Security Notice:\nHTTPS websites cannot launch local file:// links directly.\n\nThe file path has been copied to your clipboard:\n${item.url}`);
                }
              }}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-700/60 hover:border-sky-400/60 hover:bg-sky-500/10 transition-all duration-200 shadow-md group"
            >
              <RenderIcon icon={item.icon} defaultIcon="⭐" className="w-5 h-5 object-contain group-hover:scale-110 transition-transform flex-shrink-0" />
              <span className="text-xs font-medium text-slate-200 group-hover:text-sky-300 transition-colors truncate">{item.title}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
