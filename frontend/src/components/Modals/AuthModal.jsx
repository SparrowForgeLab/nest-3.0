import React, { useState } from 'react';
import axios from 'axios';
import { LogIn, UserPlus, Shield, Lock, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function AuthModal({ isOpen, onAuthSuccess }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    const endpoint = isRegisterMode ? '/api/auth/register' : '/api/auth/login';

    try {
      const res = await axios.post(endpoint, {
        username: username.trim(),
        password: password.trim()
      });

      if (res.data.success) {
        if (res.data.token) {
          localStorage.setItem('nest3_token', res.data.token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        }
        setSuccessMsg(isRegisterMode ? 'Account created successfully! Welcome to Nest 3.0.' : 'Signed in successfully!');
        setTimeout(() => {
          onAuthSuccess && onAuthSuccess(res.data.user);
        }, 600);
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Authentication failed. Please try again.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/90 rounded-3xl p-6 sm:p-8 glass-panel shadow-2xl text-slate-100 relative">
        {/* Brand & Header */}
        <div className="text-center space-y-3 mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-600 flex items-center justify-center text-slate-950 font-black text-2xl shadow-xl shadow-sky-500/20">
            N
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-100 flex items-center justify-center gap-2">
              Nest <span className="text-sky-400 text-xs px-2.5 py-0.5 rounded-full bg-sky-500/20 border border-sky-400/30 font-bold">3.0</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Personalized Multi-User Dashboard & Vault Manager
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(false);
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
              !isRegisterMode
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" /> Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(true);
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
              isRegisterMode
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> Create Account
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-medium flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-medium flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                autoFocus
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !username.trim() || !password.trim()}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-sky-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin" /> Authenticating...
              </span>
            ) : isRegisterMode ? (
              <span className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" /> Create My Account
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <LogIn className="w-4 h-4" /> Sign In To Dashboard
              </span>
            )}
          </button>
        </form>

        {/* Security Footer Notice */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-center flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <Shield className="w-3.5 h-3.5 text-sky-400" />
          <span>Each user gets their own isolated bookmarks, dock, & preferences.</span>
        </div>
      </div>
    </div>
  );
}
