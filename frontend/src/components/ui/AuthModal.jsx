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
    <div className="fixed inset-0 z-50 bg-[#20252b]/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="rea-card bg-white max-w-md w-full p-6 space-y-4 border border-[#e0e5e9] shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#e0e5e9]">
          <h3 className="text-xs font-semibold text-[#20252b] uppercase tracking-wider flex items-center">
            <Cloud className="w-3.5 h-3.5 text-[#294f82] mr-2" />
            Device Sync & Account
          </h3>
          <button onClick={onClose} className="text-[#5b6570] hover:text-[#20252b] transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#5b6570] leading-relaxed">
          Assessments are stored <strong>privately on this local machine</strong> by default. Creating or authenticating an account links your longitudinal records into the SQLite engine for cross-device access.
        </p>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-[#20252b] mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@university.edu"
              className="w-full px-3 py-2 rounded-md bg-[#fafbfc] border border-[#e0e5e9] text-xs text-[#20252b] focus:outline-none focus:border-[#294f82] focus:bg-white transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#20252b] mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-3 py-2 rounded-md bg-[#fafbfc] border border-[#e0e5e9] text-xs text-[#20252b] focus:outline-none focus:border-[#294f82] focus:bg-white transition"
            />
          </div>
        </div>

        {error && <div className="text-xs text-[#dc2626] font-mono-num">{error}</div>}

        <div className="flex space-x-2 pt-2">
          <button
            onClick={handleLogin}
            disabled={loading}
            className="flex-1 py-2 rounded-md text-xs font-medium bg-[#294f82] hover:bg-[#1e3a63] text-white transition cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
          <button
            onClick={handleRegister}
            disabled={loading}
            className="flex-1 py-2 rounded-md text-xs font-medium bg-white hover:bg-[#f4f6f8] text-[#20252b] border border-[#e0e5e9] transition cursor-pointer disabled:opacity-50"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
