export default function HowItWorks() {
  const steps = [
    { num: "01", title: "Incident Report", desc: "Submit your situation via secure portal. System logs GPS coordinates and exact timestamps." },
    { num: "02", title: "AI Classification", desc: "Neural networks instantly parse request severity and route to the specific regional dispatch center." },
    { num: "03", title: "Tactical Deployment", desc: "Field units receive immediate clearance and proceed to your exact location." }
  ];

  return (
    <section className="bg-slate-900/95 text-white py-32 px-6 lg:px-12 relative z-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl sm:text-6xl lg:text-[4rem] font-bold tracking-tight mb-24 leading-[1.05]">
          Operational Protocol
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 border-t-[1px] border-white/10 pt-16">
          {steps.map((step) => (
            <div key={step.num} className="flex flex-col">
              <span className="text-7xl lg:text-[6rem] font-light text-white/10 mb-10 leading-none tracking-tight">
                {step.num}
              </span>
              <h3 className="text-xl font-bold uppercase tracking-[0.05em] mb-6">
                {step.title}
              </h3>
              <p className="text-white/60 font-medium text-lg leading-[1.6]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
