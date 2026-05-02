import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, supabaseSecondary } from '../../lib/supabase'; // Pastikan path ini sesuai


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
  logout: () => Promise<void>;
  addUser: (data: { name: string; room: string; email: string; password: string }) => Promise<{ success: boolean; message: string }>;
  deleteUser: (userId: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function initials(name: string) {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [allUsers, setAllUsers] = useState<AuthUser[]>([]);

  const isAdmin = user?.role === 'admin';

  // Fungsi untuk mengambil detail profil pengguna dari tabel 'users' publik
  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

      console.log("🕵️ RADAR SUPABASE:", { userId_yang_dicari: userId, hasil_data: data, pesan_error: error });

    if (data) {
      setUser({
        id: data.id,
        email: data.email,
        name: data.name,
        room: data.room,
        role: data.role,
        avatar: initials(data.name),
      });
    }
  };

  // Fungsi untuk mengambil semua pengguna (hanya berguna untuk admin dashboard)
  const fetchAllUsers = async () => {
    const { data } = await supabase.from('users').select('*');
    if (data) {
      setAllUsers(data.map(u => ({
        ...u,
        avatar: initials(u.name)
      })));
    }
  };

  // Pantau status sesi Supabase (agar tetap login meski halaman di-refresh)
  useEffect(() => {
    // Cek sesi saat komponen pertama kali dimuat
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchUserProfile(session.user.id);
      }
    });

    // Dengarkan perubahan status login/logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
      }
    });

    fetchAllUsers(); // Ambil daftar semua user

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    // 1. Serahkan urusan verifikasi password ke Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    // 2. Jika sukses, profil akan otomatis ter-fetch oleh onAuthStateChange di useEffect
    return { success: true, message: 'Login successful' };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const addUser = async (data: { name: string; room: string; email: string; password: string }) => {
    if (!data.name.trim() || !data.email.trim() || !data.password.trim()) {
      return { success: false, message: 'All fields are required.' };
    }

    const { data: authData, error: authError } = await supabaseSecondary.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name.trim(),
          room: data.room.trim()
        }
      }
    });

    if (authError) return { success: false, message: authError.message };
    if (!authData.user) return { success: false, message: 'Failed to create user.' };

    fetchAllUsers(); // Refresh daftar user untuk admin
    return { success: true, message: `Account for ${data.name} created successfully.` };
  };
  const deleteUser = async (userId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const { error } = await supabase.rpc('hapus_user', {
        p_user_id: userId
      });

      if (error) {
        return { success: false, message: `Database error: ${error.message}` };
      }

      // Refresh daftar user di frontend setelah berhasil dihapus
      fetchAllUsers(); 
      return { success: true, message: 'User deleted successfully.' };

    } catch (error: any) {
      console.error("RPC Error:", error.message);
      return { success: false, message: `Failed to delete user: ${error.message}` };
    }
  };

  return (
    <AuthContext.Provider value={{ user, users: allUsers, isLoggedIn: !!user, isAdmin, login, logout, addUser, deleteUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}