import Image from "next/image";

interface BookCardProps {
  title: string;
  author: string;
  category: string;
  categoryColor: "science" | "fiction" | "history" | "design";
  badgeIcon: string;
  badgeText: string;
  imageSrc?: string;
  placeholderIcon?: string;
  placeholderBg?: string;
  placeholderIconColor?: string;
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
}

const CATEGORY_STYLES = {
  science: "text-secondary-300 bg-secondary-300/10 dark:text-white dark:bg-secondary-300/40",
  fiction: "text-primary-700 bg-primary-700/10 dark:text-white dark:bg-primary-700/40",
  history: "text-secondary-300 bg-secondary-300/10 dark:text-white dark:bg-secondary-300/40",
  design: "text-tertiary-500 bg-tertiary-500/10 dark:text-white dark:bg-tertiary-500/40",
};

const BOOKS: BookCardProps[] = [
  {
    title: "The Algorithmic Mind",
    author: "Dr. Elena Rostova",
    category: "Khoa học",
    categoryColor: "science",
    badgeIcon: "trending_up",
    badgeText: "#1 Thịnh hành",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAYlDKQmIuqCq-tqTicaKu3Yo3_ZJmzdJmUd9f-5laODWr7iO_6xc5MGw7pBqlgzRYgcmDnPSFJdaSQ3MLmMUdLvZApaDzJS-TC6acVDF90OSsK_8LtBKzFL35XNAECxSEWm4HUfIfhYYYxEGYODvnwWmAhjiZO6N81ta8KxdlnyML3EM3wR7ueblXUxAjcmEZ3JSB0PBWmD6t2M3D7scUBUCwuT4qbfHz6BPkcunChaopBdvaWcadTSqOFQ1KeOwkl_PcFdxndQ-vo",
  },
  {
    title: "Echoes of Silence",
    author: "Marcus Thorne",
    category: "Tiểu thuyết",
    categoryColor: "fiction",
    badgeIcon: "star",
    badgeText: "4.9/5",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCA0ugb2mtgwGdYen2kuKtDcr1SgH90WiQ4t-vHPzsDIm0zDpqfLep6XfQ9Av8c80v2tgU3rhAirV116cp4WU6vxAaqbvxP-LsurS-EuqR5nwMDP0bi-oalR1xxqoIp915o3WniSMrmFkdIpZviFowlkY21DMtY0dWHCZoMw8-Iwu0CwAaEL7Dy47Wx-SwJalcesh2S3c5KnGe6KXqBDuo31QzsGJyd6YIyNeROWuCYvY5TvzGIBKEjA4lTGx4c13ZZ_i20rbfPxd7m",
  },
  {
    title: "A Brief History of Tomorrow",
    author: "Sarah Jenkins",
    category: "Lịch sử",
    categoryColor: "history",
    placeholderIcon: "history_edu",
    placeholderBg: "bg-primary-container",
    placeholderIconColor: "text-on-primary-container",
    badgeIcon: "",
    badgeText: "",
    hideOnMobile: true,
  },
  {
    title: "Design Systems",
    author: "Alex Rivera",
    category: "Thiết kế",
    categoryColor: "design",
    placeholderIcon: "palette",
    placeholderBg: "bg-tertiary-container",
    placeholderIconColor: "text-on-tertiary-container",
    badgeIcon: "",
    badgeText: "",
    hideOnMobile: true,
    hideOnTablet: true,
  },
];

function BookCard({
  title,
  author,
  category,
  categoryColor,
  badgeIcon,
  badgeText,
  imageSrc,
  placeholderIcon,
  placeholderBg,
  placeholderIconColor,
  hideOnMobile,
  hideOnTablet,
}: BookCardProps) {
  let wrapperClass =
    "bg-surface-container-lowest dark:bg-slate-900 rounded-lg level-1-shadow level-2-shadow-hover transition-all duration-300 overflow-hidden flex flex-col h-full group";
  if (hideOnTablet) {
    wrapperClass += " hidden lg:flex";
  } else if (hideOnMobile) {
    wrapperClass += " hidden md:flex";
  }

  return (
    <div className={wrapperClass}>
      {/* Cover Image Area */}
      <div className="relative h-48 w-full overflow-hidden bg-surface-container-low dark:bg-slate-800 p-4 flex items-center justify-center transition-colors duration-200">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={`Book cover: ${title}`}
            width={128}
            height={192}
            className="h-full w-auto object-cover rounded shadow-sm group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
        ) : (
          <div
            className={`w-24 h-36 ${placeholderBg} rounded shadow-md flex items-center justify-center ${placeholderIconColor} group-hover:scale-105 transition-transform duration-500`}
          >
            <span className="material-symbols-outlined text-[48px]">
              {placeholderIcon}
            </span>
          </div>
        )}

        {/* Badge */}
        {badgeText && (
          <div className="absolute top-2 right-2 bg-surface-container-lowest/90 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded-full border border-outline-variant/30 dark:border-slate-700 flex items-center shadow-sm">
            <span className="material-symbols-outlined text-secondary-500 dark:text-white text-sm mr-1">
              {badgeIcon}
            </span>
            <span className="font-mono text-[12px] font-medium leading-[16px] tracking-[0.05em] text-on-surface dark:text-white">
              {badgeText}
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-sans text-[20px] font-semibold leading-[28px] text-on-surface dark:text-white mb-1 line-clamp-1 transition-colors duration-200">
          {title}
        </h3>
        <p className="font-sans text-[14px] leading-[20px] text-on-surface-variant dark:text-white mb-4 transition-colors duration-200">
          {author}
        </p>
        <div className="mt-auto flex justify-between items-center">
          <span
            className={`font-mono text-[12px] font-medium leading-[16px] tracking-[0.05em] ${CATEGORY_STYLES[categoryColor]} px-2 py-1 rounded`}
          >
            {category}
          </span>
          <button
            className="text-primary-700 dark:text-white hover:text-secondary-300 dark:hover:text-secondary-300 transition-colors"
            aria-label={`Bookmark ${title}`}
          >
            <span className="material-symbols-outlined">bookmark_add</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PopularBooks() {
  return (
    <section className="py-12 px-4 lg:px-6 max-w-[1440px] mx-auto">
      {/* Section Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="font-sans text-[32px] font-semibold leading-[40px] tracking-[-0.01em] text-primary-700 dark:text-white transition-colors duration-200">
            Đang thịnh hành
          </h2>
          <p className="font-sans text-[16px] leading-[24px] text-on-surface-variant dark:text-white transition-colors duration-200">
            Xu hướng hiện tại.
          </p>
        </div>
        <button className="text-secondary-500 dark:text-white font-semibold text-[20px] leading-[28px] hover:text-primary-700 dark:hover:text-primary-300 transition-colors flex items-center">
          Xem tất cả{" "}
          <span className="material-symbols-outlined ml-1 text-sm">
            arrow_forward
          </span>
        </button>
      </div>

      {/* Book Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {BOOKS.map((book) => (
          <BookCard key={book.title} {...book} />
        ))}
      </div>
    </section>
  );
}
