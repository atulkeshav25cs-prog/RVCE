import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-slate-200/50 bg-slate-50/95 py-20 mt-auto">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
          <div className="md:col-span-5">
            <Logo light={false} className="mb-8" />
            <p className="text-[13px] leading-relaxed text-slate-500 max-w-md font-medium">
              National Emergency Authority operates the central crisis management infrastructure for civilian safety, tactical dispatch, and disaster relief coordination.
            </p>
          </div>
          
          <div className="md:col-span-3 md:col-start-7">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-6">Directory</h3>
            <ul className="space-y-4">
              <li><Link href="#" className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors">Emergency Protocol</Link></li>
              <li><Link href="#" className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors">Regional Commands</Link></li>
              <li><Link href="#" className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors">Public Advisories</Link></li>
            </ul>
          </div>
          
          <div className="md:col-span-3">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-6">Legal Framework</h3>
            <ul className="space-y-4">
              <li><Link href="#" className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors">Data Security</Link></li>
              <li><Link href="#" className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors">Terms of Use</Link></li>
              <li><Link href="#" className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors">Accessibility Standard</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-20 flex flex-col md:flex-row justify-between items-center border-t border-slate-200/50 pt-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            &copy; {new Date().getFullYear()} National Emergency Authority
          </p>
          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <span className="flex h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-rose-500">
              For life-threatening emergencies, dial 911.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
