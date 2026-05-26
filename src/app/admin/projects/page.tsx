"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, 
    Search, 
    Edit2, 
    Trash2, 
    ExternalLink, 
    Image as ImageIcon,
    Layout,
    CheckCircle,
    X,
    Loader2,
    ArrowLeft,
    Eye
} from 'lucide-react';
import Link from 'next/link';
import AdminFooter from '../components/AdminFooter';


interface Project {
    id: string;
    title: string;
    description: string;
    category: string;
    image?: string; // Kept for legacy
    images?: string[]; // New field
    clientName?: string;
    status: string;
    createdAt: string;
}

export default function AdminProjectsPage() {
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [isAuthorized, setIsAuthorized] = useState(false);
    
    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentProject, setCurrentProject] = useState<Project | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Branding',
        images: [] as string[],
        clientName: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const categories = ['All', 'Branding', 'Digital', 'Signage', 'Vehicle', 'Events', 'Interior'];

    useEffect(() => {
        const auth = localStorage.getItem('adminAuth');
        const userStr = localStorage.getItem('adminUser');
        const user = userStr ? JSON.parse(userStr) : null;

        if (auth !== 'true' || user?.email !== 'admin@gmail.com') {
            router.push('/admin/login');
            return;
        }
        setIsAuthorized(true);
        fetchProjects();
    }, [router]);

    if (!isAuthorized) {
        return <div style={{ minHeight: '100vh', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="animate-spin" size={48} color="#e61e25" /></div>;
    }

    async function fetchProjects() {
        setIsLoading(true);
        try {
            const res = await fetch('/api/projects');
            const data = await res.json();
            if (data.projects) setProjects(data.projects);
        } catch (error) {
            console.error('Fetch error:', error);
        }
        setIsLoading(false);
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        files.forEach(file => {
            // Check file size (limit 2MB for Base64)
            if (file.size > 2 * 1024 * 1024) {
                alert(`File ${file.name} is too large! Please select images smaller than 2MB.`);
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, base64]
                }));
            };
            reader.readAsDataURL(file);
        });
        
        // Clear input so same file can be selected again
        e.target.value = '';
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleAddProject = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                setSuccessMessage('Project added successfully!');
                setIsAddModalOpen(false);
                setFormData({ title: '', description: '', category: 'Branding', images: [], clientName: '' });
                fetchProjects();
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                alert('Error: ' + (data.error || 'Failed to create project'));
            }
        } catch (error) {
            console.error('Error adding project:', error);
            alert('Something went wrong. Please check your connection and try again.');
        }
        setIsSubmitting(false);
    };

    const handleEditProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentProject) return;
        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/projects/${currentProject.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setSuccessMessage('Project updated successfully!');
                setIsEditModalOpen(false);
                fetchProjects();
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error updating project:', error);
        }
        setIsSubmitting(false);
    };

    const handleDeleteProject = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return;
        try {
            const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setSuccessMessage('Project deleted successfully!');
                fetchProjects();
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    const openEditModal = (project: Project) => {
        setCurrentProject(project);
        setFormData({
            title: project.title,
            description: project.description,
            category: project.category,
            images: project.images || (project.image ? [project.image] : []),
            clientName: project.clientName || ''
        });
        setIsEditModalOpen(true);
    };

    const allProjects = projects || [];

    const filteredProjects = allProjects.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             p.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || p.category.toLowerCase().includes(filterCategory.toLowerCase());
        return matchesSearch && matchesCategory;
    });

    const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
    };

    return (
        <div style={{ padding: '0', background: '#f8fafc', minHeight: '100vh', color: '#1c1c1c', paddingBottom: '100px' }}>
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
                
                .hover-red:hover { color: #e61e25 !important; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-spin { animation: spin 1s linear infinite; }

                .projects-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    gap: 2rem;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .project-card {
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

                .project-card::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(230, 30, 37, 0.15), transparent 80%);
                    opacity: 0;
                    transition: opacity 0.4s ease;
                    pointer-events: none;
                    z-index: 1;
                }

                .project-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 20px 40px rgba(230, 30, 37, 0.15);
                    border-color: rgba(230, 30, 37, 0.3);
                }

                .project-card:hover::before {
                    opacity: 1;
                }

                .project-card img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .project-card:hover img {
                    transform: scale(1.1);
                    filter: brightness(0.7);
                }

                .project-overlay {
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

                .project-card:hover .project-overlay {
                    background: linear-gradient(to top, rgba(12, 12, 12,0.98) 0%, rgba(12, 12, 12,0.3) 100%);
                }

                .project-title {
                    font-size: 1.7rem;
                    font-weight: 800;
                    margin-bottom: 0.6rem;
                    color: white;
                    text-shadow: 0 2px 10px rgba(12, 12, 12,0.5);
                }

                .project-category-badge {
                    display: inline-block;
                    background: rgba(230, 30, 37, 0.9);
                    color: white;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    margin-bottom: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    width: fit-content;
                }

                .project-desc {
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 0.9rem;
                    line-height: 1.6;
                    margin-bottom: 1.5rem;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .admin-actions {
                    display: flex;
                    gap: 0.75rem;
                    opacity: 1;
                    transform: translateY(0);
                    transition: all 0.4s ease;
                }

                .action-btn {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 0.6rem;
                    border-radius: 10px;
                    font-size: 0.85rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: none;
                }

                .action-btn.edit {
                    background: white;
                    color: #1c1c1c;
                }

                .action-btn.edit:hover {
                    background: #f0f0f0;
                }

                .action-btn.delete {
                    background: rgba(230, 30, 37, 0.15);
                    color: #ff4d4d;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(230, 30, 37, 0.3);
                }

                .action-btn.delete:hover {
                    background: #e61e25;
                    color: white;
                }

                .image-preview-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
                    gap: 10px;
                    margin-top: 1rem;
                }

                .preview-item {
                    position: relative;
                    height: 80px;
                    border-radius: 8px;
                    overflow: hidden;
                    border: 1px solid #eee;
                }

                .preview-item img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .remove-img-btn {
                    position: absolute;
                    top: 2px;
                    right: 2px;
                    background: rgba(230, 30, 37, 0.8);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: 12px;
                    transition: all 0.2s;
                }

                .remove-img-btn:hover {
                    background: #e61e25;
                    transform: scale(1.1);
                }

                /* Hide scrollbars for the whole dashboard content and containers */
                :global(.main-content)::-webkit-scrollbar,
                .projects-grid::-webkit-scrollbar {
                    display: none !important;
                }
                :global(.main-content),
                .projects-grid {
                    scrollbar-width: none !important;
                    -ms-overflow-style: none !important;
                }
            `}</style>

            <div style={{ padding: '2rem 3rem' }}>
                <AnimatePresence>
                    {successMessage && (
                        <motion.div 
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            style={{
                                position: 'fixed', top: '2rem', right: '2rem',
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                                color: 'white', padding: '1rem 2rem',
                                borderRadius: '12px', display: 'flex', alignItems: 'center',
                                gap: '0.5rem', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
                                zIndex: 1000, fontWeight: 600
                            }}
                        >
                            <CheckCircle size={20} />
                            {successMessage}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', gap: '1.5rem' }}>
                    <div>
                        <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#666', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1.5rem', transition: 'all 0.3s' }} className="hover-red">
                            <ArrowLeft size={18} /> Back to Dashboard
                        </Link>
                        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1c1c1c', marginBottom: '0.2rem', fontFamily: "'Outfit', sans-serif" }}>
                            Projects <span style={{ color: '#e61e25' }}>Management</span>
                        </h1>
                        <p style={{ color: '#666', fontSize: '0.95rem' }}>Showcase your best work to the world</p>
                    </div>
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            setFormData({ title: '', description: '', category: 'Branding', images: [], clientName: '' });
                            setIsAddModalOpen(true);
                        }} 
                        style={{ 
                            background: 'linear-gradient(135deg, #2c4a5e 0%, #e61e25 100%)', 
                            color: 'white', 
                            border: 'none', 
                            padding: '0.8rem 1.8rem', 
                            borderRadius: '12px', 
                            fontWeight: 700, 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.6rem', 
                            cursor: 'pointer', 
                            boxShadow: '0 4px 15px rgba(230, 30, 37, 0.3)',
                            fontSize: '0.95rem'
                        }}
                    >
                        <Plus size={20} /> Add Project
                    </motion.button>
                </div>

                <div style={{ background: 'white', padding: '1.2rem', borderRadius: '16px', marginBottom: '3rem', display: 'flex', gap: '1rem', alignItems: 'center', border: '1px solid #f0f0f0', boxShadow: '0 4px 15px rgba(12, 12, 12,0.02)' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }} size={18} />
                        <input type="text" placeholder="Search projects by title or category..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '0.9rem 1rem 0.9rem 3rem', border: '1px solid #eee', borderRadius: '12px', color: '#000', background: '#fcfcfc', fontSize: '0.95rem' }} />
                    </div>
                </div>

            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
                    <Loader2 className="animate-spin" size={40} color="#e61e25" />
                </div>
            ) : (
                <div className="projects-grid">
                    {filteredProjects.map((project, idx) => {
                        const projectImage = project.images?.[0] || project.image;
                        return (
                            <motion.div 
                                layout
                                key={project.id} 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: idx * 0.05 }}
                                className="project-card"
                                onMouseMove={handleCardMouseMove}
                            >
                                {projectImage ? (
                                    <img 
                                        src={projectImage} 
                                        alt={project.title} 
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/projects-hero-bg.png';
                                        }}
                                    />
                                ) : (
                                    <div style={{ height: '100%', background: '#1c1c1c', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#666', gap: '1rem' }}>
                                        <ImageIcon size={48} />
                                        <span>No image available</span>
                                    </div>
                                )}

                                <div className="project-overlay">
                                    <span className="project-category-badge">{project.category}</span>
                                    <h2 className="project-title">{project.title}</h2>
                                    <p className="project-desc">{project.description}</p>
                                    
                                    <div className="admin-actions">
                                        <button onClick={(e) => { e.stopPropagation(); openEditModal(project); }} className="action-btn edit">
                                            <Edit2 size={16} /> Edit
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.id); }} className="action-btn delete">
                                            <Trash2 size={16} /> Delete
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                    
                    {filteredProjects.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem', background: 'white', borderRadius: '24px', border: '2px dashed #eee' }}>
                            <div style={{ color: '#999', marginBottom: '1rem' }}><Search size={48} style={{ margin: '0 auto' }} /></div>
                            <h3 style={{ fontSize: '1.4rem', color: '#1c1c1c', marginBottom: '0.5rem' }}>No projects found</h3>
                            <p style={{ color: '#666' }}>Try adjusting your search terms or add a new project.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {(isAddModalOpen || isEditModalOpen) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, background: 'rgba(12, 12, 12,0.65)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1rem', backdropFilter: 'blur(8px)'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            style={{
                                background: 'white', borderRadius: '24px', width: '100%',
                                maxWidth: '500px', padding: '2.5rem', boxShadow: '0 25px 50px -12px rgba(12, 12, 12,0.25)',
                                position: 'relative', maxHeight: '90vh', overflowY: 'auto'
                            }}
                        >
                            <button 
                                onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                                style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', border: 'none', background: '#f5f5f5', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: '#666' }}
                            >
                                <X size={20} />
                            </button>

                            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1c1c1c', marginBottom: '1.5rem', fontFamily: "'Outfit', sans-serif" }}>
                                {isEditModalOpen ? 'Edit Project' : 'Add New Project'}
                            </h2>

                            <form onSubmit={isEditModalOpen ? handleEditProject : handleAddProject}>
                                <div style={{ marginBottom: '1.2rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#333' }}>Project Title</label>
                                    <input 
                                        type="text" required
                                        value={formData.title}
                                        onChange={e => setFormData({...formData, title: e.target.value})}
                                        style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid #ddd', color: '#000', background: '#ffffff', fontSize: '0.95rem' }}
                                        placeholder="Enter project title"
                                    />
                                </div>

                                <div style={{ marginBottom: '1.2rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#333' }}>Category</label>
                                    <select 
                                        value={formData.category}
                                        onChange={e => setFormData({...formData, category: e.target.value})}
                                        style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid #ddd', background: '#ffffff', color: '#000', fontSize: '0.95rem' }}
                                    >
                                        {categories.filter(c => c !== 'All').map(c => (
                                            <option key={c} value={c} style={{ color: '#000' }}>{c}</option>
                                        ))}
                                    </select>
                                </div>

                                <div style={{ marginBottom: '1.2rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#333' }}>Client Name (Optional)</label>
                                    <input 
                                        type="text"
                                        value={formData.clientName}
                                        onChange={e => setFormData({...formData, clientName: e.target.value})}
                                        style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid #ddd', color: '#000', background: '#ffffff', fontSize: '0.95rem' }}
                                        placeholder="Enter client name"
                                    />
                                </div>

                                <div style={{ marginBottom: '1.2rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#333' }}>
                                        Project Images (Select 2 or more)
                                    </label>
                                    <input 
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleFileChange}
                                        style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid #ddd', color: '#000', background: '#ffffff', fontSize: '0.9rem' }}
                                    />
                                    
                                    {formData.images.length > 0 && (
                                        <div className="image-preview-grid">
                                            {formData.images.map((img, idx) => (
                                                <div key={idx} className="preview-item">
                                                    <img src={img} alt={`Preview ${idx + 1}`} />
                                                    <button 
                                                        type="button" 
                                                        onClick={() => removeImage(idx)}
                                                        className="remove-img-btn"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div style={{ marginBottom: '2rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#333' }}>Description</label>
                                    <textarea 
                                        required
                                        value={formData.description}
                                        onChange={e => setFormData({...formData, description: e.target.value})}
                                        style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid #ddd', height: '100px', resize: 'none', color: '#000', background: '#ffffff', fontSize: '0.95rem' }}
                                        placeholder="Tell us about the project..."
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                    <button 
                                        type="button"
                                        onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                                        style={{
                                            flex: 1, padding: '1rem', background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0',
                                            borderRadius: '12px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                                        onMouseOut={(e) => e.currentTarget.style.background = '#f8fafc'}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        disabled={isSubmitting}
                                        style={{
                                            flex: 2, padding: '1rem', background: '#e61e25', color: '#ffffff', border: 'none',
                                            borderRadius: '12px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(230, 30, 37, 0.3)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : (isEditModalOpen ? 'Update Project' : 'Create Project')}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            </div>
            <AdminFooter />
        </div>
    );
}
