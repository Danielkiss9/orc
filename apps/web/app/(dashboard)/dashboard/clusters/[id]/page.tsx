'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { DashboardShell } from '@orc/web/components/dashboard/shell';
import { DataTableSkeleton } from '@orc/web/components/shared/advanced-skeleton';
import { DataTable } from '@orc/web/components/data-table/data-table';
import { columns } from './orphaned-resources-columns';
import { getClusterBasicInfo, getOrphanedResources } from '@orc/web/actions/cluster';
import { Alert, AlertDescription, AlertTitle, Skeleton } from '@orc/web/ui/custom-ui';
import { AlertTriangle } from 'lucide-react';
import { BreadcrumbItems } from '@orc/web/components/breadcrumbs/breadcrumbs';
import { DashboardHeader } from '@orc/web/components/dashboard/header';
import { OrphanedResource } from '@prisma/client';
import { useState } from 'react';

export const GET_CLUSTER_QUERY = 'cluster';
export const GET_CLUSTER_RESOURCES_QUERY = 'cluster-resources';

type OrphanedResourceResponse = {
  data: OrphanedResource[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
};

function HeaderSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-8 w-[200px]" />
      <Skeleton className="h-4 w-[300px]" />
    </div>
  );
}

export default function ClusterDetailsPage() {
  const params = useParams();
  const clusterId = params.id as string;

  // Separate query for basic cluster info (name, status, etc.)
  const { data: basicInfo, isLoading: isLoadingBasicInfo } = useQuery({
    queryKey: [GET_CLUSTER_QUERY, clusterId, 'basic'],
    queryFn: () => getClusterBasicInfo(clusterId),
  });

  const fetchOrphanedResources = async ({
    page,
    limit,
    search,
  }: {
    page: number;
    limit: number;
    search?: string;
  }): Promise<OrphanedResourceResponse> => {
    const response = await getOrphanedResources({
      clusterId,
      page,
      limit,
      search,
      status: 'PENDING', // Default status
    });

    if (!response.success) {
      throw new Error('Failed to fetch cluster resources');
    }

    return {
      data: (response.data! || []) as OrphanedResource[],
      pagination: response.pagination!,
    };
  };

  // Query for initial resources data
  const {
    data: initialResourcesData,
    isLoading: isLoadingResources,
    error,
  } = useQuery<OrphanedResourceResponse>({
    queryKey: [GET_CLUSTER_RESOURCES_QUERY, clusterId],
    queryFn: () => fetchOrphanedResources({ page: 1, limit: 10 }),
  });

  if (error) {
    return (
      <DashboardShell>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load cluster. Please try again later.</AlertDescription>
        </Alert>
      </DashboardShell>
    );
  }

  const clusterName = basicInfo?.success ? basicInfo.cluster?.name : 'Cluster';

  return (
    <>
      <BreadcrumbItems
        items={[
          {
            name: 'Dashboard',
            link: '/dashboard',
          },
          {
            name: 'Clusters',
            link: '/dashboard/clusters',
          },
          {
            name: clusterName || 'Cluster',
          },
        ]}
      />
      <DashboardShell>
        {isLoadingBasicInfo ? (
          <HeaderSkeleton />
        ) : (
          <DashboardHeader heading={clusterName!} text="Here you can see a detailed view of your cluster and its resources." />
        )}

        <div className="space-y-4">
          <span className="text-lg font-semibold">Orphaned Resources</span>
          {isLoadingResources ? (
            <DataTableSkeleton
              columnCount={4}
              searchableColumnCount={1}
              filterableColumnCount={0}
              actionsCount={1}
              cellWidths={['10rem', '20rem', '12rem', '12rem']}
              shrinkZero
            />
          ) : (
            <DataTable<OrphanedResource>
              columns={columns}
              queryKey={`orphanedResources-${clusterId}`}
              queryFn={fetchOrphanedResources}
              initialData={initialResourcesData}
              searchPlaceholder="Search orphaned resources..."
            />
          )}
        </div>
      </DashboardShell>
    </>
  );
}
