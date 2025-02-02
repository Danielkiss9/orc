'use server';

import { prisma } from '@orc/prisma';
import { getCurrentUser } from '@orc/web/lib/session';

export async function deleteCluster(clusterId: string) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    await prisma.cluster.delete({
      where: {
        userId: user.id,
        id: clusterId,
      },
    });

    return { success: true };
  } catch (error) {
    throw new Error('Failed to delete cluster');
  }
}
