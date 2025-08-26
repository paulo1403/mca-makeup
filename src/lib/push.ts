import webpush from 'web-push';
import { prisma } from '@/lib/prisma';

const VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY || '';

if (VAPID_PUBLIC && VAPID_PRIVATE) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:admin@example.com',
    VAPID_PUBLIC,
    VAPID_PRIVATE,
  );
}

export const getVapidPublicKey = () => VAPID_PUBLIC;

export async function sendPushToAll(payload: any) {
  // Fetch subscriptions
  let subs: Array<any> = [];
  try {
    subs = await prisma.pushSubscription.findMany();
  } catch (err: any) {
    // If the table doesn't exist (P2021) or other DB error, log and return empty results.
    // This avoids a 500 that breaks the whole flow when the migrations haven't been applied yet.
    console.error('Error fetching push subscriptions, continuing with zero subs', err?.code || err);
    return [];
  }

  const results = [] as Array<{ endpoint: string; success: boolean; error?: any }>;

  for (const s of subs) {
    try {
      const subscription = {
        endpoint: s.endpoint,
        keys: s.keys as { p256dh: string; auth: string },
      };

      await webpush.sendNotification(subscription as any, JSON.stringify(payload));
      results.push({ endpoint: s.endpoint, success: true });
    } catch (err) {
      // If subscription is invalid, remove it
      const status = (err as any)?.statusCode || (err as any)?.status;
      if (status === 410 || status === 404) {
        try {
          await prisma.pushSubscription.delete({ where: { endpoint: s.endpoint } });
        } catch {}
      }
      results.push({ endpoint: s.endpoint, success: false, error: err });
    }
  }

  return results;
}

export async function sendToSubscription(subscription: any, payload: any) {
  try {
    await webpush.sendNotification(subscription as any, JSON.stringify(payload));
    return { success: true };
  } catch (err) {
    const status = (err as any)?.statusCode || (err as any)?.status;
    // If subscription is invalid (gone), return the status so caller can decide to remove locally
    return { success: false, error: err, status };
  }
}
