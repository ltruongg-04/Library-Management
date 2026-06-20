import Image from "next/image";

function MatchPill({
  percentage,
  className = "",
}: {
  percentage: number;
  className?: string;
}) {
  return (
    <div
      className={`bg-surface-container-lowest px-2 py-1 rounded-full border border-secondary-300/50 shadow-sm flex items-center z-10 ${className}`}
    >
      <div className="w-2 h-2 rounded-full bg-secondary-300 mr-1 animate-pulse" />
      <span className="font-mono text-[12px] font-medium leading-[16px] tracking-[0.05em] text-primary-700">
        {percentage}% phù hợp.
      </span>
    </div>
  );
}

export default function CuratedSection() {
  return (
    <section className="py-12 px-4 lg:px-6 max-w-[1440px] mx-auto bg-surface-container-low rounded-xl my-12">
      {/* Section Header */}
      <div className="mb-6 text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary-300/20 text-secondary-300 mb-2">
          <span className="material-symbols-outlined">psychology</span>
        </span>
        <h2 className="font-sans text-[32px] font-semibold leading-[40px] tracking-[-0.01em] text-primary-700 mb-1">
          Dành cho bạn
        </h2>
        <p className="font-sans text-[16px] leading-[24px] text-on-surface-variant">
          Đề xuất dựa trên sở thích đọc sách của bạn.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Large Feature Cell — Philosophy of AI */}
        <div className="md:col-span-2 bg-surface-container-lowest rounded-lg p-6 level-1-shadow relative overflow-hidden group min-h-[300px] flex flex-col justify-end border border-transparent hover:border-secondary-300/30 transition-colors">
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7gTlF9fqWIvWjr9aj8LpUlcjd1ZAFrrwaxYC9ieAqCoAZ5Ik3q82TeqvrlZxHqbvRq_lDJfEapookHAbLE1Vub0NVRCMMyWySPdoOO64EsxX-vuKNuO4UjYdLazwXRCNw6RM3l13Rtw9_5YmOxVZUS_vTp4ta8XbCWxTBUOq2HtMAaX2s2RS0iaNa0Viy2hqO0z-tPjIrfRZVXhcqWV4JUJ3C2cxenRymdfwGmg6Rvvg_1g00ch1Tz4ZBx3RIS3usmXgCtDYlqrtN"
              alt="Curated book collection"
              fill
              className="object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/80 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 w-full md:w-2/3">
            <div className="inline-block bg-primary-700 text-on-primary font-mono text-[12px] font-medium leading-[16px] tracking-[0.05em] px-2 py-1 rounded mb-2">
              Deep Dive
            </div>
            <h3 className="font-sans text-[32px] font-semibold leading-[40px] tracking-[-0.01em] text-primary-700 mb-2">
              The Philosophy of Artificial Intelligence
            </h3>
            <p className="font-sans text-[16px] leading-[24px] text-on-surface-variant mb-4">
              A comprehensive collection exploring the ethical and societal
              implications of thinking machines.
            </p>
            <button className="bg-transparent border border-secondary-500 text-secondary-500 hover:bg-secondary-500/5 px-4 py-2 rounded-lg font-semibold text-[14px] transition-colors w-fit">
              Khám phá bộ sưu tập
            </button>
          </div>

          {/* Match Pill */}
          <MatchPill percentage={98} className="absolute top-6 right-6" />
        </div>

        {/* Right Column — Stacked */}
        <div className="flex flex-col gap-4">
          {/* Hard Sci-Fi Essentials */}
          <div className="bg-surface-container-lowest rounded-lg p-6 level-1-shadow flex flex-col border border-transparent hover:border-secondary-300/30 transition-colors relative flex-1">
            <div className="flex-grow">
              <div className="w-10 h-10 rounded bg-primary-container/20 text-primary-700 mb-4 flex items-center justify-center">
                <span className="material-symbols-outlined">science</span>
              </div>
              <h3 className="font-sans text-[20px] font-semibold leading-[28px] text-primary-700 mb-1">
                Hard Sci-Fi Essentials
              </h3>
              <p className="font-sans text-[14px] leading-[20px] text-on-surface-variant">
                Highly technical speculative fiction based on your recent
                searches.
              </p>
            </div>
            <div className="mt-6 flex justify-between items-center">
              <span className="text-sm text-on-surface-variant">12 Books</span>
              <button
                className="text-secondary-500 hover:text-primary-700 transition-colors"
                aria-label="View Hard Sci-Fi Essentials"
              >
                <span className="material-symbols-outlined">
                  arrow_forward
                </span>
              </button>
            </div>
            <MatchPill percentage={92} className="absolute top-4 right-4" />
          </div>

          {/* World Building Masterclass */}
          <div className="bg-surface-container-lowest rounded-lg p-6 level-1-shadow flex flex-col border border-transparent hover:border-secondary-300/30 transition-colors relative flex-1">
            <div className="flex-grow">
              <div className="w-10 h-10 rounded bg-tertiary-container/20 text-tertiary-500 mb-4 flex items-center justify-center">
                <span className="material-symbols-outlined">landscape</span>
              </div>
              <h3 className="font-sans text-[20px] font-semibold leading-[28px] text-primary-700 mb-1">
                World Building Masterclass
              </h3>
              <p className="font-sans text-[14px] leading-[20px] text-on-surface-variant">
                Because you read &apos;Dune&apos; and &apos;Foundation&apos;.
              </p>
            </div>
            <div className="mt-6 flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-surface-variant border-2 border-surface-container-lowest z-30" />
              <div className="w-8 h-8 rounded-full bg-surface-dim border-2 border-surface-container-lowest z-20" />
              <div className="w-8 h-8 rounded-full bg-outline-variant border-2 border-surface-container-lowest z-10 flex items-center justify-center font-mono text-xs text-on-surface">
                +4
              </div>
            </div>
            <MatchPill percentage={85} className="absolute top-4 right-4" />
          </div>
        </div>
      </div>
    </section>
  );
}
