"use client";

import { useState, useEffect } from 'react';
import { Mail, Trash2, Download, Users, TrendingUp, Calendar, Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Subscriber {
    id: string;
    email: string;
    subscribedAt: string;
    status: 'active' | 'unsubscribed';
}

export default function AdminNewsletterPage() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All');

    const statuses = ['All', 'active', 'unsubscribed'];

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const fetchSubscribers = async () => {
        try {
            const response = await fetch('/api/newsletter');
            const data = await response.json();
            setSubscribers(data);
        } catch (error) {
            console.error('Error fetching subscribers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSubscriber = async (id: string) => {
        if (confirm('Are you sure you want to delete this subscriber?')) {
            try {
                const response = await fetch(`/api/newsletter?id=${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setSubscribers(subscribers.filter(sub => sub.id !== id));
                } else {
                    alert('Failed to delete subscriber');
                }
            } catch (error) {
                console.error('Error deleting subscriber:', error);
                alert('Failed to delete subscriber');
            }
        }
    };

    const handleExportSubscribers = () => {
        const csvContent = [
            ['Email', 'Subscribed At', 'Status'],
            ...filteredSubscribers.map(sub => [
                sub.email,
                new Date(sub.subscribedAt).toLocaleDateString(),
                sub.status
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const filteredSubscribers = subscribers.filter(subscriber => {
        const matchesSearch = subscriber.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === 'All' || subscriber.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const activeSubscribers = subscribers.filter(sub => sub.status === 'active').length;
    const thisMonthSubscribers = subscribers.filter(sub => {
        const subDate = new Date(sub.subscribedAt);
        const now = new Date();
        return subDate.getMonth() === now.getMonth() && subDate.getFullYear() === now.getFullYear();
    }).length;

    return (
        <div style={{ padding: '2rem' }}>
            {/* Header */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '2rem',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <div>
                    <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#666', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem', transition: 'all 0.3s' }} className="hover-red">
                        <ArrowLeft size={18} /> Back to Dashboard
                    </Link>
                    <h1 style={{ 
                        fontSize: '2.5rem', 
                        fontWeight: 800, 
                        marginBottom: '0.5rem',
                        color: 'var(--color-text-main)'
                    }}>
                        Subscribers
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>
                        Manage your subscribers
                    </p>
                </div>
                <button 
                    onClick={handleExportSubscribers}
                    className="btn btn-primary"
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        padding: '1rem 2rem'
                    }}
                >
                    <Download size={20} />
                    Export CSV
                </button>
            </div>

            {/* Stats Cards */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '1rem',
                marginBottom: '2rem'
            }}>
                <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{ 
                        width: '50px', 
                        height: '50px', 
                        borderRadius: '12px', 
                        background: 'rgba(124, 58, 237, 0.1)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        margin: '0 auto 1rem'
                    }}>
                        <Users size={24} color="var(--color-primary)" />
                    </div>
                    <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                        {subscribers.length}
                    </h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Total Subscribers</p>
                </div>

                <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{ 
                        width: '50px', 
                        height: '50px', 
                        borderRadius: '12px', 
                        background: 'rgba(34, 197, 94, 0.1)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        margin: '0 auto 1rem'
                    }}>
                        <Mail size={24} color="#22c55e" />
                    </div>
                    <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#22c55e', marginBottom: '0.5rem' }}>
                        {activeSubscribers}
                    </h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Active Subscribers</p>
                </div>

                <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{ 
                        width: '50px', 
                        height: '50px', 
                        borderRadius: '12px', 
                        background: 'rgba(59, 130, 246, 0.1)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        margin: '0 auto 1rem'
                    }}>
                        <TrendingUp size={24} color="#3b82f6" />
                    </div>
                    <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#3b82f6', marginBottom: '0.5rem' }}>
                        {thisMonthSubscribers}
                    </h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>This Month</p>
                </div>

                <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{ 
                        width: '50px', 
                        height: '50px', 
                        borderRadius: '12px', 
                        background: 'rgba(245, 158, 11, 0.1)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        margin: '0 auto 1rem'
                    }}>
                        <Calendar size={24} color="#f59e0b" />
                    </div>
                    <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b', marginBottom: '0.5rem' }}>
                        {activeSubscribers > 0 ? Math.round((thisMonthSubscribers / activeSubscribers) * 100) : 0}%
                    </h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Growth Rate</p>
                </div>
            </div>

            {/* Filters */}
            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                    gap: '1rem',
                    alignItems: 'end'
                }}>
                    {/* Search */}
                    <div>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '0.5rem', 
                            fontWeight: 600,
                            color: 'var(--color-text-main)'
                        }}>
                            Search Subscribers
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Search 
                                size={20} 
                                style={{ 
                                    position: 'absolute', 
                                    left: '1rem', 
                                    top: '50%', 
                                    transform: 'translateY(-50%)',
                                    color: 'var(--color-text-muted)'
                                }} 
                            />
                            <input
                                type="text"
                                placeholder="Search by email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem 1rem 0.8rem 3rem',
                                    border: '1px solid var(--color-card-border)',
                                    borderRadius: '8px',
                                    fontSize: '0.95rem'
                                }}
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '0.5rem', 
                            fontWeight: 600,
                            color: 'var(--color-text-main)'
                        }}>
                            Status
                        </label>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                border: '1px solid var(--color-card-border)',
                                borderRadius: '8px',
                                fontSize: '0.95rem'
                            }}
                        >
                            {statuses.map(status => (
                                <option key={status} value={status}>
                                    {status === 'All' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Subscribers Table */}
            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: '4rem', textAlign: 'center' }}>
                        <div style={{ 
                            width: '50px', 
                            height: '50px', 
                            border: '3px solid rgba(124, 58, 237, 0.3)', 
                            borderTop: '3px solid var(--color-primary)', 
                            borderRadius: '50%', 
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 1rem'
                        }} />
                        <p style={{ color: 'var(--color-text-muted)' }}>Loading subscribers...</p>
                    </div>
                ) : filteredSubscribers.length === 0 ? (
                    <div style={{ padding: '4rem', textAlign: 'center' }}>
                        <Mail size={48} color="var(--color-text-muted)" style={{ marginBottom: '1rem' }} />
                        <h3 style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>No subscribers found</h3>
                        <p style={{ color: 'var(--color-text-muted)' }}>
                            {searchTerm || selectedStatus !== 'All' 
                                ? 'Try adjusting your filters or search terms.'
                                : 'Subscribers will appear here once people sign up for your newsletter.'
                            }
                        </p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="admin-table" style={{ width: '100%' }}>
                            <thead>
                                <tr style={{ background: 'rgba(124, 58, 237, 0.05)' }}>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Email</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Subscribed Date</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Status</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSubscribers.map((subscriber) => (
                                    <motion.tr 
                                        key={subscriber.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        style={{ borderBottom: '1px solid var(--color-card-border)' }}
                                    >
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '50%',
                                                    background: 'var(--color-primary)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontWeight: 600,
                                                    fontSize: '0.9rem'
                                                }}>
                                                    {subscriber.email.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>
                                                        {subscriber.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>
                                            {new Date(subscriber.subscribedAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                background: subscriber.status === 'active' ? '#10b981' : '#6b7280',
                                                color: 'white',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '12px',
                                                fontSize: '0.8rem',
                                                fontWeight: 600,
                                                textTransform: 'capitalize'
                                            }}>
                                                {subscriber.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <button
                                                onClick={() => handleDeleteSubscriber(subscriber.id)}
                                                style={{
                                                    padding: '0.5rem',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    background: 'rgba(239, 68, 68, 0.1)',
                                                    color: '#ef4444',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                title="Delete Subscriber"
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <style jsx global>{`
                .hover-red:hover { color: #e61e25 !important; }
            `}</style>
        </div>
    );
}
