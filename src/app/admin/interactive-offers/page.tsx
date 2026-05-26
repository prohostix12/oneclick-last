"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gift,
  Users,
  Settings,
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Calendar,
  Layers,
  Phone,
  Mail,
  Building2,
  RefreshCw,
  Download,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
const AdminStyles = () => (
  <style jsx global>{`
    .admin-page-container {
      color: #fff;
      font-family: 'Inter', sans-serif;
    }
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .items-center { align-items: center; }
    .items-end { align-items: flex-end; }
    .items-start { align-items: flex-start; }
    .justify-between { justify-content: space-between; }
    .justify-center { justify-content: center; }
    .gap-1 { gap: 0.25rem; }
    .gap-1-5 { gap: 0.375rem; }
    .gap-2 { gap: 0.5rem; }
    .gap-2-5 { gap: 0.625rem; }
    .gap-3 { gap: 0.75rem; }
    .gap-4 { gap: 1rem; }
    .gap-5 { gap: 1.25rem; }
    .space-y-2 > * + * { margin-top: 0.5rem; }
    .space-y-3 > * + * { margin-top: 0.75rem; }
    .space-y-5 > * + * { margin-top: 1.25rem; }
    .space-y-6 > * + * { margin-top: 1.5rem; }
    .space-y-8 > * + * { margin-top: 2rem; }
    .w-full { width: 100%; }
    .max-w-lg { max-width: 32rem; }
    .max-w-xl { max-width: 36rem; }
    .grid { display: grid; }
    .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
    .rounded-xl { border-radius: 4px; }
    .rounded-2xl { border-radius: 4px; }
    .rounded-3xl { border-radius: 4px; }
    .rounded-full { border-radius: 4px; }
    .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
    .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
    .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
    .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
    .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
    .text-xs { font-size: 0.75rem; line-height: 1rem; }
    .font-black { font-weight: 900; }
    .font-bold { font-weight: 700; }
    .font-medium { font-weight: 500; }
    .uppercase { text-transform: uppercase; }
    .tracking-widest { letter-spacing: 0.1em; }
    .p-2-5 { padding: 0.625rem; }
    .p-4 { padding: 1rem; }
    .p-5 { padding: 1.25rem; }
    .p-6 { padding: 1.5rem; }
    .p-7 { padding: 1.75rem; }
    .px-2-5 { padding-left: 0.625rem; padding-right: 0.625rem; }
    .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
    .px-4 { padding-left: 1rem; padding-right: 1rem; }
    .px-5 { padding-left: 1.25rem; padding-right: 1.25rem; }
    .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
    .px-7 { padding-left: 1.75rem; padding-right: 1.75rem; }
    .py-0-5 { padding-top: 0.125rem; padding-bottom: 0.125rem; }
    .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
    .py-2-5 { padding-top: 0.625rem; padding-bottom: 0.625rem; }
    .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
    .py-3-5 { padding-top: 0.875rem; padding-bottom: 0.875rem; }
    .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
    .w-8 { width: 2rem; }
    .h-8 { height: 2rem; }
    .w-9 { width: 2.25rem; }
    .h-9 { height: 2.25rem; }
    .w-10 { width: 2.5rem; }
    .h-10 { height: 2.5rem; }
    .w-32 { width: 8rem; }
    .h-32 { height: 8rem; }
    .h-48 { height: 12rem; }
    .h-16 { height: 4rem; }
    .text-2xl { font-size: 1.5rem; line-height: 2rem; }
    .bg-white-5 { background: rgba(255,255,255,0.05); }
    .bg-white-10 { background: rgba(255,255,255,0.1); }
    .bg-red-500-10 { background: rgba(239,68,68,0.1); }
    .bg-red-500-20 { background: rgba(239,68,68,0.2); }
    .bg-e61e25-10 { background: rgba(230,30,37,0.1); }
    .text-white-50 { color: rgba(255,255,255,0.5); }
    .text-white-40 { color: rgba(255,255,255,0.4); }
    .text-white-30 { color: rgba(255,255,255,0.3); }
    .text-white-20 { color: rgba(255,255,255,0.2); }
    .border-white-5 { border: 1px solid rgba(255,255,255,0.05); }
    .border-white-10 { border: 1px solid rgba(255,255,255,0.1); }
    .flex-wrap { flex-wrap: wrap; }
    .shrink-0 { flex-shrink: 0; }
    .mb-1 { margin-bottom: 0.25rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-3 { margin-bottom: 0.75rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mb-6 { margin-bottom: 1.5rem; }
    .ml-3 { margin-left: 0.75rem; }
    .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
    .animate-spin { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
    .relative { position: relative; }
    .absolute { position: absolute; }
    .fixed { position: fixed; }
    .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
    .z-10 { z-index: 10; }
    .z-50 { z-index: 50; }
    .blur-2xl { filter: blur(40px); }
    .opacity-20 { opacity: 0.2; }
    .opacity-40 { opacity: 0.4; }
    .group:hover .group-hover-opacity-40 { opacity: 0.4; }
    .disabled-opacity-40:disabled { opacity: 0.4; }
    .disabled-cursor-not-allowed:disabled { cursor: not-allowed; }
    .hover-text-white:hover { color: #fff; }
    .hover-border-white-20:hover { border-color: rgba(255,255,255,0.2); }
    .hover-bg-white-90:hover { background: rgba(255,255,255,0.9); }
    .hover-bg-red-700:hover { background: #b91c1c; }
    .group:hover .group-hover-opacity-100 { opacity: 1; }
    .overflow-hidden { overflow: hidden; }
    .cursor-pointer { cursor: pointer; }
    .outline-none { outline: 2px solid transparent; outline-offset: 2px; }
    .transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
    .transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
    .transition-opacity { transition-property: opacity; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
    
    @media (min-width: 640px) {
      .sm-grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    }
    @media (min-width: 768px) {
      .md-flex-row { flex-direction: row; }
      .md-items-end { align-items: flex-end; }
      .md-grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .md-grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    }
    @media (min-width: 1024px) {
      .lg-grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    }
  `}</style>
);

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  color: string;
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  businessName: string;
  offerWon: string;
  date: string;
  status: string;
}

interface OfferSettings {
  enabled: boolean;
  limit: number;
  expiryDate: string;
}

// ─── Modal ────────────────────────────────────────────────────────────────────
interface OfferModalProps {
  offer: Partial<Offer> | null;
  onSave: (offer: Offer) => void;
  onClose: () => void;
}

const PRESET_COLORS = ['#e61e25', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

const OfferModal: React.FC<OfferModalProps> = ({ offer, onSave, onClose }) => {
  const [form, setForm] = useState<Partial<Offer>>({
    title: '',
    description: '',
    discount: '',
    color: '#e61e25'
  });

  useEffect(() => {
    if (offer && Object.keys(offer).length > 0) {
      setForm(offer);
    } else {
      setForm({ title: '', description: '', discount: '', color: '#e61e25' });
    }
  }, [offer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.discount) return;
    onSave({
      id: form.id || Date.now().toString(),
      title: form.title!,
      description: form.description || '',
      discount: form.discount!,
      color: form.color || '#e61e25',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div className="flex items-center justify-between px-7 py-5 border-b border-white-5">
          <h3 className="text-xl font-black text-white">
            {offer?.id ? 'Edit Offer' : 'Create New Offer'}
          </h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white-5 hover:bg-white-10 text-white-50 hover:text-white transition-all">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-7 space-y-5">
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-white-30 mb-2 block">Offer Title *</label>
            <input
              required
              type="text"
              placeholder="e.g. Free Branding Package"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px' }}
            />
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-white-30 mb-2 block">Discount Label *</label>
            <input
              required
              type="text"
              placeholder="e.g. FREE or 20% OFF"
              value={form.discount}
              onChange={(e) => setForm({ ...form, discount: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all font-black"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: form.color, borderRadius: '4px' }}
            />
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-white-30 mb-2 block">Description</label>
            <input
              type="text"
              placeholder="Short description of the offer"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px' }}
            />
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-white-30 mb-2 block">Accent Color</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm({ ...form, color: c })}
                  style={{
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '50%',
                    background: c,
                    border: form.color === c ? '3px solid #fff' : '3px solid transparent',
                    cursor: 'pointer',
                    boxShadow: form.color === c ? `0 0 0 2px ${c}` : 'none',
                    transition: 'all 0.15s',
                    padding: 0,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-5 font-bold text-black transition-all cursor-pointer"
              style={{ background: 'white', border: 'none', borderRadius: '4px', fontSize: '1rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-5 font-black text-white text-lg transition-all cursor-pointer"
              style={{ background: '#e61e25', border: 'none', boxShadow: '0 0 30px rgba(230,30,37,0.4)', borderRadius: '4px' }}
            >
              {offer?.id ? 'Update Now' : 'Add Now'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
type Tab = 'management' | 'leads' | 'settings';

const TAB_CONFIG: { id: Tab; label: string; icon: typeof Gift }[] = [
  { id: 'management', label: 'Offer Management', icon: Layers },
  { id: 'leads',      label: 'User Leads',        icon: Users },
  { id: 'settings',   label: 'Settings',           icon: Settings },
];

export default function InteractiveOffersAdmin() {
  const [tab, setTab] = useState<Tab>('management');
  const [offers, setOffers] = useState<Offer[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [cfg, setCfg] = useState<OfferSettings>({ enabled: true, limit: 100, expiryDate: '2026-12-31' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [modalOffer, setModalOffer] = useState<Partial<Offer> | null>(null);
  const [expandedLead, setExpandedLead] = useState<string | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [settingsRes, leadsRes] = await Promise.all([
        fetch('/api/offer-settings'),
        fetch('/api/offer-leads'),
      ]);
      const settingsData = await settingsRes.json();
      const leadsData = await leadsRes.json();

      if (settingsData.success) {
        setOffers(settingsData.offers || []);
        setCfg({ enabled: settingsData.enabled, limit: settingsData.limit, expiryDate: settingsData.expiryDate });
      }
      if (leadsData.success) setLeads(leadsData.data || []);
    } catch {
      showToast('error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Toast ─────────────────────────────────────────────────────────────────
  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Save settings ──────────────────────────────────────────────────────────
  const persistSettings = async (newOffers = offers, newCfg = cfg) => {
    setSaving(true);
    try {
      const res = await fetch('/api/offer-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newCfg, offers: newOffers }),
      });
      if (res.ok) showToast('success', 'Settings saved successfully!');
      else showToast('error', 'Failed to save settings');
    } catch {
      showToast('error', 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  // ── Offer CRUD ─────────────────────────────────────────────────────────────
  const handleSaveOffer = (offer: Offer) => {
    const updated = offer.id && offers.find((o) => o.id === offer.id)
      ? offers.map((o) => (o.id === offer.id ? offer : o))
      : [...offers, offer];
    setOffers(updated);
    persistSettings(updated);
    setModalOffer(null);
    showToast('success', offer.id && offers.find((o) => o.id === offer.id) ? 'Offer updated!' : 'Offer added!');
  };

  const handleDeleteOffer = (id: string) => {
    const updated = offers.filter((o) => o.id !== id);
    setOffers(updated);
    persistSettings(updated);
    showToast('success', 'Offer deleted');
  };

  // ── Lead actions ───────────────────────────────────────────────────────────
  const handleDeleteLead = async (id: string) => {
    try {
      await fetch(`/api/offer-leads?id=${id}`, { method: 'DELETE' });
      setLeads((l) => l.filter((x) => x.id !== id));
      showToast('success', 'Lead removed');
    } catch {
      showToast('error', 'Failed to delete lead');
    }
  };

  const exportCSV = () => {
    const rows = [
      ['Date', 'Name', 'Email', 'Phone', 'Business', 'Offer Won'],
      ...leads.map((l) => [
        new Date(l.date).toLocaleDateString(),
        l.name, l.email, l.phone, l.businessName, l.offerWon,
      ]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `offer-leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8 admin-page-container">
      <AdminStyles />
      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-6 left-1/2 z-[999] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold"
            style={{
              background: toast.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(230,30,37,0.15)',
              border: `1px solid ${toast.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(230,30,37,0.3)'}`,
              color: toast.type === 'success' ? '#10b981' : '#e61e25',
              backdropFilter: 'blur(20px)',
            }}
          >
            {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <div className="flex flex-col md-flex-row md-items-end justify-between gap-5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2-5 rounded-xl" style={{ background: 'rgba(230,30,37,0.1)' }}>
              <Gift className="text-[#e61e25]" size={28} />
            </div>
            <h1 className="text-4xl font-black text-white">Limited Offer</h1>
          </div>
          <p className="text-gray-500 text-sm">
            Manage interactive promotional offers, track leads, and configure settings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
          >
            <RefreshCw size={16} color="#ffffff" className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm-grid-cols-4 gap-4">
        {[
          { label: 'Active Offers', value: offers.length, color: '#e61e25' },
          { label: 'Total Leads',   value: leads.length,  color: '#3b82f6' },
          { label: 'This Week',     value: leads.filter((l) => {
              const d = new Date(l.date);
              const now = new Date();
              const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
              return diff <= 7;
            }).length,                                    color: '#10b981' },
          { label: 'Offer Limit',   value: cfg.limit,     color: '#f59e0b' },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="p-5 rounded-2xl"
            style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="text-3xl font-black mb-1" style={{ color }}>{value}</div>
            <div className="text-xs font-bold uppercase tracking-widest text-white/30">{label}</div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 p-1 rounded-2xl w-fit" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        {TAB_CONFIG.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="relative flex items-center gap-2-5 px-6 py-3 rounded-xl text-sm font-bold transition-all"
            style={{ color: tab === id ? '#fff' : '#888' }}
          >
            {tab === id && (
              <motion.div
                layoutId="tab-bg"
                className="absolute inset-0 rounded-xl"
                style={{ background: '#e61e25', boxShadow: '0 0 20px rgba(230,30,37,0.3)' }}
              />
            )}
            <Icon size={17} className="relative z-10" />
            <span className="relative z-10">{label}</span>
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* ═══════════════════ OFFER MANAGEMENT ═══════════════════ */}
          {tab === 'management' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-white">
                  Active Offers
                  <span className="ml-3 px-2-5 py-0-5 rounded-full text-xs font-bold text-[#e61e25] bg-e61e25-10" style={{ border: '1px solid rgba(230,30,37,0.2)' }}>
                    {offers.length} / 10
                  </span>
                </h2>
                <button
                  onClick={() => setModalOffer({})}
                  disabled={offers.length >= 10}
                  className="flex items-center gap-2 px-5 py-2-5 rounded-xl font-bold text-sm transition-all disabled-opacity-40 disabled-cursor-not-allowed cursor-pointer"
                  style={{ background: 'white', color: '#e61e25', border: 'none', borderRadius: '4px', boxShadow: '0 0 15px rgba(255,255,255,0.1)' }}
                >
                  <Plus size={18} color="#e61e25" strokeWidth={3} /> Add Offer
                </button>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-3 gap-5">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-48 rounded-2xl animate-pulse" style={{ background: '#111' }} />
                  ))}
                </div>
              ) : offers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <Gift size={48} className="text-white/10 mb-4" />
                  <p className="text-white/30 italic">No offers yet. Add your first one!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-3 gap-5">
                  {offers.map((offer) => (
                    <motion.div
                      key={offer.id}
                      layout
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="group relative p-6 rounded-2xl overflow-hidden"
                      style={{
                        background: '#111',
                        border: `1px solid rgba(255,255,255,0.06)`,
                        transition: 'border-color 0.3s',
                      }}
                    >
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider"
                            style={{ background: `${offer.color}30`, color: offer.color, border: `1px solid ${offer.color}50` }}
                          >
                            {offer.discount}
                          </div>
                          <div className="flex gap-1-5 transition-opacity">
                            <button
                              onClick={() => setModalOffer(offer)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-black hover-bg-white-90 transition-all cursor-pointer"
                              style={{ border: 'none' }}
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteOffer(offer.id)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white transition-all cursor-pointer"
                              style={{ border: 'none', borderRadius: '4px' }}
                            >
                              <Trash2 size={16} color="#e61e25" />
                            </button>
                          </div>
                        </div>

                        <h3 className="text-lg font-black text-white mb-1">{offer.title}</h3>
                        <p className="text-sm text-white-40 leading-relaxed">{offer.description || '—'}</p>

                        <div className="mt-4 flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ background: offer.color }} />
                          <span className="text-xs text-white-20 font-mono uppercase">{offer.color}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {offers.length >= 10 && (
                <p className="text-yellow-500 text-xs flex items-center gap-2 font-bold" style={{ color: '#f59e0b' }}>
                  <AlertCircle size={14} /> Maximum 10 offers. Delete one to add more.
                </p>
              )}
            </div>
          )}

          {/* ═══════════════════ USER LEADS ═══════════════════ */}
          {tab === 'leads' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-white">
                  Winner Leads
                  <span className="ml-3 px-2-5 py-0-5 rounded-full text-xs font-bold text-[#3b82f6] bg-[#3b82f6]/10" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
                    {leads.length} total
                  </span>
                </h2>
                {leads.length > 0 && (
                  <button
                    onClick={exportCSV}
                    className="flex items-center gap-2 px-4 py-2-5 rounded-xl text-sm font-bold transition-all cursor-pointer"
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px' }}
                  >
                    <Download size={16} color="#ffffff" /> Export CSV
                  </button>
                )}
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: '#111' }} />
                  ))}
                </div>
              ) : leads.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24">
                  <Users size={48} className="text-white/10 mb-4" />
                  <p className="text-white/30 italic">No leads captured yet.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {[...leads].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((lead) => (
                    <motion.div
                      key={lead.id}
                      layout
                      className="rounded-2xl overflow-hidden"
                      style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      {/* Row */}
                      <div
                        className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-white-5 transition-colors"
                        onClick={() => setExpandedLead(expandedLead === lead.id ? null : lead.id)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-e61e25-10 border border-[#e61e25]/20 flex items-center justify-center text-[#e61e25] font-black text-sm">
                            {lead.name[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-white">{lead.name}</div>
                            <div className="text-xs text-white-30">{new Date(lead.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span
                            className="px-3 py-1 rounded-full text-xs font-black"
                            style={{
                              background: 'rgba(16,185,129,0.1)',
                              color: '#10b981',
                              border: '1px solid rgba(16,185,129,0.2)',
                            }}
                          >
                            {lead.offerWon}
                          </span>
                          <button
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white transition-all cursor-pointer ml-4"
                            style={{ border: 'none', borderRadius: '4px' }}
                            onClick={(e) => { e.stopPropagation(); handleDeleteLead(lead.id); }}
                          >
                            <Trash2 size={16} color="#e61e25" />
                          </button>
                          {expandedLead === lead.id ? <ChevronUp size={16} className="text-white-30" /> : <ChevronDown size={16} className="text-white-30" />}
                        </div>
                      </div>

                      {/* Expanded details */}
                      <AnimatePresence>
                        {expandedLead === lead.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div
                              className="grid grid-cols-2 md-grid-cols-4 gap-4 px-6 py-5 border-t"
                              style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                            >
                              {[
                                { icon: Mail,      label: 'Email',    value: lead.email },
                                { icon: Phone,     label: 'Phone',    value: lead.phone },
                                { icon: Building2, label: 'Business', value: lead.businessName || '—' },
                                { icon: Calendar,  label: 'Date',     value: new Date(lead.date).toLocaleString() },
                              ].map(({ icon: Icon, label, value }) => (
                                <div key={label}>
                                  <div className="flex items-center gap-1-5 text-white-30 text-[10px] font-black uppercase tracking-widest mb-1">
                                    <Icon size={11} /> {label}
                                  </div>
                                  <div className="text-white-80 text-sm font-medium break-all">{value}</div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════ SETTINGS ═══════════════════ */}
          {tab === 'settings' && (
            <div className="max-w-xl space-y-5">
              <h2 className="text-xl font-black text-white mb-6">Offer Section Settings</h2>

              {/* Enable toggle */}
              <div
                className="flex items-center justify-between p-6 rounded-2xl"
                style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div>
                  <div className="font-bold text-white mb-0.5">Section Visibility</div>
                  <div className="text-sm text-white/30">Show or hide the offer reveal section on homepage</div>
                </div>
                <button
                  onClick={() => setCfg((c) => ({ ...c, enabled: !c.enabled }))}
                  className="transition-all"
                >
                  {cfg.enabled
                    ? <ToggleRight size={40} className="text-[#e61e25]" />
                    : <ToggleLeft size={40} className="text-white/20" />
                  }
                </button>
              </div>

              {/* Limit */}
              <div
                className="p-6 rounded-2xl"
                style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <label className="block font-bold text-white mb-1">Offer Claim Limit</label>
                <p className="text-sm text-white/30 mb-4">Total number of times offers can be claimed</p>
                <input
                  type="number"
                  min={1}
                  max={10000}
                  value={cfg.limit}
                  onChange={(e) => setCfg((c) => ({ ...c, limit: +e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none font-bold"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              {/* Expiry */}
              <div
                className="p-6 rounded-2xl"
                style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <label className="block font-bold text-white mb-1">Expiry Date</label>
                <p className="text-sm text-white/30 mb-4">Campaign will automatically deactivate after this date</p>
                <input
                  type="date"
                  value={cfg.expiryDate}
                  onChange={(e) => setCfg((c) => ({ ...c, expiryDate: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', colorScheme: 'dark' }}
                />
              </div>

              {/* Save */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => persistSettings()}
                disabled={saving}
                className="w-full py-4 rounded-xl font-black text-white text-base uppercase tracking-widest flex items-center justify-center gap-3 transition-all"
                style={{ background: '#e61e25', boxShadow: '0 0 30px rgba(230,30,37,0.3)', opacity: saving ? 0.7 : 1 }}
              >
                {saving
                  ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><Save size={20} /> Save Settings</>
                }
              </motion.button>

              {/* Info box */}
              <div
                className="flex items-start gap-3 p-5 rounded-2xl"
                style={{ background: 'rgba(230,30,37,0.06)', border: '1px solid rgba(230,30,37,0.15)' }}
              >
                <Sparkles size={18} className="text-[#e61e25] shrink-0 mt-0.5" />
                <div>
                  <div className="text-white text-sm font-bold mb-1">Best Practices</div>
                  <p className="text-white/40 text-xs leading-relaxed">
                    For the best shuffle animation experience, maintain 5 different offers with varying colors. The section auto-hides when disabled or expired.
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Offer Modal ── */}
      <AnimatePresence>
        {modalOffer !== null && (
          <OfferModal
            offer={modalOffer}
            onSave={handleSaveOffer}
            onClose={() => setModalOffer(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
