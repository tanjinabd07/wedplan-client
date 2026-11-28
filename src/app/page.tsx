
import HeroBanner from "@/components/banner";
import CategorySection from "@/components/category";
import FeaturedServices from "@/components/FeaturedServices";
import HowItWorks from "@/components/HowItWorks";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div>
      <HeroBanner />
      <CategorySection />
      <FeaturedServices />
      <HowItWorks />
      <CTASection />
      <Footer />
    </div>
  );
}