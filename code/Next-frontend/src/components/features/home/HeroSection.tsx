export default function HeroSection() {
  return (
    <section className="relative py-12 lg:py-[120px] px-4 lg:px-6 overflow-hidden flex flex-col items-center justify-center min-h-[614px]">
      {/* Background Image + Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-primary-50/30 via-surface-container-low to-secondary-50/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-surface-container-lowest/50 to-surface-container-lowest" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto text-center w-full">
        <h1 className="font-sans text-[48px] font-bold leading-[56px] tracking-[-0.02em] text-primary-700 mb-4">
          TÌM KIẾM TRI THỨC CÙNG AI
        </h1>
        <p className="font-sans text-[20px] font-semibold leading-[28px] text-on-surface-variant mb-12 max-w-2xl mx-auto">
          Tìm kiếm những cuốn sách yêu thích của bạn dễ dàng hơn với công nghệ AI.
        </p>

        {/* AI Semantic Search Bar */}
        <div className="relative w-full max-w-2xl mx-auto ai-glow rounded-xl bg-surface-container-lowest p-[2px] transition-all">
          {/* Gradient border effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-700 to-secondary-300 opacity-20 pointer-events-none" />

          {/* Search input container */}
          <div className="relative flex items-center bg-surface-container-lowest rounded-[10px] overflow-hidden h-[56px] px-4 border border-transparent focus-within:border-secondary-300">
            <span className="material-symbols-outlined text-secondary-300 mr-2">
              auto_awesome
            </span>
            <input
              className="flex-grow bg-transparent border-none outline-none font-sans text-[16px] leading-[24px] text-on-surface placeholder:text-on-surface-variant/50 h-full focus:ring-0"
              placeholder="Tìm kiếm sách..."
              type="text"
              aria-label="AI semantic search"
            />
            <button className="ai-gradient-bg text-on-primary px-4 py-2 rounded-lg font-semibold text-[14px] h-[40px] hover:opacity-90 transition-opacity whitespace-nowrap">
              Tìm kiếm với AI
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
