import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Lock, LockOpen, Package, AlertTriangle, Search,
  Filter, RefreshCw, Eye, CheckCircle2, XCircle,
  BookMarked, Layers, MapPin, Maximize2, Minimize2, Settings2, Shield,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Locker, LockerStatus } from '../data/mockData';
import { BookingModal } from '../components/BookingModal';

type FilterTab = 'all' | LockerStatus;

const statusConfig: Record<LockerStatus, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  available: {
    label: 'Available', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-300',
    icon: <LockOpen className="w-3.5 h-3.5" />,
  },
  booked: {
    label: 'Booked', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-300',
    icon: <BookMarked className="w-3.5 h-3.5" />,
  },
  filled: {
    label: 'Filled', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-300',
    icon: <Package className="w-3.5 h-3.5" />,
  },
  blocked: {
    label: 'Blocked', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-300',
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
};

const sizeConfig: Record<string, { label: string; icon: React.ReactNode }> = {
  small: { label: 'S', icon: <Minimize2 className="w-3 h-3" /> },
  medium: { label: 'M', icon: <Layers className="w-3 h-3" /> },
  large: { label: 'L', icon: <Maximize2 className="w-3 h-3" /> },
};

function StatCard({ title, value, icon, color, sub }: { title: string; value: number; icon: React.ReactNode; color: string; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl text-slate-800" style={{ fontWeight: 700 }}>{value}</div>
        <div className="text-sm text-slate-500">{title}</div>
        {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

function LockerCard({ locker, onBook, onView, onChangeStatus, currentUserName, isAdmin }: {
  locker: Locker;
  onBook: (l: Locker) => void;
  onView: (l: Locker) => void;
  onChangeStatus?: (l: Locker) => void;
  currentUserName: string;
  isAdmin: boolean;
}) {
  const cfg = statusConfig[locker.status];
  const sizeCfg = sizeConfig[locker.size];
  const isMyLocker = locker.bookedBy === currentUserName;
  const canViewDetail = isAdmin || isMyLocker;

  const borderColor = {
    available: 'border-emerald-200 hover:border-emerald-400',
    booked: 'border-amber-200 hover:border-amber-400',
    filled: 'border-blue-200 hover:border-blue-400',
    blocked: 'border-red-200 hover:border-red-400',
  }[locker.status];

  const headerBg = {
    available: 'bg-emerald-50',
    booked: 'bg-amber-50',
    filled: 'bg-blue-50',
    blocked: 'bg-red-50',
  }[locker.status];

  const lockerIcon = {
    available: <LockOpen className="w-7 h-7 text-emerald-500" />,
    booked: <Lock className="w-7 h-7 text-amber-500" />,
    filled: <Package className="w-7 h-7 text-blue-500" />,
    blocked: <AlertTriangle className="w-7 h-7 text-red-500" />,
  }[locker.status];

  return (
    <div className={`bg-white rounded-2xl border-2 ${borderColor} transition-all duration-200 shadow-sm hover:shadow-md flex flex-col overflow-hidden`}>
      {/* Header */}
      <div className={`${headerBg} px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          {lockerIcon}
          <div>
            <div className="text-sm text-slate-800" style={{ fontWeight: 700 }}>{locker.number}</div>
            <div className="flex items-center gap-1 text-slate-500" style={{ fontSize: '10px' }}>
              <MapPin className="w-2.5 h-2.5" />
              {locker.location}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${cfg.color} ${cfg.bg} border ${cfg.border}`} style={{ fontWeight: 600 }}>
            {cfg.icon}
            {cfg.label}
          </span>
          {isMyLocker && (
            <span className="text-[9px] bg-cyan-100 text-cyan-700 px-1.5 py-0.5 rounded-full" style={{ fontWeight: 600 }}>
              MINE
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3 flex-1 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Size</span>
          <span className={`flex items-center gap-1 ${cfg.color}`} style={{ fontWeight: 600 }}>
            {sizeCfg.icon}
            {locker.size.charAt(0).toUpperCase() + locker.size.slice(1)}
          </span>
        </div>
        {locker.bookedBy && (
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Tenant</span>
            <span className="text-slate-700" style={{ fontWeight: 500 }}>{locker.bookedBy}</span>
          </div>
        )}
        {locker.bookedByRoom && (
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Room</span>
            <span className="text-slate-700" style={{ fontWeight: 500 }}>Room {locker.bookedByRoom}</span>
          </div>
        )}
        {locker.status === 'blocked' && (
          <div className="flex items-center gap-1 bg-red-50 text-red-600 px-2 py-1.5 rounded-lg text-xs" style={{ fontWeight: 500 }}>
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
            3 wrong attempts detected
          </div>
        )}
        {locker.wrongAttempts > 0 && locker.status !== 'blocked' && (
          <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1.5 rounded-lg text-xs" style={{ fontWeight: 500 }}>
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
            {locker.wrongAttempts}/3 wrong attempts
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 flex gap-2 flex-wrap">
        {locker.status === 'available' ? (
          <button
            onClick={() => onBook(locker)}
            className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            style={{ fontWeight: 600 }}
          >
            <BookMarked className="w-3.5 h-3.5" />
            Book Now
          </button>
        ) : canViewDetail ? (
          <button
            onClick={() => onView(locker)}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            style={{ fontWeight: 600 }}
          >
            <Eye className="w-3.5 h-3.5" />
            View Details
          </button>
        ) : (
          <div className="flex-1 text-center text-xs text-slate-400 py-2">
            Occupied
          </div>
        )}
        {isAdmin && locker.status !== 'available' && onChangeStatus && (
          <button
            onClick={() => onChangeStatus(locker)}
            className="bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs py-2 px-2.5 rounded-lg border border-amber-200 transition-colors flex items-center gap-1"
            style={{ fontWeight: 600 }}
          >
            <Settings2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Change Status Modal (inline in Dashboard) ──────────────────────────────
function ChangeStatusModal({ locker, onClose }: { locker: Locker; onClose: () => void }) {
  const { updateLockerStatus } = useApp();
  const [selected, setSelected] = useState<LockerStatus>(locker.status);
  const [done, setDone] = useState(false);

  const options: { value: LockerStatus; label: string; color: string; bg: string }[] = [
    { value: 'available', label: 'Available', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
    { value: 'booked',    label: 'Booked',    color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200' },
    { value: 'filled',    label: 'Filled',    color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200' },
    { value: 'blocked',   label: 'Blocked',   color: 'text-red-700',     bg: 'bg-red-50 border-red-200' },
  ];

  const handleApply = () => {
    updateLockerStatus(locker.id, selected);
    setDone(true);
    setTimeout(onClose, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-amber-500" />
            <span className="text-slate-800" style={{ fontWeight: 600 }}>Change Status — {locker.number}</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              Setting to <strong>Available</strong> will release the locker and clear all booking data.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {options.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelected(opt.value)}
                className={`flex items-center justify-center gap-2 p-3 border-2 rounded-xl text-sm transition-all ${
                  selected === opt.value
                    ? `${opt.bg} border-current ${opt.color}`
                    : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300'
                }`}
                style={{ fontWeight: selected === opt.value ? 700 : 500 }}
              >
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
          {!done && (
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-2.5 px-4 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
              <button
                onClick={handleApply}
                disabled={selected === locker.status}
                className="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white rounded-xl text-sm flex items-center justify-center gap-2"
                style={{ fontWeight: 600 }}
              >
                <Settings2 className="w-4 h-4" />
                Apply
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const { lockers, logs } = useApp();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');
  const [bookingLocker, setBookingLocker] = useState<Locker | null>(null);
  const [statusLocker, setStatusLocker] = useState<Locker | null>(null);

  const stats = {
    total: lockers.length,
    available: lockers.filter(l => l.status === 'available').length,
    booked: lockers.filter(l => l.status === 'booked').length,
    filled: lockers.filter(l => l.status === 'filled').length,
    blocked: lockers.filter(l => l.status === 'blocked').length,
  };

  const filtered = lockers.filter(l => {
    const matchFilter = filter === 'all' || l.status === filter;
    const matchSearch = search === '' ||
      l.number.toLowerCase().includes(search.toLowerCase()) ||
      l.location.toLowerCase().includes(search.toLowerCase()) ||
      (l.bookedBy ?? '').toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  // Group by location
  const grouped = filtered.reduce<Record<string, Locker[]>>((acc, l) => {
    const loc = l.location.split(' - ')[0];
    if (!acc[loc]) acc[loc] = [];
    acc[loc].push(l);
    return acc;
  }, {});

  const recentLogs = [...logs]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 6);

  const severityColors: Record<string, string> = {
    info: 'bg-blue-100 text-blue-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    error: 'bg-red-100 text-red-700',
  };

  const tabs: { key: FilterTab; label: string; count: number; color: string }[] = [
    { key: 'all', label: 'All Lockers', count: stats.total, color: 'text-slate-600' },
    { key: 'available', label: 'Available', count: stats.available, color: 'text-emerald-600' },
    { key: 'booked', label: 'Booked', count: stats.booked, color: 'text-amber-600' },
    { key: 'filled', label: 'Filled', count: stats.filled, color: 'text-blue-600' },
    { key: 'blocked', label: 'Blocked', count: stats.blocked, color: 'text-red-600' },
  ];

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ' ' +
      d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1" style={{ fontWeight: 700 }}>
                <Shield className="w-3 h-3" />
                Admin View
              </span>
            )}
            <h1 className="text-slate-800">Dashboard</h1>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            {isAdmin
              ? 'Full locker overview — admin controls enabled'
              : <>Welcome back, <span className="text-slate-700" style={{ fontWeight: 600 }}>{user?.name}</span> — Room {user?.room}</>
            }
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 rounded-lg px-3 py-2">
          <RefreshCw className="w-3.5 h-3.5 text-cyan-500" />
          Live — updated just now
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard title="Total Lockers" value={stats.total} color="bg-slate-100"
          icon={<Lock className="w-6 h-6 text-slate-600" />} />
        <StatCard title="Available" value={stats.available} color="bg-emerald-100"
          icon={<LockOpen className="w-6 h-6 text-emerald-600" />}
          sub="Ready to book" />
        <StatCard title="Occupied" value={stats.booked + stats.filled} color="bg-blue-100"
          icon={<Package className="w-6 h-6 text-blue-600" />}
          sub={`${stats.booked} booked, ${stats.filled} filled`} />
        <StatCard title="Blocked" value={stats.blocked} color="bg-red-100"
          icon={<AlertTriangle className="w-6 h-6 text-red-600" />}
          sub={stats.blocked > 0 ? "Needs attention" : "All clear"} />
      </div>

      {/* Locker Grid + Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Locker Grid */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-slate-100">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search lockers, rooms, tenants…"
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  />
                </div>
              </div>
              {/* Filter tabs */}
              <div className="flex gap-1 mt-3 overflow-x-auto pb-1 no-scrollbar">
                {tabs.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all
                      ${filter === tab.key
                        ? 'bg-slate-900 text-white shadow-sm'
                        : `bg-slate-100 ${tab.color} hover:bg-slate-200`
                      }`}
                    style={{ fontWeight: 600 }}
                  >
                    {tab.label}
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${filter === tab.key ? 'bg-white/20 text-white' : 'bg-white text-slate-600'}`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Locker groups */}
            <div className="p-4 space-y-5 max-h-[600px] overflow-y-auto">
              {Object.entries(grouped).length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Lock className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>No lockers match your search</p>
                </div>
              ) : (
                Object.entries(grouped).map(([loc, items]) => (
                  <div key={loc}>
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs text-slate-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>{loc}</span>
                      <div className="flex-1 h-px bg-slate-100" />
                      <span className="text-xs text-slate-400">{items.length} units</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {items.map(locker => (
                        <LockerCard
                          key={locker.id}
                          locker={locker}
                          onBook={setBookingLocker}
                          onView={l => navigate(`/locker/${l.id}`)}
                          onChangeStatus={isAdmin ? setStatusLocker : undefined}
                          currentUserName={user?.name ?? ''}
                          isAdmin={isAdmin}
                        />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-slate-800">Recent Activity</h3>
              <span className="text-xs text-slate-400">All lockers</span>
            </div>
            <div className="divide-y divide-slate-50">
              {recentLogs.map(log => {
                const locker = lockers.find(l => l.id === log.lockerId);
                return (
                  <div key={log.id} className="px-4 py-3 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <span className={`mt-0.5 text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0 ${severityColors[log.severity]}`} style={{ fontWeight: 600 }}>
                        {log.severity.toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs text-slate-700 leading-snug">{log.description}</div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[10px] text-cyan-600" style={{ fontWeight: 600 }}>
                            {locker?.number ?? log.lockerId}
                          </span>
                          <span className="text-[10px] text-slate-400">{formatTime(log.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="px-4 py-3 border-t border-slate-100">
              <button
                onClick={() => navigate('/notifications')}
                className="text-xs text-cyan-600 hover:text-cyan-700 w-full text-center"
                style={{ fontWeight: 600 }}
              >
                View all notifications →
              </button>
            </div>
          </div>

          {/* Quick legend */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <div className="text-xs text-slate-500 mb-3 uppercase tracking-wider" style={{ fontWeight: 600 }}>Status Legend</div>
            <div className="space-y-2">
              {Object.entries(statusConfig).map(([key, cfg]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                    key === 'available' ? 'bg-emerald-400' :
                    key === 'booked' ? 'bg-amber-400' :
                    key === 'filled' ? 'bg-blue-400' : 'bg-red-400'
                  }`} />
                  <span className={`text-xs ${cfg.color}`} style={{ fontWeight: 600 }}>{cfg.label}</span>
                  <span className="text-xs text-slate-400">—</span>
                  <span className="text-xs text-slate-500">
                    {key === 'available' ? 'Ready to be booked' :
                     key === 'booked' ? 'Reserved, awaiting package' :
                     key === 'filled' ? 'Package inside' : '3 wrong attempts, locked'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {bookingLocker && (
        <BookingModal locker={bookingLocker} onClose={() => setBookingLocker(null)} />
      )}

      {/* Change Status Modal (admin) */}
      {statusLocker && (
        <ChangeStatusModal locker={statusLocker} onClose={() => setStatusLocker(null)} />
      )}
    </div>
  );
}