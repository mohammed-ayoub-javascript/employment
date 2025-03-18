import type { Metadata } from "next";
import {  Cairo} from "next/font/google";
import "./globals.css";


const ar = Cairo({
  variable : "--ar",
  subsets : ["arabic"]
})

export const metadata: Metadata = {
  title: "ecommers ",
  description: "اول موقع توظيف جزائري",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${ar.className}`}
      >
        {children}
      </body>
    </html>
  );
}
