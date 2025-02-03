'use server';

import { getCurrentUser } from '@orc/web/lib/session';
import { prisma } from '@orc/prisma';

interface TimeseriesDataPoint {
  timestamp: string;
  count: number;
}

export async function getOrphanedResourcesTimeseries(clusterId: string, timeRange: number) {
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

    // Calculate the start date based on timeRange (in hours)
    const startDate = new Date();
    startDate.setHours(startDate.getHours() - timeRange);

    // Fetch snapshots with their orphaned resources count
    const snapshots = await prisma.snapshot.findMany({
      where: {
        clusterId,
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        createdAt: true,
        _count: {
          select: {
            orphanedResources: {
              where: {
                status: 'PENDING',
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Transform the data into the required format
    const timeseriesData: TimeseriesDataPoint[] = snapshots.map((snapshot) => ({
      timestamp: snapshot.createdAt.toISOString(),
      count: snapshot._count.orphanedResources,
    }));

    // If no data points exist, return an empty array
    if (timeseriesData.length === 0) {
      return {
        success: true,
        data: [],
      };
    }

    // Fill in gaps in the data if needed
    const filledData = fillDataGaps(timeseriesData, timeRange);

    return {
      success: true,
      data: filledData,
    };
  } catch (error) {
    console.error('Failed to fetch orphaned resources timeseries:', error);
    return {
      success: false,
      error,
      data: [],
    };
  }
}

function fillDataGaps(data: TimeseriesDataPoint[], timeRange: number): TimeseriesDataPoint[] {
  if (data.length === 0) return [];

  const filledData: TimeseriesDataPoint[] = [];
  const now = new Date();
  const startDate = new Date(now.getTime() - timeRange * 60 * 60 * 1000);

  let interval: number;

  // Determine the appropriate interval based on the time range
  if (timeRange <= 24) {
    interval = 60 * 60 * 1000; // 1 hour
  } else if (timeRange <= 168) {
    interval = 6 * 60 * 60 * 1000; // 6 hours
  } else {
    interval = 24 * 60 * 60 * 1000; // 1 day
  }

  let currentTime = startDate.getTime();
  let dataIndex = 0;

  while (currentTime <= now.getTime()) {
    const currentDate = new Date(currentTime);

    // Find the closest data point
    while (dataIndex < data.length && new Date(data[dataIndex].timestamp).getTime() < currentTime) {
      dataIndex++;
    }

    // Use the most recent previous value, or 0 if none exists
    const count = dataIndex > 0 ? data[dataIndex - 1].count : 0;

    filledData.push({
      timestamp: currentDate.toISOString(),
      count,
    });

    currentTime += interval;
  }

  return filledData;
}
