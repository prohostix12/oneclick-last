import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface LeadData {
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  interestedService: string;
  submittedAt: string;
  source: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: LeadData = await request.json();

    // Validation
    const { fullName, email, phone, interestedService } = body;

    if (!fullName || !email || !phone || !interestedService) {
      return NextResponse.json(
        { error: 'Missing required fields: fullName, email, phone, and interestedService are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Phone validation (basic)
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    const leadData = {
      ...body,
      emailLower: email.toLowerCase(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'new',
      submittedAt: body.submittedAt || new Date().toISOString(),
    };

    const database = await getDatabase();
    const leadsCollection = database.collection('leads');
    const existingLead = await leadsCollection.findOne({ emailLower: email.toLowerCase() });

    if (existingLead) {
      await leadsCollection.updateOne(
        { emailLower: email.toLowerCase() },
        { $set: { ...leadData, updatedAt: new Date().toISOString() } }
      );
      return NextResponse.json({ success: true, message: 'Lead updated', leadId: existingLead._id, isUpdate: true });
    } else {
      const result = await leadsCollection.insertOne(leadData);
      return NextResponse.json({ success: true, message: 'Lead captured', leadId: result.insertedId, isUpdate: false });
    }

  } catch (error) {
    console.error('Error processing lead:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const status = searchParams.get('status');
  const service = searchParams.get('service');
  const search = searchParams.get('search');

  try {
    const database = await getDatabase();
    const leadsCollection = database.collection('leads');

    const filter: any = {};
    if (status) filter.status = status;
    if (service) filter.interestedService = service;
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await leadsCollection.countDocuments(filter);
    const leads = await leadsCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    const interestStats = await leadsCollection.aggregate([
      { $group: { _id: '$interestedService', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray();

    return NextResponse.json({ success: true, data: leads, pagination: { page, limit, total, pages: Math.ceil(total / limit) }, interestStats });

  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const database = await getDatabase();
    const result = await database.collection('leads').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Lead deleted' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}