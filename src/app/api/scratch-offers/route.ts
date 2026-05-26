import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const status = searchParams.get('status') || 'all';
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    const db = await getDatabase();
    const scratchOffersCollection = db.collection('scratch_offers');

    const filter: any = {};
    if (status !== 'all') filter.status = status;
    if (dateFrom) filter.createdAt = { $gte: new Date(dateFrom) };
    if (dateTo) {
      filter.createdAt = { ...filter.createdAt, $lte: new Date(dateTo) };
    }

    const total = await scratchOffersCollection.countDocuments(filter);
    const offers = await scratchOffersCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    const todayOffers = await scratchOffersCollection.countDocuments({
      ...filter,
      createdAt: {
        $gte: new Date(new Date().toDateString()),
        $lt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
      }
    });

    const statistics = {
      totalOffers: total,
      todayOffers,
      offerTypes: ['percentage', 'free', 'fixed']
    };

    const pagination = {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    };

    return NextResponse.json({
      success: true,
      data: offers.map(o => ({ ...o, id: o._id?.toString() })),
      pagination,
      statistics
    });

  } catch (error) {
    console.error('Error fetching scratch offers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch scratch offers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.email || !body.phone || !body.offer) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new offer entry
    const newOffer = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      companyName: body.companyName || '',
      offer: body.offer,
      scratchedAt: body.scratchedAt || new Date().toISOString(),
      source: body.source || 'homepage',
      claimed: false,
      createdAt: new Date().toISOString(),
      status: 'claimed',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    const db = await getDatabase();
    const result = await db.collection('scratch_offers').insertOne(newOffer);
    
    console.log('New scratch offer saved:', result.insertedId);

    return NextResponse.json({
      success: true,
      data: { ...newOffer, id: result.insertedId },
      message: 'Scratch offer saved successfully'
    });

  } catch (error) {
    console.error('Error saving scratch offer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save scratch offer: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const offerId = searchParams.get('id');

    if (!offerId) {
      return NextResponse.json(
        { success: false, error: 'Offer ID is required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const result = await db.collection('scratch_offers').deleteOne({ _id: new ObjectId(offerId) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Offer not found' },
        { status: 404 }
      );
    }

    console.log('Scratch offer deleted:', offerId);

    return NextResponse.json({
      success: true,
      message: 'Offer deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting scratch offer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete scratch offer' },
      { status: 500 }
    );
  }
}