import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Database, CheckCircle, Clock, MapPin, Calendar, FileText, UserCircle, ShieldAlert } from "lucide-react";

async function getRecord(recordId: string) {
  const res = await fetch(`http://localhost:3000/api/public-records/${recordId}`, { cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json();
  return data.record;
}

export default async function PublicRecordDetail({ params }: { params: { recordId: string } }) {
  const record = await getRecord(params.recordId);
  if (!record) {
    notFound();
  }

  const isWS = record.title === "Women Safety Incident";

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
            <Link href="/public-records" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Archive
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Breadcrumb & Meta */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-sm font-bold text-slate-500 bg-slate-200 px-3 py-1 rounded-md shadow-sm border border-slate-300">
                {record.recordId}
              </span>
              <span className="text-sm font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-md shadow-sm border border-emerald-200 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1.5" /> {record.status}
              </span>
              {isWS && (
                <span className="text-sm font-bold text-pink-700 bg-pink-100 px-3 py-1 rounded-md shadow-sm border border-pink-200 flex items-center">
                  <ShieldAlert className="w-4 h-4 mr-1.5" /> Women Safety
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {record.title}
            </h1>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-start space-x-4">
            <div className="bg-indigo-50 p-3 rounded-xl"><MapPin className="w-6 h-6 text-indigo-600" /></div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Sanitized Location</p>
              <p className="text-sm font-bold text-slate-800">{record.location}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-start space-x-4">
            <div className="bg-blue-50 p-3 rounded-xl"><Calendar className="w-6 h-6 text-blue-600" /></div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Resolution Date</p>
              <p className="text-sm font-bold text-slate-800">{new Date(record.resolvedAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-start space-x-4">
            <div className="bg-purple-50 p-3 rounded-xl"><UserCircle className="w-6 h-6 text-purple-600" /></div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Publishing Authority</p>
              <p className="text-sm font-bold text-slate-800">{record.publishedByAuthorityName}</p>
            </div>
          </div>
        </div>

        {/* Description & Notes */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden mb-10">
          <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-900 flex items-center mb-4">
              <FileText className="w-5 h-5 mr-2 text-indigo-600" />
              Incident Summary
            </h2>
            <p className="text-slate-700 leading-relaxed text-lg">
              {record.description}
            </p>
          </div>
          <div className="p-6 md:p-8 bg-emerald-50/30">
            <h2 className="text-lg font-bold text-slate-900 flex items-center mb-4">
              <CheckCircle className="w-5 h-5 mr-2 text-emerald-600" />
              Resolution Notes
            </h2>
            <p className="text-slate-700 leading-relaxed italic">
              "{record.resolutionNotes}"
            </p>
          </div>
        </div>

        {/* Timeline */}
        {record.timeline && record.timeline.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <Clock className="w-6 h-6 mr-2 text-slate-400" />
              Historical Timeline
            </h2>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {record.timeline.map((event: any, index: number) => (
                  <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-slate-800">{event.status}</span>
                        <span className="text-xs font-bold text-slate-400">{new Date(event.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed mt-2">{event.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-16 text-center text-sm font-bold text-slate-400 uppercase tracking-widest border-t border-slate-200 pt-8">
          End of Public Record
        </div>

      </div>
    </div>
  );
}
