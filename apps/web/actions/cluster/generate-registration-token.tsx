'use server';

import { SignJWT } from 'jose';
import { redisClient } from '@orc/redis';
import { getCurrentUser } from '@orc/web/lib/session';

export async function generateRegistrationToken(clusterName: string) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const registrationId = crypto.randomUUID();

    const secret = new TextEncoder().encode(process.env.CLUSTER_REGISTRATION_SECRET);
    const registrationToken = await new SignJWT({
      registrationId,
      clusterName,
      userId: user.id,
      type: 'registration',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(secret);
      
    await redisClient.setex(
      `pending_registration:${registrationId}`,
      3600,
      JSON.stringify({
        clusterName,
        userId: user.id,
        registrationToken,
      }),
    );

    return {
      success: true,
      token: registrationToken,
      registrationId,
    };
  } catch (error) {
    return { success: false, error: 'Failed to generate token' };
  }
}
