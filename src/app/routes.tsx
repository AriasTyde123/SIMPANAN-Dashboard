import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { MyBookings } from './pages/MyBookings';
import { LockerDetail } from './pages/LockerDetail';
import { Notifications } from './pages/Notifications';
import { Settings } from './pages/Settings';
import { AdminLogs } from './pages/admin/AdminLogs';
import { ManageLockers } from './pages/admin/ManageLockers';
import { ManageUsers } from './pages/admin/ManageUsers';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      // Tenant routes
      { path: 'my-bookings', Component: MyBookings },
      // Shared
      { path: 'locker/:id', Component: LockerDetail },
      { path: 'notifications', Component: Notifications },
      { path: 'settings', Component: Settings },
      // Admin-only routes
      { path: 'admin/logs', Component: AdminLogs },
      { path: 'admin/lockers', Component: ManageLockers },
      { path: 'admin/users', Component: ManageUsers },
    ],
  },
]);
