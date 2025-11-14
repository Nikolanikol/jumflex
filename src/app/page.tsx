import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
// import FeaturedProducts from "@/components/home/FeaturedProducts";
// import PromoSection from "@/components/home/PromoSection";
// import NewProducts from "@/components/home/NewProducts";
// import BrandSection from "@/components/home/BrandSection";
import { generateOrganizationSchema } from "@/lib/seo-utils";

export default function Home() {
  const orgSchema = generateOrganizationSchema();

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      {/* Главный баннер */}
      <HeroSection />
    </main>
  );
}
