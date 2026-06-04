import Image from "next/image";

const categories = [
  { name: "Medical", image: "/images/cat_medical_1780594719908.png", desc: "Ambulance & Trauma response." },
  { name: "Fire & Rescue", image: "/images/cat_fire_1780594733902.png", desc: "Fire mitigation and extraction." },
  { name: "Disaster Mgmt", image: "/images/mission_response_1780594704142.png", desc: "Evacuation and natural crisis relief." },
  { name: "Law Enforcement", image: "/images/hero_emergency_1780594689899.png", desc: "Police dispatch and security." },
];

export default function Categories() {
  return (
    <section className="bg-slate-50/95 py-32 px-6 lg:px-12 relative z-10 border-t border-slate-200/50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div>
            <h2 className="text-5xl sm:text-6xl lg:text-[4rem] font-bold tracking-tight text-slate-900 leading-[1.05]">
              Response Units
            </h2>
          </div>
          <p className="text-lg sm:text-xl text-slate-600 max-w-lg font-medium leading-[1.6]">
            Select a critical category to review standard operating procedures and initiate immediate deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {categories.map((cat, idx) => (
            <div key={cat.name} className="group relative aspect-[16/9] w-full overflow-hidden bg-slate-900 cursor-pointer">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover opacity-70 group-hover:opacity-50 transition-all duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 p-10 flex flex-col justify-end">
                <span className="text-white/80 font-bold text-[11px] uppercase tracking-[0.2em] mb-4">Unit 0{idx + 1}</span>
                <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2 leading-none">{cat.name}</h3>
                <p className="text-white/90 font-medium text-lg translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  {cat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
