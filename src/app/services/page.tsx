import ServicesLocatorClient from "@/components/services/ServicesLocatorClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Emergency Services Locator - National Emergency Authority" };

export default function ServicesLocatorPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-500 selection:text-white pb-20">
      
      {/* Hero */}
      <div className="bg-slate-900 pt-32 pb-24 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/10 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center justify-center px-3 py-1 mb-6 text-xs font-bold tracking-widest text-blue-300 uppercase bg-blue-500/10 border border-blue-500/20 rounded-full">
            National Facility Database
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
            Emergency <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Services Locator</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mx-auto max-w-2xl leading-relaxed">
            Find nearby hospitals, police stations, fire stations, blood banks, and disaster relief shelters using your current location.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <ServicesLocatorClient />
      </div>
    </div>
  );
}
