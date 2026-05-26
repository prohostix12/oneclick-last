import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SETTINGS_ID = 'main_config';

const defaultSettings = {
  enabled: false,
  limit: 100,
  expiryDate: '2026-12-31',
  offers: [] as object[]
};

export async function GET() {
  try {
    const db = await getDatabase();
    const settings = await db.collection('offer_settings').findOne({ configId: SETTINGS_ID });
    return NextResponse.json({ success: true, ...(settings || defaultSettings) });
  } catch (error) {
    console.error('Error fetching offer settings:', error);
    return NextResponse.json({ success: true, ...defaultSettings });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { _id, ...updateData } = body;

    const db = await getDatabase();
    await db.collection('offer_settings').updateOne(
      { configId: SETTINGS_ID },
      { $set: { ...updateData, configId: SETTINGS_ID } },
      { upsert: true }
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving offer settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to save settings' }, { status: 500 });
  }
}
