import { MongoClient } from 'mongodb';

const uri = process.env.DATABASE_URL || "mongodb+srv://oneclick:oneclick@cluster0.0p19qlw.mongodb.net/advertisement?appName=Cluster0";

async function main() {
    console.log('Connecting to MongoDB...');
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected successfully to MongoDB');

        const db = client.db();

        // 1. Clear existing data
        console.log('Clearing existing data...');
        await db.collection('contacts').deleteMany({});
        await db.collection('testimonials').deleteMany({});
        await db.collection('industries').deleteMany({});
        await db.collection('projects').deleteMany({});
        await db.collection('services').deleteMany({});
        await db.collection('team').deleteMany({});

        // 2. Contacts
        console.log('Seeding contacts...');
        const contacts = [
            {
                name: "Ahmed Al Mansouri",
                email: "ahmed@retailgroup.ae",
                phone: "+971 50 123 4567",
                message: "Looking for AI-driven signage solutions for our new mall launch in Dubai Marina.",
                createdAt: new Date()
            },
            {
                name: "Sara Jenkins",
                email: "sara@marketinghub.com",
                phone: "+971 55 987 6543",
                message: "Requesting a quote for fleet brand transformation project covering 50+ vehicles.",
                createdAt: new Date()
            },
            {
                name: "John Doe",
                email: "j.doe@corporate.ae",
                phone: "+971 52 555 1111",
                message: "Interested in the Digital Facade solution for our HQ building in Business Bay.",
                createdAt: new Date()
            }
        ];
        await db.collection('contacts').insertMany(contacts);

        // 3. Testimonials
        console.log('Seeding testimonials...');
        const testimonials = [
            { 
                name: "Ahmed Al Mansouri", 
                role: "CEO, Emirates Retail Group", 
                company: "Emirates Retail Group",
                quote: "One Click Advertisement transformed our mall's visual identity with their AI-driven design approach. The results exceeded our expectations, and the installation was flawless.",
                rating: 5,
                image: "/images/testimonial-1.jpg",
                createdAt: new Date() 
            },
            { 
                name: "Sarah Jenkins", 
                role: "Marketing Director, Global Brands", 
                company: "Global Brands LLC",
                quote: "Absolute precision in their cladding solutions. The team was professional, timely, and delivered exceptional quality. Our building facade is now a landmark in Dubai.",
                rating: 5,
                image: "/images/testimonial-2.jpg",
                createdAt: new Date() 
            },
            { 
                name: "Mohammed Hassan", 
                role: "Operations Head, Tech Solutions", 
                company: "Tech Solutions DMCC",
                quote: "Transformed our headquarters into a tech landmark. The digital signage integration was seamless, and their support team is outstanding.",
                rating: 5,
                image: "/images/testimonial-3.jpg",
                createdAt: new Date() 
            },
            { 
                name: "Lisa Chen", 
                role: "Brand Manager, Luxury Motors", 
                company: "Luxury Motors",
                quote: "Their fleet branding service is unmatched. All 30 of our vehicles now showcase our brand perfectly, and the RTA approval process was handled smoothly.",
                rating: 5,
                image: "/images/testimonial-4.jpg",
                createdAt: new Date() 
            }
        ];
        await db.collection('testimonials').insertMany(testimonials);

        // 4. Industries
        console.log('Seeding industries...');
        const industries = [
            { name: "Retail & Malls", icon: "Store", description: "Premium signage and branding for shopping centers", projectCount: 150, createdAt: new Date() },
            { name: "Corporate Centers", icon: "Briefcase", description: "Professional office branding and wayfinding", projectCount: 200, createdAt: new Date() },
            { name: "Real Estate", icon: "Building2", description: "Property marketing and facade solutions", projectCount: 180, createdAt: new Date() },
            { name: "Automotive", icon: "Car", description: "Fleet branding and showroom displays", projectCount: 120, createdAt: new Date() },
            { name: "Hospitality", icon: "Hotel", description: "Hotel and restaurant branding solutions", projectCount: 90, createdAt: new Date() },
            { name: "Healthcare", icon: "HeartPulse", description: "Medical facility signage and wayfinding", projectCount: 75, createdAt: new Date() }
        ];
        await db.collection('industries').insertMany(industries);

        // 5. Projects Portfolio
        console.log('Seeding projects...');
        const projects = [
            {
                title: "Brand Identity Showcase",
                description: "Complete visual identity transformation featuring premium logo design, color theory application, and comprehensive brand guidelines for a global corporate client.",
                category: "Brand Identity",
                images: ["/signage-branding.png", "/about-hero-bg.png"],
                status: "published",
                createdAt: new Date()
            },
            {
                title: "Digital Printing Excellence",
                description: "High-precision large format printing for luxury retail displays, capturing vibrant colors and sharp details to maximize visual pull in high-traffic shopping malls.",
                category: "Digital Printing",
                images: ["/signage-digital-print.png", "/services-hero-bg.png"],
                status: "published",
                createdAt: new Date()
            },
            {
                title: "Indoor Creative Displays",
                description: "Innovative indoor banner solutions for corporate environments, utilizing premium materials and high-definition printing to deliver clear and professional brand messaging.",
                category: "Digital Printing",
                images: ["/signage-exhibition.png", "https://i.pinimg.com/736x/c0/d4/de/c0d4de585c6bcff79eeb27a950e60112.jpg"],
                status: "published",
                createdAt: new Date()
            },
            {
                title: "Premium Vehicle Wraps",
                description: "State-of-the-art vehicle branding for commercial fleets, using high-durability vinyl to ensure long-lasting brand visibility across the UAE.",
                category: "Vehicle Branding",
                images: ["/signage-vehicle.png", "https://lirp.cdn-website.com/08d904d8/dms3rep/multi/opt/fleet+wraps+roseville-1920w.jpg"],
                status: "published",
                createdAt: new Date()
            },
            {
                title: "Strategic Signage Systems",
                description: "High-visibility 3D LED signage installations designed for maximum impact in premium commercial districts, ensuring your brand stays visible 24/7.",
                category: "Signage",
                images: ["/signage-cladding.png", "/services-hero-bg.png"],
                status: "published",
                createdAt: new Date()
            },
            {
                title: "Commercial Wayfinding",
                description: "Comprehensive wayfinding and directional signage solutions for large-scale developments, merging functionality with sophisticated design.",
                category: "Signage",
                images: ["/projects-hero-bg.png", "/signage-production.png"],
                status: "published",
                createdAt: new Date()
            },
            {
                title: "POS Display Solutions",
                description: "Custom-designed point-of-sale displays focused on driving customer engagement and maximizing product visibility in competitive retail settings.",
                category: "Display Solutions",
                images: ["/signage-exhibition.png", "/about-hero-bg.png"],
                status: "published",
                createdAt: new Date()
            },
            {
                title: "Architectural Facades",
                description: "Premium building facade solutions combining high-quality ACP cladding with integrated signage to create a powerful architectural identity.",
                category: "Facade & Cladding",
                images: ["/signage-cladding.png", "/signage-branding.png"],
                status: "published",
                createdAt: new Date()
            },
            {
                title: "Frosted Glass Sticker Design",
                description: "Premium frosted glass vinyl sticker solutions for offices, storefronts, and conference rooms. Our precision-cut frosted films combine elegant privacy with striking brand visibility, featuring custom logo etchings, decorative patterns, and sandblasted effects that transform ordinary glass into sophisticated branding surfaces.",
                category: "Frosted Glass Sticker",
                images: ["/frosted-glass-4.png", "/frosted-glass-5.png", "/frosted-glass-1.png"],
                status: "published",
                createdAt: new Date()
            }
        ];
        await db.collection('projects').insertMany(projects);

        // 6. Services
        console.log('Seeding services...');
        const services = [
            {
                name: "Branding & Corporate Identity",
                description: "We'll help you create a look that people remember. No more generic designs—just a brand that feels like you.",
                category: "Branding",
                image: "/signage-branding.png",
                items: ["Professional logos", "Brand identity guides", "Office & interior branding", "Consistent look across all locations"],
                createdAt: new Date()
            },
            {
                name: "Digital Printed Graphics",
                description: "High-resolution prints that look sharp from across the street. Perfect for windows and massive banners.",
                category: "Digital Printing",
                image: "/signage-digital-print.png",
                items: ["Large format printing", "Wall & window graphics", "Privacy films", "Stickers & floor graphics", "Custom wallpaper"],
                createdAt: new Date()
            },
            {
                name: "Vehicle Graphics & Fleet Branding",
                description: "Turn your car, van, or truck into a mobile billboard. One of the best ways to get seen all over the city.",
                category: "Vehicle Branding",
                image: "/signage-vehicle.png",
                items: ["Full & partial wraps", "Corporate fleet branding", "Safety & reflective graphics", "Mobile advertising"],
                createdAt: new Date()
            },
            {
                name: "Exhibition, Display & POS Solutions",
                description: "Indoor, outdoor, or glowing neon. We use tough materials that handle the UAE sun without fading.",
                category: "Display Solutions",
                image: "/signage-production.png",
                items: ["Outdoor signboards", "Indoor office signs", "3D illuminated letters", "Wayfinding signs", "Retail & mall signage"],
                createdAt: new Date()
            },
            {
                name: "Signage Production & Installation",
                description: "Exhibition booths and kiosks that make people want to walk over and say hi.",
                category: "Signage",
                image: "/signage-exhibition.png",
                items: ["Custom exhibition stands", "Portable kiosks", "Pop-up backdrops", "Roll-up banners", "In-store displays"],
                createdAt: new Date()
            },
            {
                name: "Cladding & Facade Solutions",
                description: "Give your building a fresh, modern look. Turning old storefronts into local landmarks.",
                category: "Facade & Cladding",
                image: "/signage-cladding.png",
                items: ["ACP cladding", "Aluminum paneling", "Shopfront branding", "Modern architectural finishes", "Integrated signage"],
                createdAt: new Date()
            }
        ];
        await db.collection('services').insertMany(services);

        // 7. Team Members
        console.log('Seeding team...');
        const team = [
            {
                name: "Khalid Al Mazrouei",
                role: "CEO & Founder",
                bio: "15+ years of experience in advertising and signage industry",
                image: "/images/team-1.jpg",
                email: "khalid@oneclickadv.ae",
                linkedin: "https://linkedin.com",
                createdAt: new Date()
            },
            {
                name: "Sarah Williams",
                role: "Creative Director",
                bio: "Award-winning designer specializing in brand identity",
                image: "/images/team-2.jpg",
                email: "sarah@oneclickadv.ae",
                linkedin: "https://linkedin.com",
                createdAt: new Date()
            },
            {
                name: "Ahmed Hassan",
                role: "Technical Director",
                bio: "Expert in LED technology and digital signage systems",
                image: "/images/team-3.jpg",
                email: "ahmed@oneclickadv.ae",
                linkedin: "https://linkedin.com",
                createdAt: new Date()
            },
            {
                name: "Maria Rodriguez",
                role: "Project Manager",
                bio: "Certified PMP with 10+ years in project delivery",
                image: "/images/team-4.jpg",
                email: "maria@oneclickadv.ae",
                linkedin: "https://linkedin.com",
                createdAt: new Date()
            }
        ];
        await db.collection('team').insertMany(team);

        console.log('✅ Successfully seeded all data to MongoDB!');
        console.log(`- contacts: ${contacts.length}`);
        console.log(`- testimonials: ${testimonials.length}`);
        console.log(`- industries: ${industries.length}`);
        console.log(`- projects: ${projects.length}`);
        console.log(`- services: ${services.length}`);
        console.log(`- team: ${team.length}`);

    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    } finally {
        await client.close();
        console.log('Connection closed');
    }
}

main();
