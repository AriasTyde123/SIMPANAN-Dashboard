import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Lock, LockOpen, Package, AlertTriangle, XCircle, Plus,
  MapPin, Layers, Maximize2, Minimize2, Eye, Settings2,
  CheckCircle2, BookMarked, ShieldAlert, X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Locker, LockerStatus, LockerSize } from '../../data/mockData';

const STATUS_OPTIONS: { value: LockerStatus; label: string; color: string; bg: string; icon: React.ReactNode }[] = [
  { value: 'available', label: 'Available', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', icon: <LockOpen className="w-4 h-4 text-emerald-600" /> },
  { value: 'booked',    label: 'Booked',    color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200',   icon: <BookMarked className="w-4 h-4 text-amber-600" /> },
  { value: 'filled',    label: 'Filled',    color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200',     icon: <Package className="w-4 h-4 text-blue-600" /> },
  { value: 'blocked',   label: 'Blocked',   color: 'text-red-700',     bg: 'bg-red-50 border-red-200',       icon: <ShieldAlert className="w-4 h-4 text-red-600" /> },
];

const SIZE_OPTIONS: { value: LockerSize; label: string; icon: React.ReactNode }[] = [
  { value: 'small',  label: 'Small',  icon: <Minimize2 className="w-4 h-4" /> },
  { value: 'medium', label: 'Medium', icon: <Layers className="w-4 h-4" /> },
  { value: 'large',  label: 'Large',  icon: <Maximize2 className="w-4 h-4" /> },
];

// ─── Add Locker Modal ──────────────────────────────────────────────────────────
function AddLockerModal({ onClose }: { onClose: () => void }) {
  const { addLocker, lockers } = useApp();
  const [number, setNumber] = useState('');
  const [location, setLocation] = useState('');
  const [size, setSize] = useState<LockerSize>('small');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const existingLocations = [...new Set(lockers.map(l => l.location.split(' - ')[0]))];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = await addLocker({ number: number.trim(), location: location.trim(), size });
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
            <Plus className="w-5 h-5 text-cyan-500" />
            <span className="text-slate-800" style={{ fontWeight: 600 }}>Add New Locker</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Locker Number */}
          <div>
            <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider" style={{ fontWeight: 600 }}>
              Locker Number *
            </label>
            <input
              value={number}
              onChange={e => { setNumber(e.target.value); setError(''); }}
              placeholder="e.g. L-017"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-300"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider" style={{ fontWeight: 600 }}>
              Location *
            </label>
            <input
              value={location}
              onChange={e => { setLocation(e.target.value); setError(''); }}
              placeholder="e.g. Ground Floor - C"
              list="locations"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-300"
            />
            <datalist id="locations">
              {existingLocations.map(l => <option key={l} value={l} />)}
            </datalist>
            <p className="text-xs text-slate-400 mt-1">Existing: {existingLocations.join(', ')}</p>
          </div>

          {/* Size */}
          <div>
            <label className="block text-xs text-slate-500 mb-2 uppercase tracking-wider" style={{ fontWeight: 600 }}>
              Size *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SIZE_OPTIONS.map(s => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSize(s.value)}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 border-2 rounded-xl text-sm transition-all ${
                    size === s.value
                      ? 'border-cyan-400 bg-cyan-50 text-cyan-700'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                  }`}
                  style={{ fontWeight: size === s.value ? 700 : 500 }}
                >
                  {s.icon}
                  {s.label}
                </button>
              ))}
            </div>
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
              <Plus className="w-4 h-4" />
              Add Locker
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Change Status Modal ───────────────────────────────────────────────────────
function ChangeStatusModal({ locker, onClose }: { locker: Locker; onClose: () => void }) {
  const { updateLockerStatus } = useApp();
  const [selected, setSelected] = useState<LockerStatus>(locker.status);
  const [done, setDone] = useState(false);

  const handleApply = () => {
    updateLockerStatus(locker.id, selected);
    setDone(true);
    setTimeout(onClose, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-amber-500" />
            <span className="text-slate-800" style={{ fontWeight: 600 }}>Change Status — {locker.number}</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Warning */}
          <div className="flex gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              Changing to <strong>Available</strong> will release the locker and clear all booking data.
              Other status changes are overrides only.
            </p>
          </div>

          {/* Current status */}
          <div className="text-xs text-slate-500 mb-1">
            Current: <span className="text-slate-700" style={{ fontWeight: 600 }}>{locker.status}</span>
            {locker.bookedBy && <span className="ml-2 text-slate-400">({locker.bookedBy})</span>}
          </div>

          {/* Status options */}
          <div className="grid grid-cols-2 gap-2">
            {STATUS_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelected(opt.value)}
                className={`flex items-center gap-2 p-3 border-2 rounded-xl text-sm transition-all ${
                  selected === opt.value
                    ? `${opt.bg} border-current ${opt.color}`
                    : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300'
                }`}
                style={{ fontWeight: selected === opt.value ? 700 : 500 }}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>

          {done && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <p className="text-sm text-emerald-600">Status updated to <strong>{selected}</strong>!</p>
            </div>
          )}

          {/* Actions */}
          {!done && (
            <div className="flex gap-3 pt-1">
              <button onClick={onClose} className="flex-1 py-2.5 px-4 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={selected === locker.status}
                className="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                style={{ fontWeight: 600 }}
              >
                <Settings2 className="w-4 h-4" />
                Apply Change
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Locker Row ────────────────────────────────────────────────────────────────
function LockerRow({ locker, onChangeStatus }: { locker: Locker; onChangeStatus: (l: Locker) => void }) {
  const navigate = useNavigate();
  const statusCfg = STATUS_OPTIONS.find(s => s.value === locker.status)!;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
      {/* Locker info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${statusCfg.bg}`}>
          {statusCfg.icon}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-slate-800" style={{ fontWeight: 700 }}>{locker.number}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${statusCfg.bg} ${statusCfg.color}`} style={{ fontWeight: 600 }}>
              {statusCfg.label}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
            <MapPin className="w-3 h-3" />
            {locker.location}
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-3 text-xs text-slate-500 sm:w-48">
        <span>Size: <span className="text-slate-700" style={{ fontWeight: 600 }}>{locker.size.charAt(0).toUpperCase() + locker.size.slice(1)}</span></span>
        {locker.bookedBy && (
          <span className="truncate">Tenant: <span className="text-slate-700" style={{ fontWeight: 600 }}>{locker.bookedBy}</span></span>
        )}
        {locker.wrongAttempts > 0 && (
          <span className="text-red-600 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            {locker.wrongAttempts}/3 wrong
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 sm:flex-shrink-0">
        <button
          onClick={() => navigate(`/locker/${locker.id}`)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs transition-colors"
          style={{ fontWeight: 600 }}
        >
          <Eye className="w-3.5 h-3.5" />
          View Logs
        </button>
        <button
          onClick={() => onChangeStatus(locker)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-xs transition-colors"
          style={{ fontWeight: 600 }}
        >
          <Settings2 className="w-3.5 h-3.5" />
          Change Status
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export function ManageLockers() {
  const { lockers } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [editLocker, setEditLocker] = useState<Locker | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | LockerStatus>('all');

  const stats = {
    total: lockers.length,
    available: lockers.filter(l => l.status === 'available').length,
    booked: lockers.filter(l => l.status === 'booked').length,
    filled: lockers.filter(l => l.status === 'filled').length,
    blocked: lockers.filter(l => l.status === 'blocked').length,
  };

  const filtered = lockers.filter(l => {
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    const matchSearch = search === '' ||
      l.number.toLowerCase().includes(search.toLowerCase()) ||
      l.location.toLowerCase().includes(search.toLowerCase()) ||
      (l.bookedBy ?? '').toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const statCards = [
    { label: 'Total', value: stats.total, cls: 'bg-slate-100 text-slate-700' },
    { label: 'Available', value: stats.available, cls: 'bg-emerald-100 text-emerald-700' },
    { label: 'Occupied', value: stats.booked + stats.filled, cls: 'bg-blue-100 text-blue-700' },
    { label: 'Blocked', value: stats.blocked, cls: 'bg-red-100 text-red-700' },
  ];

  const FILTER_TABS = [
    { key: 'all' as const, label: 'All', count: stats.total },
    { key: 'available' as const, label: 'Available', count: stats.available },
    { key: 'booked' as const, label: 'Booked', count: stats.booked },
    { key: 'filled' as const, label: 'Filled', count: stats.filled },
    { key: 'blocked' as const, label: 'Blocked', count: stats.blocked },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded-full uppercase tracking-wider" style={{ fontWeight: 700 }}>Admin</span>
            <h1 className="text-slate-800">Manage Lockers</h1>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">Add lockers and change their operational status</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0c1a2e] hover:bg-slate-800 text-white rounded-xl text-sm transition-colors shadow-sm"
          style={{ fontWeight: 600 }}
        >
          <Plus className="w-4 h-4" />
          Add Locker
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map(s => (
          <div key={s.label} className={`rounded-2xl p-4 flex items-center gap-3 ${s.cls}`}>
            <div style={{ fontWeight: 700, fontSize: '1.5rem' }}>{s.value}</div>
            <div className="text-sm opacity-80">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Locker table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 space-y-3">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search lockers, locations, tenants…"
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
            {FILTER_TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setStatusFilter(t.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${
                  statusFilter === t.key ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                style={{ fontWeight: 600 }}
              >
                {t.label}
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${statusFilter === t.key ? 'bg-white/20 text-white' : 'bg-white text-slate-600'}`}>
                  {t.count}
                </span>
              </button>
            ))}
            <span className="ml-auto text-xs text-slate-400 flex items-center pr-1">{filtered.length} lockers</span>
          </div>
        </div>

        {/* List */}
        <div className="max-h-[560px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Lock className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No lockers match your filters</p>
            </div>
          ) : (
            filtered.map(l => (
              <LockerRow key={l.id} locker={l} onChangeStatus={setEditLocker} />
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      {showAdd && <AddLockerModal onClose={() => setShowAdd(false)} />}
      {editLocker && <ChangeStatusModal locker={editLocker} onClose={() => setEditLocker(null)} />}
    </div>
  );
}