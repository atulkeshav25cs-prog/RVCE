"use client";

import { useState, useEffect } from "react";
import { Search, ExternalLink, FileText, Clock, CreditCard, Phone, ShieldCheck, ChevronRight, Download } from "lucide-react";
import Link from "next/link";

export default function DirectivesPage() {
  const [procedures, setProcedures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Procedures");
  const [selectedProc, setSelectedProc] = useState<any>(null);

  const categories = [
    "All Procedures",
    "Identity Documents",
    "Cyber Crime",
    "Public Safety",
    "Property & Loss",
    "Disaster Assistance"
  ];

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
        if (data.procedures.length > 0) {
          setSelectedProc(data.procedures[0]);
        }
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const filteredProcedures = procedures.filter(p => {
    const matchCategory = category === "All Procedures" || p.category === category;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.summary.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#F4F5F7] font-sans">
      {/* Official Government Header Style */}
      <div className="bg-[#003366] text-white py-6 border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">National Citizen Services Directory</h1>
            <p className="text-blue-100 mt-1 text-sm">Official Standard Operating Procedures & Guidelines</p>
          </div>
          <Link href="/" className="text-sm font-bold bg-white text-[#003366] px-4 py-2 rounded shadow-sm hover:bg-slate-100 transition-colors">
            Return to Home
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar - Search & List */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-300 shadow-sm rounded-none p-4">
            <h2 className="font-bold text-[#003366] mb-4 text-lg border-b border-slate-200 pb-2">Filter Services</h2>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
              <input 
                type="text"
                placeholder="Search procedures (e.g. Aadhaar)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 focus:outline-none focus:border-[#003366] focus:ring-1 focus:ring-[#003366] bg-slate-50 text-slate-900"
              />
            </div>

            <div className="space-y-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors flex justify-between items-center ${category === cat ? 'bg-[#003366] text-white font-bold' : 'text-slate-700 hover:bg-slate-100'}`}
                >
                  {cat}
                  {category === cat && <ChevronRight className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-300 shadow-sm rounded-none">
            <h2 className="font-bold text-[#003366] p-4 text-lg border-b border-slate-300 bg-slate-50">Procedure Index</h2>
            <div className="max-h-[500px] overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-slate-500 text-sm">Loading directory...</div>
              ) : filteredProcedures.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">No procedures found matching your criteria.</div>
              ) : (
                <ul className="divide-y divide-slate-200">
                  {filteredProcedures.map(p => (
                    <li key={p.procedureId}>
                      <button
                        onClick={() => setSelectedProc(p)}
                        className={`w-full text-left p-4 transition-colors ${selectedProc?.procedureId === p.procedureId ? 'bg-blue-50 border-l-4 border-[#003366]' : 'hover:bg-slate-50 border-l-4 border-transparent'}`}
                      >
                        <p className={`font-bold ${selectedProc?.procedureId === p.procedureId ? 'text-[#003366]' : 'text-slate-900'}`}>{p.title}</p>
                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{p.category}</p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Right Details Panel */}
        <div className="lg:col-span-8">
          {selectedProc ? (
            <div className="bg-white border border-slate-300 shadow-sm rounded-none">
              
              <div className="p-6 lg:p-8 border-b border-slate-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 uppercase tracking-wider border border-amber-200">
                      {selectedProc.category}
                    </span>
                    <h2 className="text-3xl font-bold text-[#003366] mt-3">{selectedProc.title}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 font-mono mb-1">ID: {selectedProc.procedureId}</p>
                    <div className="flex items-center justify-end text-emerald-600 text-xs font-bold uppercase">
                      <ShieldCheck className="w-4 h-4 mr-1" /> Verified Procedure
                    </div>
                  </div>
                </div>
                <p className="text-slate-700 text-lg leading-relaxed">{selectedProc.summary}</p>
              </div>

              <div className="p-6 lg:p-8 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">To begin this procedure, visit the official government portal:</p>
                  <p className="font-bold text-slate-900">{selectedProc.officialWebsite}</p>
                </div>
                <a 
                  href={selectedProc.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#003366] hover:bg-[#002244] text-white px-6 py-3 font-bold flex items-center shadow-sm transition-colors"
                >
                  Visit Official Portal <ExternalLink className="w-5 h-5 ml-2" />
                </a>
              </div>

              <div className="p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Steps */}
                <div className="md:col-span-2">
                  <h3 className="text-xl font-bold text-[#003366] mb-4 flex items-center border-b border-slate-200 pb-2">
                    <FileText className="w-5 h-5 mr-2 text-slate-500" /> Official Procedure Steps
                  </h3>
                  <ol className="list-decimal list-outside ml-5 space-y-3 text-slate-700">
                    {selectedProc.steps.map((step: string, idx: number) => (
                      <li key={idx} className="pl-2 leading-relaxed">{step}</li>
                    ))}
                  </ol>
                </div>

                {/* Documents */}
                <div className="md:col-span-2">
                  <h3 className="text-xl font-bold text-[#003366] mb-4 flex items-center border-b border-slate-200 pb-2">
                    <Download className="w-5 h-5 mr-2 text-slate-500" /> Required Documents
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700">
                    {selectedProc.requiredDocuments.map((doc: string, idx: number) => (
                      <li key={idx} className="flex items-center bg-slate-50 border border-slate-200 px-4 py-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Meta details */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#F4F5F7] p-6 border border-slate-200 mt-4">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center"><Clock className="w-3 h-3 mr-1" /> Processing Time</p>
                    <p className="font-bold text-slate-900">{selectedProc.processingTime}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center"><CreditCard className="w-3 h-3 mr-1" /> Government Fees</p>
                    <p className="font-bold text-slate-900">{selectedProc.fees}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center"><Phone className="w-3 h-3 mr-1" /> Helpdesk Contact</p>
                    <p className="font-bold text-slate-900">{selectedProc.contactInformation}</p>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-300 shadow-sm rounded-none h-full flex items-center justify-center min-h-[500px]">
              <div className="text-center text-slate-500">
                <ShieldCheck className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p className="text-lg">Select a procedure from the directory to view details.</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
