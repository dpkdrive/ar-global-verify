

import AuthenticityBanner from "../components/home/AuthenticityBanner";
import IntroSection from "../components/home/IntroSection";
import FeaturesSection from "../components/home/FeaturesSection";
import ProductsSection from "../components/home/ProductsSection";
import VerificationSection from "../components/home/VerificationSection";
import FinalCTASection from "../components/home/FinalCTASection";
import HeroSection from "../components/home/HeroSection";
import { apiRequest } from "../api";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchProducts = async () => {
      try {
        const payload = await apiRequest("/products/public", { token: null });
        if (active) {
          setItems(payload.data.products ?? []);
        }
      } catch {
        if (active) setItems([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    void fetchProducts();
    return () => { active = false; };
  }, []);


  return (
    <main>
      <HeroSection />

      <AuthenticityBanner />


      <ProductsSection products={items} loading={loading} />
      <FeaturesSection />
      {/* <IntroSection /> */}


      <VerificationSection />

      <FinalCTASection />
    </main>
  );
}
