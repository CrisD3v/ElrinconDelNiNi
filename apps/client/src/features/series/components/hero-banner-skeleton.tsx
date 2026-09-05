import React from 'react';

export function HeroBannerSkeleton() {
  return (
    <section className="relative w-full min-h-[600px] bg-background py-16 lg:py-24">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[500px] animate-pulse">
          <div className="max-w-xl space-y-6 lg:space-y-8 order-2 lg:order-1">
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-dark-700 rounded-full" />
              <div className="h-6 w-24 bg-dark-700 rounded-full" />
            </div>
            <div className="h-16 w-full lg:w-4/5 bg-dark-700 rounded-xl" />
            <div className="space-y-3">
              <div className="h-5 w-full bg-dark-700 rounded-md" />
              <div className="h-5 w-5/6 bg-dark-700 rounded-md" />
              <div className="h-5 w-4/6 bg-dark-700 rounded-md" />
            </div>
            <div className="flex gap-4 pt-4">
              <div className="h-12 w-40 bg-dark-700 rounded-xl" />
              <div className="h-12 w-36 bg-dark-700 rounded-xl" />
            </div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="w-full max-w-[320px] sm:max-w-[400px] aspect-[2/3] lg:aspect-[3/4] bg-dark-800 rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
