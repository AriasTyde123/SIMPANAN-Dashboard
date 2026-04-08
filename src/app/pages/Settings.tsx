import React, { useState } from 'react';
import {
  User, Bell, Shield, Smartphone, Mail, Save,
  CheckCircle2, Lock, Building, Info
} from 'lucide-react';
import { CURRENT_USER } from '../data/mockData';

function ToggleSetting({ label, description, defaultOn = false }: { label: string; description: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-slate-100 last:border-0">
      <div>
        <div className="text-sm text-slate-700" style={{ fontWeight: 500 }}>{label}</div>
        <div className="text-xs text-slate-400 mt-0.5">{description}</div>
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`w-11 h-6 rounded-full transition-colors flex-shrink-0 relative mt-0.5 ${on ? 'bg-cyan-500' : 'bg-slate-200'}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}

export function Settings() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h1 className="text-slate-800">Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage your account and notification preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-cyan-500" />
            <h3 className="text-slate-800">Profile Information</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block uppercase tracking-wider" style={{ fontWeight: 600 }}>Full Name</label>
              <input
                defaultValue={CURRENT_USER.name}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-300"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block uppercase tracking-wider" style={{ fontWeight: 600 }}>Email Address</label>
              <input
                defaultValue={CURRENT_USER.email}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-300"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block uppercase tracking-wider" style={{ fontWeight: 600 }}>Room Number</label>
              <input
                defaultValue={CURRENT_USER.room}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-300"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block uppercase tracking-wider" style={{ fontWeight: 600 }}>Phone Number</label>
              <input
                placeholder="+62 812 3456 7890"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-300"
              />
            </div>
          </div>
          <button
            onClick={handleSave}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-colors ${saved ? 'bg-emerald-500 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
            style={{ fontWeight: 600 }}
          >
            {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-5 h-5 text-cyan-500" />
            <h3 className="text-slate-800">Notification Preferences</h3>
          </div>
          <ToggleSetting
            label="Package Delivered Alerts"
            description="Get notified when a package is deposited in your locker"
            defaultOn={true}
          />
          <ToggleSetting
            label="Wrong Password Alerts"
            description="Alert me when someone enters the wrong password"
            defaultOn={true}
          />
          <ToggleSetting
            label="Security Alerts (Brute Force)"
            description="Immediate alert when locker is blocked after 3 attempts"
            defaultOn={true}
          />
          <ToggleSetting
            label="Door Sensor Alerts"
            description="Notify me if the locker door is not properly closed"
            defaultOn={true}
          />
          <ToggleSetting
            label="Booking Confirmations"
            description="Receive confirmation when booking is successfully created"
            defaultOn={true}
          />
          <ToggleSetting
            label="Booking Expiry Reminders"
            description="Remind me before my locker booking expires"
            defaultOn={false}
          />
        </div>

        {/* Delivery channels */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone className="w-5 h-5 text-cyan-500" />
            <h3 className="text-slate-800">Delivery Channels</h3>
          </div>
          <ToggleSetting
            label="In-App Notifications"
            description="Show notifications inside the S.I.M.P.A.N.A.N app"
            defaultOn={true}
          />
          <ToggleSetting
            label="Email Notifications"
            description="Send alerts to your registered email address"
            defaultOn={true}
          />
          <ToggleSetting
            label="SMS Notifications"
            description="Send important alerts via SMS to your phone"
            defaultOn={false}
          />
          <ToggleSetting
            label="WhatsApp Notifications"
            description="Send alerts via WhatsApp Business"
            defaultOn={true}
          />
        </div>

        {/* Security */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-500" />
            <h3 className="text-slate-800">Security Settings</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block uppercase tracking-wider" style={{ fontWeight: 600 }}>Current Password</label>
              <input
                type="password"
                placeholder="Enter current password"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-300"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block uppercase tracking-wider" style={{ fontWeight: 600 }}>New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-300"
              />
            </div>
          </div>
          <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-3 flex gap-2">
            <Info className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-cyan-700">
              This is your <strong>account password</strong>, not your locker access password. Locker passwords are auto-generated when you book.
            </p>
          </div>
          <button
            onClick={handleSave}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-colors ${saved ? 'bg-emerald-500 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
            style={{ fontWeight: 600 }}
          >
            {saved ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            {saved ? 'Saved!' : 'Update Password'}
          </button>
        </div>
      </div>

      {/* App info */}
      <div className="bg-slate-900 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-cyan-400 flex items-center justify-center flex-shrink-0">
          <Lock className="w-6 h-6 text-slate-900" />
        </div>
        <div>
          <div className="text-cyan-400 tracking-widest text-sm" style={{ fontWeight: 700 }}>S.I.M.P.A.N.A.N</div>
          <div className="text-slate-300 text-xs mt-0.5">Smart Integrated Management Platform for Automated Notification And Notification</div>
          <div className="text-slate-500 text-xs mt-1">Version 1.0.0 · Smart Locker System</div>
        </div>
        <div className="sm:ml-auto flex items-center gap-2 text-xs text-slate-500">
          <Building className="w-4 h-4" />
          <span>Boarding House Edition</span>
        </div>
      </div>
    </div>
  );
}
