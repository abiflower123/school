// Single reusable status badge so pages stop hand-rolling their own
// status-color maps (spec requirement: "one reusable StatusBadge component").

export type StatusVariant = "success" | "warning" | "danger" | "info" | "neutral" | "accent";

const VARIANT_STYLES: Record<StatusVariant, string> = {
  success: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
  warning: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
  danger: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20",
  info: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20",
  neutral: "bg-zinc-100 text-zinc-600 ring-1 ring-inset ring-zinc-500/10",
  accent: "bg-cyan-50 text-cyan-700 ring-1 ring-inset ring-cyan-600/20",
};

type StatusBadgeProps = {
  label: string;
  variant: StatusVariant;
  icon?: React.ReactNode;
  className?: string;
};

export function StatusBadge({ label, variant, icon, className = "" }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${VARIANT_STYLES[variant]} ${className}`}
    >
      {icon}
      {label}
    </span>
  );
}
