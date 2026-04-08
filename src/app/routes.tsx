import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { MyBookings } from './pages/MyBookings';
import { LockerDetail } from './pages/LockerDetail';
import { Notifications } from './pages/Notifications';
import { Settings } from './pages/Settings';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'my-bookings', Component: MyBookings },
      { path: 'locker/:id', Component: LockerDetail },
      { path: 'notifications', Component: Notifications },
      { path: 'settings', Component: Settings },
    ],
  },
]);
