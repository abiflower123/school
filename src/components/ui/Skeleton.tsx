// Minimal skeleton primitives so data-heavy pages can show a loading
// placeholder instead of a blank panel while (future) API calls resolve.

export function SkeletonLine({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-full bg-zinc-100 ${className}`} />;
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-xl border border-zinc-200 bg-white p-5 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-zinc-100" />
        <div className="flex-1 space-y-2">
          <SkeletonLine className="h-3 w-1/2" />
          <SkeletonLine className="h-2 w-1/3" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonRow({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 px-5 py-3.5 ${className}`}>
      <div className="h-8 w-8 shrink-0 animate-pulse rounded-lg bg-zinc-100" />
      <div className="flex-1 space-y-2">
        <SkeletonLine className="h-3 w-2/3" />
        <SkeletonLine className="h-2 w-1/3" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 4, className = "" }: { count?: number; className?: string }) {
  return (
    <div className={`grid grid-cols-2 gap-4 lg:grid-cols-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
