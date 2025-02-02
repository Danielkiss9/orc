'use server';

import { prisma } from '@orc/prisma';
import { getCurrentUser } from '@orc/web/lib/session';

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
