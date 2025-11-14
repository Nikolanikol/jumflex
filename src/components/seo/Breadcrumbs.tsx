import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fitstore.kr";

  // Генерируем JSON-LD для хлебных крошек
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Главная",
        item: baseUrl,
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.name,
        item: `${baseUrl}${item.url}`,
      })),
    ],
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Визуальные хлебные крошки */}
      <nav
        className="flex items-center gap-2 text-sm text-secondary mb-6"
        aria-label="Breadcrumb"
      >
        <Link
          href="/"
          className="hover:text-primary transition-colors flex items-center gap-1"
        >
          <Home size={16} />
          <span>Главная</span>
        </Link>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <div key={item.url} className="flex items-center gap-2">
              <ChevronRight size={16} className="text-dark-lighter" />
              {isLast ? (
                <span className="text-white font-medium">{item.name}</span>
              ) : (
                <Link
                  href={item.url}
                  className="hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </>
  );
}
