"use client";

import { motion, Variants } from 'framer-motion';
import { Home, Users, MessageSquare, Briefcase, TrendingUp, Activity, Clock, CheckCircle, Mail, Phone, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminFooter from './components/AdminFooter';
import Logo from '../components/Logo';

export default function AdminPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPath, setCurrentPath] = useState('');
    const [stats, setStats] = useState({
        contacts: 0,
        services: 0
    });
    const [recentContacts, setRecentContacts] = useState<any[]>([]);
    const [selectedContact, setSelectedContact] = useState<any | null>(null);

    useEffect(() => {
        const authToken = localStorage.getItem('adminAuth');
        const adminUserStr = localStorage.getItem('adminUser');
        const adminUser = adminUserStr ? JSON.parse(adminUserStr) : null;

        if (authToken === 'true' && adminUser?.email === 'admin@gmail.com') {
            setIsAuthenticated(true);
            fetchStats();
            fetchRecentContacts();
        } else {
            router.push('/admin/login');
        }
        setIsLoading(false);
        setCurrentPath(window.location.pathname);

        // Add event listener to refresh stats when returning to dashboard
        const handleFocus = () => {
            if (document.visibilityState === 'visible') {
                fetchStats();
                fetchRecentContacts();
            }
        };

        document.addEventListener('visibilitychange', handleFocus);
        window.addEventListener('focus', handleFocus);

        return () => {
            document.removeEventListener('visibilitychange', handleFocus);
            window.removeEventListener('focus', handleFocus);
        };
    }, [router]);

    const fetchStats = async () => {
        try {
            const [contactsRes, servicesRes] = await Promise.all([
                fetch('/api/contact'),
                fetch('/api/services')
            ]);
            const contacts = await contactsRes.json();
            const services = await servicesRes.json();
            
            // Count both static services (7) and dynamic services from database
            const staticServicesCount = 7; // Branding, Digital Printing, Vehicle Graphics, Signage, Exhibition, Cladding, Premium Outdoor
            const dynamicServicesCount = Array.isArray(services) ? services.filter((s: any) => s && s.name).length : 0;
            const totalServicesCount = staticServicesCount + dynamicServicesCount;
            
            setStats({
                contacts: contacts.length || 0,
                services: totalServicesCount
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
            // Fallback to static count if API fails
            setStats({
                contacts: 0,
                services: 7
            });
        }
    };

    const fetchRecentContacts = async () => {
        try {
            const response = await fetch('/api/contact');
            const data = await response.json();
            setRecentContacts(data.slice(0, 5));
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#050505' }}>
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
                    <div className="spin-loader" />
                    <p style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: 600 }}>Loading Dashboard...</p>
                </motion.div>
                <style jsx>{`
                    .spin-loader {
                        width: 60px; height: 60px; border: 4px solid rgba(230, 30, 37, 0.3);
                        border-top: 4px solid #e61e25; border-radius: 50%;
                        margin: 0 auto 1rem; animation: spin 0.4s linear infinite;
                    }
                    @keyframes spin { to { transform: rotate(360deg); } }
                `}</style>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.3 } }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 100 } }
    };

    return (
        <div style={{ padding: '0' }}>
            {/* Responsive Header */}
            <motion.header 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="admin-header"
                style={{ 
                    padding: '1.5rem 2rem', background: '#1c1c1c', borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.4)', marginBottom: '2rem',
                    display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '1rem' }}>
                    <div onClick={() => window.location.href='/'} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
                                <Logo size="small" showFullText={true} />
                    </div>
                    
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push('/')}
                        style={{
                            background: 'linear-gradient(135deg, #1c1c1c 0%, #e61e25 100%)',
                            border: 'none', borderRadius: '12px', padding: '0.6rem 1.2rem',
                            color: 'white', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(230,30,37,0.25)'
                        }}
                    >
                        <Home size={16} /> Home
                    </motion.button>
                </div>

                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                            Welcome, <span style={{ color: '#e61e25' }}>Admin</span>
                        </h1>
                        <p style={{ color: '#666', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '5px' }}>
                            <Clock size={16} color="#e61e25" />
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>Administrator</div>
                            <div style={{ fontSize: '0.8rem', color: '#888' }}>admin@click.com</div>
                        </div>
                        <div style={{ width: 45, height: 45, borderRadius: '12px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Users size={22} color="#e61e25" />
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Stats Cards */}
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="admin-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {[
                    { title: "Inquiries", value: stats.contacts, icon: <MessageSquare size={28} />, color: '#e61e25', link: '/admin/contacts' },
                    { title: "Services", value: stats.services, icon: <Briefcase size={28} />, color: '#1c1c1c', link: '/admin/services' }
                ].map((stat, i) => (
                    <motion.div key={i} variants={itemVariants} onClick={() => router.push(stat.link)} style={{ background: '#1c1c1c', padding: '2rem', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <div style={{ width: 50, height: 50, borderRadius: '12px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                                {stat.icon}
                            </div>
                            <TrendingUp size={20} color="#e61e25" />
                        </div>
                        <h5 style={{ color: '#888', margin: '0 0 5px 0', fontSize: '0.9rem', fontWeight: 600 }}>{stat.title}</h5>
                        <h2 style={{ fontSize: '2.2rem', margin: 0, color: '#ffffff', fontWeight: 800 }}>{stat.value}</h2>
                    </motion.div>
                ))}
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <motion.div 
                    variants={itemVariants} 
                    onClick={() => router.push('/admin/services')}
                    style={{ 
                        background: 'linear-gradient(135deg, #e61e25 0%, #ff4757 100%)', 
                        padding: '2rem', 
                        borderRadius: '20px', 
                        cursor: 'pointer', 
                        color: 'white',
                        boxShadow: '0 8px 25px rgba(230, 30, 37, 0.3)',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ width: 50, height: 50, borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Briefcase size={24} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Manage Services</h3>
                            <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>Add, edit, or remove services</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    variants={itemVariants} 
                    onClick={() => router.push('/admin/contacts')}
                    style={{ 
                        background: 'linear-gradient(135deg, #1c1c1c 0%, #333 100%)', 
                        padding: '2rem', 
                        borderRadius: '20px', 
                        cursor: 'pointer', 
                        color: 'white',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ width: 50, height: 50, borderRadius: '12px', background: 'rgba(230,30,37,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <MessageSquare size={24} color="#e61e25" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>View Inquiries</h3>
                            <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.7 }}>Manage customer contacts</p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Main Content Area */}
            <div className="admin-bottom-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {/* Recent Contacts */}
                <motion.div variants={itemVariants} initial="hidden" animate="visible" style={{ background: '#1c1c1c', padding: '2rem', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff' }}>
                        <Activity size={20} color="#e61e25" /> Recent Contacts
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {recentContacts.length > 0 ? recentContacts.map((contact, i) => (
                            <div key={i} onClick={() => setSelectedContact(contact)} style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                                <div>
                                    <p style={{ fontWeight: 600, margin: 0, color: '#ffffff', fontSize: '0.95rem' }}>{contact.name}</p>
                                    <p style={{ fontSize: '0.8rem', color: '#888', margin: 0 }}>{contact.email}</p>
                                </div>
                                <CheckCircle size={18} color="#e61e25" />
                            </div>
                        )) : <p style={{ color: '#888', textAlign: 'center' }}>No recent inquiries</p>}
                    </div>
                </motion.div>

                {/* Analytics */}
                <motion.div variants={itemVariants} initial="hidden" animate="visible" style={{ background: 'linear-gradient(135deg, #1c1c1c 0%, #333 100%)', padding: '2rem', borderRadius: '20px', color: '#fff' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <TrendingUp size={20} color="#e61e25" /> Overview
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#e61e25' }}>98%</div>
                            <div style={{ fontSize: '0.7rem', color: '#aaa', textTransform: 'uppercase' }}>Response</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>4.9/5</div>
                            <div style={{ fontSize: '0.7rem', color: '#aaa', textTransform: 'uppercase' }}>Rating</div>
                        </div>
                    </div>
                    <div style={{ padding: '1rem', background: 'rgba(230,30,37,0.1)', borderRadius: '12px', border: '1px solid rgba(230,30,37,0.2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e61e25', fontSize: '0.85rem', fontWeight: 600 }}>
                            <ShieldCheck size={16} /> System Operational
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Modal */}
            {selectedContact && (
                <div onClick={() => setSelectedContact(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} onClick={e => e.stopPropagation()} style={{ background: '#1c1c1c', padding: '2.5rem', borderRadius: '24px', maxWidth: '500px', width: '100%', position: 'relative', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <button onClick={() => setSelectedContact(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', color: 'white' }}>✕</button>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.5rem' }}>{selectedContact.name}</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', marginBottom: '2px' }}>Email</div>
                                <div style={{ fontWeight: 600, color: '#ffffff' }}>{selectedContact.email}</div>
                            </div>
                            {selectedContact.message && (
                                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', marginBottom: '2px' }}>Message</div>
                                    <div style={{ color: '#ccc', lineHeight: 1.5 }}>{selectedContact.message}</div>
                                </div>
                            )}
                        </div>
                        <a href={`mailto:${selectedContact.email}`} style={{ display: 'block', width: '100%', padding: '1rem', background: '#e61e25', color: '#fff', textAlign: 'center', borderRadius: '12px', fontWeight: 700, textDecoration: 'none', marginTop: '2rem' }}>Reply via Email</a>
                    </motion.div>
                </div>
            )}

            <AdminFooter />
        </div>
    );
}
