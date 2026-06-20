import HeroSection from "@/components/features/home/HeroSection";
import PopularBooks from "@/components/features/home/PopularBooks";
import CuratedSection from "@/components/features/home/CuratedSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PopularBooks />
      <CuratedSection />
    </>
  );
}
