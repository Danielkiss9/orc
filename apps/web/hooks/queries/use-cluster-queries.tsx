import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getClusterBasicInfo } from '@orc/web/actions/cluster';
import { getOrphanedResources } from '@orc/web/actions/cluster/orhpaned-resources';

export const QUERY_KEYS = {
  CLUSTER: 'cluster',
  ORPHANED_RESOURCES: 'orphaned-resources',
  TIMESERIES: 'timeseries',
} as const;

interface UseClusterQueriesProps {
  clusterId: string;
  timeRange: number;
}

export function useClusterQueries({ clusterId }: UseClusterQueriesProps) {
  const queryClient = useQueryClient();

  const { data: basicInfo, isLoading: isLoadingBasicInfo } = useQuery({
    queryKey: [QUERY_KEYS.CLUSTER, clusterId],
    queryFn: () => getClusterBasicInfo(clusterId),
  });

  const fetchOrphanedResources = async ({ page, limit, search }: { page: number; limit: number; search?: string }) => {
    const response = await getOrphanedResources({
      clusterId,
      page,
      limit,
      search,
      status: 'PENDING',
    });

    if (!response.success) {
      throw new Error('Failed to fetch cluster resources');
    }

    return {
      data: response.data || [],
      pagination: response.pagination!,
    };
  };

  const {
    data: initialResourcesData,
    isLoading: isLoadingResources,
    error: resourcesError,
  } = useQuery({
    queryKey: [QUERY_KEYS.ORPHANED_RESOURCES, clusterId],
    queryFn: () => fetchOrphanedResources({ page: 1, limit: 10 }),
  });

  return {
    basicInfo,
    isLoadingBasicInfo,
    initialResourcesData,
    isLoadingResources,
    resourcesError,
    fetchOrphanedResources,
  };
}
