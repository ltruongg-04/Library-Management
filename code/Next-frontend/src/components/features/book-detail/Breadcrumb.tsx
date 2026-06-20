import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center font-body-sm text-body-sm text-on-surface-variant dark:text-white mb-6 transition-colors duration-200">
      {items.map((item, index) => (
        <span key={index} className="flex items-center">
          {index > 0 && (
            <span className="material-symbols-outlined text-[16px] mx-1">
              chevron_right
            </span>
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-primary dark:hover:text-primary-300 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-on-surface dark:text-white font-semibold">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
