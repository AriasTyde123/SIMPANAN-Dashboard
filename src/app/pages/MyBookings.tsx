import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Lock, Package, AlertTriangle, MapPin, Clock, Copy, Check,
  Eye, UnlockKeyhole, BookMarked, ChevronRight, ShieldAlert,
  KeyRound, CalendarClock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Locker } from '../data/mockData';

function PasswordBadge({ password }: { password: string }) {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(password).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center gap-2 bg-slate-900 rounded-lg px-3 py-2 cursor-pointer select-none"
        onClick={() => setShow(!show)}
      >
        <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
        <span
          className="text-cyan-400 tracking-[0.2em]"
          style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.9rem' }}
        >
          {show ? password : '• • • • • •'}
        </span>
        <span className="text-slate-500 text-xs ml-1">{show ? 'hide' : 'show'}</span>
      </div>
      <button
        onClick={handleCopy}
        title="Copy password"
        className={`p-2 rounded-lg transition-all ${copied ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

function BookingCard({ locker, user }: { locker: Locker, user:string }) {
  const { unblockLocker } = useApp();
  const navigate = useNavigate();
  const [unblocking, setUnblocking] = useState(false);

  const handleUnblock = () => {
    setUnblocking(true);
    setTimeout(() => {
      unblockLocker(locker.id, user);
      setUnblocking(false);
    }, 800);
  };

  const statusConfig = {
    booked: { label: 'Booked — Awaiting Package', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-400' },
    filled: { label: 'Package Inside', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', dot: 'bg-blue-400' },
    blocked: { label: 'BLOCKED — Brute Force Detected', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', dot: 'bg-red-500' },
  };

  const cfg = statusConfig[locker.status as 'booked' | 'filled' | 'blocked'] ?? statusConfig.booked;

  const formatDate = (ts?: string) => {
    if (!ts) return '-';
    return new Date(ts).toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const isBlocked = locker.status === 'blocked';
  const isFilled = locker.status === 'filled';

  return (
    <div className={`bg-white rounded-2xl border-2 ${isBlocked ? 'border-red-300' : 'border-slate-100'} shadow-sm overflow-hidden`}>
      {/* Header */}
      <div className={`${isBlocked ? 'bg-red-50' : isFilled ? 'bg-blue-50' : 'bg-amber-50'} px-5 py-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isBlocked ? 'bg-red-100' : isFilled ? 'bg-blue-100' : 'bg-amber-100'}`}>
            {isBlocked
              ? <ShieldAlert className="w-6 h-6 text-red-600" />
              : isFilled
              ? <Package className="w-6 h-6 text-blue-600" />
              : <Lock className="w-6 h-6 text-amber-600" />
            }
          </div>
          <div>
            <div className="text-slate-800" style={{ fontWeight: 700, fontSize: '1.05rem' }}>{locker.number}</div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="w-3 h-3" />
              {locker.location}
            </div>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs ${cfg.color} ${cfg.bg} border ${cfg.border}`} style={{ fontWeight: 600 }}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${isBlocked ? 'animate-pulse' : ''}`} />
          {cfg.label}
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-4">
        {/* Blocked warning */}
        {isBlocked && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm text-red-700" style={{ fontWeight: 600 }}>Security Alert: Locker Blocked</div>
              <p className="text-xs text-red-600 mt-1">
                This locker was blocked after <strong>3 consecutive wrong password attempts</strong>.
                Someone may be trying to brute-force the password. As the locker owner, you can unblock it to allow your courier to try again.
              </p>
            </div>
          </div>
        )}

        {/* Password */}
        <div>
          <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider" style={{ fontWeight: 600 }}>Courier Access Password</div>
          {locker.password ? (
            <PasswordBadge password={locker.password} />
          ) : (
            <span className="text-sm text-slate-400">No password assigned</span>
          )}
          <p className="text-xs text-slate-400 mt-1.5">Share this password with your courier to allow them to deposit your package.</p>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="text-xs text-slate-400 mb-1">Locker Size</div>
            <div className="text-sm text-slate-700" style={{ fontWeight: 600 }}>
              {locker.size.charAt(0).toUpperCase() + locker.size.slice(1)}
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="text-xs text-slate-400 mb-1">Wrong Attempts</div>
            <div className={`text-sm flex items-center gap-1 ${locker.wrongAttempts === 3 ? 'text-red-600' : locker.wrongAttempts > 0 ? 'text-amber-600' : 'text-emerald-600'}`} style={{ fontWeight: 600 }}>
              {locker.wrongAttempts}/3
              {locker.wrongAttempts === 3 && <AlertTriangle className="w-3.5 h-3.5" />}
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="text-xs text-slate-400 mb-1 flex items-center gap-1"><CalendarClock className="w-3 h-3" /> Booked At</div>
            <div className="text-xs text-slate-700" style={{ fontWeight: 500 }}>{formatDate(locker.bookedAt)}</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="text-xs text-slate-400 mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Expires</div>
            <div className="text-xs text-slate-700" style={{ fontWeight: 500 }}>{formatDate(locker.expiresAt)}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={() => navigate(`/locker/${locker.id}`)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm transition-colors"
            style={{ fontWeight: 600 }}
          >
            <Eye className="w-4 h-4" />
            View Logs
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          </button>
          {isBlocked && (
            <button
              onClick={handleUnblock}
              disabled={unblocking}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-xl text-sm transition-colors"
              style={{ fontWeight: 600 }}
            >
              <UnlockKeyhole className="w-4 h-4" />
              {unblocking ? 'Unblocking…' : 'Unblock Locker'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function MyBookings() {
  const { lockers } = useApp();
  const { user } = useAuth();
  const myLockers = lockers.filter(l => l.bookedBy === user?.name);
  const blocked = myLockers.filter(l => l.status === 'blocked');
  const active = myLockers.filter(l => l.status !== 'blocked');

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-slate-800">My Bookings</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage your reserved lockers and access passwords
        </p>
      </div>

      {myLockers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
          <BookMarked className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <h3 className="text-slate-500">No Active Bookings</h3>
          <p className="text-sm text-slate-400 mt-2">You haven't booked any lockers yet. Go to the Dashboard to book one.</p>
        </div>
      ) : (
        <>
          {/* Blocked lockers */}
          {blocked.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert className="w-4 h-4 text-red-500" />
                <h2 className="text-red-600" style={{ fontSize: '0.95rem' }}>Requires Attention ({blocked.length})</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {blocked.map(l => <BookingCard key={l.id} locker={l} user={user?.name ?? 'Unknown'}/>)}
              </div>
            </div>
          )}

          {/* Active bookings */}
          {active.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-4 h-4 text-slate-500" />
                <h2 className="text-slate-600" style={{ fontSize: '0.95rem' }}>Active Bookings ({active.length})</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {active.map(l => <BookingCard key={l.id} locker={l} user={user?.name ?? 'Unknown'}/>)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}