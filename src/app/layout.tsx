import type { Metadata } from "next";
import "./globals.css";
import { LayoutShell } from "@/src/components/layout-shell";

export const metadata: Metadata = {
  title: "The Mentalist · CBI Analytical Portal | Databricks Apps",
  description:
    "Editorial investigative analytics platform for The Mentalist running on Databricks Apps, powered by Delta Lake and Unity Catalog.",
  icons: {
    icon: "/static/images/characters/patrick_jane.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Afacad:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen selection:bg-[#C8102E] selection:text-white">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
