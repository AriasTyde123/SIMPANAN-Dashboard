import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  Activity, Filter, Search, ArrowLeft,
  DoorOpen, DoorClosed, XCircle, ShieldAlert, PackageCheck,
  PackageX, AlertTriangle, UnlockKeyhole, CheckCircle2,
  KeyRound, RefreshCw, Info, Clock, Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LogEntry, LogEventType, LogSeverity } from '../../data/mockData';

const eventConfig: Record<LogEventType, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  door_opened:     { label: 'Door Opened',     color: 'text-emerald-700', bg: 'bg-emerald-50', icon: <DoorOpen className="w-3.5 h-3.5" /> },
  door_closed:     { label: 'Door Closed',     color: 'text-slate-700',   bg: 'bg-slate-50',   icon: <DoorClosed className="w-3.5 h-3.5" /> },
  wrong_password:  { label: 'Wrong Password',  color: 'text-amber-700',   bg: 'bg-amber-50',   icon: <XCircle className="w-3.5 h-3.5" /> },
  blocked:         { label: 'Locker Blocked',  color: 'text-red-700',     bg: 'bg-red-100',    icon: <ShieldAlert className="w-3.5 h-3.5" /> },
  item_detected:   { label: 'Item Detected',   color: 'text-blue-700',    bg: 'bg-blue-50',    icon: <PackageCheck className="w-3.5 h-3.5" /> },
  item_removed:    { label: 'Item Removed',    color: 'text-purple-700',  bg: 'bg-purple-50',  icon: <PackageX className="w-3.5 h-3.5" /> },
  door_ajar:       { label: 'Door Ajar',       color: 'text-orange-700',  bg: 'bg-orange-50',  icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  unblocked:       { label: 'Unblocked',       color: 'text-emerald-700', bg: 'bg-emerald-100',icon: <UnlockKeyhole className="w-3.5 h-3.5" /> },
  booking_created: { label: 'Booking Created', color: 'text-cyan-700',    bg: 'bg-cyan-50',    icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  booking_cancelled: { label: 'Booking Cancelled', color: 'text-red-700', bg: 'bg-red-100', icon: <XCircle className="w-3.5 h-3.5" /> },
  password_sent:   { label: 'Password Sent',   color: 'text-indigo-700',  bg: 'bg-indigo-50',  icon: <KeyRound className="w-3.5 h-3.5" /> },
  password_reset:  { label: 'Password Reset',  color: 'text-teal-700',    bg: 'bg-teal-50',    icon: <RefreshCw className="w-3.5 h-3.5" /> },
};

const severityDot: Record<LogSeverity, string> = {
  info:    'bg-blue-400',
  success: 'bg-emerald-400',
  warning: 'bg-amber-400',
  error:   'bg-red-500',
};

const severityBadge: Record<LogSeverity, string> = {
  info:    'bg-blue-100 text-blue-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  error:   'bg-red-100 text-red-700',
};

function formatTs(ts: string) {
  const d = new Date(ts);
  return {
    date: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
}

function LogRow({ log, lockerNumber, onClick }: { log: LogEntry; lockerNumber: string; onClick: () => void }) {
  const cfg = eventConfig[log.eventType] ?? { label: log.eventType, color: 'text-slate-700', bg: 'bg-slate-50', icon: <Info className="w-3.5 h-3.5" /> };
  const { date, time } = formatTs(log.timestamp);

  return (
    <div
      onClick={onClick}
      className="flex gap-4 py-3.5 px-5 border-b border-slate-50 last:border-0 hover:bg-slate-50/70 cursor-pointer transition-colors group"
    >
      {/* Timeline dot */}
      <div className="flex flex-col items-center flex-shrink-0 pt-1.5">
        <div className={`w-2 h-2 rounded-full ${severityDot[log.severity]}`} />
      </div>
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-0.5">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs ${cfg.color} ${cfg.bg}`} style={{ fontWeight: 600 }}>
            {cfg.icon}
            {cfg.label}
          </span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${severityBadge[log.severity]}`} style={{ fontWeight: 600 }}>
            {log.severity.toUpperCase()}
          </span>
          <button className="ml-auto text-[10px] text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-full flex items-center gap-1 group-hover:bg-cyan-100 transition-colors" style={{ fontWeight: 600 }}>
            <Lock className="w-2.5 h-2.5" />
            {lockerNumber}
          </button>
        </div>
        <p className="text-sm text-slate-600 leading-snug">{log.description}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-slate-400">{date}</span>
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Clock className="w-3 h-3" />
            {time}
          </span>
        </div>
      </div>
    </div>
  );
}

const SEVERITY_FILTERS: { key: 'all' | LogSeverity; label: string; color: string }[] = [
  { key: 'all',     label: 'All',      color: 'text-slate-600' },
  { key: 'error',   label: 'Errors',   color: 'text-red-600' },
  { key: 'warning', label: 'Warnings', color: 'text-amber-600' },
  { key: 'success', label: 'Success',  color: 'text-emerald-600' },
  { key: 'info',    label: 'Info',     color: 'text-blue-600' },
];

export function AdminLogs() {
  const { logs, lockers } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | LogSeverity>('all');
  const [lockerFilter, setLockerFilter] = useState<string>('all');

  const lockerMap = useMemo(() => {
    const m: Record<string, string> = {};
    lockers.forEach(l => { m[l.id] = l.number; });
    return m;
  }, [lockers]);

  const filtered = useMemo(() => {
    return [...logs]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .filter(log => {
        const matchSeverity = severityFilter === 'all' || log.severity === severityFilter;
        const matchLocker = lockerFilter === 'all' || log.lockerId === lockerFilter;
        const matchSearch = search === '' ||
          log.description.toLowerCase().includes(search.toLowerCase()) ||
          (lockerMap[log.lockerId] ?? '').toLowerCase().includes(search.toLowerCase());
        return matchSeverity && matchLocker && matchSearch;
      });
  }, [logs, severityFilter, lockerFilter, search, lockerMap]);

  const stats = useMemo(() => ({
    total: logs.length,
    errors: logs.filter(l => l.severity === 'error').length,
    warnings: logs.filter(l => l.severity === 'warning').length,
    wrongAttempts: logs.filter(l => l.eventType === 'wrong_password').length,
  }), [logs]);

  const statCards = [
    { label: 'Total Events', value: stats.total, cls: 'bg-slate-100 text-slate-700' },
    { label: 'Errors', value: stats.errors, cls: 'bg-red-100 text-red-700' },
    { label: 'Warnings', value: stats.warnings, cls: 'bg-amber-100 text-amber-700' },
    { label: 'Wrong Attempts', value: stats.wrongAttempts, cls: 'bg-orange-100 text-orange-700' },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded-full uppercase tracking-wider" style={{ fontWeight: 700 }}>Admin</span>
            <h1 className="text-slate-800">All Activity Logs</h1>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">Complete activity history across all lockers</p>
        </div>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map(s => (
          <div key={s.label} className={`rounded-2xl p-4 flex items-center gap-3 ${s.cls}`}>
            <div style={{ fontWeight: 700, fontSize: '1.5rem' }}>{s.value}</div>
            <div className="text-sm opacity-80">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Main panel */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search logs, locker numbers…"
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
              />
            </div>
            {/* Locker filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <select
                value={lockerFilter}
                onChange={e => setLockerFilter(e.target.value)}
                className="text-sm border border-slate-200 bg-slate-50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-300 text-slate-700"
              >
                <option value="all">All Lockers</option>
                {lockers.map(l => (
                  <option key={l.id} value={l.id}>{l.number} — {l.location}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Severity tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
            {SEVERITY_FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setSeverityFilter(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${
                  severityFilter === f.key ? 'bg-slate-900 text-white shadow-sm' : `bg-slate-100 ${f.color} hover:bg-slate-200`
                }`}
                style={{ fontWeight: 600 }}
              >
                {f.label}
              </button>
            ))}
            <span className="ml-auto text-xs text-slate-400 flex items-center pr-1">{filtered.length} events</span>
          </div>
        </div>

        {/* Log list */}
        <div className="max-h-[600px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Activity className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No logs match your filters</p>
            </div>
          ) : (
            filtered.map(log => (
              <LogRow
                key={log.id}
                log={log}
                lockerNumber={lockerMap[log.lockerId] ?? log.lockerId}
                onClick={() => navigate(`/locker/${log.lockerId}`)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
