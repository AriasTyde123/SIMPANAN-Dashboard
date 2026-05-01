import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '../../lib/supabase'; // Pastikan path import ini sesuai dengan file supabase-mu
import { Locker, LogEntry, Notification, LockerStatus, LockerSize } from '../data/mockData';

interface AppContextType {
  lockers: Locker[];
  logs: LogEntry[];
  notifications: Notification[];
  bookLocker: (lockerId: string, userName: string, userRoom: string) => Promise<string>;
  cancelBooking: (lockerId: string, cancelledBy: string) => Promise<{ success: boolean; message: string }>;
  unblockLocker: (lockerId: string) => Promise<void>;
  markNotificationRead: (notifId: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  getLockerLogs: (lockerId: string) => LogEntry[];
  addLog: (entry: Omit<LogEntry, 'id'>) => Promise<void>;
  unreadCount: number;
  addLocker: (data: { number: string; location: string; size: LockerSize }) => Promise<{ success: boolean; message: string }>;
  updateLockerStatus: (lockerId: string, newStatus: LockerStatus) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function generatePassword(): string {
  const chars = '4567890BCD';
  let password = '';
  for (let i = 0; i < 6; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const fetchAllData = async () => {
    const { data: dbLockers } = await supabase.from('lockers').select('*');
    if (dbLockers) {
      setLockers(dbLockers.map(l => ({
        id: l.id, number: l.number, location: l.location, size: l.size as LockerSize, status: l.status as LockerStatus,
        bookedBy: l.booked_by, bookedByRoom: l.booked_by_room, password: l.password,
        bookedAt: l.booked_at, expiresAt: l.expires_at, wrongAttempts: l.wrong_attempts, cameraUrl: l.camera_url
      })));
    }

    const { data: dbLogs } = await supabase.from('logs').select('*').order('timestamp', { ascending: false });
    if (dbLogs) {
      setLogs(dbLogs.map(l => ({
        id: l.id, lockerId: l.locker_id, timestamp: l.timestamp, eventType: l.event_type, description: l.description, severity: l.severity
      })));
    }

    const { data: dbNotifs } = await supabase.from('notifications').select('*').order('timestamp', { ascending: false });
    if (dbNotifs) {
      setNotifications(dbNotifs.map(n => ({
        id: n.id, lockerId: n.locker_id, lockerNumber: n.locker_number, title: n.title, description: n.description,
        timestamp: n.timestamp, read: n.read, type: n.type
      })));
    }
  };

  useEffect(() => {
    fetchAllData(); 
    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lockers' }, fetchAllData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'logs' }, fetchAllData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, fetchAllData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);


  const addLog = async (entry: Omit<LogEntry, 'id'>) => {
    await supabase.from('logs').insert({
      locker_id: entry.lockerId,
      event_type: entry.eventType,
      description: entry.description,
      severity: entry.severity
    });
  };

  const getLockerLogs = (lockerId: string): LogEntry[] => {
    return logs.filter(l => l.lockerId === lockerId);
  };

  const bookLocker = async (lockerId: string, userName: string, userRoom: string): Promise<string> => {
    const password = generatePassword();
    const now = new Date().toISOString();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    
    const locker = lockers.find(l => l.id === lockerId);

    await supabase.from('lockers').update({
      status: 'booked',
      booked_by: userName,
      booked_by_room: userRoom,
      password: password,
      booked_at: now,
      expires_at: expires,
      wrong_attempts: 0
    }).eq('id', lockerId);

    await addLog({ lockerId, timestamp: now, eventType: 'booking_created', severity: 'info', description: `Booking created by ${userName} (Room ${userRoom})` });
    await addLog({ lockerId, timestamp: now, eventType: 'password_sent', severity: 'success', description: `Access password ${password} sent to user` });

    await supabase.from('notifications').insert({
      locker_id: lockerId,
      locker_number: locker?.number ?? lockerId,
      title: `✅ Booking Confirmed — ${locker?.number ?? lockerId}`,
      description: `Your booking is confirmed. Password: ${password} has been generated and is ready to share with your courier.`,
      type: 'info'
    });

    return password;
  };

  const unblockLocker = async (lockerId: string) => {
    const locker = lockers.find(l => l.id === lockerId);
    
    await supabase.from('lockers').update({
      status: 'booked',
      wrong_attempts: 0
    }).eq('id', lockerId);

    await addLog({ lockerId, timestamp: new Date().toISOString(), eventType: 'unblocked', severity: 'success', description: `Locker unblocked. Wrong attempt counter reset.` });
    
    await supabase.from('notifications').insert({
      locker_id: lockerId,
      locker_number: locker?.number ?? lockerId,
      title: `🔓 Locker ${locker?.number ?? lockerId} Unblocked`,
      description: `Locker successfully unblocked. The courier can now retry entering the password.`,
      type: 'success'
    });
  };

  const cancelBooking = async (lockerId: string, cancelledBy: string): Promise<{ success: boolean; message: string }> => {
    const locker = lockers.find(l => l.id === lockerId);
    if (!locker) return { success: false, message: 'Locker not found.' };
    if (locker.status === 'filled') return { success: false, message: 'Locker cannot be cancelled — a package has already been placed inside.' };
    if (locker.status === 'blocked') return { success: false, message: 'Locker cannot be cancelled while it is blocked. Unblock it first.' };
    if (locker.status !== 'booked') return { success: false, message: 'This locker has no active booking to cancel.' };

    try {
      // Panggil fungsi RPC yang ada di Supabase
      const { error } = await supabase.rpc('cancel_booking', {
        p_locker_id: lockerId
      });

      if (error) throw error;

      const now = new Date().toISOString();

      // Tambahkan log pembatalan
      await addLog({
        lockerId, timestamp: now,
        eventType: 'booking_cancelled', severity: 'info',
        description: `Booking cancelled by ${cancelledBy}. Locker is now available.`,
      });

      // Tambahkan notifikasi (tanpa fungsi generateId siluman)
      await supabase.from('notifications').insert({
        locker_id: lockerId,
        locker_number: locker.number,
        title: `🗑️ Booking Cancelled — ${locker.number}`,
        description: `Your booking for Locker ${locker.number} has been successfully cancelled. The locker is now available for others.`,
        type: 'info'
      });

      return { success: true, message: `Booking for ${locker.number} has been cancelled successfully.` };

    } catch (error: any) {
      console.error("RPC Error:", error.message);
      return { success: false, message: `Failed to cancel booking: ${error.message}` };
    }
  };

  const addLocker = async (data: { number: string; location: string; size: LockerSize }) => {
    const exists = lockers.some(l => l.number.toLowerCase() === data.number.toLowerCase());
    if (exists) return { success: false, message: `Locker ${data.number} already exists.` };
    
    const id = 'L' + (lockers.length + 1).toString().padStart(3, '0') + '_' + Math.random().toString(36).substring(2, 6);
    
    const { error } = await supabase.from('lockers').insert({
      id,
      number: data.number.trim().toUpperCase(),
      location: data.location.trim(),
      size: data.size,
      status: 'available',
      wrong_attempts: 0
    });

    if (error) return { success: false, message: `Database error: ${error.message}` };

    await addLog({ lockerId: id, timestamp: new Date().toISOString(), eventType: 'booking_created', severity: 'info', description: `Locker ${data.number} added by admin.` });
    
    return { success: true, message: `Locker ${data.number} added successfully.` };
  };

  const updateLockerStatus = async (lockerId: string, newStatus: LockerStatus) => {
    const locker = lockers.find(l => l.id === lockerId);
    
    if (newStatus === 'available') {
      await supabase.from('lockers').update({
        status: 'available', booked_by: null, booked_by_room: null, password: null, booked_at: null, expires_at: null, wrong_attempts: 0
      }).eq('id', lockerId);
    } else {
      await supabase.from('lockers').update({ status: newStatus }).eq('id', lockerId);
    }

    await addLog({
      lockerId, timestamp: new Date().toISOString(),
      eventType: newStatus === 'blocked' ? 'blocked' : newStatus === 'available' ? 'unblocked' : 'booking_created',
      severity: newStatus === 'blocked' ? 'error' : newStatus === 'available' ? 'success' : 'info',
      description: `Admin changed locker status from "${locker?.status}" to "${newStatus}".`,
    });
  };

  const markNotificationRead = async (notifId: string) => {
    await supabase.from('notifications').update({ read: true }).eq('id', notifId);
  };

  const markAllRead = async () => {
    await supabase.from('notifications').update({ read: true }).eq('read', false);
  };

  return (
    <AppContext.Provider value={{
      lockers, logs, notifications,
      bookLocker, unblockLocker, cancelBooking,
      markNotificationRead, markAllRead,
      getLockerLogs, addLog,
      unreadCount, addLocker, updateLockerStatus,
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