import { ChevronRight } from "lucide-react";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
};

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </section>
  );
}

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  linkLabel?: string;
  onLink?: () => void;
};

export function SectionHeader({ title, subtitle, linkLabel, onLink }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
      <div>
        <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
        {subtitle && <p className="mt-0.5 text-[11px] text-zinc-400">{subtitle}</p>}
      </div>
      {linkLabel && onLink && (
        <button
          type="button"
          onClick={onLink}
          className="flex items-center gap-1 text-[11px] font-medium text-zinc-400 transition hover:text-zinc-900"
        >
          {linkLabel}
          <ChevronRight size={12} />
        </button>
      )}
    </div>
  );
}
