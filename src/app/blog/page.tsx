"use client";

import { motion, Variants } from 'framer-motion';
import { ArrowRight, BookOpen, TrendingUp, Lightbulb, FileText } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } }
};

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

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    const categories = ['All', 'Design Trends', 'Case Studies', 'Industry News', 'Maintenance Tips', 'Regulations'];

    // Sample blog posts (in real app, this would come from API)
    const samplePosts: BlogPost[] = [
        {
            id: '1',
            title: 'Latest Signage Design Trends in UAE 2024',
            excerpt: 'Discover the cutting-edge design trends shaping the advertising landscape in the UAE this year.',
            content: 'Full blog content here...',
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
            content: 'Full blog content here...',
            author: 'Marketing Team',
            date: '2024-03-08',
            category: 'Case Studies',
            image: '/signage-digital-print.png',
            readTime: '8 min read'
        },
        {
            id: '3',
            title: 'Dubai Municipality Signage Regulations Update',
            excerpt: 'Important updates to signage regulations in Dubai that every business owner should know.',
            content: 'Full blog content here...',
            author: 'Legal Team',
            date: '2024-03-05',
            category: 'Regulations',
            image: '/signage-cladding.png',
            readTime: '6 min read'
        },
        {
            id: '4',
            title: 'Maintaining Your Outdoor Signage in UAE Climate',
            excerpt: 'Essential tips for keeping your outdoor advertising displays in perfect condition despite harsh weather.',
            content: 'Full blog content here...',
            author: 'Technical Team',
            date: '2024-03-03',
            category: 'Maintenance Tips',
            image: '/signage-production.png',
            readTime: '4 min read'
        }
    ];

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch('/api/blog?status=published');
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPosts = selectedCategory === 'All' 
        ? posts 
        : posts.filter(post => post.category === selectedCategory);

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Design Trends': return <TrendingUp size={20} />;
            case 'Case Studies': return <FileText size={20} />;
            case 'Industry News': return <BookOpen size={20} />;
            case 'Maintenance Tips': return <Lightbulb size={20} />;
            case 'Regulations': return <FileText size={20} />;
            default: return <BookOpen size={20} />;
        }
    };

    return (
        <>
            {/* Hero Section */}
            <section className="hero-section container" style={{ 
                minHeight: '60vh', 
                paddingTop: '10rem', 
                paddingBottom: '6rem',
                position: 'relative',
                overflow: 'hidden',
                background: '#121212',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                    <img 
                        src="/admin-billboard.png" 
                        alt="Blog Insights" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.4) contrast(1.1)' }} 
                    />
                </div>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(30,0,0,0.2) 0%, rgba(12, 12, 12,0.9) 100%)', zIndex: 1 }} />
                <motion.div 
                    initial="hidden" 
                    animate="visible" 
                    variants={staggerContainer} 
                    style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}
                >
                    <motion.div 
                        variants={fadeInUp} 
                        style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            marginBottom: '1.5rem', 
                            background: 'rgba(230, 30, 37, 0.2)', 
                            padding: '0.6rem 1.5rem', 
                            borderRadius: '50px', 
                            border: '1px solid rgba(230, 30, 37, 0.3)',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <BookOpen size={18} color="#e61e25" />
                        <span style={{ 
                            fontSize: '0.85rem', 
                            fontWeight: 700, 
                            letterSpacing: '2px', 
                            textTransform: 'uppercase', 
                            color: 'white' 
                        }}>
                            BLOG & RESOURCES
                        </span>
                    </motion.div>

                    <motion.h1 
                        variants={fadeInUp} 
                        className="hero-title" 
                        style={{ 
                            fontFamily: "'Plus Jakarta Sans', sans-serif", 
                            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', 
                            fontWeight: 900, 
                            marginBottom: '1.5rem',
                            lineHeight: '1.05',
                            color: 'white',
                            textShadow: '0 10px 30px rgba(12, 12, 12,0.5)'
                        }}
                    >
                        Insights & <span style={{ color: '#e61e25' }}>Expertise</span>
                    </motion.h1>

                    <motion.p 
                        variants={fadeInUp} 
                        style={{ 
                            color: 'rgba(255,255,255,0.9)', 
                            fontSize: '1.25rem', 
                            lineHeight: '1.6',
                            marginBottom: '2rem',
                            fontWeight: 500,
                            textShadow: '0 2px 10px rgba(12, 12, 12,0.3)'
                        }}
                    >
                        Stay updated with the latest trends, insights, and best practices in the advertising industry. 
                        From design innovations to regulatory updates, we share our expertise to help your business thrive.
                    </motion.p>
                </motion.div>
            </section>

            {/* Category Filter */}
            <section className="container" style={{ paddingBottom: '2rem' }}>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '1rem', 
                        justifyContent: 'center',
                        marginBottom: '3rem'
                    }}
                >
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.8rem 1.5rem',
                                borderRadius: '50px',
                                border: '2px solid',
                                borderColor: selectedCategory === category ? 'var(--color-primary)' : 'rgba(124, 58, 237, 0.2)',
                                background: selectedCategory === category ? 'var(--color-primary)' : 'transparent',
                                color: selectedCategory === category ? 'white' : 'var(--color-text-main)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                fontWeight: 600,
                                fontSize: '0.9rem'
                            }}
                            onMouseOver={(e) => {
                                if (selectedCategory !== category) {
                                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                                    e.currentTarget.style.background = 'rgba(124, 58, 237, 0.1)';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (selectedCategory !== category) {
                                    e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.2)';
                                    e.currentTarget.style.background = 'transparent';
                                }
                            }}
                        >
                            {getCategoryIcon(category)}
                            {category}
                        </button>
                    ))}
                </motion.div>
            </section>

            {/* Blog Posts Grid */}
            <section className="section container">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                        <div style={{ 
                            width: '50px', 
                            height: '50px', 
                            border: '3px solid rgba(124, 58, 237, 0.3)', 
                            borderTop: '3px solid var(--color-primary)', 
                            borderRadius: '50%', 
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 1rem'
                        }} />
                        <p style={{ color: 'var(--color-text-muted)' }}>Loading articles...</p>
                    </div>
                ) : (
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
                            gap: '2rem' 
                        }}
                    >
                        {filteredPosts.map((post, index) => (
                            <motion.article
                                key={post.id}
                                variants={fadeInUp}
                                whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(124, 58, 237, 0.15)' }}
                                className="glass-card"
                                style={{
                                    padding: 0,
                                    overflow: 'hidden',
                                    borderRadius: '20px',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                                    <img 
                                        src={post.image} 
                                        alt={post.title}
                                        style={{ 
                                            width: '100%', 
                                            height: '100%', 
                                            objectFit: 'cover',
                                            transition: 'transform 0.3s ease'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        left: '1rem',
                                        background: 'var(--color-primary)',
                                        color: 'white',
                                        padding: '0.4rem 0.8rem',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        fontWeight: 600
                                    }}>
                                        {post.category}
                                    </div>
                                </div>

                                <div style={{ padding: '2rem' }}>
                                    <h3 style={{ 
                                        fontSize: '1.4rem', 
                                        fontWeight: 700, 
                                        marginBottom: '1rem',
                                        lineHeight: '1.3',
                                        color: 'var(--color-text-main)'
                                    }}>
                                        {post.title}
                                    </h3>

                                    <p style={{ 
                                        color: 'var(--color-text-muted)', 
                                        lineHeight: '1.6',
                                        marginBottom: '1.5rem'
                                    }}>
                                        {post.excerpt}
                                    </p>

                                    <Link 
                                        href={`/blog/${post.id}`}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            color: 'var(--color-primary)',
                                            fontWeight: 600,
                                            textDecoration: 'none',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.gap = '0.8rem';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.gap = '0.5rem';
                                        }}
                                    >
                                        Read More
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </motion.article>
                        ))}
                    </motion.div>
                )}

                {filteredPosts.length === 0 && !loading && (
                    <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                        <BookOpen size={48} color="var(--color-text-muted)" style={{ marginBottom: '1rem' }} />
                        <h3 style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>No articles found</h3>
                        <p style={{ color: 'var(--color-text-muted)' }}>
                            Try selecting a different category or check back later for new content.
                        </p>
                    </div>
                )}
            </section>

            {/* Newsletter Signup */}
            <section className="section container">
                <NewsletterSignup />
            </section>
        </>
    );
}

// Newsletter Signup Component
function NewsletterSignup() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        try {
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: 'Successfully subscribed!' });
                setEmail('');
            } else {
                setMessage({ type: 'error', text: data.error });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to subscribe. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card"
            style={{
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                padding: '4rem',
                textAlign: 'center',
                color: 'white'
            }}
        >
            <h2 style={{ 
                fontSize: '2.5rem', 
                fontWeight: 800, 
                marginBottom: '1rem',
                color: 'white'
            }}>
                Stay Updated
            </h2>
            <p style={{ 
                fontSize: '1.1rem', 
                marginBottom: '2rem',
                opacity: 0.9,
                maxWidth: '600px',
                margin: '0 auto 2rem'
            }}>
                Subscribe to our newsletter and get the latest insights, trends, and updates delivered to your inbox.
            </p>

            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                        background: message.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        border: `1px solid ${message.type === 'success' ? '#22c55e' : '#ef4444'}`,
                        color: message.type === 'success' ? '#22c55e' : '#ef4444',
                        fontWeight: 600
                    }}
                >
                    {message.text}
                </motion.div>
            )}

            <form onSubmit={handleSubmit} style={{ 
                display: 'flex', 
                gap: '1rem', 
                maxWidth: '400px', 
                margin: '0 auto',
                flexWrap: 'wrap',
                justifyContent: 'center'
            }}>
                <input 
                    type="email" 
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                    style={{
                        flex: 1,
                        minWidth: '250px',
                        padding: '1rem 1.5rem',
                        borderRadius: '50px',
                        border: 'none',
                        fontSize: '1rem',
                        outline: 'none',
                        opacity: isSubmitting ? 0.7 : 1
                    }}
                />
                <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="btn"
                    style={{
                        background: 'white',
                        color: 'var(--color-primary)',
                        padding: '1rem 2rem',
                        borderRadius: '50px',
                        border: 'none',
                        fontWeight: 700,
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s ease',
                        opacity: isSubmitting ? 0.7 : 1
                    }}
                    onMouseOver={(e) => {
                        if (!isSubmitting) {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(12, 12, 12,0.2)';
                        }
                    }}
                    onMouseOut={(e) => {
                        if (!isSubmitting) {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }
                    }}
                >
                    {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </button>
            </form>
        </motion.div>
    );
}
