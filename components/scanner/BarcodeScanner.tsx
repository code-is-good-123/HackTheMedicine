"use client";

import { useState, useRef } from "react";
import { Camera, Scan, AlertTriangle, Sparkles, Check, RefreshCw } from "lucide-react";

interface BarcodeScannerProps {
  onDetected: (barcode: string) => void;
  isLoading?: boolean;
}

const SAMPLE_BARCODES = [
  { code: "0093-3109-01", name: "Amoxicillin 500mg (NDC)" },
  { code: "50580-726-30", name: "Cetirizine / Zyrtec (NDC)" },
  { code: "0093-1048-01", name: "Metformin 500mg (NDC)" },
  { code: "0069-4200-30", name: "Pfizerpen / Penicillin (NDC)" },
];

export default function BarcodeScanner({ onDetected, isLoading = false }: BarcodeScannerProps) {
  const [manualBarcode, setManualBarcode] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    setCameraError("");
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not supported on this browser/device.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err: any) {
      setCameraError(err?.message || "Could not access camera. Please enter barcode or medicine name.");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      onDetected(manualBarcode.trim());
    }
  };

  return (
    <div className="space-y-6">
      {/* Camera Viewfinder */}
      <div className="relative aspect-video max-h-72 w-full bg-slate-950 rounded-3xl border-2 border-slate-900 shadow-[0_4px_0_0_#0f172a] overflow-hidden flex flex-col items-center justify-center text-white">
        {cameraActive ? (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
            {/* Viewfinder crosshairs */}
            <div className="absolute inset-8 border-2 border-dashed border-emerald-400 rounded-2xl pointer-events-none flex items-center justify-center">
              <div className="w-full h-0.5 bg-red-500/80 animate-pulse shadow-[0_0_8px_#ef4444]" />
            </div>
            <button
              onClick={stopCamera}
              className="absolute bottom-3 px-3 py-1.5 bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-black uppercase rounded-xl border border-white/20 backdrop-blur-sm"
            >
              Stop Camera
            </button>
          </>
        ) : (
          <div className="p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto text-emerald-400">
              <Camera className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-sm font-black">Camera Barcode Scanner</p>
              <p className="text-xs text-white/60 font-semibold max-w-xs mx-auto mt-0.5">
                Scan standard package barcodes (UPC / NDC) directly from your pill bottles or box.
              </p>
            </div>
            <button
              onClick={startCamera}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-black text-xs uppercase tracking-wider rounded-2xl border-2 border-slate-900 shadow-[0_3px_0_0_#0f172a] active:translate-y-0.5"
            >
              <Scan className="w-4 h-4" />
              ENABLE CAMERA
            </button>
          </div>
        )}
      </div>

      {cameraError && (
        <div className="p-3 bg-amber-50 border-2 border-slate-900 rounded-2xl text-xs font-bold text-amber-900 flex items-center gap-2 shadow-[0_2px_0_0_#0f172a]">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Manual Barcode / NDC Input */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
          Enter Barcode or NDC Code
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={manualBarcode}
            onChange={(e) => setManualBarcode(e.target.value)}
            placeholder="e.g. 0093-3109-01 or 50580-726-30"
            className="flex-1 px-4 py-3 bg-slate-50 border-2 border-slate-900 rounded-2xl text-slate-900 font-bold placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-400 shadow-[0_2px_0_0_#0f172a] text-sm"
          />
          <button
            type="submit"
            disabled={isLoading || !manualBarcode.trim()}
            className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs uppercase tracking-wider rounded-2xl border-2 border-slate-900 shadow-[0_3px_0_0_#0f172a] active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "DECODE"}
          </button>
        </div>
      </form>

      {/* Sample NDC Quick Taps for Demo */}
      <div className="space-y-2">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-clinical-600" />
          Quick Test NDC Barcodes:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SAMPLE_BARCODES.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => onDetected(item.code)}
              className="text-left p-2.5 bg-white hover:bg-clinical-50 border-2 border-slate-900 rounded-2xl shadow-[0_2px_0_0_#0f172a] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-between group"
            >
              <div>
                <p className="text-xs font-black text-slate-900">{item.name}</p>
                <p className="text-[10px] font-bold text-slate-500 font-mono">{item.code}</p>
              </div>
              <Check className="w-4 h-4 text-clinical-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
