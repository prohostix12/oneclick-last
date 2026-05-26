import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SETTINGS_ID = 'main_config';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');

    const db = await getDatabase();
    if (featured === 'true') {
      const settings = await db.collection('offer_settings').findOne({ configId: SETTINGS_ID });
      if (!settings?.featuredOfferId) return NextResponse.json({ success: true, data: null });
      const featuredOffer = await db.collection('offers').findOne({ _id: new ObjectId(settings.featuredOfferId) });
      return NextResponse.json({ success: true, data: featuredOffer ? { ...featuredOffer, id: featuredOffer._id.toString() } : null });
    }
    const offers = await db.collection('offers').find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, data: offers.map(o => ({ ...o, id: o._id.toString() })) });
  } catch (error) {
    console.error('Error fetching offers:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch offers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newOffer = {
      title: body.title, description: body.description, discount: body.discount,
      type: body.type || 'percentage', color: body.color || '#e61e25',
      active: body.active !== false, createdAt: new Date().toISOString()
    };

    const db = await getDatabase();
    const result = await db.collection('offers').insertOne(newOffer);
    return NextResponse.json({ success: true, data: { ...newOffer, id: result.insertedId.toString() }, message: 'Offer created' });
  } catch (error) {
    console.error('Error creating offer:', error);
    return NextResponse.json({ success: false, error: 'Failed to create offer' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
    delete updateData._id;

    const db = await getDatabase();
    const result = await db.collection('offers').updateOne({ _id: new ObjectId(id) }, { $set: updateData });
    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Offer not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Offer updated' });
  } catch (error) {
    console.error('Error updating offer:', error);
    return NextResponse.json({ success: false, error: 'Failed to update offer' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

    const db = await getDatabase();
    const result = await db.collection('offers').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Offer not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Offer deleted successfully' });
  } catch (error) {
    console.error('Error deleting offer:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete offer' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { featuredOfferId } = body;
    if (!featuredOfferId) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

    const db = await getDatabase();
    await db.collection('offer_settings').updateOne({ configId: SETTINGS_ID }, { $set: { featuredOfferId } }, { upsert: true });
    return NextResponse.json({ success: true, message: 'Featured offer updated successfully' });
  } catch (error) {
    console.error('Error updating featured offer:', error);
    return NextResponse.json({ success: false, error: 'Failed to update featured offer' }, { status: 500 });
  }
}
