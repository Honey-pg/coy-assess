import { NextResponse } from 'next/server';
import { DiscoveryService } from '@/lib/discovery-service';
import { DEMO_USER_ID } from '@/lib/db';
import { seedDatabase } from '@/scripts/seed';

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const fullReset = url.searchParams.get('full') === 'true';

    if (fullReset) {
      seedDatabase({ reset: true });
    } else {
      DiscoveryService.resetUserData(DEMO_USER_ID);
    }

    return NextResponse.json({ success: true, message: 'Swipes and matches reset successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
