import { AlertTriangle, RotateCw } from "lucide-react";

type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
};

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this right now. Please try again.",
  onRetry,
  className = "",
}: ErrorStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-rose-200 bg-rose-50/40 px-6 py-14 text-center ${className}`}
    >
      <AlertTriangle size={28} className="text-rose-400" strokeWidth={1.5} />
      <p className="mt-3 text-sm font-bold text-zinc-900">{title}</p>
      <p className="mt-1 max-w-xs text-sm text-zinc-500">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50"
        >
          <RotateCw size={13} />
          Retry
        </button>
      )}
    </div>
  );
}
