export function SkeletonCard() {
  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-start gap-3">
        <div className="skeleton w-10 h-10 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-2/3" />
      </div>
      <div className="flex gap-2">
        <div className="skeleton h-7 w-20 rounded-lg" />
        <div className="skeleton h-7 w-20 rounded-lg" />
      </div>
    </div>
  )
}

export function SkeletonSubjectCard() {
  return (
    <div className="card p-5 space-y-3">
      <div className="flex items-start justify-between">
        <div className="skeleton w-10 h-10 rounded-lg" />
        <div className="skeleton h-5 w-12 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
      </div>
      <div className="skeleton h-3 w-1/3" />
    </div>
  )
}

export function SkeletonStat() {
  return (
    <div className="card p-6 space-y-2">
      <div className="skeleton h-8 w-16" />
      <div className="skeleton h-4 w-24" />
    </div>
  )
}

export function SkeletonText({ className = '' }) {
  return <div className={`skeleton ${className}`} />
}
