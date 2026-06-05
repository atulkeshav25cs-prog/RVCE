"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, CheckCircle, ExternalLink, RefreshCw } from "lucide-react";

export default function AuthorityProcedureManager() {
  const [procedures, setProcedures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    procedureId: "",
    title: "",
    category: "Identity Documents",
    description: "",
    officialWebsite: "",
    summary: "",
    requiredDocuments: "",
    steps: "",
    processingTime: "",
    fees: "",
    contactInformation: "",
    emergencyLevel: "Low"
  });

  useEffect(() => {
    fetchProcedures();
  }, []);

  const fetchProcedures = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/procedures");
      const data = await res.json();
      if (data.success) {
        setProcedures(data.procedures);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      procedureId: `PROC-${Date.now()}`,
      title: "",
      category: "Identity Documents",
      description: "",
      officialWebsite: "",
      summary: "",
      requiredDocuments: "",
      steps: "",
      processingTime: "",
      fees: "",
      contactInformation: "",
      emergencyLevel: "Low"
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proc: any) => {
    setEditingId(proc.procedureId);
    setFormData({
      ...proc,
      requiredDocuments: proc.requiredDocuments.join("\n"),
      steps: proc.steps.join("\n")
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (procedureId: string) => {
    if (!confirm("Are you sure you want to delete this procedure?")) return;
    
    try {
      const res = await fetch("/api/procedures/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ procedureId })
      });
      const data = await res.json();
      if (data.success) {
        fetchProcedures();
      } else {
        alert(data.error);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...formData,
      requiredDocuments: formData.requiredDocuments.split("\n").filter(d => d.trim()),
      steps: formData.steps.split("\n").filter(s => s.trim())
    };

    const endpoint = editingId ? "/api/procedures/update" : "/api/procedures/create";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchProcedures();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save procedure.");
    }
    setIsSubmitting(false);
  };

  if (loading && procedures.length === 0) {
    return <div className="p-12 text-center text-slate-500 flex justify-center"><RefreshCw className="w-6 h-6 animate-spin" /></div>;
  }

  return (
    <div className="flex flex-col h-full relative">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <h2 className="font-bold text-slate-800">Directory Contents ({procedures.length})</h2>
        <button 
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" /> Add New Procedure
        </button>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Official Link</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {procedures.map((p) => (
              <tr key={p.procedureId} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-mono font-bold text-slate-900">{p.procedureId}</td>
                <td className="px-6 py-4 font-bold text-slate-900">{p.title}</td>
                <td className="px-6 py-4">
                  <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-1 rounded">
                    {p.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <a href={p.officialWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center text-xs">
                    {p.officialWebsite} <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button onClick={() => handleOpenEdit(p)} className="text-blue-600 hover:text-blue-800 font-bold">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(p.procedureId)} className="text-red-600 hover:text-red-800 font-bold">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {procedures.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  No procedures found in the directory.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900">{editingId ? "Edit Procedure" : "Create New Procedure"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Procedure Title</label>
                  <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-slate-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Lost Aadhaar Card" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                  <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border border-slate-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Identity Documents</option>
                    <option>Cyber Crime</option>
                    <option>Public Safety</option>
                    <option>Property & Loss</option>
                    <option>Disaster Assistance</option>
                  </select>
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Short Summary</label>
                  <input required value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} className="w-full border border-slate-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Detailed Description</label>
                  <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-slate-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24" />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Official Website URL</label>
                  <input required type="url" value={formData.officialWebsite} onChange={e => setFormData({...formData, officialWebsite: e.target.value})} className="w-full border border-slate-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Processing Time</label>
                  <input required value={formData.processingTime} onChange={e => setFormData({...formData, processingTime: e.target.value})} className="w-full border border-slate-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 5-15 Days" />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Fees</label>
                  <input required value={formData.fees} onChange={e => setFormData({...formData, fees: e.target.value})} className="w-full border border-slate-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. ₹50" />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Contact / Helpline</label>
                  <input required value={formData.contactInformation} onChange={e => setFormData({...formData, contactInformation: e.target.value})} className="w-full border border-slate-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Required Documents (One per line)</label>
                  <textarea required value={formData.requiredDocuments} onChange={e => setFormData({...formData, requiredDocuments: e.target.value})} className="w-full border border-slate-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32" placeholder="Aadhaar Card&#10;FIR Copy" />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Steps (One per line)</label>
                  <textarea required value={formData.steps} onChange={e => setFormData({...formData, steps: e.target.value})} className="w-full border border-slate-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32" placeholder="Visit portal&#10;Click Submit" />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                  {isSubmitting ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />} 
                  {editingId ? "Save Changes" : "Create Procedure"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
