"use client";

import { useState, useEffect, Suspense, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
    ArrowRight, 
    Image as ImageIcon,
    Layout,
    Loader2,
    Megaphone
} from 'lucide-react';
import PremiumScratchCard from '@/components/PremiumScratchCard';
import EnquireNowModal from '@/components/EnquireNowModal';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Project {
    id: string;
    title: string;
    description: string;
    category: string;
    images: string[];
    detailsTitle?: string;
    isSmall?: boolean;
}

const ALL_PROJECTS: Project[] = [
    {
        id: 'def-1',
        title: 'Brand Identity Showcase',
        description: 'Complete visual identity transformation featuring premium logo design, color theory application, and comprehensive brand guidelines for a global corporate client.',
        category: 'Brand Identity',
        images: [
            '/signage-branding.png',
            '/about-hero-bg.png'
        ],
        isSmall: true
    },
    {
        id: 'def-2',
        title: 'Digital Printing Excellence',
        description: 'High-precision large format printing for luxury retail displays, capturing vibrant colors and sharp details to maximize visual pull in high-traffic shopping malls.',
        category: 'Digital Printing',
        images: [
            '/signage-digital-print.png',
            '/services-hero-bg.png'
        ],
        isSmall: true
    },
    {
        id: 'def-2-2',
        title: 'Indoor Creative Displays',
        description: 'Innovative indoor banner solutions for corporate environments, utilizing premium materials and high-definition printing to deliver clear and professional brand messaging.',
        category: 'Digital Printing',
        images: [
            '/signage-exhibition.png',
            'https://i.pinimg.com/736x/c0/d4/de/c0d4de585c6bcff79eeb27a950e60112.jpg'
        ]
    },
    {
        id: 'def-3',
        title: 'Premium Vehicle Wraps',
        description: 'State-of-the-art vehicle branding for commercial fleets, using high-durability vinyl to ensure long-lasting brand visibility across the UAE.',
        category: 'Vehicle Branding',
        images: [
            '/signage-vehicle.png',
            'https://lirp.cdn-website.com/08d904d8/dms3rep/multi/opt/fleet+wraps+roseville-1920w.jpg'
        ]
    },
    {
        id: 'def-4',
        title: 'Strategic Signage Systems',
        description: 'High-visibility 3D LED signage installations designed for maximum impact in premium commercial districts, ensuring your brand stays visible 24/7.',
        category: 'Signage',
        images: [
            '/signage-cladding.png',
            '/services-hero-bg.png'
        ]
    },
    {
        id: 'def-4-2',
        title: 'Commercial Wayfinding',
        description: 'Comprehensive wayfinding and directional signage solutions for large-scale developments, merging functionality with sophisticated design.',
        category: 'Signage',
        images: [
            '/projects-hero-bg.png',
            '/signage-production.png'
        ]
    },
    {
        id: 'def-5',
        title: 'POS Display Solutions',
        description: 'Custom-designed point-of-sale displays focused on driving customer engagement and maximizing product visibility in competitive retail settings.',
        category: 'Display Solutions',
        images: [
            '/signage-exhibition.png',
            '/about-hero-bg.png'
        ]
    },
    {
        id: 'def-6',
        title: 'Architectural Facades',
        description: 'Premium building facade solutions combining high-quality ACP cladding with integrated signage to create a powerful architectural identity.',
        category: 'Facade & Cladding',
        images: [
            '/signage-cladding.png',
            '/signage-branding.png'
        ]
    },
    {
        id: 'def-7',
        title: 'Frosted Glass Sticker Design',
        description: 'Premium frosted glass vinyl sticker solutions for offices, storefronts, and conference rooms. Our precision-cut frosted films combine elegant privacy with striking brand visibility, featuring custom logo etchings, decorative patterns, and sandblasted effects that transform ordinary glass into sophisticated branding surfaces.',
        category: 'Frosted Glass Sticker',
        images: [
            '/frosted-glass-4.png',
            '/frosted-glass-5.png',
            '/frosted-glass-1.png'
        ]
    }
];

function ProjectsContent() {
    const router = useRouter();
    const [filterCategory, setFilterCategory] = useState('All');
    const [dynamicProjects, setDynamicProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isScratchCardOpen, setIsScratchCardOpen] = useState(false);
    const [enquireProject, setEnquireProject] = useState<string | null>(null);

    // 3D Parallax Mouse Tracking
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);
    const springConfig = { damping: 20, stiffness: 100 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);
    
    const rotateX = useTransform(springY, [0, 1], [10, -10]);
    const rotateY = useTransform(springX, [0, 1], [-10, 10]);
    const bgX = useTransform(springX, [0, 1], [-20, 20]);
    const bgY = useTransform(springY, [0, 1], [-20, 20]);

    const handleHeroMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width);
        mouseY.set((e.clientY - rect.top) / rect.height);
    };

    const handleCategoryChange = useCallback((category: string) => {
        setFilterCategory(category);
    }, []);

    const categories = useMemo(() => [
        'All', 'Brand Identity', 'Digital Printing', 'Vehicle Branding', 
        'Display Solutions', 'Signage', 'Facade & Cladding', 'Frosted Glass Sticker'
    ], []);

    useEffect(() => {
        // Immediately show static projects and set loading to false
        setIsLoading(false);
        
        // Fetch dynamic projects in background without blocking UI
        fetchDynamicProjects();
        
        // Preload critical images
        const criticalImages = [
            '/signage-branding.png',
            '/signage-digital-print.png',
            '/signage-vehicle.png',
            '/signage-production.png'
        ];
        
        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }, []);

    const fetchDynamicProjects = async () => {
        try {
            const res = await fetch('/api/projects', {
                cache: 'no-store',
                headers: { 'Cache-Control': 'no-cache' }
            });

            if (res.ok) {
                const data = await res.json();
                if (data.projects && Array.isArray(data.projects)) {
                    const adapted = data.projects
                        .filter((p: any) => p && p.title)
                        .map((p: any) => ({
                            id: p.id || p._id?.toString() || `dynamic-${Math.random()}`,
                            title: p.title,
                            description: p.description || 'No description available',
                            category: p.category || 'Uncategorized',
                            images: (p.images && p.images.length > 0) ? p.images : (p.image ? [p.image] : ['/projects-hero-bg.png']),
                            detailsTitle: p.title
                        }));
                    setDynamicProjects(adapted);
                }
            }
        } catch (error) {
            console.error('Error fetching dynamic projects:', error);
        }
    };

    // Use DB projects when available, fall back to static only if DB is empty
    const combinedProjects = useMemo(() => dynamicProjects.length > 0 ? dynamicProjects : ALL_PROJECTS, [dynamicProjects]);

    const filteredProjects = useMemo(() => {
        return combinedProjects.filter(p => {
            if (filterCategory === 'All') return true;
            return p.category.toLowerCase().includes(filterCategory.toLowerCase());
        });
    }, [combinedProjects, filterCategory]);

    const CATEGORY_IMAGES: { [key: string]: string[] } = {
        'Brand Identity': [
            '/signage-branding.png',
            '/about-hero-bg.png'
        ],
        'Digital Printing': [
            '/signage-digital-print.png',
            '/services-hero-bg.png'
        ],
        'Vehicle Branding': [
            '/signage-vehicle.png',
            '/dubai-hero-building.jpg'
        ],
        'Display Solutions': [
            '/signage-exhibition.png',
            '/home-hero-bg.png'
        ],
        'Signage': [
            '/signage-production.png',
            '/projects-hero-bg.png'
        ],
        'Facade & Cladding': [
            '/signage-cladding.png',
            '/cta-bg-premium.png'
        ],
        'Frosted Glass Sticker': [
            '/frosted-glass-4.png',
            '/frosted-glass-5.png',
            '/frosted-glass-1.png'
        ]
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.25 } }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminAuth');
        localStorage.removeItem('adminUser');
        router.push('/');
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05, delayChildren: 0.05 }
        }
    };

    return (
        <>
        <div style={{ background: 'rgba(18, 18, 18, 0.98)', minHeight: '100vh', color: 'white', backdropFilter: 'blur(10px)', overflow: 'hidden' }}>
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,700&display=swap');
                
                /* Hide all scrollbars on projects page */
                * {
                    scrollbar-width: none !important;
                    -ms-overflow-style: none !important;
                }
                
                *::-webkit-scrollbar {
                    display: none !important;
                    width: 0 !important;
                    height: 0 !important;
                }
                
                html, body {
                    overflow-x: hidden !important;
                    scrollbar-width: none !important;
                    -ms-overflow-style: none !important;
                }
                
                html::-webkit-scrollbar, body::-webkit-scrollbar {
                    display: none !important;
                }
                
                .container { max-width: 1400px; margin: 0 auto; padding: 0 40px; overflow: hidden; }
                
                .hero-works {
                    position: relative;
                    height: 95vh;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: transparent;
                    overflow: hidden;
                    text-align: center;
                    perspective: 1500px;
                }
                .hero-works-bg {
                    position: absolute;
                    inset: -30px;
                    z-index: 0;
                }
                .hero-works-bg img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    filter: brightness(0.6) contrast(1.1);
                }
                .hero-works-overlay {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at center, rgba(30,0,0,0.2) 0%, rgba(12, 12, 12,0.9) 100%);
                    z-index: 1;
                }
                .hero-works-content {
                    position: relative;
                    z-index: 5;
                    transform-style: preserve-3d;
                    pointer-events: none;
                }
                .hero-works-h1 {
                    font-size: clamp(2.5rem, 8vw, 4.5rem);
                    font-weight: 950;
                    color: white;
                    letter-spacing: -3px;
                    line-height: 1;
                    margin-bottom: 2rem;
                    text-transform: uppercase;
                    word-break: keep-all;
                    overflow-wrap: break-word;
                    transform: translateZ(100px);
                    text-shadow: 0 15px 50px rgba(12, 12, 12,0.8);
                }
                .hero-works-h1 span {
                    color: #e61e25;
                    display: inline-block;
                    transform: translateZ(150px);
                }
                .hero-works-tagline {
                    color: rgba(255,255,255,0.9);
                    font-size: clamp(1.2rem, 4vw, 1.8rem);
                    letter-spacing: 6px;
                    opacity: 0.9;
                    font-weight: 500;
                    text-transform: uppercase;
                    transform: translateZ(60px);
                    text-shadow: 0 4px 15px rgba(12, 12, 12,0.5);
                }
                
                .section-header {
                    padding: 80px 0 60px 0;
                    text-align: center;
                    background: transparent;
                }
                .title-our {
                    font-size: clamp(2rem, 8vw, 3.5rem);
                    font-weight: 800;
                    margin-bottom: 2rem;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 15px;
                    flex-wrap: wrap;
                }
                .title-projects {
                    font-family: 'Playfair Display', serif;
                    font-style: italic;
                    font-weight: 400;
                    font-size: clamp(1.8rem, 7vw, 3rem);
                    color: #e61e25;
                }
                .header-desc {
                    max-width: 800px;
                    margin: 0 auto;
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 1.1rem;
                    line-height: 1.6;
                    font-weight: 500;
                }
                
                .category-nav {
                    display: flex;
                    justify-content: center;
                    gap: 12px;
                    flex-wrap: wrap;
                    margin-bottom: 50px;
                    padding: 10px 20px 20px 20px;
                }.category-nav::-webkit-scrollbar {
                    display: none;
                }
                .cat-btn {
                    padding: 0.6rem 1.8rem;
                    border-radius: 4px;
                    border: 1px solid #ddd;
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.6s;
                    font-size: 0.85rem;
                }
                .cat-btn.active {
                    background: #e61e25;
                    color: white;
                    border-color: #e61e25;
                    box-shadow: 0 4px 12px rgba(230, 30, 37, 0.2);
                }
                
                .project-cluster {
                    display: grid;
                    grid-template-columns: 1fr 1.5fr;
                    gap: 40px;
                    margin-bottom: 100px;
                    align-items: center;
                    contain: layout style paint;
                    overflow: hidden;
                }
                .cluster-text {
                    background: rgba(255, 255, 255, 0.05);
                    padding: clamp(1.5rem, 5vw, 4rem);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 24px;
                    box-shadow: 0 20px 50px rgba(12, 12, 12,0.2);
                    color: white;
                    will-change: transform;
                    overflow: hidden;
                }
                .cluster-title {
                    font-size: clamp(1.8rem, 6vw, 3rem);
                    font-weight: 800;
                    margin-bottom: 1.5rem;
                    letter-spacing: -1px;
                    color: white;
                }
                .cluster-desc {
                    color: rgba(255, 255, 255, 0.7);
                    line-height: 1.8;
                    font-size: 1.05rem;
                }
                .cluster-images {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    contain: layout style paint;
                }

                .cluster-images.single {
                    grid-template-columns: 1fr;
                }
                .cluster-img {
                    width: 100%;
                    height: 650px;
                    object-fit: cover;
                    border-radius: 20px;
                    box-shadow: 0 15px 45px rgba(12, 12, 12,0.1);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    will-change: transform;
                }
                .cluster-images.small .cluster-img {
                    height: 480px;
                }
                .cluster-img:hover {
                    box-shadow: 0 30px 60px rgba(12, 12, 12,0.2);
                    transform: scale(1.02);
                }
                
                .project-overview-bg {
                    position: relative;
                    padding: 160px 0;
                    background-image: linear-gradient(rgba(12, 12, 12,0.5), rgba(12, 12, 12,0.5)), url('/dubai-hero-building.jpg');
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    margin-top: 100px;
                }
                .project-overview-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(12, 12, 12,0.4);
                    z-index: 1;
                }
                .project-overview-glass {
                    position: relative;
                    z-index: 2;
                    max-width: 900px;
                    background: rgba(12, 12, 12, 0.7);
                    backdrop-filter: blur(30px);
                    -webkit-backdrop-filter: blur(30px);
                    padding: 5rem 3rem;
                    border-radius: 32px;
                    text-align: center;
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .cta-btn-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 12px;
                    padding: 1rem 2.8rem;
                    background: #e61e25;
                    color: white;
                    font-weight: 800;
                    border-radius: 8px;
                    text-decoration: none;
                    transition: all 0.6s ease;
                    font-size: 1.1rem;
                    margin-top: 2rem;
                    box-shadow: 0 4px 15px rgba(230, 30, 37, 0.3);
                    border: none;
                    cursor: pointer;
                }
                .cta-btn-pill:hover {
                    background: #ff2d35;
                    transform: translateY(-4px);
                    box-shadow: 0 8px 25px rgba(230, 30, 37, 0.4);
                    color: white;
                }
                
                @media (max-width: 1024px) {
                    .project-cluster { grid-template-columns: 1fr; gap: 20px; }
                    .cluster-img { height: 450px; }
                    .cluster-images { grid-template-columns: 1fr; }
                    .container { padding: 0 40px; }
                    .title-our { font-size: 2.8rem; }
                    .title-projects { font-size: 2.4rem; }
                }

                @media (max-width: 768px) {
                    .hero-works {
                        height: 100svh;
                        height: 100vh;
                        min-height: unset;
                        padding: 120px 1.5rem 80px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-direction: column;
                        text-align: center;
                        overflow: hidden;
                    }
                    .hero-works-content {
                        width: 100%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                    }
                    .hero-works-h1 { 
                        font-size: clamp(2.2rem, 10vw, 3.2rem); 
                        word-break: keep-all; 
                        line-height: 1.1; 
                        margin-bottom: 1.5rem; 
                        letter-spacing: -1px; 
                        text-align: center; 
                    }
                    .hero-works-tagline { 
                        font-size: 1rem; 
                        letter-spacing: 2px; 
                        text-align: center; 
                        margin-bottom: 2rem; 
                        max-width: 90%;
                    }
                    .project-cluster { margin-bottom: 4rem; display: flex !important; flex-direction: column !important; gap: 1.5rem !important; }
                    .cluster-img { height: 320px; }
                    .cluster-images { grid-template-columns: 1fr; gap: 1rem; order: 2 !important; width: 100% !important; }
                    .cluster-text { padding: 2.5rem 1.5rem; order: 1 !important; text-align: center; border-radius: 20px; }
                    .cluster-title { font-size: 1.8rem; margin-bottom: 1rem; }
                    .section-header { padding: 4rem 1rem 2rem 1rem; }
                    .title-our { font-size: 2.2rem; gap: 10px; }
                    .title-projects { font-size: 1.8rem; }
                    .category-nav { margin-bottom: 2.5rem; }
                    .cat-btn { padding: 0.7rem 1.5rem; font-size: 0.85rem; white-space: nowrap; flex-shrink: 0; }
                    .project-overview-bg { padding: 6rem 0; margin-top: 2rem; }
                    .project-overview-glass { padding: 3.5rem 1.5rem; border-radius: 20px; margin: 0 1rem; }
                    .cta-btn-pill { width: 100%; justify-content: center; margin-top: 1.5rem; padding: 1rem 2rem; }
                    .container { padding: 0 1.5rem !important; }
                    .category-nav { justify-content: center; flex-wrap: wrap; gap: 8px; }
                }
                @media (max-width: 480px) {
                    .hero-works { height: 100svh !important; height: 100vh !important; min-height: unset !important; padding: 100px 1rem 40px !important; }
                    .hero-works-h1 { font-size: 1.85rem !important; }
                }

                /* Extended Offer Badge Styles */
                .claim-btn-floating-container {
                  position: fixed !important;
                  right: 2rem !important;
                  bottom: 2rem !important;
                  left: auto !important;
                  margin: 0 !important;
                  z-index: 99999 !important;
                  pointer-events: auto !important;
                  transform-style: preserve-3d;
                  transform: translateZ(500px);
                  touch-action: manipulation;
                  width: fit-content !important;
                }
                @media (max-width: 768px) {
                  .claim-btn-floating-container {
                    right: 1rem;
                    bottom: 1rem;
                    transform: scale(0.75) translateZ(500px) !important;
                    transform-origin: bottom right;
                  }
                }
                @media (max-width: 480px) {
                  .claim-btn-floating-container {
                    right: 0.5rem !important;
                    bottom: 1.5rem !important;
                    left: auto !important;
                    transform: scale(0.6) translateZ(600px) !important;
                  }
                }
            `}</style>

            <header className="hero-works" onMouseMove={handleHeroMouseMove}>
                <motion.div 
                    className="hero-works-bg"
                    style={{ x: bgX, y: bgY }}
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 2.0, ease: "easeOut" }}
                >
                    <img 
                        src="/professional_agency_team.png" 
                        alt="Professional Agency Team"
                        loading="eager"
                    />
                </motion.div>
                <div className="hero-works-overlay"></div>

                <motion.div 
                    className="hero-works-content"
                    style={{ rotateX, rotateY }}
                    initial={{ opacity: 0, rotateX: 20, y: 100, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                    transition={{ duration: 1.4, type: "spring", bounce: 0.3 }}
                >
                    <motion.h1 
                        className="hero-works-h1"
                        initial={{ opacity: 0, y: 30, z: -150 }}
                        animate={{ opacity: 1, y: 0, z: 0 }}
                        transition={{ duration: 1.0, delay: 0.4, type: "spring", bounce: 0.4 }}
                    >
                        Our <motion.span
                            animate={{ 
                                textShadow: [
                                    "0px 0px 10px rgba(230,30,37,0.3)",
                                    "0px 0px 30px rgba(230,30,37,0.7)",
                                    "0px 0px 10px rgba(230,30,37,0.3)"
                                ]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            style={{ color: '#e61e25', display: 'inline-block' }}
                        >Impact</motion.span>
                    </motion.h1>
                    <motion.div 
                        className="hero-works-tagline"
                        initial={{ opacity: 0, y: 20, z: -50 }}
                        animate={{ opacity: 1, y: 0, z: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        Real campaigns. Real impact.
                    </motion.div>
                </motion.div>

            </header>

            <section className="section-header">
                <div className="container">
                    <motion.div 
                        className="title-our"
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.0, ease: "easeOut" }}
                    >
                        Our <span className="title-projects">Projects</span>
                    </motion.div>
                    <motion.p 
                        className="header-desc"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    >
                        Explore real world advertising campaigns crafted to maximize visibility, attract attention, and deliver strong brand impact across prime locations.
                    </motion.p>
                </div>
            </section>

            <motion.div 
                className="category-nav"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            >
                {categories.map((cat, index) => (
                    <motion.button
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        className={`cat-btn ${filterCategory === cat ? 'active' : ''}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ 
                            duration: 0.5, 
                            delay: 0.7 + (index * 0.1),
                            ease: "easeOut"
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {cat}
                    </motion.button>
                ))}
            </motion.div>

            <section style={{ paddingBottom: '100px', overflow: 'hidden' }}>
                <div className="container" style={{ overflow: 'hidden' }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={filterCategory}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}
                        >
                            {filteredProjects.length > 0 ? (
                                filteredProjects.map((project, idx) => (
                                    <motion.div 
                                        key={project.id || idx} 
                                        className="project-cluster" 
                                        style={{ flexDirection: idx % 2 === 0 ? 'row' : 'row-reverse' }}
                                        initial={{ 
                                            opacity: 0, 
                                            y: 20,
                                            scale: 0.99
                                        }}
                                        whileInView={{ 
                                            opacity: 1, 
                                            y: 0,
                                            scale: 1
                                        }}
                                        viewport={{ once: true, margin: "-20px" }}
                                        transition={{ 
                                            duration: 0.4, 
                                            delay: idx * 0.05,
                                            ease: "easeOut"
                                        }}
                                    >
                                        <motion.div 
                                            className="cluster-text"
                                            initial={{ 
                                                opacity: 0, 
                                                x: idx % 2 === 0 ? -15 : 15,
                                                scale: 0.99
                                            }}
                                            whileInView={{ 
                                                opacity: 1, 
                                                x: 0,
                                                scale: 1
                                            }}
                                            viewport={{ once: true }}
                                            transition={{ 
                                                duration: 0.3, 
                                                delay: idx * 0.05 + 0.05,
                                                ease: "easeOut"
                                            }}
                                        >
                                            <motion.h2 
                                                className="cluster-title"
                                                initial={{ opacity: 0, y: 30 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ 
                                                    duration: 0.8, 
                                                    delay: Math.min(idx * 0.25, 1.0) + 0.6
                                                }}
                                            >
                                                {project.title}
                                            </motion.h2>
                                            <motion.p
                                                className="cluster-desc"
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{
                                                    duration: 0.8,
                                                    delay: Math.min(idx * 0.25, 1.0) + 0.8
                                                }}
                                            >
                                                {project.description}
                                            </motion.p>
                                            <motion.div
                                                initial={{ opacity: 0, y: 15 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.6, delay: Math.min(idx * 0.25, 1.0) + 1.0 }}
                                                style={{ marginTop: '1.8rem' }}
                                            >
                                                <button
                                                    onClick={() => setEnquireProject(project.title)}
                                                    style={{
                                                        padding: '0.7rem 1.6rem',
                                                        background: '#e61e25',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        fontWeight: 700,
                                                        fontSize: '0.95rem',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s ease',
                                                        fontFamily: 'inherit',
                                                        boxShadow: '0 4px 14px rgba(230, 30, 37, 0.35)',
                                                    }}
                                                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#ff2d35'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(230, 30, 37, 0.55)'; }}
                                                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#e61e25'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 14px rgba(230, 30, 37, 0.35)'; }}
                                                >
                                                    Enquire Now
                                                </button>
                                            </motion.div>
                                        </motion.div>
                                        <motion.div 
                                            className={`cluster-images ${project.images.length === 1 ? 'single' : ''} ${project.isSmall ? 'small' : ''}`}
                                            initial={{ 
                                                opacity: 0, 
                                                x: idx % 2 === 0 ? 15 : -15,
                                                scale: 0.99
                                            }}
                                            whileInView={{ 
                                                opacity: 1, 
                                                x: 0,
                                                scale: 1
                                            }}
                                            viewport={{ once: true }}
                                            transition={{ 
                                                duration: 0.35, 
                                                delay: idx * 0.05 + 0.1,
                                                ease: "easeOut"
                                            }}
                                        >
                                            {project.images.length > 0 ? (
                                                project.images.map((img, i) => (
                                                    <motion.img 
                                                        key={i} 
                                                        src={img} 
                                                        alt={project.title} 
                                                        className="cluster-img"
                                                        loading="lazy"
                                                        initial={{ 
                                                            opacity: 0, 
                                                            scale: 0.98
                                                        }}
                                                        whileInView={{ 
                                                            opacity: 1, 
                                                            scale: 1
                                                        }}
                                                        viewport={{ once: true }}
                                                        transition={{ 
                                                            duration: 0.3, 
                                                            delay: idx * 0.05 + 0.15 + (i * 0.03),
                                                            ease: "easeOut"
                                                        }}
                                                        whileHover={{ 
                                                            scale: 1.03,
                                                            transition: { duration: 0.2, ease: "easeOut" }
                                                        }}
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = '/projects-hero-bg.png';
                                                        }}
                                                    />
                                                ))
                                            ) : (
                                                <div className="cluster-img-placeholder">
                                                    <span>No image available</span>
                                                </div>
                                            )}
                                        </motion.div>
                                    </motion.div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', padding: '5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '24px' }}>
                                    <h3 style={{ fontSize: '1.5rem', color: '#666', marginBottom: '1rem' }}>No projects found in this category</h3>
                                    <button onClick={() => setFilterCategory('All')} style={{ background: '#e61e25', color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>View All Projects</button>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>

            <section className="project-overview-bg">
                <div className="project-overview-overlay"></div>
                <motion.div 
                    className="project-overview-glass"
                    initial={{ opacity: 0, y: 80, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                >
                    <motion.h2 
                        style={{ fontSize: '2.8rem', fontWeight: 900, color: 'white', marginBottom: '1.5rem', letterSpacing: '-1px' }}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        Project Overview
                    </motion.h2>
                    <motion.p 
                        style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem', lineHeight: 1.7, maxWidth: '750px', margin: '0 auto', fontWeight: 500 }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        A strategically placed outdoor campaign built to maximize visibility, attract attention, and deliver a strong brand presence in a busy commercial location.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                    >
                        <Link href="/contact" className="cta-btn-pill">
                            Get This for Your Brand <ArrowRight size={22} style={{ marginLeft: '10px' }} />
                        </Link>
                    </motion.div>
                </motion.div>
            </section>



        </div>

        {isScratchCardOpen && (
            <PremiumScratchCard
                onClose={() => setIsScratchCardOpen(false)}
            />
        )}

        {enquireProject && (
            <EnquireNowModal
                serviceName={enquireProject}
                source="projects-page"
                onClose={() => setEnquireProject(null)}
            />
        )}
        </>
    );
}

export default function ProjectsPage() {
    return (
        <Suspense fallback={<div style={{ minHeight: '100vh', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="animate-spin" size={48} color="#e61e25" /></div>}>
            <ProjectsContent />
        </Suspense>
    );
}
