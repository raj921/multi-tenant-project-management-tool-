'use client';

import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Icon skeleton component
function IconSkeleton({ className = "w-4 h-4" }: { className?: string }) {
  return <Skeleton className={className} />;
}

// Lazy icon component
export function LazyIcon({ 
  icon: IconComponent, 
  className = "w-4 h-4",
  ...props 
}: { 
  icon: React.ComponentType<any>;
  className?: string;
  [key: string]: any;
}) {
  return (
    <Suspense fallback={<IconSkeleton className={className} />}>
      <IconComponent className={className} {...props} />
    </Suspense>
  );
}

// Dynamic icon loader
export async function loadIcon(iconName: string) {
  const icons = await import('lucide-react');
  return icons[iconName as keyof typeof icons];
}