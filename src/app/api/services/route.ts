import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DEFAULT_SERVICES = [
    {
        name: 'Branding & Corporate Identity',
        description: "We'll help you create a look that people remember. No more generic designs—just a brand that feels like you.",
        category: 'Branding',
        image: '/signage-branding.png',
        items: ['Professional logos', 'Brand identity guides', 'Office & interior branding', 'Consistent look across all locations'],
        createdAt: new Date()
    },
    {
        name: 'Digital Printed Graphics',
        description: 'High-resolution prints that look sharp from across the street. Perfect for windows and massive banners.',
        category: 'Graphics',
        image: '/signage-digital-print.png',
        items: ['Large format printing', 'Wall & window graphics', 'Privacy films', 'Stickers & floor graphics'],
        createdAt: new Date()
    },
    {
        name: 'Vehicle Graphics & Fleet Branding',
        description: 'Turn your car, van, or truck into a mobile billboard. One of the best ways to get seen all over the city.',
        category: 'Vehicle',
        image: '/signage-vehicle.png',
        items: ['Full & partial wraps', 'Corporate fleet branding', 'Safety & reflective graphics', 'Mobile advertising'],
        createdAt: new Date()
    },
    {
        name: 'Exhibition, Display & POS Solutions',
        description: 'Indoor, outdoor, or glowing neon. We use tough materials that handle the UAE sun without fading.',
        category: 'Signage',
        image: '/signage-production.png',
        items: ['Outdoor signboards', 'Indoor office signs', '3D illuminated letters', 'Wayfinding signs'],
        createdAt: new Date()
    },
    {
        name: 'Signage Production & Installation',
        description: 'Exhibition booths and kiosks that make people want to walk over and say hi.',
        category: 'Exhibition',
        image: '/signage-exhibition.png',
        items: ['Custom exhibition stands', 'Portable kiosks', 'Pop-up backdrops', 'Roll-up banners'],
        createdAt: new Date()
    },
    {
        name: 'Cladding & Facade Solutions',
        description: 'Give your building a fresh, modern look. Turning old storefronts into local landmarks.',
        category: 'Cladding',
        image: '/signage-cladding.png',
        items: ['ACP cladding', 'Aluminum paneling', 'Shopfront branding', 'Modern architectural finishes'],
        createdAt: new Date()
    }
];

export async function GET() {
    try {
        const db = await getDatabase();
        const collection = db.collection('services');
        let services = await collection.find({}).sort({ createdAt: -1 }).toArray();

        if (services.length === 0) {
            await collection.insertMany(DEFAULT_SERVICES);
            services = await collection.find({}).sort({ createdAt: -1 }).toArray();
        }

        return NextResponse.json(services || []);
    } catch (error) {
        console.error('Error fetching services:', error);
        return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, description, category, items, image } = body;

        if (!name || !description || !category) {
            return NextResponse.json(
                { error: 'Name, description, and category are required' },
                { status: 400 }
            );
        }

        const service = {
            name,
            description,
            category,
            image: image || '',
            items: items ? items.filter((item: string) => item.trim()) : [],
            createdAt: new Date()
        };

        const db = await getDatabase();
        const result = await db.collection('services').insertOne(service);
        return NextResponse.json({
            message: 'Service added successfully',
            id: result.insertedId
        });
    } catch (error) {
        console.error('Error adding service:', error);
        return NextResponse.json({ error: 'Failed to add service' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const body = await request.json();
        const { name, description, category, items, image } = body;

        if (!name || !description || !category) {
            return NextResponse.json(
                { error: 'Name, description, and category are required' },
                { status: 400 }
            );
        }

        const db = await getDatabase();
        const result = await db.collection('services').updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    name,
                    description,
                    category,
                    image: image || '',
                    items: items ? items.filter((item: string) => item.trim()) : [],
                    updatedAt: new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Service updated successfully' });
    } catch (error) {
        console.error('Error updating service:', error);
        return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
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
        const result = await db.collection('services').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Service deleted successfully' });
    } catch (error) {
        console.error('Error deleting service:', error);
        return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
    }
}
