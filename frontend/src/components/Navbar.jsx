import React from 'react';
import { Command, Plus, Lock, Settings, HelpCircle, ShieldCheck, LogOut, User } from 'lucide-react';

export default function Navbar({
  user,
  vaultUnlocked,
  onOpenCmdPalette,
  onOpenAddBookmark,
  onOpenVaultModal,
  onOpenSettings,
  onOpenTutorial,
  onLogout
}) {
  return (
    <header role="banner" className="w-full max-w-7xl mx-auto px-4 sm:px-8 pt-4 pb-2 flex items-center justify-between border-b border-slate-800/60 relative z-30">
      {/* Brand Title */}
      <div className="flex items-center gap-3">
        <img
          src="/N3STLogo.png"
          alt="Nest 3.0 Logo"
          className="w-9 h-9 object-contain rounded-xl shadow-lg border border-sky-500/30 transition-transform hover:scale-105"
        />
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-100 flex items-center gap-2">
            Nest <span className="text-sky-400 text-xs px-2 py-0.5 rounded-full bg-sky-500/20 border border-sky-400/30">3.0</span>
          </h1>
        </div>
      </div>

      {/* Header Actions */}
      <nav aria-label="Main Navigation Actions" className="flex items-center gap-2 sm:gap-3">
        {/* Command Palette Hotkey Trigger */}
        <button
          type="button"
          onClick={onOpenCmdPalette}
          aria-label="Open Command Palette (Control K)"
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/70 text-slate-300 text-xs transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          title="Open Command Palette (Ctrl+K)"
        >
          <Command className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
          <span className="font-mono text-[11px] text-slate-400">Ctrl + K</span>
        </button>

        {/* Add Link Button */}
        <button
          type="button"
          onClick={onOpenAddBookmark}
          aria-label="Add new bookmark link"
          className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs shadow-lg transition flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span className="hidden xs:inline">Add Link</span>
        </button>

        {/* Vault Unlock Indicator / Trigger */}
        <button
          type="button"
          onClick={onOpenVaultModal}
          aria-label={vaultUnlocked ? 'Vault unlocked. Click to manage vault.' : 'Vault locked. Click to unlock private vault.'}
          aria-pressed={vaultUnlocked}
          className={`p-2 rounded-xl border transition flex items-center gap-1 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
            vaultUnlocked
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30'
              : 'bg-slate-900 border-slate-700/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
          title={vaultUnlocked ? 'Vault Unlocked' : 'Unlock Private Vault'}
        >
          {vaultUnlocked ? <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" /> : <Lock className="w-4 h-4" aria-hidden="true" />}
          <span className="hidden md:inline font-medium">{vaultUnlocked ? 'Vault Active' : 'Vault'}</span>
        </button>

        {/* Interactive Tutorial Trigger */}
        <button
          type="button"
          onClick={onOpenTutorial}
          aria-label="Start Interactive Tutorial Tour"
          className="p-2 rounded-xl bg-slate-900 border border-slate-700/70 text-slate-400 hover:text-sky-400 hover:bg-slate-800 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          title="Start Interactive Tutorial Tour"
        >
          <HelpCircle className="w-4 h-4" aria-hidden="true" />
        </button>

        {/* Settings Preferences Button */}
        <button
          type="button"
          onClick={onOpenSettings}
          aria-label="Open User Preferences and Settings"
          className="p-2 rounded-xl bg-slate-900 border border-slate-700/70 text-slate-400 hover:text-sky-400 hover:bg-slate-800 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          title="Open Preferences"
        >
          <Settings className="w-4 h-4" aria-hidden="true" />
        </button>

        {/* Logged In User Badge */}
        {user && (
          <div className="flex items-center gap-1 pl-1 sm:pl-2 border-l border-slate-800">
            <button
              type="button"
              onClick={onOpenSettings}
              aria-label={`User profile for ${user.username}. Open user preferences.`}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              title="View Profile & User Settings"
            >
              <User className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
              <span>{user.username}</span>
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
