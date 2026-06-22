import Link from "next/link";
import { UI_TEXT } from "@/constants/ui-text";

export function LoginBanner() {
    return (
        <section className="fixed left-0 top-0 z-10 hidden h-screen w-1/2 overflow-hidden lg:flex">
            {/* Background image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src="/images/login-banner.jpg"
                alt={UI_TEXT.AUTH.BANNER.IMG_ALT}
                className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Gradient overlay — Deep Indigo per §2.1 */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-700/80 to-primary-500/30" />

            {/* AI ambient glow — Electric Blue per §2.2 */}
            <div className="absolute -top-32 right-0 h-[500px] w-[500px] rounded-full bg-secondary-300/10 blur-[120px]" />
            <div className="absolute -bottom-32 left-0 h-[600px] w-[600px] rounded-full bg-tertiary-300/10 blur-[140px]" />

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col justify-between p-12">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Link
                        href="/"
                        className="text-2xl font-bold tracking-tight text-white transition-opacity hover:opacity-80"
                    >
                        {UI_TEXT.AUTH.BANNER.LOGO_TEXT}
                    </Link>
                </div>

                {/* Hero copy */}
                <div className="max-w-md">
                    <h2 className="mb-4 text-5xl font-bold leading-tight text-white">
                        {UI_TEXT.AUTH.BANNER.HERO_HEADING}
                    </h2>
                    <p className="text-lg leading-relaxed text-primary-100">
                        {UI_TEXT.AUTH.BANNER.HERO_SUBHEADING}
                    </p>
                </div>

                {/* Footer */}
                <span className="text-sm text-primary-100/60">
                    {UI_TEXT.AUTH.BANNER.COPYRIGHT}
                </span>
            </div>
        </section>
    );
}