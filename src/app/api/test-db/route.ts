import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
    try {
        const db = await getDatabase();
        
        // Test database connection
        const collections = await db.listCollections().toArray();
        
        // Get counts from each collection
        const stats = {
            connected: true,
            database: db.databaseName,
            collections: collections.map(c => c.name),
            counts: {
                contacts: await db.collection('contacts').countDocuments(),
                services: await db.collection('services').countDocuments(),
                testimonials: await db.collection('testimonials').countDocuments(),
            }
        };

        return NextResponse.json({
            success: true,
            message: 'Database connection successful',
            stats
        });
    } catch (error) {
        console.error('Database test error:', error);
        return NextResponse.json({
            success: false,
            error: 'Database connection failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
