import React, { useState } from 'react';
import {
  UserPlus, Users, Shield, User2, Mail, Home,
  KeyRound, Eye, EyeOff, CheckCircle2, XCircle, X,
  Search,
} from 'lucide-react';
import { useAuth, AuthUser } from '../../context/AuthContext';

// ─── Add User Modal ────────────────────────────────────────────────────────────
function AddUserModal({ onClose }: { onClose: () => void }) {
  const { addUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [room, setRoom] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await addUser({ name, email, room, password }); 
    
    if (!result.success) {
      setError(result.message);
    } else {
      setSuccess(result.message);
      setTimeout(onClose, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-cyan-500" />
            <span className="text-slate-800" style={{ fontWeight: 600 }}>Add User Account</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider" style={{ fontWeight: 600 }}>
              Full Name *
            </label>
            <div className="relative">
              <User2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={name}
                onChange={e => { setName(e.target.value); setError(''); }}
                placeholder="e.g. Dewi Rahayu"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider" style={{ fontWeight: 600 }}>
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                placeholder="dewi@email.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
              />
            </div>
          </div>

          {/* Room */}
          <div>
            <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider" style={{ fontWeight: 600 }}>
              Room Number *
            </label>
            <div className="relative">
              <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={room}
                onChange={e => { setRoom(e.target.value); setError(''); }}
                placeholder="e.g. 505"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider" style={{ fontWeight: 600 }}>
              Initial Password *
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="Set a password for the user"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
              >
                {showPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-1">The user will use this to log in. Recommend sharing it securely.</p>
          </div>

          {/* Error / Success */}
          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <p className="text-sm text-emerald-600">{success}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 bg-[#0c1a2e] hover:bg-slate-800 text-white rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
              style={{ fontWeight: 600 }}
            >
              <UserPlus className="w-4 h-4" />
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── User Card ─────────────────────────────────────────────────────────────────
function UserCard({ user }: { user: AuthUser }) {
  const isAdmin = user.role === 'admin';
  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${isAdmin ? 'bg-amber-500 text-white' : 'bg-[#0c1a2e] text-cyan-400'}`} style={{ fontWeight: 700 }}>
        {user.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-800" style={{ fontWeight: 600 }}>{user.name}</span>
          {isAdmin ? (
            <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full flex items-center gap-1" style={{ fontWeight: 700 }}>
              <Shield className="w-2.5 h-2.5" />
              ADMIN
            </span>
          ) : (
            <span className="text-[10px] bg-cyan-100 text-cyan-700 px-1.5 py-0.5 rounded-full flex items-center gap-1" style={{ fontWeight: 700 }}>
              <User2 className="w-2.5 h-2.5" />
              TENANT
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Mail className="w-3 h-3" />{user.email}
          </span>
          {user.room !== '-' && (
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Home className="w-3 h-3" />Room {user.room}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export function ManageUsers() {
  const { users } = useAuth();
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'tenant' | 'admin'>('all');

  const tenants = users.filter(u => u.role === 'tenant');
  const admins = users.filter(u => u.role === 'admin');

  const filtered = users.filter(u => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchSearch = search === '' ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.room.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const statCards = [
    { label: 'Total Users', value: users.length, cls: 'bg-slate-100 text-slate-700' },
    { label: 'Tenants', value: tenants.length, cls: 'bg-cyan-100 text-cyan-700' },
    { label: 'Admins', value: admins.length, cls: 'bg-amber-100 text-amber-700' },
  ];

  const ROLE_TABS = [
    { key: 'all' as const, label: 'All', count: users.length },
    { key: 'tenant' as const, label: 'Tenants', count: tenants.length },
    { key: 'admin' as const, label: 'Admins', count: admins.length },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded-full uppercase tracking-wider" style={{ fontWeight: 700 }}>Admin</span>
            <h1 className="text-slate-800">Manage Users</h1>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">View and add tenant accounts for the system</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0c1a2e] hover:bg-slate-800 text-white rounded-xl text-sm transition-colors shadow-sm"
          style={{ fontWeight: 600 }}
        >
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {statCards.map(s => (
          <div key={s.label} className={`rounded-2xl p-4 flex items-center gap-3 ${s.cls}`}>
            <div style={{ fontWeight: 700, fontSize: '1.5rem' }}>{s.value}</div>
            <div className="text-sm opacity-80">{s.label}</div>
          </div>
        ))}
      </div>

      {/* User list */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, room…"
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
            />
          </div>
          <div className="flex gap-1.5">
            {ROLE_TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setRoleFilter(t.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${
                  roleFilter === t.key ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                style={{ fontWeight: 600 }}
              >
                {t.label}
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${roleFilter === t.key ? 'bg-white/20 text-white' : 'bg-white text-slate-600'}`}>
                  {t.count}
                </span>
              </button>
            ))}
            <span className="ml-auto text-xs text-slate-400 flex items-center pr-1">{filtered.length} users</span>
          </div>
        </div>

        {/* List */}
        <div className="max-h-[500px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No users match your search</p>
            </div>
          ) : (
            filtered.map(u => <UserCard key={u.id} user={u} />)
          )}
        </div>
      </div>

      {showAdd && <AddUserModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
