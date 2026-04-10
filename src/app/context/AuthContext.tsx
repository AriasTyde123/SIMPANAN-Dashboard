import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface AuthUser {
  id: string;
  name: string;
  room: string;
  email: string;
  avatar: string;
  role: 'tenant' | 'admin';
}

interface AuthContextType {
  user: AuthUser | null;
  users: AuthUser[];
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  addUser: (data: { name: string; room: string; email: string; password: string }) => { success: boolean; message: string };
}

export interface MockUserRecord extends AuthUser {
  password: string;
}

const initialUsers: MockUserRecord[] = [
  {
    id: 'u0',
    name: 'Admin',
    room: '-',
    email: 'admin@simpanan.com',
    avatar: 'AD',
    role: 'admin',
    password: 'admin123',
  },
  {
    id: 'u1',
    name: 'Budi Santoso',
    room: '302',
    email: 'budi.santoso@email.com',
    avatar: 'BS',
    role: 'tenant',
    password: 'simpanan123',
  },
  {
    id: 'u2',
    name: 'Sari Dewi',
    room: '115',
    email: 'sari.dewi@email.com',
    avatar: 'SD',
    role: 'tenant',
    password: 'simpanan123',
  },
  {
    id: 'u3',
    name: 'Andi Pratama',
    room: '201',
    email: 'andi.pratama@email.com',
    avatar: 'AP',
    role: 'tenant',
    password: 'simpanan123',
  },
  {
    id: 'u4',
    name: 'Rina Kusuma',
    room: '410',
    email: 'rina.kusuma@email.com',
    avatar: 'RK',
    role: 'tenant',
    password: 'simpanan123',
  },
  {
    id: 'u5',
    name: 'Hendra Wijaya',
    room: '325',
    email: 'hendra.wijaya@email.com',
    avatar: 'HW',
    role: 'tenant',
    password: 'simpanan123',
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function generateId() {
  return 'u_' + Math.random().toString(36).substring(2, 8);
}

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userRecords, setUserRecords] = useState<MockUserRecord[]>(initialUsers);

  const isAdmin = user?.role === 'admin';

  // Expose only non-sensitive user info (no passwords)
  const users: AuthUser[] = userRecords.map(({ password: _pw, ...u }) => u);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    await new Promise(r => setTimeout(r, 900));
    const found = userRecords.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) {
      return { success: false, message: 'Invalid email or password. Please try again.' };
    }
    const { password: _pw, ...authUser } = found;
    setUser(authUser);
    return { success: true, message: 'Login successful' };
  };

  const logout = () => setUser(null);

  const addUser = (data: { name: string; room: string; email: string; password: string }) => {
    const exists = userRecords.some(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (exists) return { success: false, message: 'An account with this email already exists.' };
    if (!data.name.trim() || !data.email.trim() || !data.password.trim()) {
      return { success: false, message: 'All fields are required.' };
    }
    const newUser: MockUserRecord = {
      id: generateId(),
      name: data.name.trim(),
      room: data.room.trim(),
      email: data.email.trim().toLowerCase(),
      avatar: initials(data.name),
      role: 'tenant',
      password: data.password,
    };
    setUserRecords(prev => [...prev, newUser]);
    return { success: true, message: `Account for ${data.name} created successfully.` };
  };

  return (
    <AuthContext.Provider value={{ user, users, isLoggedIn: !!user, isAdmin, login, logout, addUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
