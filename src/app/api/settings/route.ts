import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const CONFIG_ID = 'main_settings';

export async function GET() {
  try {
    const db = await getDatabase();
    const settings = await db.collection('settings').findOne({ configId: CONFIG_ID });
    if (!settings) return NextResponse.json({});
    const { _id, configId, ...data } = settings;
    return NextResponse.json(data);
  } catch (e) {
    console.error('GET /api/settings error', e);
    return NextResponse.json({}, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, phone, location } = body;
    if (!email || !phone || !location) {
      return NextResponse.json({ error: 'email, phone, and location are required' }, { status: 400 });
    }
    const settings = { email, phone, location };
    const db = await getDatabase();
    await db.collection('settings').updateOne(
      { configId: CONFIG_ID },
      { $set: { ...settings, configId: CONFIG_ID } },
      { upsert: true }
    );
    return NextResponse.json({ success: true, settings });
  } catch (e) {
    console.error('POST /api/settings error', e);
    return NextResponse.json({ error: 'internal server error' }, { status: 500 });
  }
}
