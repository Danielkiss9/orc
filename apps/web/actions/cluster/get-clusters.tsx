'use server';

import { prisma } from '@orc/prisma';
import { getCurrentUser } from '@orc/web/lib/session';

export async function getClusters() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const clusters = await prisma.cluster.findMany({
      where: {
        userId: user.id,
      },
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
    });

    return {
      success: true,
      clusters,
    };
  } catch (error) {
    console.error('Failed to fetch clusters:', error);
    return {
      success: false,
      error,
      clusters: [],
    };
  }
}
