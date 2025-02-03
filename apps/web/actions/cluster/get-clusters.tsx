'use server';

import { prisma } from '@orc/prisma';
import { getCurrentUser } from '@orc/web/lib/session';

export type GetClustersParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export async function getClusters({ page = 1, limit = 10, search, sort = {createdAt: 'desc'} }: { page?: number; limit?: number; search?: string; sort?: {[field: string]: string} } = {}) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const skip = (page - 1) * limit;

    // Build the where clause
    const where = {
      userId: user.id,
      ...(search && {
        name: {
          contains: search,
          // mode: 'insensitive', - Add after we move to PostgreSQL
        },
      }),
    };

    const clusters = await prisma.$transaction(async (tx) => {
      const items = await tx.cluster.findMany({
        where,
        include: {
          snapshots: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
            include: {
              orphanedResources: {
                where: {
                  status: 'PENDING',
                },
                select: {
                  id: true,
                  kind: true,
                  name: true,
                  namespace: true,
                  status: true,
                  createdAt: true,
                  discoveredAt: true,
                  deletedAt: true,
                },
              },
            },
          },
        },
        orderBy: sort,
        skip,
        take: limit,
      });

      // Transform the data to make it easier to work with
      const transformedItems = items.map((cluster) => ({
        ...cluster,
        lastSnapshot: cluster.snapshots[0] || null,
        orphanedResources: cluster.snapshots[0]?.orphanedResources || [],
        orphanedResourcesCount: cluster.snapshots[0]?.orphanedResources.length || 0,
        snapshots: undefined, // Remove the original snapshots array
      }));

      const total = await tx.cluster.count({ where });
      return { items: transformedItems, total };
    });

    return {
      success: true,
      clusters: clusters.items,
      pagination: {
        total: clusters.total,
        totalPages: Math.ceil(clusters.total / limit),
        currentPage: page,
        limit,
      },
    };
  } catch (error) {
    console.error('Failed to fetch clusters:', error);
    return {
      success: false,
      error,
      clusters: [],
      pagination: {
        total: 0,
        totalPages: 0,
        currentPage: page,
        limit,
      },
    };
  }
}
