"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Users,
  Mail,
  Phone,
  Building,
  Calendar,
  Filter,
  Download,
  Eye,
  Search,
  RefreshCw,
  Trash2
} from 'lucide-react';

interface Lead {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  interestedService: string;
  submittedAt: string;
  createdAt: string;
  status: string;
  source: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const services = [
  'All Services',
  'Branding & Corporate Identity',
  'Digital Printed Graphics',
  'Vehicle Graphics & Fleet Branding',
  'Signage Production & Installation',
  'Exhibition, Display & POS',
  'Cladding & Facade Solutions',
  'Complete Advertising Campaign',
  'Other'
];

const statuses = ['all', 'new', 'contacted', 'qualified', 'converted', 'closed'];

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [filters, setFilters] = useState({
    status: 'all',
    service: 'All Services',
    search: ''
  });
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [interestStats, setInterestStats] = useState<{ _id: string; count: number }[]>([]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      });

      if (filters.status !== 'all') {
        params.append('status', filters.status);
      }
      if (filters.service !== 'All Services') {
        params.append('service', filters.service);
      }
      if (filters.search.trim()) {
        params.append('search', filters.search.trim());
      }

      const response = await fetch(`/api/leads?${params}`);
      const data = await response.json();

      if (data.success) {
        setLeads(data.data);
        setPagination(data.pagination);
        if (data.interestStats) setInterestStats(data.interestStats);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    const userStr = localStorage.getItem('adminUser');
    const user = userStr ? JSON.parse(userStr) : null;
    if (auth !== 'true' || user?.email !== 'admin@gmail.com') {
      router.push('/admin/login');
      return;
    }
    fetchLeads();
  }, [pagination.page, filters.status, filters.service]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLeads();
    }, 400);
    return () => clearTimeout(timer);
  }, [filters.search]);

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
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

  const getStatusColor = (status: string) => {
    const colors = {
      new: '#3b82f6',
      contacted: '#f59e0b',
      qualified: '#8b5cf6',
      converted: '#10b981',
      closed: '#6b7280'
    };
    return colors[status as keyof typeof colors] || '#6b7280';
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      const res = await fetch(`/api/leads?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setLeads(prev => prev.filter(l => l._id !== id));
        setPagination(prev => ({ ...prev, total: prev.total - 1 }));
        if (selectedLead?._id === id) setSelectedLead(null);
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const exportLeads = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Company', 'Service', 'Status', 'Date'].join(','),
      ...leads.map(lead => [
        lead.fullName,
        lead.email,
        lead.phone,
        lead.companyName || '',
        lead.interestedService,
        lead.status,
        formatDate(lead.createdAt)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="leads-page">
      <div className="leads-container">
        {/* Header */}
        <div className="leads-header">
          <div className="header-content">
            <h1>
              <Users size={32} />
              Lead Management
            </h1>
            <p>Manage and track your advertising campaign leads</p>
          </div>
          <div className="header-actions">
            <button onClick={fetchLeads} className="refresh-btn">
              <RefreshCw size={16} />
              Refresh
            </button>
            <button onClick={exportLeads} className="export-btn">
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <h3>{pagination.total}</h3>
              <p>Total Leads</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Mail size={24} />
            </div>
            <div className="stat-content">
              <h3>{leads.filter(l => l.status === 'new').length}</h3>
              <p>New Leads</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Phone size={24} />
            </div>
            <div className="stat-content">
              <h3>{leads.filter(l => l.status === 'contacted').length}</h3>
              <p>Contacted</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Building size={24} />
            </div>
            <div className="stat-content">
              <h3>{leads.filter(l => l.status === 'converted').length}</h3>
              <p>Converted</p>
            </div>
          </div>
        </div>

        {/* Interest Breakdown */}
        {interestStats.length > 0 && (
          <div className="interest-breakdown">
            <h3 className="interest-title">Enquiries by Interest</h3>
            <div className="interest-pills">
              <button
                className={`interest-pill ${filters.service === 'All Services' ? 'active' : ''}`}
                onClick={() => setFilters(prev => ({ ...prev, service: 'All Services' }))}
              >
                All <span className="pill-count">{pagination.total}</span>
              </button>
              {interestStats.map(stat => (
                <button
                  key={stat._id}
                  className={`interest-pill ${filters.service === stat._id ? 'active' : ''}`}
                  onClick={() => setFilters(prev => ({ ...prev, service: stat._id || 'All Services' }))}
                >
                  {stat._id || 'Unknown'} <span className="pill-count">{stat.count}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-grid">
            <div className="filter-group">
              <label>Status</label>
              <select 
                value={filters.status} 
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Service</label>
              <select 
                value={filters.service} 
                onChange={(e) => setFilters(prev => ({ ...prev, service: e.target.value }))}
              >
                {services.map(service => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Search</label>
              <div className="search-input">
                <input
                  type="text"
                  placeholder="🔍 Search by name or email..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="leads-table-container">
          {loading ? (
            <div className="loading-state">
              <RefreshCw size={32} className="loading-spinner" />
              <p>Loading leads...</p>
            </div>
          ) : leads.length === 0 ? (
            <div className="empty-state">
              <Users size={48} />
              <h3>No leads found</h3>
              <p>No leads match your current filters</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="leads-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Company</th>
                    <th>Service</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <motion.tr
                      key={lead._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="lead-row"
                    >
                      <td>
                        <div className="lead-name">
                          <strong>{lead.fullName}</strong>
                        </div>
                      </td>
                      <td>
                        <div className="contact-info">
                          <div className="contact-item">
                            <Mail size={14} />
                            <span>{lead.email}</span>
                          </div>
                          <div className="contact-item">
                            <Phone size={14} />
                            <span>{lead.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="company-name">
                          {lead.companyName || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <span className="service-name">
                          {lead.interestedService}
                        </span>
                      </td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(lead.status) }}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td>
                        <div className="date-info">
                          <Calendar size={14} />
                          <span>{formatDate(lead.createdAt)}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="view-btn"
                            onClick={() => setSelectedLead(lead)}
                          >
                            <Eye size={16} />
                            View
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(lead._id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            <div className="pagination-info">
              Page {pagination.page} of {pagination.pages}
            </div>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="modal-overlay" onClick={() => setSelectedLead(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Lead Details</h2>
              <button onClick={() => setSelectedLead(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Full Name</label>
                  <span>{selectedLead.fullName}</span>
                </div>
                <div className="detail-item">
                  <label>Email</label>
                  <span>{selectedLead.email}</span>
                </div>
                <div className="detail-item">
                  <label>Phone</label>
                  <span>{selectedLead.phone}</span>
                </div>
                <div className="detail-item">
                  <label>Company</label>
                  <span>{selectedLead.companyName || 'Not provided'}</span>
                </div>
                <div className="detail-item">
                  <label>Interested Service</label>
                  <span>{selectedLead.interestedService}</span>
                </div>
                <div className="detail-item">
                  <label>Status</label>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(selectedLead.status) }}
                  >
                    {selectedLead.status}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Source</label>
                  <span>{selectedLead.source}</span>
                </div>
                <div className="detail-item">
                  <label>Submitted</label>
                  <span>{formatDate(selectedLead.createdAt)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <style jsx>{`
        .leads-page {
          min-height: 100vh;
          background: #0f0f0f;
          color: white;
          padding: 2rem;
        }

        .leads-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .leads-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-content h1 {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 2.5rem;
          font-weight: 900;
          margin-bottom: 0.5rem;
          color: white;
        }

        .header-content p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1.1rem;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
        }

        .refresh-btn, .export-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .refresh-btn {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .refresh-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .export-btn {
          background: #e61e25;
          color: white;
        }

        .export-btn:hover {
          background: #ff2d35;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-icon {
          background: #e61e25;
          padding: 0.75rem;
          border-radius: 8px;
          color: white;
        }

        .stat-content h3 {
          font-size: 2rem;
          font-weight: 900;
          margin-bottom: 0.25rem;
          color: white;
        }

        .stat-content p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }

        .interest-breakdown {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
          margin-bottom: 1.5rem;
        }

        .interest-title {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 1rem;
        }

        .interest-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
        }

        .interest-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.45rem 1rem;
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 20px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .interest-pill:hover {
          background: rgba(230, 30, 37, 0.15);
          border-color: rgba(230, 30, 37, 0.4);
          color: white;
        }

        .interest-pill.active {
          background: #e61e25;
          border-color: #e61e25;
          color: white;
          font-weight: 700;
        }

        .pill-count {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          padding: 0.1rem 0.45rem;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .interest-pill.active .pill-count {
          background: rgba(255, 255, 255, 0.3);
        }

        .filters-section {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .filter-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
        }

        .filter-group select {
          width: 100%;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: white;
          font-size: 0.9rem;
        }

        .filter-group select option {
          background: white;
          color: black;
          padding: 0.5rem;
        }

        .search-input {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .search-input input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: white;
          font-size: 0.9rem;
          box-sizing: border-box;
          height: 44px;
        }

        .search-input input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .leads-table-container {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 2rem;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .leads-table {
          width: 100%;
          border-collapse: collapse;
        }

        .leads-table th {
          background: rgba(255, 255, 255, 0.1);
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .leads-table td {
          padding: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .lead-row:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .lead-name strong {
          color: white;
          font-weight: 600;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .company-name, .service-name {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          color: white;
          text-transform: capitalize;
        }

        .date-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .view-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #e61e25;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .view-btn:hover {
          background: #ff2d35;
        }

        .delete-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 6px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .delete-btn:hover {
          background: #ef4444;
          color: white;
          border-color: #ef4444;
        }

        .loading-state, .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .loading-spinner {
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .empty-state svg {
          margin-bottom: 1rem;
          color: rgba(255, 255, 255, 0.3);
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
        }

        .pagination-btn {
          padding: 0.75rem 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .pagination-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.2);
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-info {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
        }

        .modal-content {
          background: #1a1a1a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          width: 100%;
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .modal-header h2 {
          color: white;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .modal-header button {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.5rem;
        }

        .modal-body {
          padding: 1.5rem;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .detail-item label {
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }

        .detail-item span {
          color: white;
          font-size: 1rem;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .leads-page {
            padding: 1rem;
          }

          .leads-header {
            flex-direction: column;
            align-items: stretch;
          }

          .header-actions {
            justify-content: stretch;
          }

          .refresh-btn, .export-btn {
            flex: 1;
            justify-content: center;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .filters-grid {
            grid-template-columns: 1fr;
          }

          .leads-table {
            font-size: 0.85rem;
          }

          .leads-table th,
          .leads-table td {
            padding: 0.75rem 0.5rem;
          }

          .modal-content {
            margin: 1rem;
            max-height: calc(100vh - 2rem);
          }

          .detail-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}