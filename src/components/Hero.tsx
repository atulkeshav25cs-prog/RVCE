import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full h-screen min-h-[800px] flex flex-col justify-end pb-32 pt-32 px-6 lg:px-12 bg-slate-900 overflow-hidden">
      {/* Restored exact Hero Image overlay structure */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero_emergency_1780594689899.png"
          alt="Emergency Command Center"
          fill
          priority
          className="object-cover opacity-60"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent mix-blend-multiply" />
      </div>

      <div className="relative z-10 max-w-7xl w-full mx-auto flex flex-col items-start">

        
        <h1 className="text-5xl sm:text-7xl lg:text-[7rem] font-bold tracking-tight text-white leading-[1.05] max-w-5xl">
          National Emergency Command
        </h1>
        
        <p className="mt-8 text-xl sm:text-2xl text-white/80 font-medium max-w-2xl leading-[1.6]">
          The centralized authority for immediate crisis response, public safety coordination, and rapid civilian assistance.
        </p>
        
        <div className="mt-12 flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
          <button className="bg-white/95 backdrop-blur-sm text-slate-900 px-10 py-5 text-[12px] font-bold uppercase tracking-[0.1em] hover:bg-white transition-all duration-300">
            Request Immediate Help
          </button>
          <button className="bg-black/20 backdrop-blur-md text-white px-10 py-5 text-[12px] font-bold uppercase tracking-[0.1em] border border-white/20 hover:bg-white/10 transition-all duration-300">
            View Active Alerts
          </button>
        </div>
      </div>
    </section>
  );
}
