import { HeroSection } from "@/components/hero";
import { FeatureSection } from "@/components/feature-section";


export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <HeroSection />

      <div id="features" className="mx-auto mt-24 max-w-5xl">
        <FeatureSection />
      </div>
    </div>
  );
}
