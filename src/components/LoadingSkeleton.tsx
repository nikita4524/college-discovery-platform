export function CardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="h-44 bg-gray-200 dark:bg-gray-700" />
      <div className="space-y-3 p-4">
        <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-64 rounded-xl bg-gray-200 dark:bg-gray-700" />
      <div className="grid gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-lg bg-gray-200 dark:bg-gray-700" />
        ))}
      </div>
      <div className="h-96 rounded-xl bg-gray-200 dark:bg-gray-700" />
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-12 rounded bg-gray-200 dark:bg-gray-700" />
      ))}
    </div>
  );
}
