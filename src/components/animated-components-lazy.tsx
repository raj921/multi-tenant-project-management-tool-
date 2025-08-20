'use client';

import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load animated components
const AnimatedContainer = lazy(() => import('./animated-container').then(mod => ({ default: mod.default })));
const AnimatedCard = lazy(() => import('./animated-card').then(mod => ({ default: mod.default })));
const AnimatedButton = lazy(() => import('./animated-button').then(mod => ({ default: mod.default })));
const AnimatedProgress = lazy(() => import('./animated-progress').then(mod => ({ default: mod.default })));
const AnimatedBadge = lazy(() => import('./animated-badge').then(mod => ({ default: mod.default })));

// Skeleton components
function AnimatedContainerSkeleton({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

function AnimatedCardSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4">
      {children}
    </div>
  );
}

function AnimatedButtonSkeleton({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

function AnimatedProgressSkeleton() {
  return <Skeleton className="h-2 w-full" />;
}

function AnimatedBadgeSkeleton({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export const AnimatedContainerLazy = (props: any) => (
  <Suspense fallback={<AnimatedContainerSkeleton>{props.children}</AnimatedContainerSkeleton>}>
    <AnimatedContainer {...props} />
  </Suspense>
);

export const AnimatedCardLazy = (props: any) => (
  <Suspense fallback={<AnimatedCardSkeleton>{props.children}</AnimatedCardSkeleton>}>
    <AnimatedCard {...props} />
  </Suspense>
);

export const AnimatedButtonLazy = (props: any) => (
  <Suspense fallback={<AnimatedButtonSkeleton>{props.children}</AnimatedButtonSkeleton>}>
    <AnimatedButton {...props} />
  </Suspense>
);

export const AnimatedProgressLazy = (props: any) => (
  <Suspense fallback={<AnimatedProgressSkeleton />}>
    <AnimatedProgress {...props} />
  </Suspense>
);

export const AnimatedBadgeLazy = (props: any) => (
  <Suspense fallback={<AnimatedBadgeSkeleton>{props.children}</AnimatedBadgeSkeleton>}>
    <AnimatedBadge {...props} />
  </Suspense>
);