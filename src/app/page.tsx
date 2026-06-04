import Hero from "@/components/Hero";
import Mission from "@/components/Mission";
import Categories from "@/components/Categories";
import HowItWorks from "@/components/HowItWorks";
import Services from "@/components/Services";

export default function Home() {
  return (
    <div className="flex flex-col w-full overflow-hidden bg-white text-slate-900">
      <Hero />
      <Mission />
      <Categories />
      <HowItWorks />
      <Services />
    </div>
  );
}
