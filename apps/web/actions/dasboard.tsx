'use server';

import { prisma } from '@orc/prisma';
import { getCurrentUser } from '@orc/web/lib/session';

export async function getDashboardData() {
  try {
    const user = await getCurrentUser();
    console.log('Current user:', user?.id);

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const clusters = await prisma.cluster.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        name: true,
        lastSeen: true,
        _count: {
          select: {
            orphanedResources: {
                where: {
                    status: 'PENDING',
                }
            }
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });


    // Handle empty state
    if (!clusters.length) {
      return {
        success: true,
        data: {
          stats: {
            totalClusters: 0,
            totalOrphanedResources: 0,
            clustersWithOrphanedResources: 0,
            averageHealthScore: 0,
          },
          orphanedResourcesByCluster: [],
          topClustersWithOrphanedResources: [],
        },
      };
    }

    // Calculate all stats from the clusters data
    const totalOrphanedResources = clusters.reduce((sum, cluster) => sum + cluster._count.orphanedResources, 0);

    // Sort clusters by orphaned resources count
    const sortedClusters = [...clusters].sort((a, b) => b._count.orphanedResources - a._count.orphanedResources);

    const data = {
      stats: {
        totalClusters: clusters.length,
        totalOrphanedResources,
        clustersWithOrphanedResources: clusters.filter((cluster) => cluster._count.orphanedResources > 0).length,
      },
      orphanedResourcesByCluster: clusters.map((cluster) => ({
        clusterName: cluster.name,
        orphanedResources: cluster._count.orphanedResources,
      })),
      topClustersWithOrphanedResources: sortedClusters.slice(0, 5).map((cluster) => ({
        id: cluster.id,
        name: cluster.name,
        orphanedResources: cluster._count.orphanedResources,
        lastSeen: cluster.lastSeen,
      })),
    };

    return { success: true, data };
  } catch (error) {
    console.error('Dashboard data error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch dashboard data',
    };
  }
}
