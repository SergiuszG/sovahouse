import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Sova House",
  description: "Domek w lesie w Kruczym Borku",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="pl">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-786Q1HDJPN"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-786Q1HDJPN');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
