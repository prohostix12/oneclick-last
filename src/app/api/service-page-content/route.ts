import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DEFAULT_CONTENT = {
    hero: {
        title: "Get Noticed Every",
        titleHighlight: "where",
        subtitle: "We're here to help you get your business in front of the right people. No stress, no confusion—just high-quality ads that work."
    },
    servicesSection: {
        title: "What we",
        titleItalic: "do",
        subtitle: "Everything you need to make your business look its best."
    },
    whyChoose: {
        heading: "Why Choose One Click",
        intro: "As the leader in outdoor advertising, we deliver measurable results through strategic placements and creative excellence.",
        points: [
            { title: "Extensive Network", desc: "Access the most premium advertising locations across all of UAE." },
            { title: "Premium Quality", desc: "We use high-grade, durable materials to ensure long-lasting brand impact." },
            { title: "Strategic Precision", desc: "Data-driven placements that reach your specific target demographic." },
            { title: "Full Scale Service", desc: "From design and planning to installation and legal approvals." }
        ]
    },
    accordion: [
        { title: "You'll be seen", content: "We pick the best spots so your brand gets the most attention from people passing by." },
        { title: "All over the UAE", content: "From the busy streets of Dubai to the main hubs in Abu Dhabi, we've got you covered." },
        { title: "No waiting around", content: "We work quickly to get your campaign live so you can start seeing results sooner." },
        { title: "We handle everything", content: "From the first design to the final install, we take care of the hard work for you." }
    ],
    cta: {
        title: "Ready to make your brand",
        titleItalic: "impossible to ignore?",
        subtitle: "Launch your advertising campaign with high-impact placements across prime locations - fast, simple, and effective.",
        buttonText: "Get started",
        buttonLink: "/contact#campaign"
    },
    staticServices: [
        {
            title: "Branding & Corporate Identity",
            image: "/signage-branding.png",
            description: "We'll help you create a look that people remember. No more generic designs—just a brand that feels like you.",
            details: ["Professional logos", "Brand identity guides", "Office & interior branding", "Consistent look across all locations"],
            link: "/services/branding"
        },
        {
            title: "Digital Printed Graphics",
            image: "/signage-digital-print.png",
            description: "High-resolution prints that look sharp from across the street. Perfect for windows and massive banners.",
            details: ["Large format printing", "Wall & window graphics", "Privacy films", "Stickers & floor graphics", "Custom wallpaper"],
            link: "/services/digital-graphics"
        },
        {
            title: "Vehicle Graphics & Fleet Branding",
            image: "/signage-vehicle.png",
            description: "Turn your car, van, or truck into a mobile billboard. One of the best ways to get seen all over the city.",
            details: ["Full & partial wraps", "Corporate fleet branding", "Safety & reflective graphics", "Mobile advertising"],
            link: "/services/vehicle-branding"
        },
        {
            title: "Exhibition, Display & POS Solutions",
            image: "/signage-production.png",
            description: "Indoor, outdoor, or glowing neon. We use tough materials that handle the UAE sun without fading.",
            details: ["Outdoor signboards", "Indoor office signs", "3D illuminated letters", "Wayfinding signs", "Retail & mall signage"],
            link: "/services/signage"
        },
        {
            title: "Signage Production & Installation",
            image: "/signage-exhibition.png",
            description: "Exhibition booths and kiosks that make people want to walk over and say hi.",
            details: ["Custom exhibition stands", "Portable kiosks", "Pop-up backdrops", "Roll-up banners", "In-store displays"],
            link: "/services/exhibition"
        },
        {
            title: "Cladding & Facade Solutions",
            image: "/signage-cladding.png",
            description: "Give your building a fresh, modern look. Turning old storefronts into local landmarks.",
            details: ["ACP cladding", "Aluminum paneling", "Shopfront branding", "Modern architectural finishes", "Integrated signage"],
            link: "/services/cladding"
        }
    ]
};

export async function GET() {
    try {
        const db = await getDatabase();
        const doc = await db.collection('servicePageContent').findOne({ _id: 'main' as any });
        if (doc) {
            const { _id, ...content } = doc;
            return NextResponse.json({ ...DEFAULT_CONTENT, ...content });
        }
        return NextResponse.json(DEFAULT_CONTENT);
    } catch (error) {
        console.error('Service page content GET error:', error);
        return NextResponse.json(DEFAULT_CONTENT);
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const db = await getDatabase();
        await db.collection('servicePageContent').updateOne(
            { _id: 'main' as any },
            { $set: { ...body, updatedAt: new Date() } },
            { upsert: true }
        );
        return NextResponse.json({ message: 'Page content updated successfully' });
    } catch (error) {
        console.error('Service page content PUT error:', error);
        return NextResponse.json({ error: 'Failed to update page content' }, { status: 500 });
    }
}
