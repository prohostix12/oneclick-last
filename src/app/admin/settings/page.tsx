"use client";

import { motion } from 'framer-motion';
import { Save, CheckCircle, Mail, Phone, MapPin, Settings as SettingsIcon, Shield, Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminHeader from '../components/AdminHeader';
import AdminFooter from '../components/AdminFooter';

export default function SettingsPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Default contact values
    const [contact, setContact] = useState({
        email: 'hello@oneclickadv.ae',
        phone: '+971 52 406 5110',
        location: 'Dubai, UAE'
    });

    useEffect(() => {
        const authToken = localStorage.getItem('adminAuth');
        if (authToken === 'true') {
            setIsAuthenticated(true);
        } else {
            router.push('/admin/login');
        }
    }, [router]);

    // Load existing settings
    useEffect(() => {
        if (!isAuthenticated) return;
        (async () => {
            try {
                const res = await fetch('/api/settings');
                if (res.ok) {
                    const data = await res.json();
                    if (data && (data.email || data.phone || data.location)) {
                        setContact({
                            email: data.email || contact.email,
                            phone: data.phone || contact.phone,
                            location: data.location || contact.location
                        });
                    }
                }
            } catch (e) {
                // ignore
            }
        })();
    }, [isAuthenticated]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contact)
            });
            if (res.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            } else {
                const err = await res.json().catch(() => ({}));
                console.error('Failed saving settings', err);
            }
        } catch (e) {
            console.error('Save settings error', e);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div style={{ padding: '0' }}>
            <AdminHeader 
                title="System Settings"
                subtitle="Configure global contact information and account security"
                actionButton={
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSave}
                        disabled={isSaving}
                        style={{
                            background: saved ? '#10b981' : '#e61e25',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.9rem 1.8rem',
                            color: 'white',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            boxShadow: '0 4px 12px rgba(12, 12, 12,0.15)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {isSaving ? 'Saving...' : saved ? <><CheckCircle size={20} /> Saved</> : <><Save size={20} /> Save Changes</>}
                    </motion.button>
                }
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                {/* Contact Details Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(12, 12, 12, 0.05)' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ padding: '0.8rem', background: 'rgba(230, 30, 37, 0.1)', color: '#e61e25', borderRadius: '12px' }}>
                            <Mail size={24} />
                        </div>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827' }}>Contact Essentials</h2>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>Public Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <input 
                                    type="text" 
                                    value={contact.email} 
                                    onChange={(e) => setContact({...contact, email: e.target.value})}
                                    style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }}
                                />
                                <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                            </div>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>Primary Phone Number</label>
                            <div style={{ position: 'relative' }}>
                                <input 
                                    type="text" 
                                    value={contact.phone} 
                                    onChange={(e) => setContact({...contact, phone: e.target.value})}
                                    style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }}
                                />
                                <Phone size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>Business Location</label>
                            <div style={{ position: 'relative' }}>
                                <input 
                                    type="text" 
                                    value={contact.location} 
                                    onChange={(e) => setContact({...contact, location: e.target.value})}
                                    style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }}
                                />
                                <MapPin size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
            <AdminFooter />
        </div>
    );
}
