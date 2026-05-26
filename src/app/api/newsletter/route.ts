import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const db = await getDatabase();
        const subscribers = await db.collection('newsletter_subscribers').find({}).sort({ subscribedAt: -1 }).toArray();
        return NextResponse.json(subscribers.map(s => ({ ...s, id: s._id.toString() })));
    } catch (error) {
        console.error('Newsletter GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
        }

        const db = await getDatabase();
        const collection = db.collection('newsletter_subscribers');
        const existing = await collection.findOne({ email });

        if (existing) {
            if (existing.status === 'active') {
                return NextResponse.json({ error: 'Email already subscribed' }, { status: 409 });
            }
            await collection.updateOne({ email }, { $set: { status: 'active', subscribedAt: new Date().toISOString() } });
            return NextResponse.json({ message: 'Successfully resubscribed to newsletter!' });
        }

        const newSubscriber = { email, subscribedAt: new Date().toISOString(), status: 'active' };
        const result = await collection.insertOne(newSubscriber);
        return NextResponse.json({ message: 'Successfully subscribed to newsletter!', id: result.insertedId.toString() }, { status: 201 });
    } catch (error) {
        console.error('Newsletter POST error:', error);
        return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'Subscriber ID is required' }, { status: 400 });

        const db = await getDatabase();
        const result = await db.collection('newsletter_subscribers').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });

        return NextResponse.json({ message: 'Subscriber deleted successfully' });
    } catch (error) {
        console.error('Newsletter DELETE error:', error);
        return NextResponse.json({ error: 'Failed to delete subscriber' }, { status: 500 });
    }
}
