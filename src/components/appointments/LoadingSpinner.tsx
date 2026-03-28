import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingSpinner({ message: _message }: { message?: string }) {
  return (
    <div className="min-h-[60vh] bg-[color:var(--color-app-bg)] px-4 py-6">
      <div className="mx-auto max-w-6xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-9 w-32" />
        </div>
        {/* KPI cards */}
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-14 rounded-lg" />
          ))}
        </div>
        {/* Stats toggle */}
        <Skeleton className="h-8 w-full rounded-lg" />
        {/* Search */}
        <Skeleton className="h-10 w-full rounded-lg" />
        {/* Filter pills */}
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-7 w-20 rounded-full" />
          ))}
        </div>
        {/* Table rows */}
        <div className="space-y-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
