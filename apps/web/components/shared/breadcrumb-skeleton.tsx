'use client';

import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from '@orc/web/ui/custom-ui';

export function BreadcrumbSkeleton() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <div className="h-4 w-24 animate-pulse rounded-md bg-muted"></div>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <div className="h-4 w-24 animate-pulse rounded-md bg-muted"></div>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
