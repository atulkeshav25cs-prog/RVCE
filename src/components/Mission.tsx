import Image from "next/image";

export default function Mission() {
  return (
    <section className="bg-white/95 py-32 px-6 lg:px-12 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-center">
          
          <div className="order-2 lg:order-1 relative aspect-[4/5] w-full">
            <Image
              src="/images/mission_response_1780594704142.png"
              alt="Paramedics responding to emergency"
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute -bottom-8 -right-8 w-full h-full border-[3px] border-slate-900/10 -z-10 hidden sm:block"></div>
          </div>

          <div className="order-1 lg:order-2 flex flex-col justify-center">
            <h2 className="text-5xl sm:text-6xl lg:text-[4rem] font-bold tracking-tight text-slate-900 leading-[1.05] mb-10">
              Public Safety is our highest mandate.
            </h2>
            
            <div className="w-16 h-[2px] bg-slate-900/50 mb-10"></div>
            
            <p className="text-lg sm:text-xl text-slate-700 leading-[1.7] font-medium mb-8">
              We operate at the critical intersection of technology and first response. Our infrastructure unifies police, fire, medical, and disaster management into a single, cohesive command structure.
            </p>
            
            <p className="text-lg sm:text-xl text-slate-700 leading-[1.7] font-medium mb-12">
              When seconds dictate survival, our platform eliminates bureaucratic friction, instantly routing your distress call to the nearest tactical unit.
            </p>
            
            <a href="#" className="inline-flex items-center text-[12px] font-bold uppercase tracking-[0.15em] text-slate-900 group">
              Read Operational Protocol
              <span className="ml-6 w-12 h-[1px] bg-slate-900/50 group-hover:w-20 transition-all duration-300"></span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
