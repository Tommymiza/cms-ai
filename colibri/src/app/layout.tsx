import type { Metadata } from "next";
import "../styles/base.css";
import "../styles/rich-text.css";
import "../styles/typography.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tweeksy",
  description: "Site builder CMS headless",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
