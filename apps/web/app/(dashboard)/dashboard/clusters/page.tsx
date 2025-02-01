'use client';

import { DashboardHeader } from '@orc/web/components/dashboard/header';
import { DashboardShell } from '@orc/web/components/dashboard/shell';
import { columns } from './columns';
import { DataTable } from '@orc/web/components/data-table/data-table';
import { useCallback, useEffect, useState } from 'react';
import { getClusters } from '@orc/web/actions/cluster';
import { Cluster, OrphanedResource } from '@prisma/client';
import { DataTableSkeleton } from '@orc/web/components/shared/advanced-skeleton';

export default function ClustersPage() {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClusters = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getClusters();
      console.log(response);
      setClusters(response.clusters ?? []);
    } catch (err) {
      setError('Failed to load clusters');
      console.error('Failed to fetch clusters:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClusters();
  }, [fetchClusters]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <DataTableSkeleton
          columnCount={5}
          searchableColumnCount={1}
          filterableColumnCount={0}
          actionsCount={1}
          cellWidths={['10rem', '20rem', '12rem', '12rem', '8rem']}
          shrinkZero
        />
      );
    }

    if (error) {
      return <div className="flex items-center justify-center p-8 text-destructive">{error}</div>;
    }

    return <DataTable<Cluster & { _count: { orphanedResources: number } }> columns={columns} filterColumn="name" queryKey="clusters" />;
  };

  return (
    <DashboardShell>
      <DashboardHeader heading="Clusters" text="Here you can see all of your clusters and their status." />
      {renderContent()}
    </DashboardShell>
  );
}
