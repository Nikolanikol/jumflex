import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SessionProvider from "@/components/providers/SessionProvider";
import ToastProvider from "@/components/providers/ToastProvider";
import { generateMetadata, generateOrganizationSchema } from "@/lib/seo-utils";

const inter = Inter({ subsets: ["latin"] });

// Генерируем метаданные для главной страницы
export const metadata: Metadata = generateMetadata({
  title: "Премиальные спортивные пищевые добавки",
  description:
    "Лучший интернет-магазин спортивного питания в Корее. Протеины, креатин, BCAA, витамины — только оригинальные товары мировых брендов. Быстрая доставка, гарантия лучшей цены.",
  keywords:
    "спортивное питание, добавки, протеин, белок, креатин, BCAA, витамины, фитнес-добавки, спортивные витамины, фитнес, сывороточный протеин, гейнер, добавки для похудения",
  url: "/",
  type: "website",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <SessionProvider>
          <ToastProvider />
          <meta
            name="google-site-verification"
            content="g90FNmY3D2HwxcOpcT02Ggb3vjYvdckgHeFhqq4qiLI"
          />
          <Header />
          {children}
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
