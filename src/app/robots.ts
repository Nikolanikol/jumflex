import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jymflex.vercel.app/";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/*",
          "/admin/*",
          "/profile/*",
          "/checkout/*",
          "/order/*",
          "/_next/*",
          "/static/*",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/api/*",
          "/admin/*",
          "/profile/*",
          "/checkout/*",
          "/order/*",
        ],
      },
      {
        userAgent: "Yeti", // Naver bot
        allow: "/",
        disallow: [
          "/api/*",
          "/admin/*",
          "/profile/*",
          "/checkout/*",
          "/order/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}