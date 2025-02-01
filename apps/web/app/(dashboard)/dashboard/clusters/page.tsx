'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { DashboardHeader } from '@orc/web/components/dashboard/header';
import { DashboardShell } from '@orc/web/components/dashboard/shell';
import { columns } from './columns';
import { DataTable } from '@orc/web/components/data-table/data-table';
import type { Cluster } from '@prisma/client';
import { DataTableSkeleton } from '@orc/web/components/shared/advanced-skeleton';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getClusters } from '@orc/web/actions/cluster';
import { ClusterConnectModal } from '@orc/web/components/modals/cluster-connect-modal';

export type GetAllClustersResponse = Cluster & { _count: { orphanedResources: number } };
export const GET_ALL_CLUSTERS_QUERY_KEY = 'clusters';

export default function ClustersPage() {
  const queryClient = useQueryClient();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const {
    data = [],
    isLoading,
    error,
  } = useQuery<GetAllClustersResponse[]>({
    queryKey: [GET_ALL_CLUSTERS_QUERY_KEY],
    queryFn: async () => {
      const response = await getClusters();
      return response.clusters as GetAllClustersResponse[];
    },
  });

  const toolbarActions = [
    {
      icon: <Plus className="h-4 w-4" />,
      label: 'Import Cluster',
      onClick: () => setIsImportModalOpen(true),
    },
  ];

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

    return (
      <>
        <DataTable<GetAllClustersResponse>
          columns={columns}
          searchableColumns={["name"]}
          searchPlaceholder='Search clusters...'
          queryKey="clusters"
          initialData={data}
          toolbarActions={toolbarActions}
        />
        <ClusterConnectModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onConnect={async () => await queryClient.invalidateQueries({ queryKey: [GET_ALL_CLUSTERS_QUERY_KEY] })}
        />
      </>
    );
  };

  return (
    <DashboardShell>
      <DashboardHeader heading="Clusters" text="Here you can see all of your clusters and their status." />
      {renderContent()}
    </DashboardShell>
  );
}
