"use client";

import { useState, useEffect } from "react";
import { Megaphone, Trash2, Clock, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";

export default function AuthorityAlertsManager() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    alertType: "Weather",
    severity: "Medium",
    targetArea: "",
    expiresInHours: "24"
  });

  const fetchAlerts = async () => {
    try {
      const res = await fetch("/api/alerts/authority", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setAlerts(data.alerts);
      }
    } catch (err) {
      console.error("Error fetching alerts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + parseInt(formData.expiresInHours));

      const res = await fetch("/api/alerts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          expiresAt: expiresAt.toISOString(),
          isPinned: formData.severity === "Critical"
        })
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setFormData({
        title: "",
        description: "",
        alertType: "Weather",
        severity: "Medium",
        targetArea: "",
        expiresInHours: "24"
      });
      fetchAlerts();
    } catch (err: any) {
      setError(err.message || "Failed to create alert");
    } finally {
      setSubmitting(false);
    }
  };

  const handleExpire = async (alertId: string) => {
    if (!confirm("Are you sure you want to manually expire this alert?")) return;
    try {
      const res = await fetch("/api/alerts/update-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alertId, status: "Expired" })
      });
      if (res.ok) fetchAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (alertId: string) => {
    if (!confirm("Are you sure you want to permanently delete this alert?")) return;
    try {
      const res = await fetch(`/api/alerts/delete?alertId=${alertId}`, {
        method: "DELETE"
      });
      if (res.ok) fetchAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case "Critical": return "bg-red-100 text-red-700 border-red-200";
      case "High": return "bg-orange-100 text-orange-700 border-orange-200";
      case "Medium": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Low": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-[800px]">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center shrink-0">
        <h2 className="text-lg font-bold text-slate-800 flex items-center">
          <Megaphone className="w-5 h-5 mr-2 text-indigo-600" />
          Emergency Alert Broadcast
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Create Form */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Broadcast New Alert</h3>
          {error && <div className="mb-3 p-2 bg-red-100 text-red-700 rounded text-xs">{error}</div>}
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Alert Title</label>
                <input required type="text" className="w-full text-sm border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g., Flash Flood Warning" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Target Area</label>
                <input required type="text" className="w-full text-sm border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" value={formData.targetArea} onChange={e => setFormData({...formData, targetArea: e.target.value})} placeholder="e.g., All Districts, Downtown" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Alert Type</label>
                <select className="w-full text-sm border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" value={formData.alertType} onChange={e => setFormData({...formData, alertType: e.target.value})}>
                  <option>Weather</option>
                  <option>Flood</option>
                  <option>Fire</option>
                  <option>Medical</option>
                  <option>Security</option>
                  <option>Disaster</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Severity</label>
                <select className="w-full text-sm border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" value={formData.severity} onChange={e => setFormData({...formData, severity: e.target.value})}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Expires In (Hours)</label>
                <select className="w-full text-sm border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" value={formData.expiresInHours} onChange={e => setFormData({...formData, expiresInHours: e.target.value})}>
                  <option value="1">1 Hour</option>
                  <option value="3">3 Hours</option>
                  <option value="6">6 Hours</option>
                  <option value="12">12 Hours</option>
                  <option value="24">24 Hours</option>
                  <option value="48">48 Hours</option>
                  <option value="72">72 Hours</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Description / Instructions</label>
              <textarea required rows={2} className="w-full text-sm border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Provide clear instructions to citizens..."></textarea>
            </div>

            <div className="flex justify-end">
              <button disabled={submitting} type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center transition-colors disabled:opacity-50">
                {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Megaphone className="w-4 h-4 mr-2" />}
                Broadcast Alert
              </button>
            </div>
          </form>
        </div>

        {/* Existing Alerts List */}
        <div>
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Broadcast History</h3>
          {loading ? (
            <div className="flex justify-center p-8 text-slate-400"><Loader2 className="w-8 h-8 animate-spin" /></div>
          ) : alerts.length === 0 ? (
            <div className="text-center p-8 bg-slate-50 rounded-lg text-slate-500 text-sm">No alerts found.</div>
          ) : (
            <div className="space-y-3">
              {alerts.map(alert => (
                <div key={alert.alertId} className={`p-4 rounded-lg border ${alert.status === 'Active' ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-70'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getSeverityColor(alert.severity)}`}>{alert.severity}</span>
                        {alert.status === "Active" ? (
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-green-100 text-green-700 border border-green-200 flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Active</span>
                        ) : (
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-600 border border-slate-300 flex items-center"><Clock className="w-3 h-3 mr-1" /> Expired</span>
                        )}
                        <span className="text-xs font-medium text-slate-500 border border-slate-200 rounded px-2 py-0.5 bg-slate-100">{alert.alertType}</span>
                      </div>
                      <h4 className="font-bold text-slate-900">{alert.title}</h4>
                      <p className="text-sm text-slate-600 mt-1">{alert.description}</p>
                      <div className="flex items-center text-xs text-slate-500 mt-3 space-x-4">
                        <span><strong className="text-slate-700">Area:</strong> {alert.targetArea}</span>
                        <span><strong className="text-slate-700">Expires:</strong> {new Date(alert.expiresAt).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      {alert.status === "Active" && (
                        <button onClick={() => handleExpire(alert.alertId)} className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded border border-slate-200">
                          Expire
                        </button>
                      )}
                      <button onClick={() => handleDelete(alert.alertId)} className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded border border-red-100 flex items-center justify-center">
                        <Trash2 className="w-3 h-3 mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
