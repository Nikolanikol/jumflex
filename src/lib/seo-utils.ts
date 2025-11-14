import { Metadata } from "next";

// ============================================
// ТИПЫ И ИНТЕРФЕЙСЫ
// ============================================

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "product" | "article";
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
}

const defaultMetadata = {
  siteName: "FitStore",
  defaultTitle: "FitStore - 프리미엄 스포츠 영양 보충제 | 한국 최고의 보충제 쇼핑몰",
  defaultDescription:
    "한국 최고의 스포츠 영양 보충제 전문 쇼핑몰. 프로틴, 크레아틴, BCAA, 비타민 등 글로벌 브랜드 정품 보장. 빠른 배송, 최저가 보장.",
  defaultKeywords:
    "스포츠영양, 보충제, 프로틴, 단백질, 크레아틴, BCAA, 비타민, 헬스보충제, 운동영양제, 피트니스",
  defaultImage: "/og-image.jpg",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://fitstore.kr",
  locale: "ko_KR",
  twitterHandle: "@fitstore_kr",
};

// ============================================
// ОСНОВНАЯ ФУНКЦИЯ ГЕНЕРАЦИИ МЕТАДАННЫХ
// ============================================

export function generateMetadata({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  author,
  publishedTime,
  modifiedTime,
  noIndex = false,
}: SEOProps = {}): Metadata {
  const metaTitle = title
    ? `${title} | ${defaultMetadata.siteName}`
    : defaultMetadata.defaultTitle;
  const metaDescription = description || defaultMetadata.defaultDescription;
  const metaKeywords = keywords || defaultMetadata.defaultKeywords;
  const metaImage = image || defaultMetadata.defaultImage;
  const metaUrl = url
    ? `${defaultMetadata.siteUrl}${url}`
    : defaultMetadata.siteUrl;

  const metadata: Metadata = {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      type: type === "article" ? "article" : type === "product" ? "website" : "website",
      locale: defaultMetadata.locale,
      url: metaUrl,
      siteName: defaultMetadata.siteName,
      title: metaTitle,
      description: metaDescription,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      site: defaultMetadata.twitterHandle,
      creator: defaultMetadata.twitterHandle,
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
    },
    alternates: {
      canonical: metaUrl,
      languages: {
        "ko-KR": metaUrl,
        "en-US": `${metaUrl}/en`,
      },
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "",
      // naver: process.env.NEXT_PUBLIC_NAVER_VERIFICATION || "",
    },
  };

  return metadata;
}

// ============================================
// STRUCTURED DATA SCHEMAS
// ============================================

// Схема продукта
export function generateProductSchema(product: {
  name: string;
  description: string;
  image: string | string[];
  price: number;
  currency: string;
  brand?: string;
  sku?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  rating?: number;
  reviewCount?: number;
  condition?: "NewCondition" | "UsedCondition" | "RefurbishedCondition";
  url?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: Array.isArray(product.image) ? product.image : [product.image],
    brand: product.brand
      ? {
          "@type": "Brand",
          name: product.brand,
        }
      : undefined,
    sku: product.sku,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency,
      availability: `https://schema.org/${product.availability || "InStock"}`,
      url: product.url || `${defaultMetadata.siteUrl}/products/${product.sku}`,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      itemCondition: `https://schema.org/${product.condition || "NewCondition"}`,
    },
    aggregateRating:
      product.rating && product.reviewCount
        ? {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
            bestRating: "5",
            worstRating: "1",
          }
        : undefined,
  };
}

// Схема организации
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: defaultMetadata.siteName,
    url: defaultMetadata.siteUrl,
    logo: `${defaultMetadata.siteUrl}/logo.png`,
    description: defaultMetadata.defaultDescription,
    address: {
      "@type": "PostalAddress",
      addressCountry: "KR",
      addressLocality: "Seoul",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+82-10-1234-5678",
      contactType: "Customer Service",
      availableLanguage: ["Korean", "English"],
    },
    sameAs: [
      "https://instagram.com/fitstore_kr",
      "https://facebook.com/fitstore.kr",
    ],
  };
}

// Схема для хлебных крошек
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Главная",
        item: defaultMetadata.siteUrl,
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.name,
        item: `${defaultMetadata.siteUrl}${item.url}`,
      })),
    ],
  };
}

// Схема для отзыва
export function generateReviewSchema(review: {
  author: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
  itemReviewed: {
    name: string;
    type: "Product" | "Service";
  };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    author: {
      "@type": "Person",
      name: review.author,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.rating,
      bestRating: "5",
      worstRating: "1",
    },
    reviewBody: review.reviewBody,
    datePublished: review.datePublished,
    itemReviewed: {
      "@type": review.itemReviewed.type,
      name: review.itemReviewed.name,
    },
  };
}

// Схема для статьи блога
export function generateArticleSchema(article: {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.headline,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: defaultMetadata.siteName,
      logo: {
        "@type": "ImageObject",
        url: `${defaultMetadata.siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${defaultMetadata.siteUrl}${article.url}`,
    },
  };
}

// Схема для FAQ
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// Схема для предложения (спецпредложение, акция)
export function generateOfferSchema(offer: {
  name: string;
  description: string;
  price: number;
  priceCurrency: string;
  validFrom: string;
  validThrough: string;
  availability: "InStock" | "OutOfStock" | "PreOrder";
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: offer.name,
    description: offer.description,
    price: offer.price,
    priceCurrency: offer.priceCurrency,
    validFrom: offer.validFrom,
    validThrough: offer.validThrough,
    availability: `https://schema.org/${offer.availability}`,
    url: `${defaultMetadata.siteUrl}${offer.url}`,
  };
}

// Схема для локального бизнеса (если есть физический магазин)
export function generateLocalBusinessSchema(business: {
  name: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: {
    latitude: number;
    longitude: number;
  };
  telephone: string;
  openingHours: string[];
  priceRange?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    image: `${defaultMetadata.siteUrl}/og-image.jpg`,
    "@id": defaultMetadata.siteUrl,
    url: defaultMetadata.siteUrl,
    telephone: business.telephone,
    priceRange: business.priceRange || "₩₩",
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.streetAddress,
      addressLocality: business.address.addressLocality,
      addressRegion: business.address.addressRegion,
      postalCode: business.address.postalCode,
      addressCountry: business.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: business.geo.latitude,
      longitude: business.geo.longitude,
    },
    openingHoursSpecification: business.openingHours.map((hours) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: hours.split(":")[0],
      opens: hours.split(":")[1].split("-")[0],
      closes: hours.split(":")[1].split("-")[1],
    })),
  };
}

// ============================================
// УТИЛИТЫ ДЛЯ РАБОТЫ СО STRUCTURED DATA
// ============================================

// Функция для безопасного рендеринга JSON-LD
export function renderStructuredData(schema: object) {
  return JSON.stringify(schema);
}

// Функция для объединения нескольких схем
export function combineSchemas(...schemas: object[]) {
  return {
    "@context": "https://schema.org",
    "@graph": schemas,
  };
}

// Экспорт дефолтных метаданных для использования в других файлах
export { defaultMetadata };