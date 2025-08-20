'use client';

import { lazy, Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load the heavy TaskBoard component
const TaskBoard = lazy(() => import('./task-board').then(mod => ({ default: mod.default })));

interface TaskBoardLazyProps {
  tasks: any[];
  onTaskUpdate: (taskId: string, newStatus: string) => void;
  onTaskCreate: (task: any) => void;
  onTaskEdit: (task: any) => void;
  onTaskDelete: (taskId: string) => void;
  onAddComment: (taskId: string, content: string) => void;
}

function TaskBoardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>
      
      <div className="flex gap-4 overflow-x-auto">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="flex-1 min-w-80">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-6 w-8" />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {[1, 2, 3].map((j) => (
                <Card key={j} className="mb-3">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        <Skeleton className="h-4 w-4" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-32 mb-1" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Skeleton className="h-3 w-full mb-2" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                      <div className="flex items-center gap-1">
                        <Skeleton className="h-6 w-6" />
                        <Skeleton className="h-6 w-6" />
                        <Skeleton className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function TaskBoardLazy(props: TaskBoardLazyProps) {
  return (
    <Suspense fallback={<TaskBoardSkeleton />}>
      <TaskBoard {...props} />
    </Suspense>
  );
}