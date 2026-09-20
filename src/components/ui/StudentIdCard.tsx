import { X, QrCode } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function StudentIdCard({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { selectedChild } = useAuth();
  if (!isOpen || !selectedChild) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/40 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-[320px] overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-zinc-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-black/20 p-1.5 text-white backdrop-blur-md hover:bg-black/40"
        >
          <X size={16} />
        </button>

        {/* Card Header Pattern */}
        <div className="h-32 bg-gradient-to-br from-cyan-500 to-blue-600 p-6 text-center text-white">
          <p className="text-xs font-bold uppercase tracking-widest text-white/80">Ravion School</p>
          <p className="mt-1 text-sm font-medium">Digital Identity Card</p>
        </div>

        {/* Photo & Info */}
        <div className="relative flex flex-col items-center px-6 pb-6 pt-0">
          <div className="absolute -top-12 flex h-24 w-24 items-center justify-center rounded-xl border-4 border-white bg-zinc-100 shadow-sm">
            <span className="text-3xl font-bold text-zinc-400">
              {selectedChild.name.charAt(0)}
            </span>
          </div>

          <div className="mt-14 text-center">
            <h2 className="text-lg font-bold text-zinc-900">{selectedChild.name}</h2>
            <p className="text-sm font-medium text-cyan-600">
              Class {selectedChild.class} - {selectedChild.section}
            </p>
          </div>

          <div className="mt-6 w-full space-y-3 rounded-xl bg-zinc-50 p-4 text-left">
            <div>
              <p className="text-[10px] font-semibold uppercase text-zinc-400">Student ID</p>
              <p className="text-sm font-medium text-zinc-900">{selectedChild.id}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase text-zinc-400">Academic Year</p>
              <p className="text-sm font-medium text-zinc-900">{selectedChild.academicYear ?? "2026-2027"}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase text-zinc-400">Date of Birth</p>
              <p className="text-sm font-medium text-zinc-900">{selectedChild.dob}</p>
            </div>
          </div>

          {/* QR Code Simulation */}
          <div className="mt-6 flex flex-col items-center border-t border-zinc-100 pt-6">
            <QrCode size={64} className="text-zinc-800" strokeWidth={1} />
            <p className="mt-2 text-[10px] text-zinc-400">Scan for verification</p>
          </div>
        </div>
      </div>
    </div>
  );
}
