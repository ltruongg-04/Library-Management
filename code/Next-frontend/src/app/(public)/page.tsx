import BannerSlider from "@/components/features/home/BannerSlider";
import HeroSection from "@/components/features/home/HeroSection";
import HowItWorks from "@/components/features/home/HowItWorks";
import NewestBooks from "@/components/features/home/NewestBooks";
import PopularBooks from "@/components/features/home/PopularBooks";
import TopRatedBooks from "@/components/features/home/TopRatedBooks";

export default function HomePage() {
    return (
        <>
            {/* 1. Hero & Fast Catalog Search */}
            <HeroSection />

            {/* 2. Dynamic Banner Slider (Events & Library Announcements) */}
            <BannerSlider />

            {/* 3. Popular & Trending Books */}
            <PopularBooks />

            {/* 4. Top Rated Books */}
            <TopRatedBooks />

            {/* 5. New Arrivals */}
            <NewestBooks />

            {/* 6. How it Works & Library Stats */}
            <HowItWorks />
        </>
    );
}
