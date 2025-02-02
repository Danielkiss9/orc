'use server';

import { prisma } from '@orc/prisma';
import { getCurrentUser } from '@orc/web/lib/session';

export type GetClustersParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export async function getClusters({ page = 1, limit = 10, search }: { page?: number; limit?: number; search?: string } = {}) {
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
          orphanedResources: {
            where: {
              status: 'PENDING',
            },
            select: {
              id: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      });

      const total = await tx.cluster.count({ where });

      return { items, total };
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
