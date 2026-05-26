"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  RefreshCw,
  X,
  Check
} from 'lucide-react';

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  type: 'percentage' | 'free' | 'fixed';
  color: string;
  active: boolean;
  createdAt: string;
}

export default function OffersAdminPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [featuredOfferId, setFeaturedOfferId] = useState<string | null>(null);
  const [settingFeatured, setSettingFeatured] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount: '',
    type: 'percentage' as 'percentage' | 'free' | 'fixed',
    color: '#e61e25',
    active: true
  });

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/offers');
      const data = await response.json();
      if (data.success) {
        setOffers(data.data);
      }

      // Fetch featured offer
      const settingsResponse = await fetch('/api/offers?featured=true');
      const settingsData = await settingsResponse.json();
      if (settingsData.success && settingsData.data) {
        setFeaturedOfferId(settingsData.data.id);
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.discount || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId 
        ? { ...formData, id: editingId }
        : formData;

      const response = await fetch('/api/offers', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.success) {
        setFormData({
          title: '',
          description: '',
          discount: '',
          type: 'percentage',
          color: '#e61e25',
          active: true
        });
        setEditingId(null);
        setShowForm(false);
        fetchOffers();
      } else {
        alert(data.error || 'Error saving offer');
      }
    } catch (error) {
      console.error('Error saving offer:', error);
      alert('Error saving offer');
    }
  };

  const handleEdit = (offer: Offer) => {
    setFormData({
      title: offer.title,
      description: offer.description,
      discount: offer.discount,
      type: offer.type as 'percentage' | 'free' | 'fixed',
      color: offer.color,
      active: offer.active
    });
    setEditingId(offer.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) {
      return;
    }

    try {
      const response = await fetch(`/api/offers?id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setOffers(prev => prev.filter(o => o.id !== id));
        if (featuredOfferId === id) {
          setFeaturedOfferId(null);
        }
      } else {
        alert(data.error || 'Error deleting offer');
      }
    } catch (error) {
      console.error('Error deleting offer:', error);
      alert('Error deleting offer');
    }
  };

  const handleSetFeatured = async (offerId: string) => {
    setSettingFeatured(offerId);
    try {
      const response = await fetch('/api/offers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featuredOfferId: offerId })
      });

      const data = await response.json();

      if (data.success) {
        setFeaturedOfferId(offerId);
      } else {
        alert(data.error || 'Error setting featured offer');
      }
    } catch (error) {
      console.error('Error setting featured offer:', error);
      alert('Error setting featured offer');
    } finally {
      setSettingFeatured(null);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      discount: '',
      type: 'percentage' as 'percentage' | 'free' | 'fixed',
      color: '#e61e25',
      active: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)', 
      color: '#ffffff', 
      fontFamily: "'DM Sans', sans-serif" 
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 900, 
              marginBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              🎁 Manage Offers
            </h1>
            <p style={{ color: '#888', fontSize: '1rem' }}>
              Create and manage scratch card offers for users
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={fetchOffers}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 600,
                transition: 'all 0.3s ease'
              }}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                background: 'rgba(230, 30, 37, 0.1)',
                border: '1px solid rgba(230, 30, 37, 0.2)',
                color: '#ffffff',
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 600,
                transition: 'all 0.3s ease'
              }}
            >
              <Plus size={16} />
              {showForm ? 'Cancel' : 'Add Offer'}
            </button>
          </div>
        </header>

        {/* Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '2rem',
              marginBottom: '2rem'
            }}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
              {editingId ? 'Edit Offer' : 'Create New Offer'}
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#aaa' }}>
                  Offer Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Premium Package"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#aaa' }}>
                  Discount *
                </label>
                <input
                  type="text"
                  value={formData.discount}
                  onChange={(e) => setFormData(prev => ({ ...prev, discount: e.target.value }))}
                  placeholder="e.g., 30% OFF or $200 OFF"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#aaa' }}>
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '0.95rem'
                  }}
                >
                  <option value="percentage">Percentage</option>
                  <option value="free">Free</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#aaa' }}>
                  Color
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    style={{
                      width: '50px',
                      height: '40px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#aaa' }}>
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g., Get exclusive access to premium features"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '0.95rem',
                    minHeight: '100px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    transition: 'all 0.3s ease'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #e61e25 0%, #ff2d35 100%)',
                    border: 'none',
                    color: '#ffffff',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    transition: 'all 0.3s ease'
                  }}
                >
                  {editingId ? 'Update Offer' : 'Create Offer'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Offers List */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
              <RefreshCw className="animate-spin" size={24} style={{ marginRight: '0.5rem' }} />
              <span>Loading offers...</span>
            </div>
          ) : offers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem', color: '#ffffff' }}>
                No offers yet
              </h3>
              <p style={{ color: '#888' }}>Create your first offer to get started</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {offers.map((offer, index) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    padding: '1.5rem',
                    borderBottom: index < offers.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'background 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          backgroundColor: offer.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 900,
                          fontSize: '0.8rem'
                        }}
                      >
                        {offer.discount}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                          {offer.title}
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: '#aaa', margin: '0.25rem 0 0 0' }}>
                          {offer.description}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#888' }}>
                      <span>Type: {offer.type}</span>
                      <span>Status: {offer.active ? '✓ Active' : '✗ Inactive'}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                    {featuredOfferId === offer.id && (
                      <div style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        color: '#10b981',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.9rem',
                        fontWeight: 600
                      }}>
                        <Check size={16} /> Featured
                      </div>
                    )}
                    <button
                      onClick={() => handleSetFeatured(offer.id)}
                      disabled={settingFeatured === offer.id}
                      style={{
                        background: featuredOfferId === offer.id ? 'rgba(16, 185, 129, 0.1)' : 'rgba(168, 85, 247, 0.1)',
                        border: featuredOfferId === offer.id ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(168, 85, 247, 0.3)',
                        color: featuredOfferId === offer.id ? '#10b981' : '#a855f7',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        cursor: settingFeatured === offer.id ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        transition: 'all 0.3s ease',
                        opacity: settingFeatured === offer.id ? 0.6 : 1
                      }}
                    >
                      {settingFeatured === offer.id ? 'Setting...' : (featuredOfferId === offer.id ? 'Featured' : 'Set Featured')}
                    </button>
                    <button
                      onClick={() => handleEdit(offer)}
                      style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        color: '#3b82f6',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <Edit2 size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(offer.id)}
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
                        fontWeight: 600,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
