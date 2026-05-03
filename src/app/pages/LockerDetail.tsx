import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  ArrowLeft, Lock, LockOpen, Package, AlertTriangle, ShieldAlert,
  MapPin, Clock, KeyRound, Copy, Check, Eye, EyeOff,
  DoorOpen, DoorClosed, PackageCheck, PackageX, UnlockKeyhole,
  Activity, Info, CheckCircle2, XCircle, RefreshCw, CalendarClock,
  ShieldX, Video, Trash2, TriangleAlert, LockKeyholeOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { LogEntry, LogEventType } from '../data/mockData';
import { CameraFeed } from '../components/CameraFeed';

const eventConfig: Record<LogEventType, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  door_opened: {
    label: 'Door Opened', color: 'text-emerald-700', bg: 'bg-emerald-50',
    icon: <DoorOpen className="w-4 h-4" />,
  },
  door_closed: {
    label: 'Door Closed', color: 'text-slate-700', bg: 'bg-slate-50',
    icon: <DoorClosed className="w-4 h-4" />,
  },
  wrong_password: {
    label: 'Wrong Password', color: 'text-amber-700', bg: 'bg-amber-50',
    icon: <XCircle className="w-4 h-4" />,
  },
  blocked: {
    label: 'Locker Blocked', color: 'text-red-700', bg: 'bg-red-100',
    icon: <ShieldAlert className="w-4 h-4" />,
  },
  item_detected: {
    label: 'Item Detected', color: 'text-blue-700', bg: 'bg-blue-50',
    icon: <PackageCheck className="w-4 h-4" />,
  },
  item_removed: {
    label: 'Item Removed', color: 'text-purple-700', bg: 'bg-purple-50',
    icon: <PackageX className="w-4 h-4" />,
  },
  door_ajar: {
    label: 'Door Not Closed', color: 'text-orange-700', bg: 'bg-orange-50',
    icon: <AlertTriangle className="w-4 h-4" />,
  },
  unblocked: {
    label: 'Locker Unblocked', color: 'text-emerald-700', bg: 'bg-emerald-100',
    icon: <UnlockKeyhole className="w-4 h-4" />,
  },
  booking_created: {
    label: 'Booking Created', color: 'text-cyan-700', bg: 'bg-cyan-50',
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  booking_cancelled: {
    label: 'Booking Cancelled', color: 'text-orange-700', bg: 'bg-orange-50',
    icon: <AlertTriangle className="w-4 h-4" />,
  },
  locker_deleted: {
    label: 'Locker Deleted', color: 'text-orange-700', bg: 'bg-orange-50',
    icon: <Trash2 className="w-4 h-4" />,
  },
  password_sent: {
    label: 'Password Sent', color: 'text-indigo-700', bg: 'bg-indigo-50',
    icon: <KeyRound className="w-4 h-4" />,
  },
  password_reset: {
    label: 'Password Reset', color: 'text-teal-700', bg: 'bg-teal-50',
    icon: <RefreshCw className="w-4 h-4" />,
  },
};

const severityDot: Record<string, string> = {
  info: 'bg-blue-400',
  success: 'bg-emerald-400',
  warning: 'bg-amber-400',
  error: 'bg-red-500',
};

function LogRow({ log }: { log: LogEntry }) {
  const cfg = eventConfig[log.eventType] ?? {
    label: log.eventType, color: 'text-slate-700', bg: 'bg-slate-50',
    icon: <Info className="w-4 h-4" />,
  };

  const formatTs = (ts: string) => {
    const d = new Date(ts);
    return {
      date: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
  };

  const { date, time } = formatTs(log.timestamp);

  return (
    <div className="flex gap-4 py-4 border-b border-slate-50 last:border-0 group hover:bg-slate-50/50 px-5 -mx-5 rounded-lg transition-colors">
      {/* Timeline dot */}
      <div className="flex flex-col items-center flex-shrink-0 pt-1">
        <div className={`w-2 h-2 rounded-full ${severityDot[log.severity]}`} />
        <div className="flex-1 w-px bg-slate-100 mt-1 min-h-[20px] group-last:hidden" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start gap-2 mb-1">
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs ${cfg.color} ${cfg.bg}`} style={{ fontWeight: 600 }}>
            {cfg.icon}
            {cfg.label}
          </span>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">{log.description}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="text-xs text-slate-400">{date}</span>
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Clock className="w-3 h-3" />
            {time}
          </span>
        </div>
      </div>
    </div>
  );
}

export function LockerDetail() {
  const { id } = useParams<{ id: string }>();
  const { lockers, getLockerLogs, unblockLocker, cancelBooking, openLockerFromAdmin } = useApp();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const locker = lockers.find(l => l.id === id);
  const logs = getLockerLogs(id ?? '');

  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [unblocking, setUnblocking] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'warning' | 'error'>('all');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [opening, setOpening] = useState(false);
  const [openError, setOpenError] = useState<string | null>(null);
  const [openSuccess, setOpenSuccess] = useState(false);

  if (!locker) {
    return (
      <div className="p-6 text-center">
        <Lock className="w-12 h-12 mx-auto mb-4 text-slate-300" />
        <h3 className="text-slate-500">Locker not found</h3>
        <button onClick={() => navigate('/')} className="mt-4 text-cyan-600 text-sm">← Back to Dashboard</button>
      </div>
    );
  }

  const isOwner = locker.bookedBy === user?.name;
  const canAccess = isAdmin || isOwner;

  // Access denied for regular users viewing someone else's locker
  if (!canAccess) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldX className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-slate-800 mb-2">Access Restricted</h2>
        <p className="text-sm text-slate-500 max-w-sm">
          You don't have permission to view details for <strong>{locker.number}</strong>.
          You can only access lockers that are booked under your account.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <button
            onClick={() => navigate('/my-bookings')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0c1a2e] hover:bg-slate-800 text-white rounded-xl text-sm transition-colors"
            style={{ fontWeight: 600 }}
          >
            View My Bookings
          </button>
        </div>
      </div>
    );
  }

  const isBlocked = locker.status === 'blocked';

  const handleCopy = () => {
    if (locker.password) {
      navigator.clipboard.writeText(locker.password).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUnblock = () => {
    setUnblocking(true);
    setTimeout(() => {
      unblockLocker(locker!.id, user?.name ?? 'Unknown');
      setUnblocking(false);
    }, 800);
  };

  const handleCancelBooking = async (lockerId: string) => {
    try {
      setCancelling(true);
      setCancelError(null);
      await new Promise(res => setTimeout(res, 700));

      const result = await cancelBooking(lockerId, user?.name ?? 'User', isAdmin);

      if (!result.success) throw new Error(result.message);

      setShowCancelModal(false);
      navigate('/my-bookings');
    } catch (error: any) {
      setCancelError(error.message ?? 'Failed to cancel booking.');
    } finally {
      setCancelling(false);
    }
  };

  const handleOpenLocker = async (lockerId: string) => {
    try {
      setOpening(true);
      setOpenError(null);
      setOpenSuccess(false);
      const result = await openLockerFromAdmin(lockerId);
      if (!result.success) throw new Error(result.message);
      setOpenSuccess(true);
    } catch (error: any) {
      setOpenError(error.message ?? 'Failed to open locker.');
    } finally {
      setOpening(false);
    }
  };

  const filteredLogs = filterSeverity === 'all'
    ? logs
    : logs.filter(l => l.severity === filterSeverity);

  const statusConfig = {
    available: { label: 'Available', color: 'text-emerald-700', bg: 'bg-emerald-100', icon: <LockOpen className="w-5 h-5 text-emerald-600" /> },
    booked: { label: 'Booked', color: 'text-amber-700', bg: 'bg-amber-100', icon: <Lock className="w-5 h-5 text-amber-600" /> },
    filled: { label: 'Filled', color: 'text-blue-700', bg: 'bg-blue-100', icon: <Package className="w-5 h-5 text-blue-600" /> },
    blocked: { label: 'Blocked', color: 'text-red-700', bg: 'bg-red-100', icon: <ShieldAlert className="w-5 h-5 text-red-600" /> },
  };
  const sCfg = statusConfig[locker.status];

  const formatDate = (ts?: string) => {
    if (!ts) return '-';
    return new Date(ts).toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const logStats = {
    total: logs.length,
    warnings: logs.filter(l => l.severity === 'warning').length,
    errors: logs.filter(l => l.severity === 'error').length,
    wrongAttempts: logs.filter(l => l.eventType === 'wrong_password').length,
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Back + Header */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-slate-800">{locker.number}</h1>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${sCfg.color} ${sCfg.bg}`} style={{ fontWeight: 600 }}>
                {sCfg.icon}
                {sCfg.label}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
              <MapPin className="w-3.5 h-3.5" />
              {locker.location}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Admin: Open Locker (any status) */}
            {isAdmin && (
              <button
                onClick={() => { setOpenError(null); setOpenSuccess(false); setShowOpenModal(true); }}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#0c1a2e] hover:bg-slate-800 text-white rounded-xl text-sm transition-colors"
                style={{ fontWeight: 600 }}
              >
                <LockKeyholeOpen className="w-4 h-4" />
                Open Locker
              </button>
            )}

            {/* Cancel booking — only owner, only when status is 'booked' */}
            {(isOwner || isAdmin) && locker.status === 'booked' && (
              <button
                onClick={() => { setCancelError(null); setShowCancelModal(true); }}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-xl text-sm transition-colors"
                style={{ fontWeight: 600 }}
              >
                <Trash2 className="w-4 h-4" />
                Cancel Booking
              </button>
            )}

            {/* Unblock — admin or owner when blocked */}
            {(isAdmin || isOwner) && isBlocked && (
              <button
                onClick={handleUnblock}
                disabled={unblocking}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-xl text-sm transition-colors"
                style={{ fontWeight: 600 }}
              >
                <UnlockKeyhole className="w-4 h-4" />
                {unblocking ? 'Unblocking…' : 'Unblock Locker'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Admin: Open Locker Modal ── */}
      {showOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#0c1a2e]/10 flex items-center justify-center flex-shrink-0">
                <LockKeyholeOpen className="w-5 h-5 text-[#0c1a2e]" />
              </div>
              <div>
                <h3 className="text-slate-800" style={{ fontWeight: 700 }}>Open Locker Remotely?</h3>
                <p className="text-sm text-slate-500 mt-0.5">Admin override — no PIN required.</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Locker</span>
                <span style={{ fontWeight: 600 }}>{locker.number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Location</span>
                <span style={{ fontWeight: 600 }}>{locker.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <span className={`${sCfg.color}`} style={{ fontWeight: 600 }}>{sCfg.label}</span>
              </div>
              {locker.bookedBy && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Tenant</span>
                  <span style={{ fontWeight: 600 }}>{locker.bookedBy}</span>
                </div>
              )}
            </div>

            {/* Success */}
            {openSuccess && (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5 text-sm text-emerald-700">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                Locker <strong>{locker.number}</strong> has been opened successfully.
              </div>
            )}

            {/* Error */}
            {openError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-sm text-red-600">
                <XCircle className="w-4 h-4 flex-shrink-0" />
                {openError}
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => { setShowOpenModal(false); setOpenError(null); setOpenSuccess(false); }}
                disabled={opening}
                className="flex-1 py-2.5 px-4 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                {openSuccess ? 'Close' : 'Cancel'}
              </button>
              {!openSuccess && (
                <button
                  onClick={() => handleOpenLocker(locker.id)}
                  disabled={opening}
                  className="flex-1 py-2.5 px-4 bg-[#0c1a2e] hover:bg-slate-800 disabled:opacity-60 text-white rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                  style={{ fontWeight: 600 }}
                >
                  {opening ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Opening…
                    </>
                  ) : (
                    <>
                      <LockKeyholeOpen className="w-4 h-4" />
                      Yes, Open It
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Booking Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            {/* Icon + title */}
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <TriangleAlert className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-slate-800" style={{ fontWeight: 700 }}>Cancel Booking?</h3>
                <p className="text-sm text-slate-500 mt-0.5">This action cannot be undone.</p>
              </div>
            </div>

            {/* Info */}
            <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Locker</span>
                <span style={{ fontWeight: 600 }}>{locker.number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Location</span>
                <span style={{ fontWeight: 600 }}>{locker.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Booked by</span>
                <span style={{ fontWeight: 600 }}>{locker.bookedBy}</span>
              </div>
            </div>

            <p className="text-sm text-slate-600">
              Cancelling will <strong>immediately release</strong> this locker and invalidate the access password.
              The locker will become available for others to book.
            </p>

            {/* Error */}
            {cancelError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-sm text-red-600">
                <XCircle className="w-4 h-4 flex-shrink-0" />
                {cancelError}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => { setShowCancelModal(false); setCancelError(null); }}
                disabled={cancelling}
                className="flex-1 py-2.5 px-4 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Keep Booking
              </button>
              <button
                onClick={() => handleCancelBooking(locker.id)}
                disabled={cancelling}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                style={{ fontWeight: 600 }}
              >
                {cancelling ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Cancelling…
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Yes, Cancel
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Info panel */}
        <div className="space-y-4">
          {/* ── Live Camera Feed ── visible to admin always, or to owner when status is booked/filled/blocked ── */}
          {locker.cameraUrl && (isAdmin || (isOwner && locker.status !== 'available')) && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-cyan-500" />
                  <h3 className="text-slate-700">Live Camera</h3>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">ESP32-CAM</span>
              </div>
              <div className="p-3">
                <CameraFeed
                  cameraUrl={locker.cameraUrl}
                  lockerNumber={locker.number}
                  expandable={true}
                />
              </div>
            </div>
          )}

          {/* Blocked alert */}
          {isBlocked && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                <span className="text-red-700" style={{ fontWeight: 700 }}>Security Alert!</span>
              </div>
              <p className="text-sm text-red-600">
                This locker has been <strong>blocked</strong> due to 3 consecutive wrong password attempts. A potential brute-force attack was detected.
              </p>
              {isOwner && (
                <button
                  onClick={handleUnblock}
                  disabled={unblocking}
                  className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-lg text-sm transition-colors"
                  style={{ fontWeight: 600 }}
                >
                  <UnlockKeyhole className="w-4 h-4" />
                  {unblocking ? 'Unblocking…' : 'Unblock Now'}
                </button>
              )}
            </div>
          )}

          {/* Locker details */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
            <h3 className="text-slate-700">Locker Details</h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-sm text-slate-500">Locker ID</span>
                <span className="text-sm text-slate-800" style={{ fontWeight: 600 }}>{locker.number}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-sm text-slate-500">Location</span>
                <span className="text-sm text-slate-800" style={{ fontWeight: 600 }}>{locker.location}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-sm text-slate-500">Size</span>
                <span className="text-sm text-slate-800" style={{ fontWeight: 600 }}>{locker.size.charAt(0).toUpperCase() + locker.size.slice(1)}</span>
              </div>
              {locker.bookedBy && (
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500">Tenant</span>
                  <span className="text-sm text-slate-800" style={{ fontWeight: 600 }}>{locker.bookedBy}</span>
                </div>
              )}
              {locker.bookedByRoom && (
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500">Room</span>
                  <span className="text-sm text-slate-800" style={{ fontWeight: 600 }}>Room {locker.bookedByRoom}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-sm text-slate-500">Wrong Attempts</span>
                <span className={`text-sm flex items-center gap-1 ${locker.wrongAttempts === 3 ? 'text-red-600' : locker.wrongAttempts > 0 ? 'text-amber-600' : 'text-emerald-600'}`} style={{ fontWeight: 600 }}>
                  {locker.wrongAttempts}/3
                  {locker.wrongAttempts > 0 && <AlertTriangle className="w-3.5 h-3.5" />}
                </span>
              </div>
              {locker.bookedAt && (
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500">Booked At</span>
                  <span className="text-xs text-slate-700" style={{ fontWeight: 500 }}>{formatDate(locker.bookedAt)}</span>
                </div>
              )}
              {locker.expiresAt && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-slate-500">Expires</span>
                  <span className="text-xs text-slate-700" style={{ fontWeight: 500 }}>{formatDate(locker.expiresAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Password (owner or admin can see) */}
          {(isOwner || isAdmin) && locker.password && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
              <h3 className="text-slate-700">Access Password</h3>
              <div className="bg-slate-900 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 mb-1 uppercase tracking-widest">Courier Password</div>
                  <div
                    className="text-cyan-400 tracking-[0.25em]"
                    style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '1.3rem' }}
                  >
                    {showPassword ? locker.password : '••••••'}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleCopy}
                    className={`p-2 rounded-lg transition-colors ${copied ? 'bg-emerald-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-400">Share this password with your courier. Do not share it with anyone else.</p>
            </div>
          )}

          {/* Stats */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="text-slate-700 mb-3">Activity Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <div className="text-xl text-slate-800" style={{ fontWeight: 700 }}>{logStats.total}</div>
                <div className="text-xs text-slate-500">Total Events</div>
              </div>
              <div className="bg-amber-50 rounded-xl p-3 text-center">
                <div className="text-xl text-amber-700" style={{ fontWeight: 700 }}>{logStats.warnings}</div>
                <div className="text-xs text-amber-600">Warnings</div>
              </div>
              <div className="bg-red-50 rounded-xl p-3 text-center">
                <div className="text-xl text-red-700" style={{ fontWeight: 700 }}>{logStats.errors}</div>
                <div className="text-xs text-red-600">Errors</div>
              </div>
              <div className="bg-orange-50 rounded-xl p-3 text-center">
                <div className="text-xl text-orange-700" style={{ fontWeight: 700 }}>{logStats.wrongAttempts}</div>
                <div className="text-xs text-orange-600">Wrong PW</div>
              </div>
            </div>
          </div>
        </div>

        {/* Logs panel */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-500" />
                <h3 className="text-slate-800">Activity Log</h3>
                <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>
                  {filteredLogs.length} events
                </span>
              </div>
              {/* Filter */}
              <div className="sm:ml-auto flex gap-2">
                {(['all', 'warning', 'error'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilterSeverity(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                      filterSeverity === f
                        ? f === 'all' ? 'bg-slate-900 text-white'
                          : f === 'warning' ? 'bg-amber-500 text-white'
                          : 'bg-red-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                    style={{ fontWeight: 600 }}
                  >
                    {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1) + 's'}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 max-h-[600px] overflow-y-auto">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Activity className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No activity logs yet</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {filteredLogs.map(log => <LogRow key={log.id} log={log} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}