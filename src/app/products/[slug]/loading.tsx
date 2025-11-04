export default function Loading() {
  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-lighter animate-shimmer rounded-2xl"></div>
          <div className="card p-6">
            <div className="h-8 bg-lighter animate-shimmer rounded mb-4"></div>
            <div className="h-6 bg-lighter animate-shimmer rounded w-3/4 mb-6"></div>
            <div className="h-12 bg-lighter animate-shimmer rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
