import React, { useState } from 'react';
import axios from 'axios';
import { Lock, KeyRound, ShieldAlert, X } from 'lucide-react';

export default function VaultModal({ isOpen, onClose, onSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pin.trim()) return;

    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/auth/vault/verify', { pin });
      if (res.data.unlocked) {
        onSuccess && onSuccess();
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid Vault PIN / Password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-slate-900 border border-rose-500/40 rounded-2xl p-6 glass-panel shadow-2xl text-slate-100 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-200">
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 animate-pulse">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100">Unlock Encrypted Vault</h3>
            <p className="text-xs text-slate-400 mt-1">
              Enter your Master Password or Vault PIN to decrypt AES-256 protected links.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <input
              type="password"
              required
              autoFocus
              placeholder="Enter Vault Password or PIN..."
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700/60 rounded-xl px-4 py-3 pl-11 text-slate-100 text-sm outline-none focus:border-rose-400"
            />
            <KeyRound className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-sm shadow-lg transition flex items-center justify-center gap-2"
          >
            {loading ? 'Decrypting Vault...' : 'Unlock Vault'}
          </button>
        </form>
      </div>
    </div>
  );
}
