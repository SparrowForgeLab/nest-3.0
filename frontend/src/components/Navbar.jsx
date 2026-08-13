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
    <header className="w-full max-w-7xl mx-auto px-4 sm:px-8 pt-4 pb-2 flex items-center justify-between border-b border-slate-800/60 relative z-30">
      {/* Brand Title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center text-slate-950 font-black text-lg shadow-lg">
          N
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-100 flex items-center gap-2">
            Nest <span className="text-sky-400 text-xs px-2 py-0.5 rounded-full bg-sky-500/20 border border-sky-400/30">3.0</span>
          </h1>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Command Palette Hotkey Trigger */}
        <button
          onClick={onOpenCmdPalette}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/70 text-slate-300 text-xs transition"
          title="Open Command Palette (Ctrl+K)"
        >
          <Command className="w-3.5 h-3.5 text-sky-400" />
          <span className="font-mono text-[11px] text-slate-400">Ctrl + K</span>
        </button>

        {/* Add Link Button */}
        <button
          onClick={onOpenAddBookmark}
          className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs shadow-lg transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden xs:inline">Add Link</span>
        </button>

        {/* Vault Unlock Indicator / Trigger */}
        <button
          onClick={onOpenVaultModal}
          className={`p-2 rounded-xl border transition flex items-center gap-1 text-xs ${
            vaultUnlocked
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30'
              : 'bg-slate-900 border-slate-700/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
          title={vaultUnlocked ? 'Vault Unlocked' : 'Unlock Private Vault'}
        >
          {vaultUnlocked ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4" />}
          <span className="hidden md:inline font-medium">{vaultUnlocked ? 'Vault Active' : 'Vault'}</span>
        </button>

        {/* Interactive Tutorial Trigger */}
        <button
          onClick={onOpenTutorial}
          className="p-2 rounded-xl bg-slate-900 border border-slate-700/70 text-slate-400 hover:text-sky-400 hover:bg-slate-800 transition"
          title="Start Interactive Tutorial Tour"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Settings Preferences Button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl bg-slate-900 border border-slate-700/70 text-slate-400 hover:text-sky-400 hover:bg-slate-800 transition"
          title="Open Preferences"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Logged In User Badge & Logout */}
        {user && (
          <div className="flex items-center gap-1 pl-1 sm:pl-2 border-l border-slate-800">
            <span className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
              <User className="w-3.5 h-3.5 text-sky-400" />
              <span>{user.username}</span>
            </span>
            {onLogout && (
              <button
                onClick={onLogout}
                className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
