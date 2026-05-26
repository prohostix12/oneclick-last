import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId, Db } from 'mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface BlogPost {
    title: string;
    excerpt: string;
    content: string;
    author: string;
    date: string;
    category: string;
    image: string;
    status: 'published' | 'draft';
    readTime: string;
}

const defaultPosts: BlogPost[] = [
    {
        title: 'Latest Signage Design Trends in UAE 2024',
        excerpt: 'Discover the cutting-edge design trends shaping the advertising landscape in the UAE this year.',
        content: `<h2>The Evolution of Signage Design in the UAE</h2><p>The UAE's advertising landscape is constantly evolving, driven by technological advancements and changing consumer preferences. In 2024, we're seeing several key trends that are reshaping how businesses communicate with their audiences.</p><h3>1. Sustainable Materials and Eco-Friendly Designs</h3><p>Environmental consciousness is becoming increasingly important in the UAE. Businesses are now opting for sustainable materials like recycled aluminum, bamboo composites, and solar-powered LED systems.</p><h3>2. Interactive Digital Displays</h3><p>Touch-enabled displays and QR code integration are becoming standard. These interactive elements allow customers to engage directly with brands.</p><h3>3. Minimalist Arabic Typography</h3><p>Clean, modern Arabic fonts are gaining popularity, especially in Dubai and Abu Dhabi.</p><h3>4. Smart Signage with IoT Integration</h3><p>Internet of Things (IoT) technology is enabling signs to collect data, adjust content based on weather conditions, and even monitor foot traffic patterns.</p>`,
        author: 'Design Team',
        date: '2024-03-10',
        category: 'Design Trends',
        image: '/signage-branding.png',
        status: 'published',
        readTime: '5 min read'
    },
    {
        title: 'ROI Analysis: Digital vs Traditional Signage',
        excerpt: 'A comprehensive case study comparing the return on investment between digital and traditional advertising methods.',
        content: `<h2>Understanding ROI in Modern Advertising</h2><p>In today's competitive market, businesses need to make informed decisions about their advertising investments. This comprehensive analysis examines the return on investment (ROI) of digital versus traditional signage solutions.</p><h3>Traditional Signage: The Foundation</h3><p>Traditional signage has been the backbone of outdoor advertising for decades. Average ROI: 150-200% over 3 years.</p><h3>Digital Signage: The Future</h3><p>Digital displays offer dynamic content capabilities and real-time updates. Average ROI: 250-350% over 3 years.</p>`,
        author: 'Marketing Team',
        date: '2024-03-08',
        category: 'Case Studies',
        image: '/signage-digital-print.png',
        status: 'published',
        readTime: '8 min read'
    },
    {
        title: 'Dubai Municipality Signage Regulations Update',
        excerpt: 'Important updates to signage regulations in Dubai that every business owner should know.',
        content: `<h2>New Signage Regulations in Dubai</h2><p>Dubai Municipality has updated its signage regulations to ensure better urban aesthetics and safety standards.</p><h3>Key Changes</h3><ul><li>New size restrictions for commercial signage</li><li>Updated color guidelines for heritage areas</li><li>Digital display brightness limitations</li><li>Enhanced safety requirements for installation</li></ul><h3>Compliance Timeline</h3><p>All existing signage must comply with new regulations by December 2024.</p>`,
        author: 'Legal Team',
        date: '2024-03-05',
        category: 'Regulations',
        image: '/signage-cladding.png',
        status: 'published',
        readTime: '6 min read'
    },
    {
        title: 'Essential Maintenance Tips for Outdoor LED Displays',
        excerpt: "Keep your LED displays running efficiently in UAE's harsh climate with these proven maintenance strategies.",
        content: `<h2>Protecting Your LED Investment in the UAE</h2><p>LED displays are a significant investment, and proper maintenance is crucial for maximizing their lifespan in the UAE's challenging climate conditions.</p><h3>Daily Maintenance Checklist</h3><ul><li>Visual Inspection: Check for dead pixels, color inconsistencies, or physical damage</li><li>Brightness Check: Ensure displays are visible but not overly bright</li><li>Content Verification: Confirm all content is displaying correctly</li><li>Temperature Monitoring: Check cooling systems are functioning properly</li></ul>`,
        author: 'Technical Team',
        date: '2024-03-09',
        category: 'Maintenance Tips',
        image: '/signage-production.png',
        status: 'published',
        readTime: '7 min read'
    }
];

async function seedIfEmpty(db: Db) {
    const count = await db.collection('blog_posts').countDocuments();
    if (count === 0) {
        const posts = defaultPosts.map(p => ({ ...p, createdAt: new Date() }));
        await db.collection('blog_posts').insertMany(posts);
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const status = searchParams.get('status');

        const db = await getDatabase();
        await seedIfEmpty(db);

        if (id) {
            const post = await db.collection('blog_posts').findOne({ _id: new ObjectId(id) });
            if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
            return NextResponse.json({ ...post, id: post._id.toString() });
        }

        const filter: Record<string, string> = {};
        if (status && status !== 'all') filter.status = status;

        const posts = await db.collection('blog_posts').find(filter).sort({ createdAt: -1 }).toArray();
        return NextResponse.json(posts.map(p => ({ ...p, id: p._id.toString() })));
    } catch (error) {
        console.error('Blog GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const postData = await request.json();
        const newPost = {
            title: postData.title,
            excerpt: postData.excerpt,
            content: postData.content,
            author: postData.author || 'Admin',
            date: new Date().toISOString().split('T')[0],
            category: postData.category,
            image: postData.image,
            status: postData.status || 'draft',
            readTime: `${Math.ceil((postData.content?.length || 0) / 1000)} min read`,
            createdAt: new Date()
        };

        const db = await getDatabase();
        const result = await db.collection('blog_posts').insertOne(newPost);
        return NextResponse.json({ ...newPost, id: result.insertedId.toString() }, { status: 201 });
    } catch (error) {
        console.error('Blog POST error:', error);
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const postData = await request.json();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });

        const { _id, ...updateFields } = postData;
        const db = await getDatabase();
        const result = await db.collection('blog_posts').updateOne(
            { _id: new ObjectId(id) },
            { $set: { ...updateFields, updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

        const updated = await db.collection('blog_posts').findOne({ _id: new ObjectId(id) });
        return NextResponse.json({ ...updated, id: updated!._id.toString() });
    } catch (error) {
        console.error('Blog PUT error:', error);
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });

        const db = await getDatabase();
        const result = await db.collection('blog_posts').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

        return NextResponse.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Blog DELETE error:', error);
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}
