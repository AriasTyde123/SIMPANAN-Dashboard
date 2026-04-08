import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface AuthUser {
  name: string;
  room: string;
  email: string;
  avatar: string;
  role: 'tenant' | 'admin';
}

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const MOCK_USERS: Array<AuthUser & { password: string }> = [
  {
    name: 'Budi Santoso',
    room: '302',
    email: 'budi.santoso@email.com',
    avatar: 'BS',
    role: 'tenant',
    password: 'simpanan123',
  },
  {
    name: 'Sari Dewi',
    room: '115',
    email: 'sari.dewi@email.com',
    avatar: 'SD',
    role: 'tenant',
    password: 'simpanan123',
  },
  {
    name: 'Andi Pratama',
    room: '201',
    email: 'andi.pratama@email.com',
    avatar: 'AP',
    role: 'tenant',
    password: 'simpanan123',
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 900));

    const found = MOCK_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!found) {
      return { success: false, message: 'Invalid email or password. Please try again.' };
    }

    const { password: _pw, ...authUser } = found;
    setUser(authUser);
    return { success: true, message: 'Login successful' };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
