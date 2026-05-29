import React from 'react';

export default function Loading() {
  return (
    <main className="max-w-[1280px] mx-auto p-6 md:p-12 animate-pulse">
      <header className="mb-12">
        <div className="h-12 w-64 bg-surface-dim rounded mb-4" />
        <div className="h-6 w-96 bg-surface-dim rounded" />
      </header>

      <section>
        <div className="h-8 w-48 bg-surface-dim rounded mb-6" />
        
        <div className="flex overflow-hidden gap-6 pb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="min-w-[300px] max-w-[320px] shrink-0 border border-outline-variant bg-surface rounded-lg p-6 flex flex-col h-[300px]">
              <div className="h-6 w-3/4 bg-surface-dim rounded mb-4" />
              <div className="space-y-2 mb-4">
                <div className="h-4 w-full bg-surface-dim rounded" />
                <div className="h-4 w-full bg-surface-dim rounded" />
                <div className="h-4 w-5/6 bg-surface-dim rounded" />
              </div>
              <div className="flex gap-2 mb-4 mt-auto">
                <div className="h-6 w-16 bg-surface-dim rounded" />
                <div className="h-6 w-20 bg-surface-dim rounded" />
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-outline-variant">
                <div className="h-4 w-24 bg-surface-dim rounded" />
                <div className="h-8 w-16 bg-surface-dim rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
