'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@orc/web/ui/custom-ui';
import type { Cluster } from '@prisma/client';

interface ClusterInfoCardProps {
  cluster: Cluster;
}

export function ClusterInfoCard({ cluster }: ClusterInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cluster Information</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Name</dt>
            <dd className="mt-1 text-sm text-gray-900">{cluster.name}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1 text-sm text-gray-900">{cluster.status}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Created At</dt>
            <dd className="mt-1 text-sm text-gray-900">{new Date(cluster.createdAt).toLocaleString()}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Updated At</dt>
            <dd className="mt-1 text-sm text-gray-900">{new Date(cluster.updatedAt).toLocaleString()}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
