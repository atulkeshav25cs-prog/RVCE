"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Trash2, Edit2, Loader2, Save, X } from "lucide-react";

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

export default function TrustedContactsManager() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/citizen/trusted-contacts");
      const data = await res.json();
      if (data.success) {
        setContacts(data.trustedContacts);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSave = async () => {
    if (!formData.name || !formData.phone) return;
    try {
      let res;
      if (editingId) {
        res = await fetch("/api/citizen/trusted-contacts", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contactId: editingId, ...formData })
        });
      } else {
        res = await fetch("/api/citizen/trusted-contacts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
      }
      
      const data = await res.json();
      if (!data.success) {
        alert("Failed to save contact: " + (data.error || "Unknown error"));
        return;
      }
      
      setFormData({ name: "", phone: "", email: "" });
      setIsAdding(false);
      setEditingId(null);
      fetchContacts();
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch("/api/citizen/trusted-contacts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactId: id })
      });
      fetchContacts();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center justify-center"><Loader2 className="animate-spin text-slate-400" /></div>;
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-500" />
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Trusted Contacts</h2>
        </div>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
          {contacts.length} / 3
        </span>
      </div>

      <div className="space-y-3 mb-4">
        {contacts.length === 0 && !isAdding && (
          <p className="text-xs text-slate-500 italic text-center py-4">No Trusted Contacts Added</p>
        )}
        
        {contacts.map(c => (
          editingId === c._id ? (
            <div key={c._id} className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Name" className="w-full text-sm p-1.5 border rounded" />
              <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Phone" className="w-full text-sm p-1.5 border rounded" />
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Email (optional)" className="w-full text-sm p-1.5 border rounded" />
              <div className="flex gap-2 pt-2">
                <button onClick={handleSave} className="flex-1 bg-blue-600 text-white text-xs font-bold py-1.5 rounded"><Save className="w-3 h-3 inline mr-1" /> Save</button>
                <button onClick={() => { setEditingId(null); setFormData({name: "", phone: "", email: ""}); }} className="flex-1 bg-slate-200 text-slate-700 text-xs font-bold py-1.5 rounded"><X className="w-3 h-3 inline mr-1" /> Cancel</button>
              </div>
            </div>
          ) : (
            <div key={c._id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:border-slate-200 transition-colors">
              <div>
                <p className="text-sm font-bold text-slate-900">{c.name}</p>
                <p className="text-xs text-slate-500">{c.phone} {c.email && `• ${c.email}`}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditingId(c._id); setFormData({name: c.name, phone: c.phone, email: c.email || ""}); }} className="text-slate-400 hover:text-blue-600"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(c._id)} className="text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          )
        ))}

        {isAdding && !editingId && (
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Name" className="w-full text-sm p-1.5 border rounded" />
            <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Phone" className="w-full text-sm p-1.5 border rounded" />
            <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Email (optional)" className="w-full text-sm p-1.5 border rounded" />
            <div className="flex gap-2 pt-2">
              <button onClick={handleSave} disabled={!formData.name || !formData.phone} className="flex-1 bg-blue-600 text-white text-xs font-bold py-1.5 rounded disabled:opacity-50"><Save className="w-3 h-3 inline mr-1" /> Save</button>
              <button onClick={() => { setIsAdding(false); setFormData({name: "", phone: "", email: ""}); }} className="flex-1 bg-slate-200 text-slate-700 text-xs font-bold py-1.5 rounded"><X className="w-3 h-3 inline mr-1" /> Cancel</button>
            </div>
          </div>
        )}
      </div>

      {!isAdding && contacts.length < 3 && (
        <button onClick={() => setIsAdding(true)} className="w-full flex items-center justify-center py-2 border-2 border-dashed border-slate-200 rounded-lg text-sm font-bold text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-colors">
          <Plus className="w-4 h-4 mr-1" /> Add Contact
        </button>
      )}

      {lastUpdated && (
        <p className="text-[10px] text-slate-400 mt-4 text-center">Last updated: {lastUpdated.toLocaleTimeString()}</p>
      )}
    </div>
  );
}
