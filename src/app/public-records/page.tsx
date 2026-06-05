import Link from "next/link";
import { Database, Search, Filter, ShieldAlert, CheckCircle, Clock, MapPin, AlertTriangle, ArrowRight } from "lucide-react";

async function getRecordsData() {
  // Use absolute URL since this runs on the server
  const res = await fetch("http://localhost:3000/api/public-records", { cache: "no-store" });
  if (!res.ok) return { records: [], stats: null };
  return res.json();
}

export default async function PublicRecordsArchive() {
  const data = await getRecordsData();
  const records = data.records || [];
  const stats = data.stats || { totalPublished: 0, resolvedEmergencies: 0, resolvedWSCases: 0, latestPublicationDate: null };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-500 selection:text-white pb-20">
      
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Database className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white tracking-tight text-lg">National Emergency Authority</span>
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Home</Link>
              <Link href="/citizen/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Citizen Portal</Link>
              <Link href="/authority/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Authority Portal</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-slate-900 pt-16 pb-24 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-500/10 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center justify-center px-3 py-1 mb-6 text-xs font-bold tracking-widest text-indigo-300 uppercase bg-indigo-500/10 border border-indigo-500/20 rounded-full">
            Official Government Archive
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
            Public Incident <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Records</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Transparent access to resolved emergency dispatches, women safety incidents, and historical public safety data. All personally identifiable information has been redacted.
          </p>
          
          {/* Statistics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="text-3xl font-black text-white mb-1">{stats.totalPublished}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Records</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="text-3xl font-black text-blue-400 mb-1">{stats.resolvedEmergencies}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Emergencies</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="text-3xl font-black text-pink-400 mb-1">{stats.resolvedWSCases}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Women Safety</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="text-lg font-bold text-emerald-400 mb-1 mt-2">{stats.latestPublicationDate ? new Date(stats.latestPublicationDate).toLocaleDateString() : 'N/A'}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">Latest Update</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        
        {/* Search & Filters */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4 mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search incident ID, title, or location..." 
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer">
              <option>All Types</option>
              <option>Women Safety</option>
              <option>Fire</option>
              <option>Medical</option>
            </select>
            <select className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer">
              <option>All Severities</option>
              <option>Critical</option>
              <option>High</option>
            </select>
          </div>
        </div>

        {/* Records Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <Database className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-700">No Records Found</h3>
              <p className="text-slate-500 mt-1">The public archive is currently empty.</p>
            </div>
          ) : (
            records.map((record: any) => {
              const isWS = record.title === "Women Safety Incident";
              return (
                <Link 
                  href={`/public-records/${record.recordId}`} 
                  key={record.recordId}
                  className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 overflow-hidden flex flex-col"
                >
                  <div className={`h-2 w-full ${isWS ? 'bg-pink-500' : 'bg-indigo-500'}`}></div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                        {record.recordId}
                      </span>
                      {isWS && (
                        <span className="text-[10px] font-black uppercase tracking-wider text-pink-700 bg-pink-50 px-2 py-1 rounded border border-pink-200 flex items-center">
                          <ShieldAlert className="w-3 h-3 mr-1" />
                          Women Safety
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {record.title}
                    </h3>
                    
                    <p className="text-sm text-slate-600 mb-6 line-clamp-2 flex-1">
                      {record.description}
                    </p>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-sm font-medium text-slate-600">
                        <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                        <span className="truncate">{record.location}</span>
                      </div>
                      <div className="flex items-center text-sm font-medium text-slate-600">
                        <Clock className="w-4 h-4 mr-2 text-slate-400" />
                        Resolved: {new Date(record.resolvedAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                        <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                        {record.status}
                      </span>
                      <span className="text-sm font-bold text-indigo-600 flex items-center opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
                        View Details <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
