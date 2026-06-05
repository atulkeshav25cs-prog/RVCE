import Link from "next/link";

export default function Services() {
  return (
    <section className="bg-white/95 py-32 px-6 lg:px-12 relative z-10 border-t border-slate-200/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-10">
          <h2 className="text-5xl sm:text-6xl lg:text-[4rem] font-bold tracking-tight text-slate-900 leading-[1.05] max-w-3xl">
            National Infrastructure & Support
          </h2>
          <Link href="/directives" className="inline-flex items-center text-[12px] font-bold uppercase tracking-[0.15em] text-slate-900 group whitespace-nowrap mb-2">
            View All Directives
            <span className="ml-4 w-12 h-[1px] bg-slate-900/50 group-hover:w-20 transition-all duration-300"></span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 bg-slate-50 p-12 sm:p-16 flex flex-col justify-between aspect-video lg:aspect-auto border border-slate-100">
            <div>
              <span className="inline-block px-4 py-2 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.15em] mb-8">Active Program</span>
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-6 max-w-lg leading-[1.1]">Civilian Defense & Preparedness</h3>
              <p className="text-slate-600 font-medium text-xl max-w-md leading-[1.6]">Comprehensive training modules and state-sponsored safety initiatives for regional communities.</p>
            </div>
            <div className="mt-16 flex justify-end">
              <Link href="/directives" className="w-16 h-16 border border-slate-300 flex items-center justify-center hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all cursor-pointer group">
                <span className="text-2xl font-light leading-none group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
          
          <div className="bg-slate-900 p-12 sm:p-16 flex flex-col justify-between text-white aspect-[4/5] lg:aspect-auto">
            <div>
              <span className="inline-block px-4 py-2 bg-white text-slate-900 text-[10px] font-bold uppercase tracking-[0.15em] mb-8">Resource</span>
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6 leading-[1.1]">Federal Relief Funds</h3>
              <p className="text-white/70 font-medium text-xl leading-[1.6]">Financial assistance and recovery programs post-disaster.</p>
            </div>
            <div className="mt-16 flex justify-end">
              <Link href="/directives" className="w-16 h-16 border border-white/20 flex items-center justify-center hover:bg-white hover:text-slate-900 hover:border-white transition-all cursor-pointer group">
                <span className="text-2xl font-light leading-none group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
