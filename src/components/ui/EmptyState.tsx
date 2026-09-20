import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  message?: string;
  action?: { label: string; onClick: () => void };
  dashed?: boolean;
  className?: string;
};

export function EmptyState({
  icon: Icon = Inbox,
  title,
  message,
  action,
  dashed = true,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl ${
        dashed ? "border border-dashed border-zinc-200" : ""
      } px-6 py-14 text-center ${className}`}
    >
      <Icon size={32} className="text-zinc-300" strokeWidth={1.5} />
      <p className="mt-3 text-sm font-bold text-zinc-900">{title}</p>
      {message && <p className="mt-1 max-w-xs text-sm text-zinc-500">{message}</p>}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-4 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
