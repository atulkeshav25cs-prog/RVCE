"use client";

import { useState, useEffect } from "react";
import { Archive, Trash2, CheckCircle, ShieldAlert, Loader2, RefreshCw } from "lucide-react";

export default function AuthorityRecordsManager() {
  const [published, setPublished] = useState<any[]>([]);
  const [eligible, setEligible] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pubRes, eligRes] = await Promise.all([
        fetch("/api/public-records"),
        fetch("/api/public-records/eligible")
      ]);
      const pubData = await pubRes.json();
      const eligData = await eligRes.json();
      
      if (pubData.success) setPublished(pubData.records);
      if (eligData.success) setEligible(eligData.eligible);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePublish = async (incidentId: string) => {
    if (!confirm("Are you sure you want to publish this incident? All PII will be stripped and an immutable public snapshot will be created.")) return;
    
    setPublishing(incidentId);
    try {
      const res = await fetch("/api/public-records/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ incidentId })
      });
      if (res.ok) await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setPublishing(null);
    }
  };

  const handleDelete = async (recordId: string) => {
    if (!confirm("Are you sure you want to completely remove this from the public archive?")) return;
    
    try {
      const res = await fetch(`/api/public-records/delete?recordId=${recordId}`, {
        method: "DELETE"
      });
      if (res.ok) await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-[800px]">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center shrink-0">
        <h2 className="text-lg font-bold text-slate-800 flex items-center">
          <Archive className="w-5 h-5 mr-2 text-slate-700" />
          Public Records Management
        </h2>
        <button onClick={fetchData} className="text-slate-500 hover:text-slate-800 p-1">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Eligible for Publishing */}
        <div>
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center">
            Resolved Incidents Awaiting Publication
            <span className="ml-2 bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs">{eligible.length}</span>
          </h3>
          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
          ) : eligible.length === 0 ? (
            <div className="text-center p-6 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-sm">No new resolved incidents.</div>
          ) : (
            <div className="space-y-3">
              {eligible.map(inc => {
                const isWS = inc.reportId.startsWith("WS-");
                return (
                  <div key={inc.reportId} className="p-4 bg-white border border-slate-200 shadow-sm rounded-lg flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                    <div className="w-full xl:w-auto overflow-hidden">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{inc.reportId}</span>
                        {isWS && <span className="text-xs font-bold text-pink-700 bg-pink-100 px-2 py-0.5 rounded border border-pink-200 flex items-center"><ShieldAlert className="w-3 h-3 mr-1" /> Women Safety</span>}
                        <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded border border-green-200 flex items-center shrink-0"><CheckCircle className="w-3 h-3 mr-1" /> Resolved</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 break-words">{isWS ? "Women Safety Incident" : `${inc.emergencyType} Emergency`}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1 break-words">{inc.description}</p>
                    </div>
                    <button 
                      onClick={() => handlePublish(inc.reportId)}
                      disabled={publishing === inc.reportId}
                      className="w-full xl:w-auto xl:ml-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-3 py-1.5 rounded text-xs font-bold shadow-sm transition-colors shrink-0 flex items-center justify-center"
                    >
                      {publishing === inc.reportId ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Archive className="w-3 h-3 mr-1" />}
                      Publish to Archive
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Currently Published */}
        <div>
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Published Archives</h3>
          {loading ? (
             <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
          ) : published.length === 0 ? (
            <div className="text-center p-6 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-sm">No records published yet.</div>
          ) : (
            <div className="space-y-3">
              {published.map(rec => (
                <div key={rec.recordId} className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-start opacity-90">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded border border-slate-300">{rec.recordId}</span>
                      <span className="text-xs text-slate-500">From: {rec.incidentId}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800">{rec.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">Published: {new Date(rec.publishedAt).toLocaleDateString()}</p>
                  </div>
                  <button 
                    onClick={() => handleDelete(rec.recordId)}
                    className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded"
                    title="Remove from public records"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
