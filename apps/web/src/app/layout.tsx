import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import LayoutClientWrapper from "@/components/LayoutClientWrapper";
import { seoData } from "@/data/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: seoData.title,
  description: seoData.description,
  keywords: seoData.keywords,
  authors: [{ name: seoData.author }],
  openGraph: {
    title: seoData.title,
    description: seoData.description,
    url: seoData.url,
    siteName: seoData.siteName,
    locale: seoData.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: seoData.title,
    description: seoData.description,
    creator: seoData.twitter,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-bg-dark text-slate-900 dark:text-white transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LayoutClientWrapper>
            {children}
          </LayoutClientWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
