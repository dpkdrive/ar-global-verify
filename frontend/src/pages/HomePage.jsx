

import AuthenticityBanner from "../components/home/AuthenticityBanner";
import IntroSection from "../components/home/IntroSection";
import FeaturesSection from "../components/home/FeaturesSection";
import ProductsSection from "../components/home/ProductsSection";
import VerificationSection from "../components/home/VerificationSection";
import FinalCTASection from "../components/home/FinalCTASection";
import HeroSection from "../components/home/HeroSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />

      <AuthenticityBanner />

      <IntroSection />

      <FeaturesSection />

      <ProductsSection />

      <VerificationSection />

      <FinalCTASection />
    </main>
  );
}
