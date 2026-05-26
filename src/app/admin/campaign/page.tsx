"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Gift, 
  Users, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  Eye
} from 'lucide-react';

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  color?: string;
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

export default function CampaignAdmin() {
  const [activeTab, setActiveTab] = useState<'settings' | 'offers' | 'leads'>('settings');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Settings state
  const [settings, setSettings] = useState({
    enabled: true,
    limit: 100,
    expiryDate: '2026-12-31'
  });

  // Offers state
  const [offers, setOffers] = useState<Offer[]>([]);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [offerFormData, setOfferFormData] = useState<Offer>({
    id: '',
    title: '',
    description: '',
    discount: '',
    color: '#e61e25'
  });

  // Leads state
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const settingsRes = await fetch('/api/offer-settings');
      const settingsData = await settingsRes.json();
      if (settingsData.success) {
        setSettings({
          enabled: settingsData.enabled,
          limit: settingsData.limit,
          expiryDate: settingsData.expiryDate
        });
        setOffers(settingsData.offers || []);
      }

      const leadsRes = await fetch('/api/offer-leads');
      const leadsData = await leadsRes.json();
      if (leadsData.success) {
        setLeads(leadsData.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/offer-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settings, offers })
      });
      if (res.ok) {
        showMessage('success', 'Settings updated successfully!');
      } else {
        showMessage('error', 'Failed to update settings');
      }
    } catch (error) {
      showMessage('error', 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let newOffers;
    if (editingOffer) {
      newOffers = offers.map(o => o.id === editingOffer.id ? offerFormData : o);
    } else {
      newOffers = [...offers, { ...offerFormData, id: Date.now().toString() }];
    }
    setOffers(newOffers);
    setShowOfferForm(false);
    setEditingOffer(null);
    setOfferFormData({ id: '', title: '', description: '', discount: '', color: '#e61e25' });
  };

  const deleteOffer = (id: string) => {
    if (confirm('Delete this offer?')) {
      setOffers(offers.filter(o => o.id !== id));
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0c0c0c]">
      <div className="w-12 h-12 border-4 border-[#e61e25] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white font-sans p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black mb-2">Campaign Management</h1>
            <p className="text-white/50 italic text-lg">Interactive Offer Reveal Control Center</p>
          </div>
          
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-[#e61e25] text-white' : 'hover:bg-white/5'}`}
            >
              <Settings size={20} /> Settings
            </button>
            <button 
              onClick={() => setActiveTab('offers')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${activeTab === 'offers' ? 'bg-[#e61e25] text-white' : 'hover:bg-white/5'}`}
            >
              <Gift size={20} /> Offers
            </button>
            <button 
              onClick={() => setActiveTab('leads')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${activeTab === 'leads' ? 'bg-[#e61e25] text-white' : 'hover:bg-white/5'}`}
            >
              <Users size={20} /> Leads
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}
            >
              {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        <main className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm shadow-2xl">
          <div className="p-10">
            {activeTab === 'settings' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                       <Settings className="text-[#e61e25]" /> General Configuration
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
                        <div>
                          <div className="font-bold text-lg">Section Visibility</div>
                          <div className="text-sm text-white/40 italic">Show/Hide campaign from landing page</div>
                        </div>
                        <button 
                          onClick={() => setSettings({...settings, enabled: !settings.enabled})}
                          className={`w-14 h-8 rounded-full transition-all relative ${settings.enabled ? 'bg-[#e61e25]' : 'bg-white/10'}`}
                        >
                          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.enabled ? 'left-7' : 'left-1'}`} />
                        </button>
                      </div>

                      <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                        <label className="block font-bold mb-2">Offer Limit</label>
                        <p className="text-sm text-white/40 mb-4 italic">Number of offers available for claim</p>
                        <input 
                          type="number" 
                          value={settings.limit}
                          onChange={(e) => setSettings({...settings, limit: parseInt(e.target.value)})}
                          className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 focus:border-[#e61e25] outline-none transition-all"
                        />
                      </div>

                      <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                        <label className="block font-bold mb-2">Expiry Date</label>
                        <p className="text-sm text-white/40 mb-4 italic">Campaign automatically ends on this date</p>
                        <input 
                          type="date" 
                          value={settings.expiryDate}
                          onChange={(e) => setSettings({...settings, expiryDate: e.target.value})}
                          className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 focus:border-[#e61e25] outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 p-10 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-[#e61e25]/20 rounded-full flex items-center justify-center mb-6">
                      <Save className="text-[#e61e25]" size={32} />
                    </div>
                    <h4 className="text-xl font-bold mb-2">Publish Changes</h4>
                    <p className="text-white/50 mb-8 italic">All changes to settings and offers will be live immediately after saving.</p>
                    <button 
                      onClick={handleSettingsSave}
                      disabled={saving}
                      className="w-full bg-[#e61e25] hover:bg-[#ff2d35] py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#e61e25]/20"
                    >
                      {saving ? "Saving..." : <><Save size={20} /> Save All Changes</>}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'offers' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-bold">Offer Inventory</h3>
                  <button 
                    onClick={() => {
                        setEditingOffer(null);
                        setOfferFormData({ id: '', title: '', description: '', discount: '', color: '#e61e25' });
                        setShowOfferForm(true);
                    }}
                    className="bg-[#e61e25] hover:bg-[#ff2d35] px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#e61e25]/20"
                  >
                    <Plus size={20} /> Add New Offer
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {offers.map((offer) => (
                    <div key={offer.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl relative group overflow-hidden">
                      {/* Decorative Accent */}
                      <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-10 blur-2xl" style={{ backgroundColor: offer.color }} />
                      
                      <div className="flex justify-between items-start mb-4">
                        <div 
                          className="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest"
                          style={{ backgroundColor: `${offer.color}20`, color: offer.color, border: `1px solid ${offer.color}40` }}
                        >
                          {offer.discount}
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                                setEditingOffer(offer);
                                setOfferFormData(offer);
                                setShowOfferForm(true);
                            }}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => deleteOffer(offer.id)}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <h4 className="text-xl font-black mb-2">{offer.title}</h4>
                      <p className="text-white/50 text-sm italic">{offer.description}</p>
                    </div>
                  ))}
                  
                  {offers.length === 0 && (
                    <div className="col-span-full py-20 text-center text-white/30 italic">
                      No offers created yet. Start by adding one!
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'leads' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-bold">User Leads & winners</h3>
                  <div className="flex items-center gap-4 text-white/50 text-sm font-semibold uppercase tracking-widest">
                    <span>Total: {leads.length}</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-left">
                        <th className="py-4 px-4 font-black uppercase text-xs tracking-widest text-[#e61e25]">User</th>
                        <th className="py-4 px-4 font-black uppercase text-xs tracking-widest text-[#e61e25]">Contact Info</th>
                        <th className="py-4 px-4 font-black uppercase text-xs tracking-widest text-[#e61e25]">Business</th>
                        <th className="py-4 px-4 font-black uppercase text-xs tracking-widest text-[#e61e25]">Offer Won</th>
                        <th className="py-4 px-4 font-black uppercase text-xs tracking-widest text-[#e61e25]">Date</th>
                        <th className="py-4 px-4 font-black uppercase text-xs tracking-widest text-[#e61e25]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((lead) => (
                        <tr key={lead.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                          <td className="py-6 px-4 font-bold">{lead.name}</td>
                          <td className="py-6 px-4">
                            <div className="text-sm font-semibold">{lead.email}</div>
                            <div className="text-xs text-white/40 italic">{lead.phone}</div>
                          </td>
                          <td className="py-6 px-4 italic text-white/70">{lead.businessName}</td>
                          <td className="py-6 px-4">
                            <span className="bg-red-500/10 text-[#e61e25] px-3 py-1 rounded-full text-xs font-black uppercase tracking-tight border border-[#e61e25]/20">
                              {lead.offerWon}
                            </span>
                          </td>
                          <td className="py-6 px-4 text-sm text-white/40">
                            {new Date(lead.date).toLocaleDateString()}
                          </td>
                          <td className="py-6 px-4">
                            <button className="text-white/30 hover:text-white transition-colors">
                                <Eye size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {leads.length === 0 && (
                    <div className="py-20 text-center text-white/30 italic">
                      No leads captured yet. Keep promoting!
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>

      {/* Offer Modal */}
      <AnimatePresence>
        {showOfferForm && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#121212] border border-white/10 rounded-3xl p-10 w-full max-w-lg shadow-2xl shadow-black"
            >
              <h3 className="text-2xl font-black mb-8">{editingOffer ? "Edit Offer" : "New Offer Asset"}</h3>
              <form onSubmit={handleOfferSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-white/40 mb-2">Offer Title</label>
                  <input 
                    required
                    type="text" 
                    value={offerFormData.title}
                    onChange={(e) => setOfferFormData({...offerFormData, title: e.target.value})}
                    placeholder="e.g. Free Professional Branding"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 outline-none focus:border-[#e61e25] transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-white/40 mb-2">Discount Label</label>
                    <input 
                      required
                      type="text" 
                      value={offerFormData.discount}
                      onChange={(e) => setOfferFormData({...offerFormData, discount: e.target.value})}
                      placeholder="e.g. 20% OFF or FREE"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 outline-none focus:border-[#e61e25] transition-all font-black text-[#e61e25]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-white/40 mb-2">UI Highlight Color</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="color" 
                        value={offerFormData.color}
                        onChange={(e) => setOfferFormData({...offerFormData, color: e.target.value})}
                        className="w-14 h-14 rounded-full border-none outline-none cursor-pointer bg-transparent"
                      />
                      <span className="text-xs font-mono opacity-50 uppercase">{offerFormData.color}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-white/40 mb-2">Description</label>
                  <textarea 
                    required
                    value={offerFormData.description}
                    onChange={(e) => setOfferFormData({...offerFormData, description: e.target.value})}
                    placeholder="Brief details about this reward..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 outline-none focus:border-[#e61e25] transition-all h-24 resize-none italic"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowOfferForm(false)}
                    className="flex-1 py-4 px-4 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all border border-white/10"
                  >
                    Discard
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 px-4 bg-[#e61e25] hover:bg-[#ff2d35] rounded-xl font-bold shadow-lg shadow-[#e61e25]/20"
                  >
                    {editingOffer ? "Update Asset" : "Deploy Offer"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
