import { Metadata } from "next";

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
      // Добавьте сюда коды верификации после получения
      google: "", // Добавить после регистрации в Google Search Console
      // naver: "", // Для Naver Webmaster Tools
    },
  };

  return metadata;
}

// Утилита для JSON-LD Structured Data
export function generateProductSchema(product: {
  name: string;
  description: string;
  image: string;
  price: number;
  currency: string;
  brand?: string;
  sku?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  rating?: number;
  reviewCount?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
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
      url: `${defaultMetadata.siteUrl}/products/${product.sku}`,
    },
    aggregateRating:
      product.rating && product.reviewCount
        ? {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          }
        : undefined,
  };
}

// Схема для организации (для главной страницы)
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
      // Добавьте ссылки на социальные сети
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
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${defaultMetadata.siteUrl}${item.url}`,
    })),
  };
}