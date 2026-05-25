import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionProvider from "@/components/providers/SessionProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "CollegeDiscovery | Find Your Perfect College in India",
  description:
    "Discover, compare, and save top colleges across India. Explore IITs, NITs, BITS, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} min-h-screen font-sans antialiased`}>
        <SessionProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              <ErrorBoundary>{children}</ErrorBoundary>
            </main>
            <Footer />
          </div>
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        </SessionProvider>
      </body>
    </html>
  );
}
