'use client';

import { DashboardHeader } from '@orc/web/components/dashboard/header';
import { DashboardShell } from '@orc/web/components/dashboard/shell';
import { columns } from './columns';
import { DataTable } from '@orc/web/components/data-table/data-table';
import type { Cluster } from '@prisma/client';
import { DataTableSkeleton } from '@orc/web/components/shared/advanced-skeleton';
import { useQuery } from '@tanstack/react-query';
import { getClusters } from '@orc/web/actions/cluster';

export type GetAllClustersResponse = Cluster & { _count: { orphanedResources: number } };

export default function ClustersPage() {
  const {
    data = [],
    isLoading,
    error,
  } = useQuery<GetAllClustersResponse[]>({
    queryKey: ['clusters'],
    queryFn: async () => {
      const response = await getClusters();
      return response.clusters as GetAllClustersResponse[];
    },
  });

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
      return <div className="flex items-center justify-center p-8 text-destructive">Failed to load clusters</div>;
    }

    return <DataTable<GetAllClustersResponse> columns={columns} filterColumn="name" queryKey="clusters" initialData={data} />;
  };

  return (
    <DashboardShell>
      <DashboardHeader heading="Clusters" text="Here you can see all of your clusters and their status." />
      {renderContent()}
    </DashboardShell>
  );
}
