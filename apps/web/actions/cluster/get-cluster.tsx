'use server';

import { prisma } from '@orc/prisma';
import { getCurrentUser } from '@orc/web/lib/session';
import { OrphanResourceStatus } from '@prisma/client';

interface GetOrphanedResourcesParams {
  clusterId: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: OrphanResourceStatus;
}

export async function getClusterBasicInfo(clusterId: string) {
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
      select: {
        id: true,
        name: true,
        status: true,
        version: true,
        nodes: true,
        score: true,
        lastSeen: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!cluster) {
      return { success: false, error: 'Cluster not found', errorCode: 404 };
    }

    return {
      success: true,
      cluster,
    };
  } catch (error) {
    console.error('Failed to fetch cluster basic info:', error);
    return {
      success: false,
      error,
      cluster: null,
    };
  }
}

export async function getOrphanedResources({ clusterId, page = 1, limit = 10, search, status }: GetOrphanedResourcesParams) {
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

    // Build the where clause
    const where = {
      clusterId,
      ...(status && { status }),
      ...(search && {
        OR: [{ name: { contains: search } }, { kind: { contains: search } }, { namespace: { contains: search } }],
      }),
    };

    // Get resources and total count in parallel
    const [resources, total] = await Promise.all([
      prisma.orphanedResource.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          kind: true,
          name: true,
          namespace: true,
          uid: true,
          reason: true,
          age: true,
          status: true,
          discoveredAt: true,
          deletedAt: true,
          // Add any other fields you need
        },
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
