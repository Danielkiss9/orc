'use server';

import { getCurrentUser } from '@orc/web/lib/session';
import { OrphanedResourceStatus } from '@prisma/client';
import { prisma } from '@orc/prisma';

interface GetOrphanedResourcesParams {
  clusterId: string;
  page?: number;
  limit?: number;
  search?: string;
  sort?: {[field: string]: string};
  status?: OrphanedResourceStatus;
}

export async function getOrphanedResources({ clusterId, page = 1, limit = 10, search, status, sort = {createdAt: 'desc'} }: GetOrphanedResourcesParams) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const cluster = await prisma.cluster.findFirst({
      where: {
        id: clusterId,
        userId: user.id,
      },
      select: { id: true },
    });

    if (!cluster) {
      return { success: false, error: 'Cluster not found', errorCode: 404 };
    }

    const where = {
      snapshot: {
        clusterId,
        id: (
          await prisma.snapshot.findFirst({
            where: { clusterId },
            orderBy: { createdAt: 'desc' },
            select: { id: true },
          })
        )?.id,
      },
      ...(status && { status }),
      ...(search && {
        OR: [{ name: { contains: search } }, { kind: { contains: search } }, { namespace: { contains: search } }],
      }),
    };

    const [resources, total] = await Promise.all([
      prisma.orphanedResource.findMany({
        where,
        orderBy: sort,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.orphanedResource.count({ where }),
    ]);

    return {
      success: true,
      data: resources,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    };
  } catch (error) {
    console.error('Failed to fetch orphaned resources:', error);
    return {
      success: false,
      error,
      data: [],
      pagination: {
        total: 0,
        totalPages: 0,
        currentPage: page,
        limit,
      },
    };
  }
}
