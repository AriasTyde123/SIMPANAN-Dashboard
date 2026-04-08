import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  Locker, LogEntry, Notification,
  initialLockers, initialLogs, initialNotifications,
  LockerStatus,
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

    addLog({
      lockerId, timestamp: now,
      eventType: 'booking_created', severity: 'info',
      description: `Booking created by ${userName} (Room ${userRoom})`,
    });

    addLog({
      lockerId, timestamp: new Date(Date.now() + 5000).toISOString(),
      eventType: 'password_sent', severity: 'success',
      description: `Access password ${password} sent to user`,
    });

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

    addLog({
      lockerId, timestamp: now,
      eventType: 'unblocked', severity: 'success',
      description: `Locker unblocked by owner ${locker?.bookedBy ?? 'user'}. Wrong attempt counter reset.`,
    });

    addLog({
      lockerId, timestamp: now,
      eventType: 'password_reset', severity: 'info',
      description: `Access re-enabled. Courier may retry with the original password.`,
    });

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

  const markNotificationRead = (notifId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notifId ? { ...n, read: true } : n)
    );
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
