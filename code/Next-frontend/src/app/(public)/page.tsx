import HeroSection from "@/components/features/home/HeroSection";
import NewestBooks from "@/components/features/home/NewestBooks";
import PopularBooks from "@/components/features/home/PopularBooks";
import TopRatedBooks from "@/components/features/home/TopRatedBooks";
import CuratedSection from "@/components/features/home/curated-section";

export default function HomePage() {
    return (
        <>
            <PopularBooks />
            <TopRatedBooks />
            <NewestBooks />
            <CuratedSection />
            <HeroSection />
        </>
    );
}
