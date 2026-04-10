import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  Locker, LogEntry, Notification,
  initialLockers, initialLogs, initialNotifications,
  LockerStatus, LockerSize,
} from '../data/mockData';

interface AppContextType {
  lockers: Locker[];
  logs: LogEntry[];
  notifications: Notification[];
  bookLocker: (lockerId: string, userName: string, userRoom: string) => string;
  unblockLocker: (lockerId: string) => void;
  markNotificationRead: (notifId: string) => void;
  markAllRead: () => void;
  getLockerLogs: (lockerId: string) => LogEntry[];
  addLog: (entry: Omit<LogEntry, 'id'>) => void;
  unreadCount: number;
  addLocker: (data: { number: string; location: string; size: LockerSize }) => { success: boolean; message: string };
  updateLockerStatus: (lockerId: string, newStatus: LockerStatus) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function generatePassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let password = '';
  for (let i = 0; i < 6; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lockers, setLockers] = useState<Locker[]>(initialLockers);
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addLog = (entry: Omit<LogEntry, 'id'>) => {
    const newLog: LogEntry = { ...entry, id: 'log_' + generateId() };
    setLogs(prev => [...prev, newLog]);
  };

  const getLockerLogs = (lockerId: string): LogEntry[] => {
    return logs
      .filter(l => l.lockerId === lockerId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const bookLocker = (lockerId: string, userName: string, userRoom: string): string => {
    const password = generatePassword();
    const now = new Date().toISOString();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    setLockers(prev =>
      prev.map(l =>
        l.id === lockerId
          ? {
              ...l,
              status: 'booked' as LockerStatus,
              bookedBy: userName,
              bookedByRoom: userRoom,
              password,
              bookedAt: now,
              expiresAt: expires,
              wrongAttempts: 0,
            }
          : l
      )
    );

    const locker = lockers.find(l => l.id === lockerId)!;

    addLog({ lockerId, timestamp: now, eventType: 'booking_created', severity: 'info', description: `Booking created by ${userName} (Room ${userRoom})` });
    addLog({ lockerId, timestamp: new Date(Date.now() + 5000).toISOString(), eventType: 'password_sent', severity: 'success', description: `Access password ${password} sent to user` });

    setNotifications(prev => [
      {
        id: 'notif_' + generateId(),
        lockerId,
        lockerNumber: locker?.number ?? lockerId,
        title: `✅ Booking Confirmed — ${locker?.number ?? lockerId}`,
        description: `Your booking is confirmed. Password: ${password} has been generated and is ready to share with your courier.`,
        timestamp: now,
        read: false,
        type: 'info',
      },
      ...prev,
    ]);

    return password;
  };

  const unblockLocker = (lockerId: string) => {
    const now = new Date().toISOString();
    const locker = lockers.find(l => l.id === lockerId)!;

    setLockers(prev =>
      prev.map(l =>
        l.id === lockerId
          ? { ...l, status: 'booked' as LockerStatus, wrongAttempts: 0 }
          : l
      )
    );

    addLog({ lockerId, timestamp: now, eventType: 'unblocked', severity: 'success', description: `Locker unblocked by owner ${locker?.bookedBy ?? 'user'}. Wrong attempt counter reset.` });
    addLog({ lockerId, timestamp: now, eventType: 'password_reset', severity: 'info', description: `Access re-enabled. Courier may retry with the original password.` });

    setNotifications(prev => [
      {
        id: 'notif_' + generateId(),
        lockerId,
        lockerNumber: locker?.number ?? lockerId,
        title: `🔓 Locker ${locker?.number ?? lockerId} Unblocked`,
        description: `You have successfully unblocked Locker ${locker?.number ?? lockerId}. The courier can now retry entering the password.`,
        timestamp: now,
        read: false,
        type: 'success',
      },
      ...prev,
    ]);
  };

  const addLocker = (data: { number: string; location: string; size: LockerSize }) => {
    const exists = lockers.some(l => l.number.toLowerCase() === data.number.toLowerCase());
    if (exists) return { success: false, message: `Locker ${data.number} already exists.` };
    if (!data.number.trim() || !data.location.trim()) {
      return { success: false, message: 'Locker number and location are required.' };
    }
    const id = 'L' + (lockers.length + 1).toString().padStart(3, '0') + '_' + generateId();
    const newLocker: Locker = {
      id,
      number: data.number.trim().toUpperCase(),
      location: data.location.trim(),
      size: data.size,
      status: 'available',
      wrongAttempts: 0,
    };
    setLockers(prev => [...prev, newLocker]);
    addLog({ lockerId: id, timestamp: new Date().toISOString(), eventType: 'booking_created', severity: 'info', description: `Locker ${data.number} added by admin.` });
    return { success: true, message: `Locker ${data.number} added successfully.` };
  };

  const updateLockerStatus = (lockerId: string, newStatus: LockerStatus) => {
    const now = new Date().toISOString();
    const locker = lockers.find(l => l.id === lockerId)!;
    setLockers(prev =>
      prev.map(l => {
        if (l.id !== lockerId) return l;
        if (newStatus === 'available') {
          return { id: l.id, number: l.number, location: l.location, size: l.size, status: 'available', wrongAttempts: 0 };
        }
        return { ...l, status: newStatus };
      })
    );
    addLog({
      lockerId, timestamp: now,
      eventType: newStatus === 'blocked' ? 'blocked' : newStatus === 'available' ? 'unblocked' : 'booking_created',
      severity: newStatus === 'blocked' ? 'error' : newStatus === 'available' ? 'success' : 'info',
      description: `Admin changed locker status from "${locker?.status}" to "${newStatus}".`,
    });
    setNotifications(prev => [
      {
        id: 'notif_' + generateId(),
        lockerId,
        lockerNumber: locker?.number ?? lockerId,
        title: `🔧 Admin: Status Changed — ${locker?.number ?? lockerId}`,
        description: `Locker status was manually changed from "${locker?.status}" to "${newStatus}" by the admin.`,
        timestamp: now,
        read: false,
        type: newStatus === 'blocked' ? 'error' : newStatus === 'available' ? 'success' : 'info',
      },
      ...prev,
    ]);
  };

  const markNotificationRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider value={{
      lockers, logs, notifications,
      bookLocker, unblockLocker,
      markNotificationRead, markAllRead,
      getLockerLogs, addLog,
      unreadCount,
      addLocker,
      updateLockerStatus,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}