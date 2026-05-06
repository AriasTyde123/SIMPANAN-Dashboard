export type LockerStatus = 'available' | 'booked' | 'filled' | 'blocked';
export type LockerSize = 'small' | 'medium' | 'large';
export type LogEventType =
  | 'door_opened'
  | 'door_closed'
  | 'door_locked'
  | 'door_unlocked'
  | 'wrong_password'
  | 'blocked'
  | 'item_detected'
  | 'item_removed'
  | 'door_ajar'
  | 'unblocked'
  | 'booking_created'
  | 'booking_cancelled'
  | 'locker_deleted'
  | 'password_sent'
  | 'password_reset';
export type LogSeverity = 'info' | 'warning' | 'error' | 'success';

export interface Locker {
  id: string;
  number: string;
  location: string;
  size: LockerSize;
  status: LockerStatus;
  bookedBy?: string;
  bookedByRoom?: string;
  password?: string;
  bookedAt?: string;
  expiresAt?: string;
  wrongAttempts: number;
  cameraUrl?: string;
}

export interface LogEntry {
  id: string;
  lockerId: string;
  timestamp: string;
  eventType: LogEventType;
  description: string;
  severity: LogSeverity;
}

export interface Notification {
  id: string;
  lockerId: string;
  lockerNumber: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: 'warning' | 'error' | 'info' | 'success';
}

export const CURRENT_USER = {
  name: 'Budi Santoso',
  room: '302',
  email: 'budi.santoso@email.com',
  avatar: 'BS',
};

export const initialLockers: Locker[] = [
  {
    id: 'L001', number: 'L-001', location: 'Ground Floor - A', size: 'small',
    status: 'available', wrongAttempts: 0,
    cameraUrl: 'http://192.168.1.101:81/stream',
  },
  {
    id: 'L002', number: 'L-002', location: 'Ground Floor - A', size: 'medium',
    status: 'available', wrongAttempts: 0,
    cameraUrl: 'http://192.168.1.102:81/stream',
  },
  {
    id: 'L003', number: 'L-003', location: 'Ground Floor - A', size: 'large',
    status: 'booked',
    bookedBy: 'Budi Santoso', bookedByRoom: '302',
    password: 'X7K2M9',
    bookedAt: '2026-04-08T08:30:00',
    expiresAt: '2026-04-09T08:30:00',
    wrongAttempts: 1,
    cameraUrl: 'http://192.168.1.103:81/stream',
  },
  {
    id: 'L004', number: 'L-004', location: 'Ground Floor - A', size: 'small',
    status: 'filled',
    bookedBy: 'Sari Dewi', bookedByRoom: '115',
    password: 'P3Q8W1',
    bookedAt: '2026-04-07T14:00:00',
    expiresAt: '2026-04-10T14:00:00',
    wrongAttempts: 0,
    cameraUrl: 'http://192.168.1.104:81/stream',
  },
  {
    id: 'L005', number: 'L-005', location: 'Ground Floor - B', size: 'medium',
    status: 'available', wrongAttempts: 0,
    cameraUrl: 'http://192.168.1.105:81/stream',
  },
  {
    id: 'L006', number: 'L-006', location: 'Ground Floor - B', size: 'small',
    status: 'filled',
    bookedBy: 'Andi Pratama', bookedByRoom: '201',
    password: 'R5T6Y7',
    bookedAt: '2026-04-06T09:15:00',
    expiresAt: '2026-04-09T09:15:00',
    wrongAttempts: 0,
    cameraUrl: 'http://192.168.1.106:81/stream',
  },
  {
    id: 'L007', number: 'L-007', location: 'Ground Floor - B', size: 'large',
    status: 'filled',
    bookedBy: 'Budi Santoso', bookedByRoom: '302',
    password: 'M4N5B6',
    bookedAt: '2026-04-07T11:00:00',
    expiresAt: '2026-04-10T11:00:00',
    wrongAttempts: 0,
    cameraUrl: 'http://192.168.1.107:81/stream',
  },
  {
    id: 'L008', number: 'L-008', location: 'Ground Floor - B', size: 'medium',
    status: 'available', wrongAttempts: 0,
    cameraUrl: 'http://192.168.1.108:81/stream',
  },
  {
    id: 'L009', number: 'L-009', location: 'First Floor - A', size: 'small',
    status: 'available', wrongAttempts: 0,
    cameraUrl: 'http://192.168.1.109:81/stream',
  },
  {
    id: 'L010', number: 'L-010', location: 'First Floor - A', size: 'large',
    status: 'booked',
    bookedBy: 'Rina Kusuma', bookedByRoom: '410',
    password: 'V8U9I0',
    bookedAt: '2026-04-08T06:00:00',
    expiresAt: '2026-04-09T06:00:00',
    wrongAttempts: 0,
    cameraUrl: 'http://192.168.1.110:81/stream',
  },
  {
    id: 'L011', number: 'L-011', location: 'First Floor - A', size: 'medium',
    status: 'available', wrongAttempts: 0,
    cameraUrl: 'http://192.168.1.111:81/stream',
  },
  {
    id: 'L012', number: 'L-012', location: 'First Floor - B', size: 'small',
    status: 'blocked',
    bookedBy: 'Budi Santoso', bookedByRoom: '302',
    password: 'Z2X3C4',
    bookedAt: '2026-04-08T07:45:00',
    expiresAt: '2026-04-09T07:45:00',
    wrongAttempts: 3,
    cameraUrl: 'http://192.168.1.112:81/stream',
  },
  {
    id: 'L013', number: 'L-013', location: 'First Floor - B', size: 'medium',
    status: 'available', wrongAttempts: 0,
    cameraUrl: 'http://192.168.1.113:81/stream',
  },
  {
    id: 'L014', number: 'L-014', location: 'First Floor - B', size: 'large',
    status: 'filled',
    bookedBy: 'Hendra Wijaya', bookedByRoom: '325',
    password: 'Q1W2E3',
    bookedAt: '2026-04-05T16:30:00',
    expiresAt: '2026-04-11T16:30:00',
    wrongAttempts: 0,
    cameraUrl: 'http://192.168.1.114:81/stream',
  },
  {
    id: 'L015', number: 'L-015', location: 'Second Floor - A', size: 'small',
    status: 'available', wrongAttempts: 0,
    cameraUrl: 'http://192.168.1.115:81/stream',
  },
  {
    id: 'L016', number: 'L-016', location: 'Second Floor - A', size: 'medium',
    status: 'available', wrongAttempts: 0,
    cameraUrl: 'http://192.168.1.116:81/stream',
  },
];

export const initialLogs: LogEntry[] = [
  // L003 logs
  {
    id: 'log001', lockerId: 'L003', timestamp: '2026-04-08T08:30:00',
    eventType: 'booking_created', severity: 'info',
    description: 'Booking created by Budi Santoso (Room 302)',
  },
  {
    id: 'log002', lockerId: 'L003', timestamp: '2026-04-08T08:30:05',
    eventType: 'password_sent', severity: 'success',
    description: 'Access password X7K2M9 sent to user',
  },
  {
    id: 'log003', lockerId: 'L003', timestamp: '2026-04-08T10:12:33',
    eventType: 'wrong_password', severity: 'warning',
    description: 'Incorrect password attempt (1/3)',
  },
  {
    id: 'log004', lockerId: 'L003', timestamp: '2026-04-08T10:15:00',
    eventType: 'door_ajar', severity: 'warning',
    description: 'Door not fully closed — please check locker door',
  },

  // L007 logs
  {
    id: 'log005', lockerId: 'L007', timestamp: '2026-04-07T11:00:00',
    eventType: 'booking_created', severity: 'info',
    description: 'Booking created by Budi Santoso (Room 302)',
  },
  {
    id: 'log006', lockerId: 'L007', timestamp: '2026-04-07T11:00:05',
    eventType: 'password_sent', severity: 'success',
    description: 'Access password M4N5B6 sent to user',
  },
  {
    id: 'log007', lockerId: 'L007', timestamp: '2026-04-07T15:43:22',
    eventType: 'door_opened', severity: 'success',
    description: 'Door opened with correct password by courier',
  },
  {
    id: 'log008', lockerId: 'L007', timestamp: '2026-04-07T15:44:01',
    eventType: 'item_detected', severity: 'info',
    description: 'Item placed inside locker (weight sensor triggered)',
  },
  {
    id: 'log009', lockerId: 'L007', timestamp: '2026-04-07T15:44:15',
    eventType: 'door_closed', severity: 'success',
    description: 'Door closed and locked successfully',
  },

  // L012 logs (blocked)
  {
    id: 'log010', lockerId: 'L012', timestamp: '2026-04-08T07:45:00',
    eventType: 'booking_created', severity: 'info',
    description: 'Booking created by Budi Santoso (Room 302)',
  },
  {
    id: 'log011', lockerId: 'L012', timestamp: '2026-04-08T07:45:05',
    eventType: 'password_sent', severity: 'success',
    description: 'Access password Z2X3C4 sent to user',
  },
  {
    id: 'log012', lockerId: 'L012', timestamp: '2026-04-08T09:22:10',
    eventType: 'wrong_password', severity: 'warning',
    description: 'Incorrect password attempt (1/3)',
  },
  {
    id: 'log013', lockerId: 'L012', timestamp: '2026-04-08T09:22:45',
    eventType: 'wrong_password', severity: 'warning',
    description: 'Incorrect password attempt (2/3)',
  },
  {
    id: 'log014', lockerId: 'L012', timestamp: '2026-04-08T09:23:05',
    eventType: 'wrong_password', severity: 'error',
    description: 'Incorrect password attempt (3/3) — maximum exceeded',
  },
  {
    id: 'log015', lockerId: 'L012', timestamp: '2026-04-08T09:23:05',
    eventType: 'blocked', severity: 'error',
    description: 'Locker BLOCKED — 3 consecutive wrong password attempts detected. Possible brute-force attack!',
  },

  // L004 logs
  {
    id: 'log016', lockerId: 'L004', timestamp: '2026-04-07T14:00:00',
    eventType: 'booking_created', severity: 'info',
    description: 'Booking created by Sari Dewi (Room 115)',
  },
  {
    id: 'log017', lockerId: 'L004', timestamp: '2026-04-07T14:00:05',
    eventType: 'password_sent', severity: 'success',
    description: 'Access password P3Q8W1 sent to user',
  },
  {
    id: 'log018', lockerId: 'L004', timestamp: '2026-04-08T11:30:00',
    eventType: 'door_opened', severity: 'success',
    description: 'Door opened with correct password',
  },
  {
    id: 'log019', lockerId: 'L004', timestamp: '2026-04-08T11:30:45',
    eventType: 'item_detected', severity: 'info',
    description: 'Item placed inside locker',
  },
  {
    id: 'log020', lockerId: 'L004', timestamp: '2026-04-08T11:31:00',
    eventType: 'door_closed', severity: 'success',
    description: 'Door closed and locked successfully',
  },

  // L006 logs
  {
    id: 'log021', lockerId: 'L006', timestamp: '2026-04-06T09:15:00',
    eventType: 'booking_created', severity: 'info',
    description: 'Booking created by Andi Pratama (Room 201)',
  },
  {
    id: 'log022', lockerId: 'L006', timestamp: '2026-04-07T13:05:18',
    eventType: 'door_opened', severity: 'success',
    description: 'Door opened with correct password',
  },
  {
    id: 'log023', lockerId: 'L006', timestamp: '2026-04-07T13:06:00',
    eventType: 'item_detected', severity: 'info',
    description: 'Item placed inside locker',
  },
  {
    id: 'log024', lockerId: 'L006', timestamp: '2026-04-07T13:06:22',
    eventType: 'door_closed', severity: 'success',
    description: 'Door closed and locked successfully',
  },
];

export const initialNotifications: Notification[] = [
  {
    id: 'notif001', lockerId: 'L012', lockerNumber: 'L-012',
    title: '🚨 Locker Blocked — Possible Brute Force!',
    description: 'Locker L-012 has been blocked after 3 incorrect password attempts. Please review and unblock if needed.',
    timestamp: '2026-04-08T09:23:05',
    read: false, type: 'error',
  },
  {
    id: 'notif002', lockerId: 'L003', lockerNumber: 'L-003',
    title: '⚠️ Wrong Password Attempt on L-003',
    description: 'Someone entered the wrong password for Locker L-003. Attempt 1 of 3.',
    timestamp: '2026-04-08T10:12:33',
    read: false, type: 'warning',
  },
  {
    id: 'notif003', lockerId: 'L003', lockerNumber: 'L-003',
    title: '⚠️ Door Not Closed Properly on L-003',
    description: 'The door sensor detected that Locker L-003 may not be fully closed.',
    timestamp: '2026-04-08T10:15:00',
    read: true, type: 'warning',
  },
  {
    id: 'notif004', lockerId: 'L007', lockerNumber: 'L-007',
    title: '📦 Package Delivered to L-007',
    description: 'A package has been placed in Locker L-007 by the courier. Courier access was granted at 15:43.',
    timestamp: '2026-04-07T15:44:01',
    read: true, type: 'success',
  },
  {
    id: 'notif005', lockerId: 'L003', lockerNumber: 'L-003',
    title: '✅ Booking Confirmed — L-003',
    description: 'Your booking for Locker L-003 is confirmed. Password: X7K2M9 has been generated.',
    timestamp: '2026-04-08T08:30:05',
    read: true, type: 'info',
  },
];