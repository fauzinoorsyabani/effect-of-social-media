import React, { useState } from 'react';
import { Cloud, X } from 'lucide-react';
import { registerAccount, loginAccount } from '../../services/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleLogin() {
    if (!email || !password) {
      setError('Please provide email and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await loginAccount(email, password);
      if (res.success) {
        onAuthSuccess({ email: res.email, user_id: res.user_id, token: res.token });
        onClose();
      } else {
        setError(res.error || 'Invalid credentials');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister() {
    if (!email || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await registerAccount(email, password);
      if (res.success) {
        onAuthSuccess({ email: res.email, user_id: res.user_id });
        alert('Account registered successfully! Cloud sync enabled.');
        onClose();
      } else {
        setError(res.error || 'Registration failed');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="glass-card bg-white max-w-md w-full p-6 space-y-5 border border-slate-200 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center">
            <Cloud className="w-4 h-4 text-emerald-600 mr-2" />
            Account & Device Sync
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          By default, your assessments are saved <strong>privately on this device only</strong>. Create or log in to a
          free account if you want to sync your tracking history across your laptop and smartphone.
        </p>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@university.edu"
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
            />
          </div>
        </div>

        {error && <div className="text-xs text-rose-600">{error}</div>}

        <div className="flex space-x-3 pt-2">
          <button
            onClick={handleLogin}
            disabled={loading}
            className="flex-1 py-2 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Sign In'}
          </button>
          <button
            onClick={handleRegister}
            disabled={loading}
            className="flex-1 py-2 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer disabled:opacity-50"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
