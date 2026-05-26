"use client";

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Edit2, Globe, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AdminHeaderProps {
    title: string;
    subtitle: string;
    actionButton?: React.ReactNode;
}

export default function AdminHeader({ title, subtitle, actionButton }: AdminHeaderProps) {
    const router = useRouter();
    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '2.5rem', borderBottom: '1px solid rgba(12, 12, 12,0.05)', marginBottom: '2.5rem' }}>
            <div style={{ flex: 1 }}>
                <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#666', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem', transition: 'all 0.3s' }} className="hover-red">
                    <ArrowLeft size={18} /> Back to Dashboard
                </Link>
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}
                >
                    <div style={{ padding: '0.4rem 0.8rem', background: 'rgba(230, 30, 37, 0.1)', color: '#e61e25', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Admin Overview
                    </div>
                </motion.div>
                <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#111827', marginBottom: '0.5rem', fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                    {title}
                </h1>
                <p style={{ color: '#6b7280', fontSize: '1rem', fontFamily: "'Manrope', sans-serif" }}>{subtitle}</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                {/* Unified Contact Status / Edit Button */}
                <div 
                    onClick={() => router.push('/admin/settings')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.2rem',
                        padding: '0.8rem 1.5rem',
                        background: '#ffffff',
                        borderRadius: '16px',
                        border: '1px solid #f1f5f9',
                        boxShadow: '0 4px 6px -1px rgba(12, 12, 12, 0.05)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                   onMouseEnter={(e) => {
                       e.currentTarget.style.transform = 'translateY(-2px)';
                       e.currentTarget.style.borderColor = 'rgba(230, 30, 37, 0.2)';
                   }}
                   onMouseLeave={(e) => {
                       e.currentTarget.style.transform = 'translateY(0)';
                       e.currentTarget.style.borderColor = '#f1f5f9';
                   }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#111827' }}>
                            <Edit2 size={16} color="#e61e25" />
                            Edit Contact Details
                        </div>
                    </div>
                    <div style={{ padding: '0.4rem', background: '#f8fafc', borderRadius: '8px', color: '#94a3b8' }}>
                         <ArrowRight size={16} />
                    </div>
                </div>

                {/* Additional Action Button (like Add Project/Service) */}
                {actionButton && (
                    <div style={{ marginLeft: '0.5rem' }}>
                        {actionButton}
                    </div>
                )}
            </div>
            <style jsx global>{`
                .hover-red:hover { color: #e61e25 !important; }
            `}</style>
        </header>
    );
}
