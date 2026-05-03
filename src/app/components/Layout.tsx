import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router';
import {
  LayoutDashboard, BookMarked, Bell, Settings,
  Lock, Menu, X, LogOut, ChevronRight, Package,
  Activity, Shield, Users, ClipboardList, Video,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const userNavItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/my-bookings', label: 'My Bookings', icon: BookMarked },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const adminNavItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/my-bookings', label: 'My Bookings', icon: BookMarked },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const adminOnlyItems = [
  { to: '/admin/cameras', label: 'Camera Monitor', icon: Video },
  { to: '/admin/logs', label: 'All Logs', icon: Activity },
  { to: '/admin/lockers', label: 'Manage Lockers', icon: ClipboardList },
  { to: '/admin/users', label: 'Manage Users', icon: Users },
];

function NavItem({ to, label, icon: Icon, end, unread, onClick }: {
  to: string; label: string; icon: React.ComponentType<{ className?: string }>;
  end?: boolean; unread?: number; onClick?: () => void;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative
        ${isActive
          ? 'bg-cyan-400/15 text-cyan-400'
          : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-cyan-400 rounded-r-full" />
          )}
          <Icon className="w-4.5 h-4.5 flex-shrink-0" />
          <span className="text-sm flex-1">{label}</span>
          {unread != null && unread > 0 && (
            <span className="bg-red-500 text-white text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
              {unread}
            </span>
          )}
          {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-50" />}
        </>
      )}
    </NavLink>
  );
}

export function Layout() {
  const { unreadCount } = useApp();
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={closeSidebar} />
      )}

      {/* Logout confirm modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <div className="text-slate-800" style={{ fontWeight: 600 }}>Sign Out</div>
                <div className="text-xs text-slate-500">You will be logged out of S.I.M.P.A.N.A.N</div>
              </div>
            </div>
            <p className="text-sm text-slate-600">
              Are you sure you want to sign out? You'll need to log in again to access your locker dashboard.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 px-4 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                style={{ fontWeight: 600 }}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative z-30 flex flex-col w-64 h-full bg-[#0c1a2e] text-white transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-cyan-400 flex items-center justify-center flex-shrink-0">
            <Lock className="w-5 h-5 text-slate-900" />
          </div>
          <div>
            <div className="text-sm text-cyan-400 tracking-widest" style={{ fontWeight: 700, letterSpacing: '0.15em' }}>
              S.I.M.P.A.N.A.N
            </div>
            <div className="text-[10px] text-slate-400" style={{ lineHeight: 1.2 }}>Smart Locker Management</div>
          </div>
          <button className="ml-auto lg:hidden text-slate-400 hover:text-white" onClick={closeSidebar}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User card */}
        <div className="mx-4 mt-5 mb-2 bg-white/5 rounded-xl px-4 py-3">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${isAdmin ? 'bg-amber-400 text-slate-900' : 'bg-cyan-400 text-slate-900'}`} style={{ fontWeight: 700 }}>
              {user?.avatar ?? '?'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <div className="text-sm text-white truncate" style={{ fontWeight: 600 }}>{user?.name ?? '—'}</div>
                {isAdmin && (
                  <span className="flex-shrink-0 flex items-center gap-0.5 text-[9px] bg-amber-400/20 text-amber-400 px-1.5 py-0.5 rounded-full" style={{ fontWeight: 700 }}>
                    <Shield className="w-2.5 h-2.5" />
                    ADMIN
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400">{isAdmin ? 'Administrator' : `Room ${user?.room ?? '—'}`}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {/* Main */}
          <div className="px-3 py-2">
            <span className="text-[10px] text-slate-500 tracking-widest uppercase">Main</span>
          </div>
          {(isAdmin ? adminNavItems : userNavItems).map(({ to, label, icon, end }) => (
            <NavItem
              key={to}
              to={to}
              label={label}
              icon={icon}
              end={end}
              unread={label === 'Notifications' ? unreadCount : undefined}
              onClick={closeSidebar}
            />
          ))}

          {/* Admin section */}
          {isAdmin && (
            <>
              <div className="px-3 py-2 mt-2">
                <span className="text-[10px] text-amber-400/70 tracking-widest uppercase flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Admin
                </span>
              </div>
              {adminOnlyItems.map(({ to, label, icon }) => (
                <NavItem key={to} to={to} label={label} icon={icon} onClick={closeSidebar} />
              ))}
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="px-3 pb-5 border-t border-white/10 pt-3">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all w-full text-sm"
          >
            <LogOut className="w-4.5 h-4.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-4 lg:px-6 h-14 flex items-center gap-3 flex-shrink-0">
          <button
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Package className="w-4 h-4" />
            <span>Smart Locker System</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <NavLink to="/notifications" className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
              <Bell className="w-4.5 h-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </NavLink>
            {/* User pill */}
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="hidden sm:flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${isAdmin ? 'bg-amber-400 text-slate-900' : 'bg-[#0c1a2e] text-cyan-400'}`} style={{ fontWeight: 700 }}>
                {user?.avatar ?? '?'}
              </div>
              <span className="text-sm text-slate-700" style={{ fontWeight: 500 }}>{user?.name?.split(' ')[0]}</span>
              {isAdmin && <span className="text-[9px] bg-amber-100 text-amber-700 px-1 py-0.5 rounded" style={{ fontWeight: 700 }}>ADMIN</span>}
              <LogOut className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}