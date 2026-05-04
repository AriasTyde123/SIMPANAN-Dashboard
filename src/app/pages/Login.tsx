import React, { useState } from 'react';
import {
  Lock, Eye, EyeOff, LogIn, Package, ShieldCheck,
  Bell, BarChart3, AlertCircle, CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DEMO_ACCOUNTS = [
  { email: 'ariqfakhrizakip@gmail.com', password: 'admin123', name: 'Admin', room: '-', role: 'admin' as const },
  { email: 'dierlyawan.wiguna@student.pradita.ac.id', password: 'simpanan123', name: 'Dierlyawan Wiguna', room: '302', role: 'tenant' as const },
  { email: 'miko.afrian@student.pradita.ac.id', password: 'simpanan123', name: 'Miko Afrian Perey', room: '115', role: 'tenant' as const },
];

const features = [
  { icon: <Lock className="w-5 h-5 text-cyan-400" />, title: 'Smart Locker Booking', desc: 'Reserve your locker instantly with a tap' },
  { icon: <ShieldCheck className="w-5 h-5 text-cyan-400" />, title: 'Secure Access Codes', desc: 'Auto-generated passwords sent to your courier' },
  { icon: <Bell className="w-5 h-5 text-cyan-400" />, title: 'Real-time Alerts', desc: 'Get notified the moment your package arrives' },
  { icon: <BarChart3 className="w-5 h-5 text-cyan-400" />, title: 'Full Activity Logs', desc: 'Monitor every event on your locker 24/7' },
];

export function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.success) {
      setError(result.message);
    } else {
      setSuccess(true);
    }
  };

  const fillDemo = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError('');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col w-[480px] flex-shrink-0 bg-[#0c1a2e] text-white p-10 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-400/3 rounded-full" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10 mb-5">
          <div className="w-10 h-10 rounded-xl bg-cyan-400 flex items-center justify-center">
            <Lock className="w-5.5 h-5.5 text-slate-900" />
          </div>
          <div>
            <div className="tracking-[0.18em] text-cyan-400" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
              S.I.M.P.A.N.A.N
            </div>
            <div className="text-slate-400" style={{ fontSize: '0.65rem', lineHeight: 1.2 }}>
              Smart Locker Management System
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div className="relative z-10 space-y-2">
          <h2 className="text-white" style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.3 }}>
            Protect Your Packages,<br />
            <span className="text-cyan-400">Anywhere, Anytime.</span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            The smart locker solution for boarding houses and offices — keeping your deliveries safe until you're ready to collect.
          </p>
        </div>

        {/* Features */}
        <div className="relative z-10 mt-8 space-y-4">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                {f.icon}
              </div>
              <div>
                <div className="text-sm text-white" style={{ fontWeight: 600 }}>{f.title}</div>
                <div className="text-xs text-slate-400">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="relative z-10 mt-auto pt-8 border-t border-white/10">
          <p className="text-xs text-slate-500">© 2026 S.I.M.P.A.N.A.N · Smart Locker System v1.0</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 p-6 sm:p-10 overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#0c1a2e] flex items-center justify-center">
            <Lock className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-[#0c1a2e] tracking-[0.15em]" style={{ fontWeight: 700, fontSize: '0.9rem' }}>
            S.I.M.P.A.N.A.N
          </div>
        </div>

        <div className="w-full max-w-md">
          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-slate-800" style={{ fontSize: '1.6rem' }}>Welcome back</h1>
            <p className="text-slate-500 text-sm mt-1">Sign in to manage your smart lockers</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider" style={{ fontWeight: 600 }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                placeholder="your@email.com"
                autoComplete="email"
                className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all
                  ${error ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-cyan-200 focus:border-cyan-400'}`}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider" style={{ fontWeight: 600 }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={`w-full px-4 py-3 pr-12 bg-white border rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all
                    ${error ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-cyan-200 focus:border-cyan-400'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <p className="text-sm text-emerald-600">Login successful! Redirecting…</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || success}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm transition-all
                ${loading || success
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-[#0c1a2e] hover:bg-slate-800 text-white shadow-sm hover:shadow-md'
                }`}
              style={{ fontWeight: 600 }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">Demo accounts</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Demo accounts */}
          <div className="space-y-2">
            {DEMO_ACCOUNTS.map(acc => (
              <button
                key={acc.email}
                type="button"
                onClick={() => fillDemo(acc)}
                className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 hover:border-cyan-300 hover:bg-cyan-50 rounded-xl transition-all text-left group"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${acc.role === 'admin' ? 'bg-amber-500 text-white' : 'bg-[#0c1a2e] text-cyan-400'}`} style={{ fontWeight: 700 }}>
                  {acc.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-slate-700 group-hover:text-slate-900 truncate" style={{ fontWeight: 600 }}>
                      {acc.name}
                    </div>
                    {acc.role === 'admin' && (
                      <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ fontWeight: 700 }}>ADMIN</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 truncate">{acc.email}{acc.room !== '-' ? ` · Room ${acc.room}` : ''}</div>
                </div>
                <span className="text-xs text-cyan-600 group-hover:text-cyan-700 flex-shrink-0" style={{ fontWeight: 600 }}>
                  Use →
                </span>
              </button>
            ))}
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            Tenant password: <span className="text-slate-600" style={{ fontFamily: 'monospace', fontWeight: 600 }}>simpanan123</span>
            {' · '}
            Admin password: <span className="text-slate-600" style={{ fontFamily: 'monospace', fontWeight: 600 }}>admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
}