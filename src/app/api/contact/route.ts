import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Name, email, and message are required fields.' }, { status: 400 });
        }

        const entry = { name, email, phone: phone || null, message, createdAt: new Date().toISOString() };

        const db = await getDatabase();
        const result = await db.collection('contacts').insertOne(entry);
        return NextResponse.json({ success: true, message: 'Message received successfully!', data: { id: result.insertedId } }, { status: 201 });
    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const db = await getDatabase();
        const submissions = await db.collection('contacts').find({}).sort({ createdAt: -1 }).toArray();
        return NextResponse.json(submissions || []);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        const db = await getDatabase();
        await db.collection('contacts').deleteOne({ _id: new ObjectId(id) });
        return NextResponse.json({ message: 'Contact deleted successfully' });
    } catch (error) {
        console.error('Error deleting contact:', error);
        return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
    }
}
