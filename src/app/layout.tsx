import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "Ayenda | Future-Built Creative Technology Studio",
  description:
    "Ayenda is a creative technology studio building brands, products, and campaigns for the future. Strategy, design, engineering, and media production unified.",
  openGraph: {
    title: "Ayenda | Future-Built Creative Technology Studio",
    description:
      "Ayenda is a creative technology studio building brands, products, and campaigns for the future.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayenda | Future-Built Creative Technology Studio",
    description:
      "Ayenda is a creative technology studio building brands, products, and campaigns for the future.",
  },
};

export interface RootLayoutProps {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  );
}
