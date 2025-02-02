'use server';

import { prisma } from '@orc/prisma';
import { getCurrentUser } from '@orc/web/lib/session';

export type GetClustersParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export async function getClusters({ page = 1, limit = 10, search }: GetClustersParams = {}) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const where = {
      userId: user.id,
      ...(search && {
        name: {
          contains: search,
        },
      }),
    };

    const [clusters, total] = await Promise.all([
      prisma.cluster.findMany({
        where,
        include: {
          _count: {
            select: {
              orphanedResources: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.cluster.count({ where }),
    ]);

    return {
      success: true,
      clusters,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
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
