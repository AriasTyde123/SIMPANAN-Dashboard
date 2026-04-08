import React from 'react';
import { useNavigate } from 'react-router';
import {
  Bell, BellOff, ShieldAlert, AlertTriangle, Package,
  CheckCircle2, Info, ChevronRight, CheckCheck, Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Notification } from '../data/mockData';

const typeConfig = {
  error: {
    icon: <ShieldAlert className="w-5 h-5 text-red-500" />,
    bg: 'bg-red-50', border: 'border-red-200',
    dot: 'bg-red-500',
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    bg: 'bg-amber-50', border: 'border-amber-200',
    dot: 'bg-amber-400',
  },
  success: {
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    bg: 'bg-emerald-50', border: 'border-emerald-200',
    dot: 'bg-emerald-400',
  },
  info: {
    icon: <Info className="w-5 h-5 text-blue-500" />,
    bg: 'bg-blue-50', border: 'border-blue-200',
    dot: 'bg-blue-400',
  },
};

function NotifCard({ notif, onRead }: { notif: Notification; onRead: (id: string) => void }) {
  const navigate = useNavigate();
  const cfg = typeConfig[notif.type];

  const formatTs = (ts: string) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };

  const handleClick = () => {
    onRead(notif.id);
    navigate(`/locker/${notif.lockerId}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`flex gap-4 p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-md
        ${notif.read ? 'bg-white border-slate-100' : `${cfg.bg} ${cfg.border}`}
      `}
    >
      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${notif.read ? 'bg-slate-100' : cfg.bg} border ${notif.read ? 'border-slate-200' : cfg.border}`}>
        {notif.read
          ? <Bell className="w-5 h-5 text-slate-400" />
          : cfg.icon
        }
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className={`text-sm ${notif.read ? 'text-slate-600' : 'text-slate-800'}`} style={{ fontWeight: notif.read ? 400 : 600 }}>
            {notif.title}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {!notif.read && (
              <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
            )}
            <span className="text-xs text-slate-400">{formatTs(notif.timestamp)}</span>
          </div>
        </div>
        <p className={`text-sm mt-1 leading-relaxed ${notif.read ? 'text-slate-400' : 'text-slate-600'}`}>
          {notif.description}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1 text-xs text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>
            <Lock className="w-3 h-3" />
            {notif.lockerNumber}
          </div>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            View details <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
}

export function Notifications() {
  const { notifications, markNotificationRead, markAllRead, unreadCount } = useApp();

  const unread = notifications.filter(n => !n.read);
  const read = notifications.filter(n => n.read);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-slate-800">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full" style={{ fontWeight: 700 }}>
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Alerts and updates from your locker bookings
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm transition-colors"
            style={{ fontWeight: 600 }}
          >
            <CheckCheck className="w-4 h-4" />
            Mark All Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
          <BellOff className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <h3 className="text-slate-500">No Notifications</h3>
          <p className="text-sm text-slate-400 mt-2">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Unread */}
          {unread.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-slate-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>New ({unread.length})</span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>
              <div className="space-y-3">
                {unread.map(n => (
                  <NotifCard key={n.id} notif={n} onRead={markNotificationRead} />
                ))}
              </div>
            </div>
          )}

          {/* Read */}
          {read.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-slate-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Earlier ({read.length})</span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>
              <div className="space-y-3">
                {read.map(n => (
                  <NotifCard key={n.id} notif={n} onRead={markNotificationRead} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
