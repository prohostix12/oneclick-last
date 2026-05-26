import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const db = await getDatabase();
        const testimonials = await db.collection('testimonials')
            .find({})
            .sort({ createdAt: -1 })
            .toArray();
        return NextResponse.json({ testimonials: testimonials || [] });
    } catch (error) {
        console.error('Testimonials API Error:', error);
        // Return empty array instead of error to prevent UI crash
        return NextResponse.json({ testimonials: [] });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, company, role, message, rating } = body;

        if (!name || !company || !role || !message || !rating) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        const db = await getDatabase();
        const testimonial = {
            name,
            company,
            role,
            message,
            rating: parseInt(rating),
            createdAt: new Date()
        };

        const result = await db.collection('testimonials').insertOne(testimonial);

        return NextResponse.json({
            message: 'Testimonial added successfully',
            id: result.insertedId
        });
    } catch (error) {
        console.error('Error adding testimonial:', error);
        return NextResponse.json({ error: 'Failed to add testimonial' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const db = await getDatabase();
        await db.collection('testimonials').deleteOne({ _id: new ObjectId(id) });

        return NextResponse.json({ message: 'Testimonial deleted successfully' });
    } catch (error) {
        console.error('Error deleting testimonial:', error);
        return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
    }
}
