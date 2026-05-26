"use client";

import { motion } from 'framer-motion';
import { Home, MessageSquare, Briefcase, LogOut, Plus, Trash2, Layers, MapPin, Phone, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminFooter from '../components/AdminFooter';

interface Project {
    _id: string;
    title: string;
    category: string;
    image: string;
    description?: string;
    createdAt: string;
}

export default function ProjectsPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        category: 'Billboards',
        image: '',
        description: ''
    });

    useEffect(() => {
        const authToken = localStorage.getItem('adminAuth');
        if (authToken === 'true') {
            setIsAuthenticated(true);
            fetchProjects();
        } else {
            router.push('/admin/login');
        }
    }, [router]);

    const fetchProjects = async () => {
        try {
            const response = await fetch('/api/projects');
            const data = await response.json();
            setProjects(data || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
        setIsLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setShowAddModal(false);
                setFormData({ title: '', category: 'Billboards', image: '', description: '' });
                setSuccessMessage('Project added successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
                fetchProjects();
            }
        } catch (error) {
            console.error('Error adding project:', error);
            setSuccessMessage('Failed to add project');
            setTimeout(() => setSuccessMessage(''), 3000);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            const response = await fetch(`/api/projects?id=${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setProjects(projects.filter(p => p._id !== id));
                setSuccessMessage('Project deleted successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error deleting project:', error);
            setSuccessMessage('Failed to delete project');
            setTimeout(() => setSuccessMessage(''), 3000);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminAuth');
        localStorage.removeItem('adminUser');
        router.push('/admin/login');
    };

    if (!isAuthenticated) return null;

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            

            {/* Main Content */}
            <main className="admin-main" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100vh', overflowY: 'auto' }}>
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
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(44, 74, 94, 0.2)' }}>
                    <div>
                        <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#666', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem', transition: 'all 0.3s' }} className="hover-red">
                            <ArrowLeft size={18} /> Back to Dashboard
                        </Link>
                        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#1c1c1c' }}>Projects <span className="text-gradient">Management</span></h1>
                        <p style={{ color: '#666666', fontSize: '0.9rem', fontFamily: "'DM Sans', sans-serif" }}>Manage your advertising projects</p>
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
                        <Plus size={20} /> Add Project
                    </button>
                </header>

                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <p style={{ color: '#666666' }}>Loading projects...</p>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                        <Layers size={48} color="#666666" style={{ margin: '0 auto 1rem' }} />
                        <h3 style={{ marginBottom: '0.5rem' }}>No Projects Yet</h3>
                        <p style={{ color: '#666666', marginBottom: '1.5rem' }}>Start by adding your first project</p>
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
                            <Plus size={20} /> Add Project
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {projects.map((project) => (
                            <motion.div
                                key={project._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass-card"
                                style={{ padding: '0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                            >
                                {project.image && (
                                    <div style={{ 
                                        width: '100%', 
                                        height: '200px', 
                                        overflow: 'hidden',
                                        background: '#f0f0f0'
                                    }}>
                                        <img 
                                            src={project.image} 
                                            alt={project.title}
                                            style={{ 
                                                width: '100%', 
                                                height: '100%', 
                                                objectFit: 'cover' 
                                            }}
                                        />
                                    </div>
                                )}
                                <div style={{ padding: '1.5rem' }}>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <span style={{ 
                                            background: 'rgba(255, 107, 53, 0.1)', 
                                            color: '#e61e25',
                                            padding: '0.3rem 0.8rem',
                                            borderRadius: '6px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            textTransform: 'uppercase'
                                        }}>
                                            {project.category}
                                        </span>
                                    </div>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.8rem', color: '#1c1c1c' }}>
                                        {project.title}
                                    </h3>
                                    {project.description && (
                                        <p style={{ color: '#666666', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                                            {project.description}
                                        </p>
                                    )}
                                    <button
                                        onClick={() => handleDelete(project._id)}
                                        style={{
                                            width: '100%',
                                            padding: '0.7rem',
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            border: '1px solid rgba(239, 68, 68, 0.3)',
                                            color: '#ef4444',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            fontSize: '0.9rem',
                                            fontWeight: 600,
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <Trash2 size={16} /> Delete Project
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Add Project Modal */}
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
                            <h2 style={{ marginBottom: '1.5rem', fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#1c1c1c' }}>Add New Project</h2>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#1c1c1c' }}>
                                        Project Title
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g., DIOR Luxury Billboard"
                                        style={{
                                            width: '100%',
                                            padding: '0.8rem',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(44, 74, 94, 0.2)',
                                            background: 'rgba(255, 107, 53, 0.03)',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#1c1c1c' }}>
                                        Category
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '0.8rem',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(44, 74, 94, 0.2)',
                                            background: 'rgba(255, 107, 53, 0.03)',
                                            fontSize: '0.95rem'
                                        }}
                                    >
                                        <option value="Billboards">Billboards</option>
                                        <option value="Retail Signage">Retail Signage</option>
                                        <option value="Vehicle Branding">Vehicle Branding</option>
                                        <option value="Campaigns">Campaign Solutions</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#1c1c1c' }}>
                                        Image URL
                                    </label>
                                    <input
                                        type="url"
                                        required
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        placeholder="/signage-production.png"
                                        style={{
                                            width: '100%',
                                            padding: '0.8rem',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(44, 74, 94, 0.2)',
                                            background: 'rgba(255, 107, 53, 0.03)',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#1c1c1c' }}>
                                        Description (Optional)
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Brief description of the project..."
                                        rows={3}
                                        style={{
                                            width: '100%',
                                            padding: '0.8rem',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(44, 74, 94, 0.2)',
                                            background: 'rgba(255, 107, 53, 0.03)',
                                            fontSize: '0.95rem',
                                            resize: 'vertical'
                                        }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        style={{ 
                                            flex: 1,
                                            padding: '0.8rem',
                                            background: '#f5f5f5',
                                            border: '1px solid rgba(44, 74, 94, 0.2)',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: 600,
                                            fontSize: '0.95rem'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        style={{ 
                                            flex: 1,
                                            padding: '0.8rem',
                                            background: 'linear-gradient(135deg, #2c4a5e 0%, #e61e25 100%)',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: 'white',
                                            cursor: 'pointer',
                                            fontWeight: 600,
                                            fontSize: '0.95rem'
                                        }}
                                    >
                                        Add Project
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Admin Footer */}
                <AdminFooter />
            </main>
            <style jsx global>{`
                .hover-red:hover { color: #e61e25 !important; }
            `}</style>
        </div>
    );
}
