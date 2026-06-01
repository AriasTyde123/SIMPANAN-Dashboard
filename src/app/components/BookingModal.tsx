import React, { useState } from 'react';
import {
  X, Lock, MapPin, CheckCircle2, Copy, Check,
  Send, AlertCircle, Package, Maximize2, Layers, Minimize2,
  RefreshCw
} from 'lucide-react';
import { Locker } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';

interface Props {
  locker: Locker;
  onClose: () => void;
}

type Step = 'confirm' | 'success';

export function BookingModal({ locker, onClose }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { bookLocker } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('confirm');
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const sizeLabel = { small: 'Small', medium: 'Medium', large: 'Large' }[locker.size];
  const sizeIcon = {
    small: <Minimize2 className="w-4 h-4 text-slate-500" />,
    medium: <Layers className="w-4 h-4 text-slate-500" />,
    large: <Maximize2 className="w-4 h-4 text-slate-500" />,
  }[locker.size];

  const handleConfirm = async () => {
    // 1. Ubah state menjadi true agar animasi loading muncul dan tombol mati
    setIsSubmitting(true);
    
    try {
      // (Opsional) Tambahkan jeda waktu 600ms agar animasi loading sempat terlihat 
      // dan UI terasa lebih natural (tidak sekadar berkedip lalu hilang)
      await new Promise(resolve => setTimeout(resolve, 600));

      // 2. Lakukan proses booking ke database
      const pw = await bookLocker(locker.id, user?.name ?? 'Unknown', user?.room ?? '—');
      
      // 3. Jika berhasil, set password dan pindah ke halaman sukses
      setPassword(pw);
      setStep('success');
    } catch (error) {
      console.error("Booking gagal:", error);
    } finally {
      // 4. Kembalikan state ke false jika sewaktu-waktu proses gagal 
      // (atau selesai) agar tombol bisa diklik lagi
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(password).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-cyan-500" />
            <span className="text-slate-800" style={{ fontWeight: 600 }}>
              {step === 'confirm' ? 'Confirm Booking' : 'Booking Confirmed!'}
            </span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === 'confirm' ? (
          <div className="p-6 space-y-5">
            {/* Locker info */}
            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
                  <Lock className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <div className="text-slate-800" style={{ fontWeight: 700, fontSize: '1.1rem' }}>{locker.number}</div>
                  <div className="flex items-center gap-1 text-slate-500 text-xs">
                    <MapPin className="w-3 h-3" />
                    {locker.location}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                <div className="text-center">
                  <div className="text-xs text-slate-400 mb-1">Size</div>
                  <div className="flex items-center justify-center gap-1 text-sm text-slate-700" style={{ fontWeight: 600 }}>
                    {sizeIcon}
                    {sizeLabel}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-slate-400 mb-1">Duration</div>
                  <div className="text-sm text-slate-700" style={{ fontWeight: 600 }}>24 hours</div>
                </div>
              </div>
            </div>

            {/* Booking by */}
            <div className="space-y-2">
              <div className="text-xs text-slate-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Booking For</div>
              <div className="flex items-center gap-3 bg-cyan-50 rounded-xl px-4 py-3">
                <div className="w-8 h-8 rounded-full bg-cyan-400 flex items-center justify-center text-slate-900 text-sm" style={{ fontWeight: 700 }}>
                  {user?.avatar ?? '?'}
                </div>
                <div>
                  <div className="text-sm text-slate-800" style={{ fontWeight: 600 }}>{user?.name}</div>
                  <div className="text-xs text-slate-500">Room {user?.room}</div>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                After booking, a <strong>6-character password</strong> will be generated and sent to you. Share this password with your courier so they can deposit your package.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 py-2.5 px-4 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="flex-1 py-2.5 px-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                style={{ fontWeight: 600 }}
              >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Booking...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Confirm Booking
                
                </>
              )}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Success header */}
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-9 h-9 text-emerald-500" />
              </div>
              <h3 className="text-slate-800">Locker {locker.number} Booked!</h3>
              <p className="text-sm text-slate-500 mt-1">Your access password has been generated</p>
            </div>

            {/* Password */}
            <div className="bg-slate-900 rounded-2xl p-5 text-center">
              <div className="text-xs text-slate-400 mb-2 uppercase tracking-widest">Access Password</div>
              <div className="text-4xl text-cyan-400 tracking-[0.3em] mb-3" style={{ fontWeight: 700, fontFamily: 'monospace' }}>
                {password}
              </div>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-2 mx-auto px-4 py-2 rounded-lg text-sm transition-all ${
                  copied ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                style={{ fontWeight: 600 }}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Password'}
              </button>
            </div>

            {/* Instructions */}
            <div className="space-y-2">
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 text-xs flex items-center justify-center flex-shrink-0 mt-0.5" style={{ fontWeight: 700 }}>1</div>
                <p className="text-sm text-slate-600">Copy the password above and send it to your package courier.</p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 text-xs flex items-center justify-center flex-shrink-0 mt-0.5" style={{ fontWeight: 700 }}>2</div>
                <p className="text-sm text-slate-600">The courier will enter this password at the locker keypad to deposit your package.</p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 text-xs flex items-center justify-center flex-shrink-0 mt-0.5" style={{ fontWeight: 700 }}>3</div>
                <p className="text-sm text-slate-600">You'll be notified when your package has been deposited.</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 px-4 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => { onClose(); navigate('/my-bookings'); }}
                className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                style={{ fontWeight: 600 }}
              >
                <Package className="w-4 h-4" />
                View My Bookings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}