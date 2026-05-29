import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
title: "Sova House",
description: "Domek w lesie w Kruczym Borku",
};

export default function RootLayout({
children,
}: {
children: ReactNode;
}) {
return ( <html lang="pl"> <body>{children}</body> </html>
);
}
