"use client";

import { motion } from 'framer-motion';
import { Home, LogOut, MessageSquare, Briefcase, Plus, Trash2, Edit2, Layers, MapPin, Phone, Mail, ArrowLeft, Eye, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminFooter from '../components/AdminFooter';

interface Service {
    _id?: string;
    name: string;
    description: string;
    category: string;
    image?: string;
    items?: string[];
    createdAt?: string;
}


export default function ServicesPage() {
    const router = useRouter();
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        image: '',
        items: ['', '', '', '']
    });
    const [editFormData, setEditFormData] = useState({
        name: '',
        description: '',
        category: '',
        image: '',
        items: ['', '', '', '']
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const auth = localStorage.getItem('adminAuth');
        const userStr = localStorage.getItem('adminUser');
        const user = userStr ? JSON.parse(userStr) : null;

        if (auth !== 'true' || user?.email !== 'admin@gmail.com') {
            router.push('/admin/login');
            return;
        }
        setIsAuthorized(true);
        fetchServices();
    }, [router]);

    if (!isAuthorized) {
        return <div style={{ minHeight: '100vh', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="animate-spin" size={48} color="#e61e25" /></div>;
    }

    async function fetchServices() {
        try {
            const response = await fetch(`/api/services?t=${Date.now()}`, {
                cache: 'no-store',
                headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
            });
            if (response.ok) {
                const data = await response.json();
                setServices(Array.isArray(data) ? data.filter((s: any) => s && s.name) : []);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const response = await fetch('/api/services', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setShowAddModal(false);
                setFormData({ name: '', description: '', category: '', image: '', items: ['', '', '', ''] });
                setSuccessMessage('Service added successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
                fetchServices();
            } else {
                const err = await response.json().catch(() => ({}));
                setSuccessMessage(err.error || 'Failed to add service. Please try again.');
                setTimeout(() => setSuccessMessage(''), 4000);
            }
        } catch (error) {
            console.error('Error adding service:', error);
            setSuccessMessage('Network error. Please check your connection.');
            setTimeout(() => setSuccessMessage(''), 4000);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingService) return;
        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/services?id=${editingService._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editFormData)
            });

            if (response.ok) {
                setShowEditModal(false);
                setEditingService(null);
                setSuccessMessage('Service updated successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
                fetchServices();
            } else {
                const err = await response.json().catch(() => ({}));
                setSuccessMessage(err.error || 'Failed to update service. Please try again.');
                setTimeout(() => setSuccessMessage(''), 4000);
            }
        } catch (error) {
            console.error('Error updating service:', error);
            setSuccessMessage('Network error. Please check your connection.');
            setTimeout(() => setSuccessMessage(''), 4000);
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEditModal = (service: Service) => {
        setEditingService(service);
        setEditFormData({
            name: service.name,
            description: service.description,
            category: service.category,
            image: service.image || '',
            items: service.items?.length ? [...service.items, ...Array(4).fill('')].slice(0, 4) : ['', '', '', '']
        });
        setShowEditModal(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this service?')) return;

        try {
            const response = await fetch(`/api/services?id=${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setServices(services.filter(s => s._id !== id));
                setSuccessMessage('Service deleted successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error deleting service:', error);
            setSuccessMessage('Failed to delete service');
            setTimeout(() => setSuccessMessage(''), 3000);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (isEdit) setEditFormData({ ...editFormData, image: reader.result as string });
                else setFormData({ ...formData, image: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
    };

    const handleLogout = () => {
        localStorage.removeItem('adminAuth');
        localStorage.removeItem('adminUser');
        router.push('/admin/login');
    };

    const ModalForm = ({ data, setData, onSubmit, onFileChange, title, submitLabel }: any) => (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(12, 12, 12,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}
            onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>
            <div style={{ maxWidth: '520px', width: '92%', background: 'white', borderRadius: '20px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px rgba(12, 12, 12,0.2)' }}
                onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1c1c1c' }}>{title}</h2>
                    <button onClick={() => { setShowAddModal(false); setShowEditModal(false); }} style={{ border: 'none', background: '#f5f5f5', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: '#666' }}><X size={20} /></button>
                </div>
                <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[{ label: 'Service Name', key: 'name', placeholder: 'e.g., Digital Signage' }, { label: 'Category', key: 'category', placeholder: 'e.g., Signage, Branding' }].map(({ label, key, placeholder }) => (
                        <div key={key}>
                            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.88rem', color: '#333' }}>{label}</label>
                            <input type="text" required value={data[key]} onChange={(e) => setData({ ...data, [key]: e.target.value })} placeholder={placeholder}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #ddd', fontSize: '0.9rem', color: '#000' }} />
                        </div>
                    ))}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.88rem', color: '#333' }}>Description</label>
                        <textarea required value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} placeholder="Describe the service..." rows={3}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #ddd', fontSize: '0.9rem', resize: 'vertical', color: '#000' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.88rem', color: '#333' }}>Image Upload</label>
                        <input type="file" accept="image/*" onChange={onFileChange}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #ddd', fontSize: '0.9rem' }} />
                        {data.image && <div style={{ marginTop: '0.75rem', height: '90px', borderRadius: '10px', overflow: 'hidden' }}><img src={data.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.88rem', color: '#333' }}>Service Features</label>
                        {data.items.map((item: string, index: number) => (
                            <input key={index} type="text" value={item} onChange={(e) => { const newItems = [...data.items]; newItems[index] = e.target.value; setData({ ...data, items: newItems }); }}
                                placeholder={`Feature ${index + 1} (optional)`}
                                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#000' }} />
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                        <button type="button" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}
                            style={{ flex: 1, padding: '0.85rem', background: '#f5f5f5', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', color: '#666' }}>Cancel</button>
                        <button type="submit"
                            style={{ flex: 2, padding: '0.85rem', background: '#e61e25', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(230,30,37,0.3)' }}>{submitLabel}</button>
                    </div>
                </form>
            </div>
        </div>
    );

    return (
        <div style={{ padding: '2rem', background: '#f8fafc', minHeight: '100vh', paddingBottom: '100px' }}>
                {successMessage && (
                    <div style={{
                        position: 'fixed',
                        top: '20px',
                        right: '20px',
                        background: successMessage.includes('success') ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        color: 'white',
                        padding: '1rem 1.5rem',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(12, 12, 12, 0.15)',
                        zIndex: 9999,
                        fontWeight: 600,
                        fontSize: '0.95rem'
                    }}>
                        {successMessage}
                    </div>
                )}
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#666', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem', transition: 'all 0.3s' }} className="hover-red">
                            <ArrowLeft size={18} /> Back to Dashboard
                        </Link>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1c1c1c', fontFamily: "'Outfit', sans-serif" }}>Services <span style={{ color: '#e61e25' }}>Management</span></h1>
                        <p style={{ color: '#666', fontSize: '0.9rem' }}>Manage your public service offerings</p>
                    </div>
                    <button 
                        onClick={() => setShowAddModal(true)} 
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem', 
                            padding: '0.8rem 1.5rem',
                            background: 'linear-gradient(135deg, #2c4a5e 0%, #e61e25 100%)',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <Plus size={20} /> Add Service
                    </button>
                </header>

                {services.length === 0 ? (
                    <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                        <Briefcase size={48} color="#666666" style={{ margin: '0 auto 1rem' }} />
                        <h3 style={{ marginBottom: '0.5rem' }}>No Services Yet</h3>
                        <p style={{ color: '#666666', marginBottom: '1.5rem' }}>Start by adding your first service</p>
                        <button 
                            onClick={() => setShowAddModal(true)} 
                            style={{ 
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.8rem 1.5rem',
                                background: 'linear-gradient(135deg, #2c4a5e 0%, #e61e25 100%)',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <Plus size={20} /> Add Service
                        </button>
                    </div>
                ) : (
                    <div className="services-grid">
                        {services.map((service, index) => (
                            <motion.div
                                key={service._id || index}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="service-card"
                                onMouseMove={handleCardMouseMove}
                            >
                                <img 
                                    src={service.image} 
                                    alt={service.name} 
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/services-hero-bg.png';
                                    }}
                                />
                                <div className="service-overlay">
                                    <h3 className="service-title">{service.name}</h3>
                                    <p className="service-desc">{service.description}</p>
                                    
                                    <div className="admin-actions">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); openEditModal(service); }}
                                            className="action-btn edit"
                                        >
                                            <Edit2 size={16} /> Edit
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); service._id && handleDelete(service._id); }}
                                            className="action-btn delete"
                                        >
                                            <Trash2 size={16} /> Delete
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Add Service Modal */}
                {showAddModal && (
                    <div style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(12, 12, 12,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }} onClick={() => setShowAddModal(false)}>
                        <div className="glass-card" style={{ 
                            maxWidth: '500px', 
                            width: '90%', 
                            padding: '2rem',
                            maxHeight: '90vh',
                            overflowY: 'auto'
                        }} onClick={(e) => e.stopPropagation()}>
                            <h2 style={{ marginBottom: '1.5rem', fontFamily: "'Outfit', sans-serif" }}>Add New Service</h2>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
                                        Service Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g., Digital Signage"
                                        style={{
                                            width: '100%',
                                            padding: '0.8rem',
                                            borderRadius: '8px',
                                            border: '1px solid var(--color-card-border)',
                                            background: 'rgba(124, 58, 237, 0.03)',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
                                        Category
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        placeholder="e.g., Signage, Branding, Graphics"
                                        style={{
                                            width: '100%',
                                            padding: '0.8rem',
                                            borderRadius: '8px',
                                            border: '1px solid var(--color-card-border)',
                                            background: 'rgba(124, 58, 237, 0.03)',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
                                        Description
                                    </label>
                                    <textarea
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Describe the service..."
                                        rows={3}
                                        style={{
                                            width: '100%',
                                            padding: '0.8rem',
                                            borderRadius: '8px',
                                            border: '1px solid var(--color-card-border)',
                                            background: 'rgba(124, 58, 237, 0.03)',
                                            fontSize: '0.95rem',
                                            resize: 'vertical'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
                                        Image (Direct Upload)
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        style={{
                                            width: '100%',
                                            padding: '0.8rem',
                                            borderRadius: '8px',
                                            border: '1px solid var(--color-card-border)',
                                            background: 'rgba(124, 58, 237, 0.03)',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                    {formData.image && (
                                        <div style={{ marginTop: '1rem', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
                                            <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
                                        Service Items (Features/Details)
                                    </label>
                                    {formData.items.map((item, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            value={item}
                                            onChange={(e) => {
                                                const newItems = [...formData.items];
                                                newItems[index] = e.target.value;
                                                setFormData({ ...formData, items: newItems });
                                            }}
                                            placeholder={`Item ${index + 1} (optional)`}
                                            style={{
                                                width: '100%',
                                                padding: '0.7rem',
                                                borderRadius: '8px',
                                                border: '1px solid var(--color-card-border)',
                                                background: 'rgba(124, 58, 237, 0.03)',
                                                fontSize: '0.9rem',
                                                marginBottom: '0.6rem'
                                            }}
                                        />
                                    ))}
                                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                                        Add up to 4 bullet points describing key features or details
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="btn btn-outline"
                                        style={{ flex: 1 }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={isSubmitting}
                                        style={{ flex: 1, opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                    >
                                        {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : 'ADD SERVICE'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Service Modal */}
                {showEditModal && (
                    <div style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(12, 12, 12,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }} onClick={() => setShowEditModal(false)}>
                        <div className="glass-card" style={{ 
                            maxWidth: '500px', 
                            width: '90%', 
                            padding: '2rem',
                            maxHeight: '90vh',
                            overflowY: 'auto'
                        }} onClick={(e) => e.stopPropagation()}>
                            <h2 style={{ marginBottom: '1.5rem', fontFamily: "'Outfit', sans-serif" }}>Edit Service</h2>
                            <form onSubmit={handleEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
                                        Service Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={editFormData.name}
                                        onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                        placeholder="e.g., Digital Signage"
                                        style={{
                                            width: '100%',
                                            padding: '0.8rem',
                                            borderRadius: '8px',
                                            border: '1px solid var(--color-card-border)',
                                            background: 'rgba(124, 58, 237, 0.03)',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
                                        Category
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={editFormData.category}
                                        onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                                        placeholder="e.g., Signage, Branding, Graphics"
                                        style={{
                                            width: '100%',
                                            padding: '0.8rem',
                                            borderRadius: '8px',
                                            border: '1px solid var(--color-card-border)',
                                            background: 'rgba(124, 58, 237, 0.03)',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
                                        Description
                                    </label>
                                    <textarea
                                        required
                                        value={editFormData.description}
                                        onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                        placeholder="Describe the service..."
                                        rows={3}
                                        style={{
                                            width: '100%',
                                            padding: '0.8rem',
                                            borderRadius: '8px',
                                            border: '1px solid var(--color-card-border)',
                                            background: 'rgba(124, 58, 237, 0.03)',
                                            fontSize: '0.95rem',
                                            resize: 'vertical'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
                                        Image (Direct Upload)
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, true)}
                                        style={{
                                            width: '100%',
                                            padding: '0.8rem',
                                            borderRadius: '8px',
                                            border: '1px solid var(--color-card-border)',
                                            background: 'rgba(124, 58, 237, 0.03)',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                    {editFormData.image && (
                                        <div style={{ marginTop: '1rem', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
                                            <img src={editFormData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
                                        Service Items (Features/Details)
                                    </label>
                                    {editFormData.items.map((item, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            value={item}
                                            onChange={(e) => {
                                                const newItems = [...editFormData.items];
                                                newItems[index] = e.target.value;
                                                setEditFormData({ ...editFormData, items: newItems });
                                            }}
                                            placeholder={`Item ${index + 1} (optional)`}
                                            style={{
                                                width: '100%',
                                                padding: '0.7rem',
                                                borderRadius: '8px',
                                                border: '1px solid var(--color-card-border)',
                                                background: 'rgba(124, 58, 237, 0.03)',
                                                fontSize: '0.9rem',
                                                marginBottom: '0.6rem'
                                            }}
                                        />
                                    ))}
                                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                                        Add up to 4 bullet points describing key features or details
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="btn btn-outline"
                                        style={{ flex: 1 }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={isSubmitting}
                                        style={{ flex: 1, opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                    >
                                        {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : 'Update Service'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Admin Footer */}
                <AdminFooter />
            <style jsx global>{`
                .hover-red:hover { color: #e61e25 !important; }

                .services-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    gap: 2rem;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .service-card {
                    position: relative;
                    height: 380px;
                    border-radius: 20px;
                    overflow: hidden;
                    cursor: pointer;
                    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                    background: #000;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 10px 30px rgba(12, 12, 12, 0.2);
                    will-change: transform, box-shadow;
                }

                .service-card::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(230, 30, 37, 0.15), transparent 80%);
                    opacity: 0;
                    transition: opacity 0.4s ease;
                    pointer-events: none;
                    z-index: 1;
                }

                .service-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 20px 40px rgba(230, 30, 37, 0.15);
                    border-color: rgba(230, 30, 37, 0.3);
                }

                .service-card:hover::before {
                    opacity: 1;
                }

                .service-card img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .service-card:hover img {
                    transform: scale(1.1);
                    filter: brightness(0.7);
                }

                .service-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to top, rgba(12, 12, 12,0.95) 0%, rgba(12, 12, 12,0.4) 50%, rgba(12, 12, 12,0.1) 100%);
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                    padding: 2rem;
                    color: white;
                    z-index: 2;
                    transition: all 0.6s ease;
                }

                .service-card:hover .service-overlay {
                    background: linear-gradient(to top, rgba(12, 12, 12,0.98) 0%, rgba(12, 12, 12,0.3) 100%);
                }

                .service-title {
                    font-size: 1.7rem;
                    font-weight: 800;
                    margin-bottom: 0.6rem;
                    color: white;
                    text-shadow: 0 2px 10px rgba(12, 12, 12,0.5);
                    transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .service-card:hover .service-title {
                    color: #ffffff;
                    text-shadow: 0 0 20px rgba(230,30,37,0.6);
                    transform: translateY(-5px);
                }

                .service-desc {
                    font-size: 1rem;
                    color: rgba(255,255,255,0.85);
                    line-height: 1.5;
                    margin-bottom: 1.5rem;
                    transition: all 0.6s ease;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .service-card:hover .service-desc {
                    color: white;
                    transform: translateY(-3px);
                }

                .admin-actions {
                    display: flex;
                    gap: 1rem;
                    opacity: 0.6;
                    transition: all 0.6s ease;
                    margin-top: 1rem;
                }

                .service-card:hover .admin-actions {
                    opacity: 1;
                    transform: translateY(-2px);
                }

                .action-btn {
                    padding: 10px 20px;
                    border-radius: 10px;
                    border: 1px solid rgba(255,255,255,0.2);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: all 0.6s;
                    backdrop-filter: blur(12px);
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: white;
                }

                .action-btn.edit {
                    background: rgba(255, 255, 255, 0.15);
                }

                .action-btn.edit:hover {
                    background: #1c1c1c;
                    color: #1c1c1c;
                }

                .action-btn.delete {
                    background: rgba(230, 30, 37, 0.2);
                    border-color: rgba(230,30,37,0.4);
                }

                .action-btn.delete:hover {
                    background: #e61e25;
                    border-color: #e61e25;
                }

                @media (max-width: 768px) {
                    .services-grid { grid-template-columns: 1fr; }
                    .service-card { height: 300px; }
                }
            `}</style>
        </div>
    );
}
