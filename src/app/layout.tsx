import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { CartIcon } from "@/components/CartIcon";
import Navbar from "@/components/NavBar";
import { MiniCart } from "@/lib/cart/component/MiniCart";
import { getSiteUrl } from "@/lib/seo/jsonld";
import { fetchStoreConfigForSeo } from "@/lib/seo/storeConfig";
import { cn } from "@/lib/utils";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await fetchStoreConfigForSeo();
  const siteUrl = getSiteUrl();

  return {
    metadataBase: new URL(siteUrl),
    title: {
      template: config.seo.titleTemplate,
      default: config.seo.defaultTitle,
    },
    description: config.seo.defaultDescription,
    openGraph: {
      type: "website",
      siteName: config.seo.defaultTitle,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal?: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(spaceGrotesk.variable, "font-sans")}>
      <body className="antialiased">
        <Navbar
          miniCart={
            <Suspense fallback={<CartIcon numberOfItems={0} />}>
              <MiniCart />
            </Suspense>
          }
        />
        {children}
        {modal}
      </body>
    </html>
  );
}
