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
      <div className="clean-card bg-white max-w-md w-full p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3">
          <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center">
            <Cloud className="w-3.5 h-3.5 text-blue-600 mr-2" />
            Device Sync & Account
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Assessments are stored <strong>privately on this local device</strong> by default. Creating or authenticating an account links your longitudinal records into the SQLite engine for cross-device access.
        </p>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-800 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@university.edu"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-800 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition"
            />
          </div>
        </div>

        {error && <div className="text-xs text-rose-600 font-mono-num">{error}</div>}

        <div className="flex space-x-2 pt-2">
          <button
            onClick={handleLogin}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer disabled:opacity-50 shadow-xs"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
          <button
            onClick={handleRegister}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer disabled:opacity-50"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
