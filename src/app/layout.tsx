import type { Metadata } from "next";
import "./globals.css";
import ClientLayoutWrapper from "./components/ClientLayoutWrapper";

export const metadata: Metadata = {
  title: "One Click Advertisement | Get Noticed Across the UAE",
  description: "We make it easy to get your business seen across the UAE. From vibrant signs to vehicle wraps, we handle every detail of your outdoor advertising journey.",
  keywords: ["outdoor advertising", "billboards UAE", "signage Dubai", "vehicle branding", "One Click Advertisement"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
