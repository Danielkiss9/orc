'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { DashboardShell } from '@orc/web/components/dashboard/shell';
import { DataTableSkeleton } from '@orc/web/components/shared/advanced-skeleton';
import { DataTable } from '@orc/web/components/data-table/data-table';
import { columns } from './orphaned-resources-columns';
import { getCluster } from '@orc/web/actions/cluster';
import { Alert, AlertDescription, AlertTitle } from '@orc/web/ui/custom-ui';
import { AlertTriangle } from 'lucide-react';
import { BreadcrumbItems } from '@orc/web/components/breadcrumbs/breadcrumbs';
import { DashboardHeader } from '../../../../../components/dashboard/header';

export const GET_CLUSTER_QUERY = 'cluster';

function LoadingState() {
  return (
    <DashboardShell>
      {/* <div className="h-[200px] animate-pulse rounded-lg bg-muted" /> Skeleton for ClusterInfoCard */}
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-md bg-muted" /> {/* Skeleton for heading */}
        <DataTableSkeleton
          columnCount={4}
          searchableColumnCount={1}
          filterableColumnCount={0}
          actionsCount={1}
          cellWidths={['10rem', '20rem', '12rem', '12rem']}
          shrinkZero
        />
      </div>
    </DashboardShell>
  );
}

export default function ClusterDetailsPage() {
  const params = useParams();
  const clusterId = params.id as string;

  const { data, isLoading, error } = useQuery({
    queryKey: [GET_CLUSTER_QUERY, clusterId],
    queryFn: () => getCluster(clusterId),
  });

  if (isLoading) {
    return <LoadingState />;
  }

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
            name: data?.cluster?.name as string,
          },
        ]}
      />
      <DashboardShell>
        <DashboardHeader
          heading={data?.cluster?.name || 'Cluster'}
          text="Here you can see a detailed view of your cluster and its resources."
        />

        {/* <ClusterInfoCard cluster={data?.cluster as Cluster} /> */}
        <div className="space-y-4">
          <span className="text-lg font-semibold">Orphaned Resources</span>
          <DataTable<any>
            columns={columns}
            searchableColumns={["name", "kind", "namespace"]}
            queryKey={`orphanedResources-${clusterId}`}
            initialData={data?.cluster?.orphanedResources}
            searchPlaceholder="Search orphaned resources..."
          />
        </div>
      </DashboardShell>
    </>
  );
}
