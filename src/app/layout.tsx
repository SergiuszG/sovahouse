import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sova House",
  description: "Domek w lesie w Kruczym Borku",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
