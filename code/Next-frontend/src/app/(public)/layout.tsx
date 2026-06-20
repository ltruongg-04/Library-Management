export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen pt-16">
      {/* Navigation Bar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm transition-all duration-200">
        <div className="flex justify-between items-center h-16 px-6 max-w-[1440px] mx-auto">
          <div className="flex items-center gap-8">
            <a className="text-[32px] font-bold text-primary tracking-tight" href="/">
              Lumina Library
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="mt-auto bg-surface-container-low border-t border-outline-variant/50 w-full py-12">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 max-w-[1440px] mx-auto gap-4">
          <div className="text-xl font-bold text-primary">Lumina Library</div>
          <div className="text-sm text-on-surface-variant text-center md:text-right">
            © 2026 Lumina Library AI. Powered by Illuminated Intelligence.
          </div>
        </div>
      </footer>
    </div>
  );
}
