import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Video, Grid2x2, Grid3x3, LayoutGrid, MapPin,
  LockOpen, BookMarked, Package, ShieldAlert, Eye,
  Wifi,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Locker, LockerStatus } from '../../data/mockData';
import { CameraFeed } from '../../components/CameraFeed';

const statusStyle: Record<LockerStatus, { label: string; dot: string; text: string }> = {
  available: { label: 'Available', dot: 'bg-emerald-400', text: 'text-emerald-600' },
  booked:    { label: 'Booked',    dot: 'bg-amber-400',   text: 'text-amber-600' },
  filled:    { label: 'Filled',    dot: 'bg-blue-400',    text: 'text-blue-600' },
  blocked:   { label: 'Blocked',   dot: 'bg-red-500',     text: 'text-red-600' },
};

type GridSize = 2 | 3 | 4;
type StatusFilter = 'all' | LockerStatus;

function CameraCard({ locker }: { locker: Locker }) {
  const navigate = useNavigate();
  const st = statusStyle[locker.status];

  return (
    <div className="bg-[#0c1a2e] rounded-2xl overflow-hidden border border-slate-700/50 flex flex-col shadow-lg">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/80 border-b border-slate-700/50 flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${st.dot}`} />
          <span className="text-sm text-white truncate" style={{ fontWeight: 700 }}>{locker.number}</span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className={`text-[10px] ${st.text} hidden sm:inline`} style={{ fontWeight: 600 }}>
            {st.label}
          </span>
          <button
            onClick={() => navigate(`/locker/${locker.id}`)}
            className="p-1 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors"
            title="View detail"
          >
            <Eye className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Camera feed */}
      <div className="relative" style={{ paddingTop: '75%' }}>
        <div className="absolute inset-0">
          {locker.cameraUrl ? (
            <CameraFeed
              cameraUrl={locker.cameraUrl}
              lockerNumber={locker.number}
              compact={true}
              expandable={true}
              showControls={true}
            />
          ) : (
            <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center gap-2">
              <Video className="w-8 h-8 text-slate-600" />
              <p className="text-xs text-slate-500">No camera configured</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 py-1.5 bg-slate-900/80 border-t border-slate-700/50 flex items-center gap-1.5 flex-shrink-0">
        <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
        <span className="text-[10px] text-slate-400 truncate">{locker.location}</span>
        {locker.bookedBy && (
          <>
            <span className="text-slate-600 mx-1">·</span>
            <span className="text-[10px] text-slate-400 truncate">{locker.bookedBy}</span>
          </>
        )}
      </div>
    </div>
  );
}

const GRID_OPTIONS: { cols: GridSize; icon: React.ReactNode; label: string }[] = [
  { cols: 2, icon: <Grid2x2 className="w-4 h-4" />, label: '2-col' },
  { cols: 3, icon: <Grid3x3 className="w-4 h-4" />, label: '3-col' },
  { cols: 4, icon: <LayoutGrid className="w-4 h-4" />, label: '4-col' },
];

const STATUS_FILTERS: { key: StatusFilter; label: string; icon: React.ReactNode }[] = [
  { key: 'all',       label: 'All Lockers', icon: <Video className="w-3.5 h-3.5" /> },
  { key: 'available', label: 'Available',   icon: <LockOpen className="w-3.5 h-3.5" /> },
  { key: 'booked',    label: 'Booked',      icon: <BookMarked className="w-3.5 h-3.5" /> },
  { key: 'filled',    label: 'Filled',      icon: <Package className="w-3.5 h-3.5" /> },
  { key: 'blocked',   label: 'Blocked',     icon: <ShieldAlert className="w-3.5 h-3.5" /> },
];

const gridCols: Record<GridSize, string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};

export function CameraMonitor() {
  const { lockers } = useApp();
  const [gridSize, setGridSize] = useState<GridSize>(3);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const filtered = lockers.filter(l =>
    statusFilter === 'all' || l.status === statusFilter
  );

  const counts = {
    all:       lockers.length,
    available: lockers.filter(l => l.status === 'available').length,
    booked:    lockers.filter(l => l.status === 'booked').length,
    filled:    lockers.filter(l => l.status === 'filled').length,
    blocked:   lockers.filter(l => l.status === 'blocked').length,
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded-full uppercase tracking-wider" style={{ fontWeight: 700 }}>Admin</span>
            <h1 className="text-slate-800">Camera Monitor</h1>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Live ESP32-CAM feeds from all {lockers.length} lockers
          </p>
        </div>

        {/* Grid size picker */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
          {GRID_OPTIONS.map(opt => (
            <button
              key={opt.cols}
              onClick={() => setGridSize(opt.cols)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                gridSize === opt.cols
                  ? 'bg-[#0c1a2e] text-white shadow-sm'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
              title={opt.label}
            >
              {opt.icon}
              <span className="hidden sm:inline">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Status filter strip */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {STATUS_FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setStatusFilter(f.key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs whitespace-nowrap transition-all border ${
              statusFilter === f.key
                ? 'bg-[#0c1a2e] text-white border-transparent shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
            style={{ fontWeight: statusFilter === f.key ? 700 : 500 }}
          >
            {f.icon}
            {f.label}
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              statusFilter === f.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {counts[f.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Network note */}
      <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5">
        <Wifi className="w-4 h-4 text-blue-500 flex-shrink-0" />
        <p className="text-xs text-blue-700">
          Feeds connect directly to each ESP32-CAM on your local network.
          Make sure this device is on the same network as the locker units.
          Cameras showing <strong>"Offline"</strong> may be powered off or out of range.
        </p>
      </div>

      {/* Camera grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-20 text-center">
          <Video className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <p className="text-slate-400">No lockers match the selected filter</p>
        </div>
      ) : (
        <div className={`grid ${gridCols[gridSize]} gap-4`}>
          {filtered.map(locker => (
            <CameraCard key={locker.id} locker={locker} />
          ))}
        </div>
      )}
    </div>
  );
}