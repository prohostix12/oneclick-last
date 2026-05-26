import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const db = await getDatabase();
    const leads = await db.collection('offer_leads').find({}).sort({ date: -1 }).toArray();
    return NextResponse.json({ success: true, data: leads });
  } catch (error) {
    console.error('Error fetching offer leads:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, businessName, offerWon, offerId } = body;

    if (!name || !phone || !email || !businessName) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }

    const newLead = {
      name, phone, email, businessName, offerWon, offerId,
      date: new Date().toISOString(),
      status: 'pending'
    };

    const db = await getDatabase();
    const result = await db.collection('offer_leads').insertOne(newLead);
    return NextResponse.json({ success: true, data: { ...newLead, id: result.insertedId } });
  } catch (error) {
    console.error('Error saving lead:', error);
    return NextResponse.json({ success: false, error: 'Failed to save lead' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

    const db = await getDatabase();
    await db.collection('offer_leads').deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete lead' }, { status: 500 });
  }
}
