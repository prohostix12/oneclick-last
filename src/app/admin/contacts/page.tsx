"use client";

import { motion } from 'framer-motion';
import { Home, LogOut, MessageSquare, Briefcase, Trash2, Mail, Phone, Calendar, MapPin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminFooter from '../components/AdminFooter';

interface Contact {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    message: string;
    createdAt: string;
}

export default function ContactsPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const authToken = localStorage.getItem('adminAuth');
        if (authToken === 'true') {
            setIsAuthenticated(true);
            fetchContacts();
        } else {
            router.push('/admin/login');
        }
    }, [router]);

    const fetchContacts = async () => {
        try {
            const response = await fetch('/api/contact');
            const data = await response.json();
            setContacts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching contacts:', error);
            setContacts([]);
        }
        setIsLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this contact?')) return;

        try {
            const response = await fetch(`/api/contact?id=${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setContacts(contacts.filter(c => c._id !== id));
            }
        } catch (error) {
            console.error('Error deleting contact:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminAuth');
        localStorage.removeItem('adminUser');
        router.push('/admin/login');
    };

    if (!isAuthenticated) return null;

    return (
        <div style={{ padding: '2rem', minHeight: '100vh', background: '#050505', color: '#ffffff' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(44, 74, 94, 0.2)' }}>
                    <div>
                        <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#666', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem', transition: 'all 0.3s' }} className="hover-red">
                            <ArrowLeft size={18} /> Back to Dashboard
                        </Link>
                        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', fontFamily: "'Bricolage Grotesque', sans-serif", color: '#ffffff' }}>Contact <span style={{ color: '#e61e25', fontWeight: 700 }}>Forms</span></h1>
                        <p style={{ color: '#aaa', fontSize: '0.9rem', fontFamily: "'Manrope', sans-serif" }}>Manage customer inquiries and messages</p>
                    </div>
                    <div style={{ background: 'rgba(230, 30, 37, 0.1)', padding: '0.8rem 1.5rem', borderRadius: '12px', border: '1px solid rgba(230, 30, 37, 0.2)' }}>
                        <span style={{ color: '#ffffff', fontWeight: 800 }}>{contacts.length} Total</span>
                    </div>
                </header>

                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '5rem' }}>
                        <p style={{ color: '#888' }}>Loading contacts...</p>
                    </div>
                ) : contacts.length === 0 ? (
                    <div className="glass-card" style={{ padding: '5rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <MessageSquare size={64} color="rgba(255,255,255,0.1)" style={{ margin: '0 auto 1.5rem' }} />
                        <h3 style={{ marginBottom: '0.5rem', color: '#ffffff' }}>No Contact Forms Yet</h3>
                        <p style={{ color: '#888' }}>Contact form submissions will appear here</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {contacts.map((contact) => (
                            <motion.div
                                key={contact._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass-card"
                                style={{ 
                                    padding: '1.5rem',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                    borderRadius: '16px'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem', fontFamily: "'DM Sans', sans-serif", color: '#ffffff', fontWeight: 700 }}>{contact.name}</h3>
                                        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#aaaaaa', fontSize: '0.9rem' }}>
                                                <Mail size={16} color="#e61e25" />
                                                {contact.email}
                                            </div>
                                            {contact.phone && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#aaaaaa', fontSize: '0.9rem' }}>
                                                    <Phone size={16} color="#e61e25" />
                                                    {contact.phone}
                                                </div>
                                            )}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#aaaaaa', fontSize: '0.9rem' }}>
                                                <Calendar size={16} color="#e61e25" />
                                                {new Date(contact.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(contact._id)}
                                        style={{
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            border: '1px solid rgba(239, 68, 68, 0.3)',
                                            color: '#ef4444',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            fontSize: '0.9rem',
                                            fontWeight: 600
                                        }}
                                    >
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </div>
                                <div style={{ 
                                    background: 'rgba(230, 30, 37, 0.05)', 
                                    padding: '1.2rem', 
                                    borderRadius: '12px',
                                    border: '1px solid rgba(230, 30, 37, 0.15)'
                                }}>
                                    <p style={{ color: '#dddddd', lineHeight: '1.6', margin: 0, fontFamily: "'Manrope', sans-serif" }}>
                                        {contact.message}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Admin Footer */}
                <AdminFooter />
            <style jsx global>{`
                .hover-red:hover { color: #e61e25 !important; }
            `}</style>
        </div>
    );
}
