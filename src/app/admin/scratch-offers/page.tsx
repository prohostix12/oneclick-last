"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Gift, 
  Users, 
  Calendar, 
  Mail, 
  Phone, 
  Building, 
  Search,
  Download,
  Filter,
  Eye,
  Trash2,
  RefreshCw,
  TrendingUp,
  Clock
} from 'lucide-react';

interface ScratchOffer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  offer: {
    id: string;
    title: string;
    description: string;
    discount: string;
    type: string;
    color: string;
  };
  scratchedAt: string;
  source: string;
  claimed: boolean;
  createdAt: string;
  ipAddress: string;
  status: string;
  userAgent: string;
  expiresAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface Statistics {
  totalOffers: number;
  todayOffers: number;
  offerTypes: string[];
}

export default function ScratchOffersAdminPage() {
  const [offers, setOffers] = useState<ScratchOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [statistics, setStatistics] = useState<Statistics>({
    totalOffers: 0,
    todayOffers: 0,
    offerTypes: []
  });
  const [selectedOffer, setSelectedOffer] = useState<ScratchOffer | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: (pagination?.page || 1).toString(),
        limit: '1000'  // Fetch up to 1000 offers to show all submissions
      });

      const response = await fetch(`/api/scratch-offers?${params}`);
      const data = await response.json();

      if (data.success) {
        setOffers(data.data);
        setPagination(data.pagination);
        setStatistics(data.statistics);
      }
    } catch (error) {
      console.error('Error fetching scratch offers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch offers if pagination is properly initialized
    if (pagination && pagination.page) {
      fetchOffers();
    }
  }, [pagination?.page]);

  // Initial fetch on component mount
  useEffect(() => {
    fetchOffers();
  }, []);

  const handlePageChange = (newPage: number) => {
    if (pagination) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleDeleteOffer = async (offerId: string) => {
    if (!confirm('Are you sure you want to delete this offer? This will remove it from the view.')) {
      return;
    }

    setDeletingId(offerId);
    try {
      // Just remove from local state (Vercel has read-only file system)
      setOffers(prev => prev.filter(offer => offer._id !== offerId));
      setSelectedOffer(null);
      alert('Offer removed from view');
    } catch (error) {
      console.error('Error removing offer:', error);
      alert('Error removing offer');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOfferTypeColor = (type: string) => {
    const colors = {
      percentage: '#3b82f6',
      free: '#10b981',
      fixed: '#f59e0b'
    };
    return colors[type as keyof typeof colors] || '#6b7280';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: '#10b981',
      claimed: '#10b981',
      expired: '#ef4444',
      used: '#8b5cf6'
    };
    return colors[status as keyof typeof colors] || '#6b7280';
  };

  const getOfferStatus = (offer: ScratchOffer) => {
    if (isOfferExpired(offer.expiresAt)) {
      return 'expired';
    }
    return offer.status;
  };

  const getNormalizedOffer = (offer: ScratchOffer['offer'] | string) => {
    if (typeof offer === 'string') {
      return {
        title: offer,
        discount: 'N/A',
        description: 'Legacy Offer',
        type: 'fixed',
        color: '#e61e25'
      };
    }
    return {
      title: offer?.title || 'Untitled Offer',
      discount: offer?.discount || 'N/A',
      description: offer?.description || '',
      type: offer?.type || 'fixed',
      color: offer?.color || '#e61e25'
    };
  };

  const exportOffers = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Company', 'Offer Title', 'Discount', 'Type', 'Status', 'Date', 'Expires'].join(','),
      ...offers.map(offer => [
        offer.name,
        offer.email,
        offer.phone,
        offer.companyName || '',
        offer.offer.title,
        offer.offer.discount,
        offer.offer.type,
        offer.status,
        formatDate(offer.createdAt),
        formatDate(offer.expiresAt)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scratch-offers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const isOfferExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
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
              <Gift className="text-red-500" size={32} />
              Scratch Card Offers
            </h1>
            <p style={{ color: '#888', fontSize: '1rem' }}>
              Manage scratch card campaigns and track user engagement
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
              onClick={exportOffers}
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
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </header>

        {/* Statistics Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem', 
          marginBottom: '2rem' 
        }}>
          <motion.div
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                padding: '0.75rem', 
                background: 'rgba(230, 30, 37, 0.1)', 
                borderRadius: '12px',
                border: '1px solid rgba(230, 30, 37, 0.2)'
              }}>
                <Gift className="text-red-500" size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.25rem', color: '#ffffff' }}>
                  {statistics?.totalOffers || 0}
                </h3>
                <p style={{ color: '#888', fontSize: '0.9rem', margin: 0 }}>Total Claims</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card"
            style={{ 
              padding: '1.5rem',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              borderRadius: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                padding: '0.75rem', 
                background: 'rgba(59, 130, 246, 0.1)', 
                borderRadius: '12px',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}>
                <Calendar className="text-blue-500" size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.25rem', color: '#ffffff' }}>
                  {statistics?.todayOffers || 0}
                </h3>
                <p style={{ color: '#888', fontSize: '0.9rem', margin: 0 }}>Today's Claims</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card"
            style={{ 
              padding: '1.5rem',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              borderRadius: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                padding: '0.75rem', 
                background: 'rgba(16, 185, 129, 0.1)', 
                borderRadius: '12px',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                <TrendingUp className="text-green-500" size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.25rem', color: '#ffffff' }}>
                  {offers.filter(o => o.offer.type === 'percentage').length}
                </h3>
                <p style={{ color: '#888', fontSize: '0.9rem', margin: 0 }}>Discount Offers</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card"
            style={{ 
              padding: '1.5rem',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              borderRadius: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                padding: '0.75rem', 
                background: 'rgba(139, 92, 246, 0.1)', 
                borderRadius: '12px',
                border: '1px solid rgba(139, 92, 246, 0.2)'
              }}>
                <Users className="text-purple-500" size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.25rem', color: '#ffffff' }}>
                  {new Set(offers.map(o => o.email)).size}
                </h3>
                <p style={{ color: '#888', fontSize: '0.9rem', margin: 0 }}>Unique Users</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Offers Table */}
        <div className="glass-card" style={{ 
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          borderRadius: '16px',
          overflow: 'hidden',
          marginBottom: '2rem'
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
              <RefreshCw className="animate-spin" size={24} style={{ marginRight: '0.5rem' }} />
              <span>Loading offers...</span>
            </div>
          ) : offers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <Gift size={48} style={{ margin: '0 auto 1rem auto', color: 'rgba(255,255,255,0.1)' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem', color: '#ffffff' }}>
                No offers found
              </h3>
              <p style={{ color: '#888' }}>No scratch card offers match your current filters</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {offers.map((offer, index) => (
                <motion.div
                  key={offer._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{ 
                    padding: '1.5rem',
                    borderBottom: index < offers.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                    transition: 'background 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        fontSize: '1.2rem', 
                        marginBottom: '0.5rem', 
                        fontFamily: "'DM Sans', sans-serif", 
                        color: '#ffffff', 
                        fontWeight: 700 
                      }}>
                        {offer.name}
                      </h3>
                      {offer.companyName && (
                        <p style={{ 
                          color: '#888', 
                          fontSize: '0.9rem', 
                          marginBottom: '0.75rem',
                          margin: '0 0 0.75rem 0'
                        }}>
                          {offer.companyName}
                        </p>
                      )}
                      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#aaaaaa', fontSize: '0.9rem' }}>
                          <Mail size={16} color="#e61e25" />
                          {offer.email}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#aaaaaa', fontSize: '0.9rem' }}>
                          <Phone size={16} color="#e61e25" />
                          {offer.phone}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#aaaaaa', fontSize: '0.9rem' }}>
                          <Calendar size={16} color="#e61e25" />
                          {formatDate(offer.createdAt)}
                        </div>
                      </div>
                      
                      {/* Offer Details */}
                      <div style={{ 
                        marginTop: '1.25rem',
                        padding: '1.25rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '16px',
                        border: '1px solid rgba(230, 30, 37, 0.2)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px', fontWeight: 700 }}>Title</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                              {(offer.offer as any).title || offer.offer}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px', fontWeight: 700 }}>Discount</div>
                            <div style={{ 
                              background: (offer.offer as any).color || '#e61e25',
                              padding: '4px 12px',
                              borderRadius: '6px',
                              fontSize: '0.9rem',
                              fontWeight: 900,
                              color: 'white',
                              display: 'inline-block',
                              boxShadow: `0 4px 10px ${((offer.offer as any).color || '#e61e25')}40`
                            }}>
                              {(offer.offer as any).discount || 'N/A'}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px', fontWeight: 700 }}>Description</div>
                          <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5' }}>
                            {(offer.offer as any).description || 'No description available'}
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                          <div style={{ display: 'flex', gap: '1.5rem' }}>
                            <div>
                              <div style={{ fontSize: '0.65rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>Type</div>
                              <div style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: 600 }}>{(offer.offer as any).type || 'promotion'}</div>
                            </div>
                            <div>
                              <div style={{ fontSize: '0.65rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>Expiry</div>
                              <div style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: 600 }}>{formatDate(offer.expiresAt)}</div>
                            </div>
                          </div>
                          
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '20px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              textTransform: 'capitalize',
                              backgroundColor: `${getStatusColor(getOfferStatus(offer))}20`,
                              color: getStatusColor(getOfferStatus(offer)),
                              border: `1px solid ${getStatusColor(getStatusColor(getOfferStatus(offer)))}30`
                            }}
                          >
                            {getOfferStatus(offer)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setSelectedOffer(offer)}
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
                        marginLeft: '1rem',
                        flexShrink: 0
                      }}
                    >
                      <Eye size={16} /> View
                    </button>
                    <button
                      onClick={() => handleDeleteOffer(offer._id)}
                      disabled={deletingId === offer._id}
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#ef4444',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        cursor: deletingId === offer._id ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        marginLeft: '0.5rem',
                        flexShrink: 0,
                        opacity: deletingId === offer._id ? 0.6 : 1,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <Trash2 size={16} /> {deletingId === offer._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '1rem',
            padding: '1.5rem',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '16px'
          }}>
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              style={{
                padding: '0.75rem 1.5rem',
                background: pagination.page === 1 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(230, 30, 37, 0.1)',
                border: pagination.page === 1 ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(230, 30, 37, 0.2)',
                color: pagination.page === 1 ? '#666' : '#ffffff',
                borderRadius: '8px',
                cursor: pagination.page === 1 ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                transition: 'all 0.3s ease'
              }}
            >
              Previous
            </button>
            <span style={{
              color: '#888',
              fontSize: '0.9rem',
              fontWeight: 600
            }}>
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              style={{
                padding: '0.75rem 1.5rem',
                background: pagination.page === pagination.pages ? 'rgba(255, 255, 255, 0.05)' : 'rgba(230, 30, 37, 0.1)',
                border: pagination.page === pagination.pages ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(230, 30, 37, 0.2)',
                color: pagination.page === pagination.pages ? '#666' : '#ffffff',
                borderRadius: '8px',
                cursor: pagination.page === pagination.pages ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                transition: 'all 0.3s ease'
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Offer Detail Modal */}
      {selectedOffer && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '1rem'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: '#1a1a1a',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              width: '100%',
              maxWidth: '800px',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
            }}
          >
            {/* Modal Header */}
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h2 style={{
                fontSize: '1.3rem',
                fontWeight: 700,
                color: '#ffffff',
                margin: 0
              }}>
                Offer Details
              </h2>
              <button
                onClick={() => setSelectedOffer(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#888',
                  fontSize: '2rem',
                  cursor: 'pointer',
                  padding: 0,
                  width: '2rem',
                  height: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#888'}
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div style={{
              padding: '1.5rem',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2rem',
              marginBottom: '2rem'
            }}>
              {/* User Information */}
              <div>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  marginBottom: '1rem'
                }}>
                  User Information
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{
                      fontSize: '0.85rem',
                      color: '#888',
                      display: 'block',
                      marginBottom: '0.25rem'
                    }}>
                      Name
                    </label>
                    <div style={{ color: '#ffffff', fontWeight: 500 }}>
                      {selectedOffer.name}
                    </div>
                  </div>
                  <div>
                    <label style={{
                      fontSize: '0.85rem',
                      color: '#888',
                      display: 'block',
                      marginBottom: '0.25rem'
                    }}>
                      Email
                    </label>
                    <div style={{ color: '#ffffff', fontWeight: 500 }}>
                      {selectedOffer.email}
                    </div>
                  </div>
                  <div>
                    <label style={{
                      fontSize: '0.85rem',
                      color: '#888',
                      display: 'block',
                      marginBottom: '0.25rem'
                    }}>
                      Phone
                    </label>
                    <div style={{ color: '#ffffff', fontWeight: 500 }}>
                      {selectedOffer.phone}
                    </div>
                  </div>
                  {selectedOffer.companyName && (
                    <div>
                      <label style={{
                        fontSize: '0.85rem',
                        color: '#888',
                        display: 'block',
                        marginBottom: '0.25rem'
                      }}>
                        Company
                      </label>
                      <div style={{ color: '#ffffff', fontWeight: 500 }}>
                        {selectedOffer.companyName}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Offer Information */}
              <div>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  marginBottom: '1rem'
                }}>
                  Offer Information
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{
                      fontSize: '0.85rem',
                      color: '#888',
                      display: 'block',
                      marginBottom: '0.25rem'
                    }}>
                      Title
                    </label>
                    <div style={{ color: '#ffffff', fontWeight: 500 }}>
                      {selectedOffer.offer.title}
                    </div>
                  </div>
                  <div>
                    <label style={{
                      fontSize: '0.85rem',
                      color: '#888',
                      display: 'block',
                      marginBottom: '0.25rem'
                    }}>
                      Description
                    </label>
                    <div style={{ color: '#ffffff', fontWeight: 500 }}>
                      {selectedOffer.offer.description}
                    </div>
                  </div>
                  <div>
                    <label style={{
                      fontSize: '0.85rem',
                      color: '#888',
                      display: 'block',
                      marginBottom: '0.25rem'
                    }}>
                      Discount
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div
                        style={{
                          width: '1.5rem',
                          height: '1.5rem',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '0.7rem',
                          fontWeight: 900,
                          backgroundColor: selectedOffer.offer.color
                        }}
                      >
                        {selectedOffer.offer.discount}
                      </div>
                      <span style={{ color: '#ffffff', fontWeight: 500 }}>
                        {selectedOffer.offer.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div style={{
              padding: '1.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#ffffff',
                marginBottom: '1rem'
              }}>
                Technical Details
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem'
              }}>
                <div>
                  <label style={{
                    fontSize: '0.85rem',
                    color: '#888',
                    display: 'block',
                    marginBottom: '0.25rem'
                  }}>
                    Claimed Date
                  </label>
                  <div style={{ color: '#ffffff', fontSize: '0.9rem' }}>
                    {formatDate(selectedOffer.createdAt)}
                  </div>
                </div>
                <div>
                  <label style={{
                    fontSize: '0.85rem',
                    color: '#888',
                    display: 'block',
                    marginBottom: '0.25rem'
                  }}>
                    Expires Date
                  </label>
                  <div style={{
                    color: isOfferExpired(selectedOffer.expiresAt) ? '#ef4444' : '#ffffff',
                    fontSize: '0.9rem'
                  }}>
                    {formatDate(selectedOffer.expiresAt)}
                  </div>
                </div>
                <div>
                  <label style={{
                    fontSize: '0.85rem',
                    color: '#888',
                    display: 'block',
                    marginBottom: '0.25rem'
                  }}>
                    IP Address
                  </label>
                  <div style={{ color: '#ffffff', fontSize: '0.9rem' }}>
                    {selectedOffer.ipAddress}
                  </div>
                </div>
                <div>
                  <label style={{
                    fontSize: '0.85rem',
                    color: '#888',
                    display: 'block',
                    marginBottom: '0.25rem'
                  }}>
                    Source
                  </label>
                  <div style={{ color: '#ffffff', fontSize: '0.9rem' }}>
                    {selectedOffer.source}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}