import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "@/trpc/client";

const ar = Cairo({
  variable: "--ar",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "store4dz ",
  description: "store4dz هو متجر إلكتروني موثوق يوفر لك تجربة تسوق فريدة في الجزائر. اكتشف مجموعة واسعة من المنتجات بأسعار تنافسية مع خيارات دفع آمنة وتوصيل سريع إلى جميع الولايات. تسوق الآن بسهولة وأمان!"  ,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${ar.className}`}>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
