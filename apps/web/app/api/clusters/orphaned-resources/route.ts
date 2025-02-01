import { prisma } from '@orc/prisma';
import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const communicationPayloadSchema = z.object({
  clusterName: z.string().min(1, 'Cluster name is required'),
  clusterId: z.string().min(1, 'Cluster ID is required'),
  userId: z.string().min(1, 'User ID is required'),
});

const orphanedResourceSchema = z.object({
  kind: z.string().min(1, 'Resource kind is required'),
  name: z.string().min(1, 'Resource name is required'),
  namespace: z.string().optional(),
  uid: z.string().min(1, 'Resource UID is required'),
  owner: z
    .object({
      apiVersion: z.string().optional(),
      kind: z.string().optional(),
      name: z.string().optional(),
      uid: z.string().optional(),
    })
    .nullable()
    .optional(),
  reason: z.string().min(1, 'Reason is required'),
  labels: z.record(z.string()).optional(),
  annotations: z.record(z.string()).optional(),
});

const reportSchema = z.object({
  timestamp: z.preprocess((arg) => (typeof arg === 'string' ? new Date(arg) : arg), z.date()),
  orphanedResources: z.array(orphanedResourceSchema),
  summary: z.object({
    totalScanned: z.number().int().nonnegative(),
    totalOrphaned: z.number().int().nonnegative(),
    totalSkipped: z.number().int().nonnegative(),
    totalErrors: z.number().int().nonnegative(),
    scanDuration: z.number().int().nonnegative(),
  }),
});

export async function POST(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return new Response('Unauthorized', { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.CLUSTER_COMMUNICATION_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const parsedPayload = communicationPayloadSchema.safeParse(payload);

    if (!parsedPayload.success) {
      return NextResponse.json({ error: 'Unauthorized', details: parsedPayload.error.errors }, { status: 401 });
    }

    const requestBody = await request.json();
    const parsedReport = reportSchema.safeParse(requestBody);

    if (!parsedReport.success) {
      return NextResponse.json({ error: 'Invalid request data', details: parsedReport.error.errors }, { status: 400 });
    }

    await prisma.cluster.update({
      where: { userId: parsedPayload.data.userId, id: parsedPayload.data.clusterId },
      data: {
        lastSeen: new Date(),
        status: 'ACTIVE',
      },
    });

    await prisma.$transaction(
      parsedReport.data.orphanedResources.map((resource) =>
        prisma.orphanedResource.create({
          data: {
            clusterId: parsedPayload.data.clusterId,
            kind: resource.kind,
            name: resource.name,
            namespace: resource.namespace,
            uid: resource.uid,
            reason: resource.reason,
            discoveredAt: new Date(),
            status: 'PENDING',
          },
        }),
      ),
    );

    return new Response('OK');
  } catch (error) {
    console.error('Failed to record orphaned resource:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
