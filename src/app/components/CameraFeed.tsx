import React, { useState, useRef } from 'react';
import {
  Video, VideoOff, RefreshCw, Maximize2, X,
  Wifi, WifiOff, AlertTriangle, Zap, ZapOff,
} from 'lucide-react';

interface CameraFeedProps {
  cameraUrl: string;
  lockerNumber: string;
  /** compact = small card mode (for grid); default = full panel mode */
  compact?: boolean;
  /** Show a fullscreen expand button */
  expandable?: boolean;
  /** Show camera on/off + flashlight toggle controls (default false) */
  showControls?: boolean;
}

/** Derive the ESP32-CAM HTTP control endpoint from the stream URL.
 *  Stream runs on :81/stream; control runs on :80/control */
function getFlashUrl(streamUrl: string, val: 0 | 255): string | null {
  try {
    const u = new URL(streamUrl);
    // Control server is on port 80 (default); stream is typically on :81
    const controlPort = u.port === '81' ? '' : u.port ? `:${u.port}` : '';
    return `${u.protocol}//${u.hostname}${controlPort}/control?var=flash&val=${val}`;
  } catch {
    return null;
  }
}

export function CameraFeed({
  cameraUrl,
  lockerNumber,
  compact = false,
  expandable = true,
  showControls = false,
}: CameraFeedProps) {
  const [status, setStatus] = useState<'connecting' | 'live' | 'error'>('connecting');
  const [retryKey, setRetryKey] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [flashOn, setFlashOn] = useState(true);
  const [flashPending, setFlashPending] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleLoad = () => setStatus('live');
  const handleError = () => setStatus('error');
  const handleRetry = () => {
    setStatus('connecting');
    setRetryKey(k => k + 1);
  };

  const handleCameraToggle = () => {
    const next = !cameraOn;
    setCameraOn(next);
    if (next) {
      // Turning back on — reconnect stream
      setStatus('connecting');
      setRetryKey(k => k + 1);
    }
  };

  const handleFlashToggle = async () => {
    if (flashPending) return;
    const next = !flashOn;
    setFlashOn(next);
    setFlashPending(true);
    const url = getFlashUrl(cameraUrl, next ? 255 : 0);
    if (url) {
      try {
        await fetch(url, { mode: 'no-cors' });
      } catch {
        // Silently ignore — ESP32 may not respond to cross-origin preflight
      }
    }
    setFlashPending(false);
  };

  // ── Control buttons overlay (shared between normal + fullscreen) ──────────────
  const controlButtons = showControls && (
    <div className="absolute bottom-2 right-2 flex items-center gap-1.5 z-10">
      {/* Flash toggle */}
      <button
        onClick={handleFlashToggle}
        disabled={flashPending || !cameraOn}
        title={flashOn ? 'Turn flash off' : 'Turn flash on'}
        className={`p-1.5 rounded-lg backdrop-blur-sm text-white transition-colors disabled:opacity-50 ${
          flashOn
            ? 'bg-yellow-500/80 hover:bg-yellow-500'
            : 'bg-black/60 hover:bg-black/80'
        }`}
      >
        {flashOn
          ? <Zap className={`${compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} ${flashPending ? 'animate-pulse' : ''}`} />
          : <ZapOff className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        }
      </button>

      {/* Camera on/off toggle */}
      <button
        onClick={handleCameraToggle}
        title={cameraOn ? 'Turn camera off' : 'Turn camera on'}
        className={`p-1.5 rounded-lg backdrop-blur-sm text-white transition-colors ${
          cameraOn
            ? 'bg-black/60 hover:bg-black/80'
            : 'bg-red-500/80 hover:bg-red-600/80'
        }`}
      >
        {cameraOn
          ? <Video className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          : <VideoOff className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        }
      </button>
    </div>
  );

  const feedEl = (
    <div className="relative w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden">

      {/* ── Stream image — hidden (not removed) when camera is off ── */}
      {cameraOn && (
        <img
          key={retryKey}
          ref={imgRef}
          src={cameraUrl}
          onLoad={handleLoad}
          onError={handleError}
          alt={`Camera feed — ${lockerNumber}`}
          className={`w-full h-full object-cover transition-opacity duration-500 ${status === 'live' ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
          crossOrigin="anonymous"
        />
      )}

      {/* ── Camera-off overlay ── */}
      {!cameraOn && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950">
          <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
            <VideoOff className="w-6 h-6 text-slate-500" />
          </div>
          <p className="text-xs text-slate-500" style={{ fontWeight: 600 }}>Camera Off</p>
          <button
            onClick={handleCameraToggle}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs transition-colors"
            style={{ fontWeight: 600 }}
          >
            <Video className="w-3 h-3" />
            Turn On
          </button>
        </div>
      )}

      {/* ── Connecting overlay ── */}
      {cameraOn && status === 'connecting' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950">
          <Wifi className="w-8 h-8 text-cyan-400 animate-pulse" />
          <p className="text-xs text-slate-400">Connecting to ESP32-CAM…</p>
          <p className="text-[10px] text-slate-600 font-mono">{cameraUrl}</p>
        </div>
      )}

      {/* ── Error overlay ── */}
      {cameraOn && status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950">
          <div className="w-12 h-12 rounded-full bg-red-950/60 border border-red-800 flex items-center justify-center">
            <WifiOff className="w-6 h-6 text-red-400" />
          </div>
          <div className="text-center px-4">
            <p className="text-xs text-slate-300" style={{ fontWeight: 600 }}>Camera Offline</p>
            <p className="text-[10px] text-slate-500 mt-0.5 font-mono break-all">{cameraUrl}</p>
          </div>
          <button
            onClick={handleRetry}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs transition-colors"
            style={{ fontWeight: 600 }}
          >
            <RefreshCw className="w-3 h-3" />
            Retry
          </button>
        </div>
      )}

      {/* ── Live badge ── */}
      {cameraOn && status === 'live' && (
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] text-white" style={{ fontWeight: 700 }}>LIVE</span>
        </div>
      )}

      {/* ── Flash indicator badge (when on + live) ── */}
      {cameraOn && flashOn && status === 'live' && showControls && (
        <div className="absolute top-2 left-14 flex items-center gap-1 bg-yellow-500/80 backdrop-blur-sm rounded-full px-2 py-1">
          <Zap className="w-2.5 h-2.5 text-white" />
          <span className="text-[10px] text-white" style={{ fontWeight: 700 }}>FLASH</span>
        </div>
      )}

      {/* ── Locker label ── */}
      <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1.5">
        <Video className="w-3 h-3 text-cyan-400" />
        <span className="text-[10px] text-white" style={{ fontWeight: 600 }}>{lockerNumber}</span>
      </div>

      {/* ── Expand button ── */}
      {expandable && !fullscreen && (
        <button
          onClick={() => setFullscreen(true)}
          className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-lg text-white transition-colors"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      )}

      {/* ── Retry button for live (top-right when no expand) ── */}
      {cameraOn && status === 'live' && !expandable && !showControls && (
        <button
          onClick={handleRetry}
          className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-lg text-white transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      )}

      {/* ── Controls overlay ── */}
      {controlButtons}
    </div>
  );

  return (
    <>
      {/* Normal view */}
      <div className={compact ? 'w-full h-full' : 'w-full aspect-video rounded-xl overflow-hidden border border-slate-800'}>
        {feedEl}
      </div>

      {/* Fullscreen lightbox */}
      {fullscreen && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
          {/* Header bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-white" style={{ fontWeight: 600 }}>{lockerNumber} — Live Camera Feed</span>
              {cameraOn && status === 'live' && (
                <span className="flex items-center gap-1 bg-red-600/20 border border-red-600/40 rounded-full px-2 py-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[10px] text-red-400" style={{ fontWeight: 700 }}>LIVE</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Fullscreen flash control */}
              {showControls && (
                <button
                  onClick={handleFlashToggle}
                  disabled={flashPending || !cameraOn}
                  title={flashOn ? 'Turn flash off' : 'Turn flash on'}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors disabled:opacity-50 ${
                    flashOn
                      ? 'bg-yellow-500/30 hover:bg-yellow-500/50 text-yellow-300 border border-yellow-500/40'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  {flashOn ? <Zap className="w-3 h-3" /> : <ZapOff className="w-3 h-3" />}
                  {flashOn ? 'Flash On' : 'Flash Off'}
                </button>
              )}
              {/* Fullscreen camera toggle */}
              {showControls && (
                <button
                  onClick={handleCameraToggle}
                  title={cameraOn ? 'Turn camera off' : 'Turn camera on'}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    cameraOn
                      ? 'bg-white/10 hover:bg-white/20 text-white'
                      : 'bg-red-500/30 hover:bg-red-500/50 text-red-300 border border-red-500/40'
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  {cameraOn ? <Video className="w-3 h-3" /> : <VideoOff className="w-3 h-3" />}
                  {cameraOn ? 'Camera On' : 'Camera Off'}
                </button>
              )}
              <button
                onClick={handleRetry}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Refresh
              </button>
              <button
                onClick={() => setFullscreen(false)}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Full-size feed */}
          <div className="flex-1 relative overflow-hidden">
            {feedEl}
          </div>

          {/* Footer info */}
          <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center gap-3 flex-shrink-0">
            <span className="text-[10px] text-slate-500 font-mono">{cameraUrl}</span>
            {cameraOn && status === 'error' && (
              <span className="flex items-center gap-1 text-[10px] text-red-400">
                <AlertTriangle className="w-3 h-3" />
                No signal from ESP32-CAM
              </span>
            )}
            {!cameraOn && (
              <span className="flex items-center gap-1 text-[10px] text-slate-400">
                <VideoOff className="w-3 h-3" />
                Camera is off
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
}
