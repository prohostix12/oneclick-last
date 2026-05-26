"use client";

import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    date: string;
    category: string;
    image: string;
    readTime: string;
}

export default function BlogPostPage() {
    const params = useParams();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    // Sample blog posts (in real app, this would come from API)
    const samplePosts: BlogPost[] = [
        {
            id: '1',
            title: 'Latest Signage Design Trends in UAE 2024',
            excerpt: 'Discover the cutting-edge design trends shaping the advertising landscape in the UAE this year.',
            content: `
                <h2>The Evolution of Signage Design in the UAE</h2>
                <p>The UAE's advertising landscape is constantly evolving, driven by technological advancements and changing consumer preferences. In 2024, we're seeing several key trends that are reshaping how businesses communicate with their audiences.</p>
                
                <h3>1. Sustainable Materials and Eco-Friendly Designs</h3>
                <p>Environmental consciousness is becoming increasingly important in the UAE. Businesses are now opting for sustainable materials like recycled aluminum, bamboo composites, and solar-powered LED systems. This shift not only reduces environmental impact but also appeals to eco-conscious consumers.</p>
                
                <h3>2. Interactive Digital Displays</h3>
                <p>Touch-enabled displays and QR code integration are becoming standard. These interactive elements allow customers to engage directly with brands, access additional information, and even make purchases on the spot.</p>
                
                <h3>3. Minimalist Arabic Typography</h3>
                <p>Clean, modern Arabic fonts are gaining popularity, especially in Dubai and Abu Dhabi. This trend reflects the UAE's commitment to preserving cultural identity while embracing contemporary design principles.</p>
                
                <h3>4. Smart Signage with IoT Integration</h3>
                <p>Internet of Things (IoT) technology is enabling signs to collect data, adjust content based on weather conditions, and even monitor foot traffic patterns. This data-driven approach helps businesses optimize their advertising strategies.</p>
                
                <h3>Conclusion</h3>
                <p>As we move through 2024, the key to successful signage in the UAE lies in balancing innovation with cultural sensitivity, sustainability with functionality, and technology with human connection.</p>
            `,
            author: 'Design Team',
            date: '2024-03-10',
            category: 'Design Trends',
            image: '/signage-branding.png',
            readTime: '5 min read'
        },
        {
            id: '2',
            title: 'ROI Analysis: Digital vs Traditional Signage',
            excerpt: 'A comprehensive case study comparing the return on investment between digital and traditional advertising methods.',
            content: `
                <h2>Understanding ROI in Modern Advertising</h2>
                <p>In today's competitive market, businesses need to make informed decisions about their advertising investments. This comprehensive analysis examines the return on investment (ROI) of digital versus traditional signage solutions.</p>
                
                <h3>Traditional Signage: The Foundation</h3>
                <p>Traditional signage has been the backbone of outdoor advertising for decades. Our analysis of 50 UAE businesses shows:</p>
                <ul>
                    <li>Average ROI: 150-200% over 3 years</li>
                    <li>Lower initial maintenance costs</li>
                    <li>Proven durability in harsh UAE climate</li>
                    <li>One-time content creation cost</li>
                </ul>
                
                <h3>Digital Signage: The Future</h3>
                <p>Digital displays offer dynamic content capabilities and real-time updates:</p>
                <ul>
                    <li>Average ROI: 250-350% over 3 years</li>
                    <li>Higher initial investment but lower long-term content costs</li>
                    <li>Ability to display multiple campaigns</li>
                    <li>Real-time performance tracking</li>
                </ul>
                
                <h3>Case Study: Dubai Mall Retailer</h3>
                <p>A major retailer in Dubai Mall switched from traditional to digital signage and saw:</p>
                <ul>
                    <li>40% increase in foot traffic</li>
                    <li>25% boost in sales conversion</li>
                    <li>60% reduction in content update costs</li>
                    <li>ROI improvement from 180% to 320%</li>
                </ul>
                
                <h3>Recommendations</h3>
                <p>The choice between digital and traditional signage depends on your specific needs, budget, and location. For high-traffic areas with frequent content changes, digital signage offers superior ROI. For permanent branding in stable locations, traditional signage remains cost-effective.</p>
            `,
            author: 'Marketing Team',
            date: '2024-03-08',
            category: 'Case Studies',
            image: '/signage-digital-print.png',
            readTime: '8 min read'
        }
    ];

    useEffect(() => {
        fetchPost();
    }, [params.id]);

    const fetchPost = async () => {
        try {
            const response = await fetch(`/api/blog?id=${params.id}`);
            if (response.ok) {
                const data = await response.json();
                setPost(data);
            } else {
                setPost(null);
            }
        } catch (error) {
            console.error('Error fetching post:', error);
            setPost(null);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                paddingTop: '5rem'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                        width: '50px', 
                        height: '50px', 
                        border: '3px solid rgba(124, 58, 237, 0.3)', 
                        borderTop: '3px solid var(--color-primary)', 
                        borderRadius: '50%', 
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 1rem'
                    }} />
                    <p style={{ color: 'var(--color-text-muted)' }}>Loading article...</p>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div style={{ 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                paddingTop: '5rem'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <BookOpen size={48} color="var(--color-text-muted)" style={{ marginBottom: '1rem' }} />
                    <h2 style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Article Not Found</h2>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                        The article you're looking for doesn't exist or has been removed.
                    </p>
                    <Link href="/blog" className="btn btn-primary">
                        Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Hero Section */}
            <section style={{ 
                paddingTop: '8rem', 
                paddingBottom: '4rem',
                background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, rgba(167, 139, 250, 0.05) 100%)'
            }}>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Link 
                            href="/blog"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: 'var(--color-primary)',
                                textDecoration: 'none',
                                marginBottom: '2rem',
                                fontWeight: 600,
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.gap = '0.8rem'}
                            onMouseOut={(e) => e.currentTarget.style.gap = '0.5rem'}
                        >
                            <ArrowLeft size={20} />
                            Back to Blog
                        </Link>

                        <h1 style={{ 
                            fontSize: 'clamp(2rem, 5vw, 3.5rem)', 
                            fontWeight: 800, 
                            lineHeight: '1.2',
                            marginBottom: '2rem',
                            color: 'var(--color-text-main)'
                        }}>
                            {post.title}
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* Featured Image */}
            <section className="container" style={{ marginBottom: '4rem' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    style={{ 
                        borderRadius: '20px', 
                        overflow: 'hidden',
                        boxShadow: '0 20px 40px rgba(12, 12, 12,0.1)'
                    }}
                >
                    <img 
                        src={post.image} 
                        alt={post.title}
                        style={{ 
                            width: '100%', 
                            height: '400px', 
                            objectFit: 'cover'
                        }}
                    />
                </motion.div>
            </section>

            {/* Article Content */}
            <section className="container" style={{ paddingBottom: '4rem' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="glass-card"
                        style={{ 
                            padding: '3rem',
                            fontSize: '1.1rem',
                            lineHeight: '1.8',
                            color: 'var(--color-text-main)'
                        }}
                    >
                        <div 
                            dangerouslySetInnerHTML={{ __html: post.content }}
                            className="blog-content"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Related Articles */}
            <section className="section container">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 style={{ 
                        textAlign: 'center', 
                        fontSize: '2.5rem', 
                        fontWeight: 800, 
                        marginBottom: '3rem',
                        color: 'var(--color-text-main)'
                    }}>
                        Related <span style={{ color: 'var(--color-primary)' }}>Articles</span>
                    </h2>
                    
                    <div style={{ textAlign: 'center' }}>
                        <Link href="/blog" className="btn btn-primary">
                            View All Articles
                        </Link>
                    </div>
                </motion.div>
            </section>
        </>
    );
}