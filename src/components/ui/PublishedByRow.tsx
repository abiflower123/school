type PublishedByRowProps = {
  name: string;
  role?: string;
  date?: string;
  avatar?: string;
  className?: string;
};

export function PublishedByRow({ name, role, date, avatar, className = "" }: PublishedByRowProps) {
  const initials = avatar ?? name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-[11px] font-bold text-zinc-600">
        {initials}
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-zinc-800">
          {name}
          {role && <span className="font-normal text-zinc-400"> · {role}</span>}
        </p>
        {date && <p className="text-[11px] text-zinc-400">{date}</p>}
      </div>
    </div>
  );
}
